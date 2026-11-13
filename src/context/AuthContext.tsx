import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useAppDispatch } from '../app/hooks';
import { store } from '../app/store';
import {
  mergeRemoteQuizAttempts,
  type QuizAttemptRecord,
} from '../features/quiz/quizSlice';
import {
  applyItemSyncAck,
  hydrateUserCloudReactions,
  resetCloudReactionSyncState,
  setCloudItemStats,
} from '../features/reactions/reactionsSlice';
import { resolveReactionItemType } from '../features/reactions/reactionUtils';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  clearEnsuredProfileCache,
  fetchAllCloudItemStats,
  fetchUserCloudReactions,
  fetchUserFlaggedQuestions,
  subscribeToCloudItemStats,
  syncReactionAndStatsToFirestore,
  upsertFlaggedQuestionInFirestore,
} from '../services/cloudSyncService';
import { storageService } from '../services/storageService';

export const DASHBOARD_ADMIN_EMAIL = 'info.pscnepal@gmail.com';

export function isDashboardAdminUser(
  user: User | null | undefined
): boolean {
  if (!user || !user.emailVerified || !user.email) {
    return false;
  }
  return user.email.trim().toLowerCase() === DASHBOARD_ADMIN_EMAIL;
}

interface AuthContextValue {
  user: User | null;
  isDashboardAdmin: boolean;
  isAuthReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function sanitizeFirestoreId(raw: string, fallbackPrefix: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  if (cleaned.length > 0 && VALID_ID_REGEX.test(cleaned)) {
    return cleaned;
  }
  return `${fallbackPrefix}-${Date.now()}`;
}

function buildSanitizedProfileFields(user: User) {
  const displayName = (
    user.displayName?.trim() ||
    user.email?.split('@')[0] ||
    'PSC Aspirant'
  ).slice(0, 120);

  const payload: {
    displayName: string;
    email?: string;
    photoURL?: string;
  } = {
    displayName,
  };

  if (user.email && user.email.trim().length > 0) {
    payload.email = user.email.trim().slice(0, 254);
  }
  if (user.photoURL && user.photoURL.trim().length > 0) {
    payload.photoURL = user.photoURL.trim().slice(0, 512);
  }
  return payload;
}

export class AccountBlockedError extends Error {
  status: 'banned' | 'disabled';
  reason: string;

  constructor(status: 'banned' | 'disabled', reason: string) {
    const label = status === 'banned' ? 'banned' : 'temporarily disabled';
    const detail = reason.trim()
      ? ` Reason: ${reason.trim()}`
      : ' Please contact the portal administrator.';
    super(`Your account has been ${label}.${detail}`);
    this.name = 'AccountBlockedError';
    this.status = status;
    this.reason = reason;
  }
}

export async function ensureUserProfileDoc(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const fields = buildSanitizedProfileFields(user);

  let snap;
  try {
    snap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (!snap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        ...fields,
        role: 'aspirant',
        status: 'active',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }
  } else {
    const existingData = snap.data();
    const existingStatus = existingData.status;
    if (existingStatus === 'banned' || existingStatus === 'disabled') {
      const reason =
        typeof existingData.statusReason === 'string'
          ? existingData.statusReason
          : '';
      throw new AccountBlockedError(existingStatus, reason);
    }

    const patch: Record<string, unknown> = {
      lastLoginAt: serverTimestamp(),
    };
    if (!existingData.displayName && fields.displayName) {
      patch.displayName = fields.displayName;
    }
    if (!existingData.email && fields.email) {
      patch.email = fields.email;
    }
    if (!existingData.photoURL && fields.photoURL) {
      patch.photoURL = fields.photoURL;
    }

    try {
      await updateDoc(userRef, patch);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  }
}

export async function saveQuizAttemptToFirestore(
  user: User,
  attempt: QuizAttemptRecord
): Promise<void> {
  const attemptId = sanitizeFirestoreId(attempt.id, 'attempt');
  const attemptPath = `users/${user.uid}/quizAttempts/${attemptId}`;

  // Guarantee parent profile doc exists before writing subcollection doc
  await ensureUserProfileDoc(user);

  const totalQuestions = Math.max(
    1,
    Math.min(500, Math.round(attempt.totalQuestions))
  );
  const totalMarks = Math.max(
    0,
    Math.min(1000, Number(attempt.totalMarks ?? totalQuestions))
  );
  const correctCount = Math.max(
    0,
    Math.min(totalQuestions, Math.round(attempt.correctCount))
  );
  const wrongCount = Math.max(
    0,
    Math.min(totalQuestions, Math.round(attempt.wrongCount))
  );
  const unansweredCount = Math.max(
    0,
    Math.min(totalQuestions, Math.round(attempt.unansweredCount))
  );
  const accuracyPercent = Math.max(
    0,
    Math.min(100, Number(attempt.accuracyPercent))
  );
  const pscNetScore = Math.max(
    0,
    Math.min(totalMarks, Number(attempt.pscNetScore))
  );
  const durationSeconds = Math.max(
    0,
    Math.min(36000, Math.round(attempt.durationSeconds))
  );
  const deadlineSeconds = Math.max(
    1,
    Math.min(36000, Math.round(attempt.deadlineSeconds))
  );

  try {
    await setDoc(doc(db, 'users', user.uid, 'quizAttempts', attemptId), {
      id: attemptId,
      userId: user.uid,
      deckId: (attempt.deckId || 'quiz').slice(0, 160),
      deckTitle: (attempt.deckTitle || 'PSC Practice Quiz').slice(0, 220),
      mode: attempt.mode === 'study' ? 'study' : 'exam',
      totalQuestions,
      totalMarks,
      correctCount,
      wrongCount,
      unansweredCount,
      accuracyPercent,
      pscNetScore,
      durationSeconds,
      deadlineSeconds,
      timedOut: Boolean(attempt.timedOut),
      completedAt: (attempt.completedAt || new Date().toISOString()).slice(
        0,
        64
      ),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, attemptPath);
  }
}

async function fetchUserQuizAttempts(
  userId: string
): Promise<QuizAttemptRecord[]> {
  const collectionPath = `users/${userId}/quizAttempts`;
  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('userId', '==', userId),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: String(data.id ?? docSnap.id),
        deckId: String(data.deckId ?? ''),
        deckTitle: String(data.deckTitle ?? 'PSC Quiz'),
        mode: data.mode === 'study' ? 'study' : 'exam',
        totalQuestions: Number(data.totalQuestions ?? 0),
        totalMarks:
          typeof data.totalMarks === 'number' ? data.totalMarks : undefined,
        correctCount: Number(data.correctCount ?? 0),
        wrongCount: Number(data.wrongCount ?? 0),
        unansweredCount: Number(data.unansweredCount ?? 0),
        accuracyPercent: Number(data.accuracyPercent ?? 0),
        pscNetScore: Number(data.pscNetScore ?? 0),
        durationSeconds: Number(data.durationSeconds ?? 0),
        deadlineSeconds: Number(data.deadlineSeconds ?? 60),
        timedOut: Boolean(data.timedOut),
        completedAt: String(data.completedAt ?? new Date().toISOString()),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in window was closed before completing Google login.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'A Google sign-in request was already in progress.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'This domain is not yet authorized in Firebase Authentication settings.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network error while connecting to Google Sign-In. Please check your connection.';
  }
  return error instanceof Error
    ? error.message
    : 'Unable to sign in with Google right now. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const syncedUidRef = useRef<string | null>(null);

  // Load public non-PII community itemStats (views, likes, dislikes) once on mount for guests
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stats = await fetchAllCloudItemStats();
        if (!cancelled) {
          dispatch(setCloudItemStats(stats));
        }
      } catch (err) {
        console.error('Failed to load community item stats:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  // Real-time community itemStats listener when user is authenticated
  useEffect(() => {
    if (!isAuthReady || !user) return;
    const unsubscribe = subscribeToCloudItemStats((stats) => {
      dispatch(setCloudItemStats(stats));
    });
    return () => {
      unsubscribe();
    };
  }, [isAuthReady, user, dispatch]);

  // Enforce active account status in real time if admin bans/disables a signed-in user
  useEffect(() => {
    if (!isAuthReady || !user || !user.emailVerified) return;
    const userPath = `users/${user.uid}`;
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        if (data.status === 'banned' || data.status === 'disabled') {
          const reason =
            typeof data.statusReason === 'string' ? data.statusReason : '';
          const blocked = new AccountBlockedError(data.status, reason);
          setAuthError(blocked.message);
          syncedUidRef.current = null;
          clearEnsuredProfileCache(user.uid);
          dispatch(resetCloudReactionSyncState());
          void signOut(auth);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );
    return () => unsubscribe();
  }, [isAuthReady, user, dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (!firebaseUser) {
        syncedUidRef.current = null;
        clearEnsuredProfileCache();
        dispatch(resetCloudReactionSyncState());
        return;
      }

      if (syncedUidRef.current === firebaseUser.uid) {
        return;
      }
      syncedUidRef.current = firebaseUser.uid;

      void (async () => {
        try {
          if (!firebaseUser.emailVerified) {
            return;
          }

          await ensureUserProfileDoc(firebaseUser);

          // 1. Sync Quiz & OMR Attempts
          const remoteAttempts = await fetchUserQuizAttempts(firebaseUser.uid);
          if (remoteAttempts.length > 0) {
            dispatch(mergeRemoteQuizAttempts(remoteAttempts));
          }

          // 2. Sync Flagged Questions & Revision Notes (two-way merge)
          const cloudFlags = await fetchUserFlaggedQuestions(firebaseUser.uid);
          const { toPushToCloud } = storageService.mergeCloudFlaggedQuestions(cloudFlags);
          for (const flagRecord of toPushToCloud) {
            if (auth.currentUser?.uid !== firebaseUser.uid) return;
            await upsertFlaggedQuestionInFirestore(firebaseUser.uid, flagRecord);
          }

          // 3. Sync User Reactions & Views (two-way merge + community stats sync)
          const cloudReactions = await fetchUserCloudReactions(firebaseUser.uid);
          if (auth.currentUser?.uid !== firebaseUser.uid) return;
          dispatch(hydrateUserCloudReactions(cloudReactions));

          // Push any offline/guest reactions or views not yet reflected in Firestore
          const localReactionsState = store.getState().reactions;
          const candidateIds = new Set<string>([
            ...Object.keys(localReactionsState.userReactions),
            ...Object.keys(localReactionsState.itemViews),
          ]);

          let pushedAny = false;
          for (const itemId of candidateIds) {
            if (auth.currentUser?.uid !== firebaseUser.uid) return;

            const localReaction =
              localReactionsState.userReactions[itemId] ?? 'none';
            const cloudReaction =
              cloudReactions.userReactions[itemId] ?? 'none';
            const localViews = localReactionsState.itemViews[itemId] ?? 0;
            const cloudViews = cloudReactions.itemViews[itemId] ?? 0;
            const finalViews = Math.max(localViews, cloudViews);

            if (localReaction !== cloudReaction || localViews > cloudViews) {
              const itemType = resolveReactionItemType(
                itemId,
                localReactionsState.itemTypes[itemId]
              );
              const ack = await syncReactionAndStatsToFirestore({
                userId: firebaseUser.uid,
                itemId,
                itemType,
                targetReaction: localReaction,
                targetUserViews: finalViews,
              });
              if (auth.currentUser?.uid === firebaseUser.uid) {
                dispatch(applyItemSyncAck(ack));
              }
              pushedAny = true;
            }
          }

          if (pushedAny && auth.currentUser?.uid === firebaseUser.uid) {
            const refreshedStats = await fetchAllCloudItemStats();
            if (auth.currentUser?.uid === firebaseUser.uid) {
              dispatch(setCloudItemStats(refreshedStats));
            }
          }
        } catch (err) {
          if (err instanceof AccountBlockedError) {
            setAuthError(err.message);
            syncedUidRef.current = null;
            clearEnsuredProfileCache(firebaseUser.uid);
            dispatch(resetCloudReactionSyncState());
            void signOut(auth);
            return;
          }
          console.error('Failed to sync authenticated user data:', err);
        }
      })();
    });

    return () => unsubscribe();
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      setUser(credential.user);
      return credential.user;
    } catch (error) {
      setAuthError(mapFirebaseAuthError(error));
      return null;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOutUser = useCallback(async (): Promise<void> => {
    setAuthError(null);
    const activeUid = auth.currentUser?.uid;
    try {
      await signOut(auth);
      if (activeUid) {
        clearEnsuredProfileCache(activeUid);
      }
      syncedUidRef.current = null;
      dispatch(resetCloudReactionSyncState());
    } catch (error) {
      setAuthError(mapFirebaseAuthError(error));
    }
  }, [dispatch]);

  const isDashboardAdmin = useMemo(() => isDashboardAdminUser(user), [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isDashboardAdmin,
      isAuthReady,
      isSigningIn,
      authError,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
    }),
    [
      user,
      isDashboardAdmin,
      isAuthReady,
      isSigningIn,
      authError,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
