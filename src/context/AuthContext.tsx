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
  getDocFromCache,
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
  resetLocalQuizHistory,
  type QuizAttemptRecord,
} from '../features/quiz/quizSlice';
import {
  applyItemSyncAck,
  hydrateUserCloudReactions,
  resetCloudReactionSyncState,
  resetLocalUserReactions,
  setCloudItemStats,
} from '../features/reactions/reactionsSlice';
import { resolveReactionItemType } from '../features/reactions/reactionUtils';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  reportFirestoreSnapshotError,
} from '../lib/firebase';
import { pscApi } from '../app/api/pscApi';
import {
  clearEnsuredProfileCache,
  subscribeToCloudItemStats,
  subscribeToCloudMaterialOverrides,
  subscribeToCloudQuizOverrides,
  subscribeToCloudWrittenOverrides,
  upsertFlaggedQuestionInFirestore,
} from '../services/cloudSyncService';
import { materialStorageService } from '../services/materialStorageService';
import { questionStorageService } from '../services/questionStorageService';
import { storageService } from '../services/storageService';
import { toast } from '../services/toastService';
import {
  formatUserFriendlyError,
  isFirestoreOfflineError,
} from '../utils/errorHelpers';

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

async function getDocWithOfflineResilience(userRef: ReturnType<typeof doc>) {
  try {
    return await getDoc(userRef);
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      throw error;
    }

    try {
      return await getDocFromCache(userRef);
    } catch {
      // Cache miss; wait briefly in case initial Firestore channel is still connecting
    }

    if (typeof navigator === 'undefined' || navigator.onLine !== false) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return await getDoc(userRef);
    }

    throw error;
  }
}

export async function ensureUserProfileDoc(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const fields = buildSanitizedProfileFields(user);

  let snap;
  try {
    snap = await getDocWithOfflineResilience(userRef);
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
    const existingData = snap.data() as Record<string, unknown>;
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
    let hasProfileBackfill = false;
    if (!existingData.displayName && fields.displayName) {
      patch.displayName = fields.displayName;
      hasProfileBackfill = true;
    }
    if (!existingData.email && fields.email) {
      patch.email = fields.email;
      hasProfileBackfill = true;
    }
    if (!existingData.photoURL && fields.photoURL) {
      patch.photoURL = fields.photoURL;
      hasProfileBackfill = true;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return;
    }

    if (!hasProfileBackfill) {
      void updateDoc(userRef, patch).catch((error) => {
        if (!isFirestoreOfflineError(error)) {
          reportFirestoreSnapshotError(error, OperationType.UPDATE, userPath);
        }
      });
      return;
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
  const syncingUidRef = useRef<string | null>(null);
  const needsPublicCloudReloadRef = useRef(false);

  const loadPublicCloudData = useCallback(
    async (isCancelled?: () => boolean) => {
      const [statsRes, quizRes, writtenRes, materialsRes] =
        await Promise.allSettled([
          store
            .dispatch(
              pscApi.endpoints.getCloudItemStats.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap(),
          store
            .dispatch(
              pscApi.endpoints.getCloudQuizBank.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap(),
          store
            .dispatch(
              pscApi.endpoints.getCloudWrittenBank.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap(),
          store
            .dispatch(
              pscApi.endpoints.getCloudMaterials.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap(),
        ]);
      if (isCancelled?.()) return;

      let hadOfflineFailure = false;

      if (statsRes.status === 'fulfilled') {
        dispatch(setCloudItemStats(statsRes.value));
      } else if (isFirestoreOfflineError(statsRes.reason)) {
        hadOfflineFailure = true;
        console.warn('Deferred community item stats load while offline.');
      } else {
        console.error('Failed to load community item stats:', statsRes.reason);
        toast.error(
          formatUserFriendlyError(
            statsRes.reason,
            'Could not load community view and rating counts.'
          ),
          { id: 'cloud-stats-load-err' }
        );
      }

      if (quizRes.status === 'fulfilled') {
        questionStorageService.applyCloudQuizOverrides(quizRes.value);
      } else if (isFirestoreOfflineError(quizRes.reason)) {
        hadOfflineFailure = true;
        console.warn('Deferred cloud MCQ bank load while offline.');
      } else {
        console.error('Failed to load cloud MCQ bank overrides:', quizRes.reason);
        toast.error(
          formatUserFriendlyError(
            quizRes.reason,
            'Could not load updated MCQ question bank from cloud. Using cached questions.'
          ),
          { id: 'cloud-quiz-load-err' }
        );
      }

      if (writtenRes.status === 'fulfilled') {
        questionStorageService.applyCloudWrittenOverrides(writtenRes.value);
      } else if (isFirestoreOfflineError(writtenRes.reason)) {
        hadOfflineFailure = true;
        console.warn('Deferred cloud written bank load while offline.');
      } else {
        console.error('Failed to load cloud written bank overrides:', writtenRes.reason);
        toast.error(
          formatUserFriendlyError(
            writtenRes.reason,
            'Could not load updated written question bank from cloud. Using cached questions.'
          ),
          { id: 'cloud-written-load-err' }
        );
      }

      if (materialsRes.status === 'fulfilled') {
        materialStorageService.applyCloudMaterialOverrides(materialsRes.value);
      } else if (isFirestoreOfflineError(materialsRes.reason)) {
        hadOfflineFailure = true;
        console.warn('Deferred cloud reading materials load while offline.');
      } else {
        console.error(
          'Failed to load cloud reading materials overrides:',
          materialsRes.reason
        );
        toast.error(
          formatUserFriendlyError(
            materialsRes.reason,
            'Could not load updated reading materials catalog from cloud. Using cached catalog.'
          ),
          { id: 'cloud-materials-load-err' }
        );
      }

      needsPublicCloudReloadRef.current = hadOfflineFailure;
      if (hadOfflineFailure) {
        toast.warning(
          'Cloud database is currently offline. Using locally cached data until reconnected.',
          { id: 'firebase-offline', title: 'Offline Mode' }
        );
      }
    },
    [dispatch]
  );

  // Load public non-PII community itemStats and question banks independently on mount
  useEffect(() => {
    let cancelled = false;
    void loadPublicCloudData(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [loadPublicCloudData]);

  // Real-time community itemStats, question banks, and reading materials listeners when user is authenticated
  useEffect(() => {
    if (!isAuthReady || !user) return;
    const handleLiveSyncError = (
      label: string,
      err: unknown,
      toastId: string,
      fallbackMsg: string
    ) => {
      if (isFirestoreOfflineError(err)) {
        console.warn(`${label} paused while offline.`);
        toast.warning(
          'Cloud connection interrupted. Changes are saved locally and will sync when back online.',
          { id: 'firebase-offline', title: 'Offline Mode' }
        );
        return;
      }
      console.error(`${label}:`, err);
      toast.error(formatUserFriendlyError(err, fallbackMsg), { id: toastId });
    };

    const unsubscribeStats = subscribeToCloudItemStats(
      (stats) => {
        dispatch(setCloudItemStats(stats));
      },
      (err) => {
        handleLiveSyncError(
          'Community stats live sync error',
          err,
          'cloud-stats-sub-err',
          'Live community ratings sync was interrupted.'
        );
      }
    );
    const unsubscribeQuizBank = subscribeToCloudQuizOverrides(
      (overrides) => {
        questionStorageService.applyCloudQuizOverrides(overrides);
      },
      (err) => {
        handleLiveSyncError(
          'Quiz bank live sync error',
          err,
          'cloud-quiz-sub-err',
          'Live MCQ question bank sync was interrupted.'
        );
      }
    );
    const unsubscribeWrittenBank = subscribeToCloudWrittenOverrides(
      (overrides) => {
        questionStorageService.applyCloudWrittenOverrides(overrides);
      },
      (err) => {
        handleLiveSyncError(
          'Written bank live sync error',
          err,
          'cloud-written-sub-err',
          'Live written question bank sync was interrupted.'
        );
      }
    );
    const unsubscribeMaterials = subscribeToCloudMaterialOverrides(
      (overrides) => {
        materialStorageService.applyCloudMaterialOverrides(overrides);
      },
      (err) => {
        handleLiveSyncError(
          'Reading materials live sync error',
          err,
          'cloud-materials-sub-err',
          'Live reading materials catalog sync was interrupted.'
        );
      }
    );
    return () => {
      unsubscribeStats();
      unsubscribeQuizBank();
      unsubscribeWrittenBank();
      unsubscribeMaterials();
    };
  }, [isAuthReady, user, dispatch]);

  // Enforce active account status in real time if admin bans, disables, or deletes a signed-in user
  useEffect(() => {
    if (!isAuthReady || !user || !user.emailVerified) return;
    const userPath = `users/${user.uid}`;
    let hadProfileSnap = false;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (!snap.exists()) {
          if (hadProfileSnap) {
            const msg =
              'Your account data was removed by an administrator. You have been signed out.';
            setAuthError(msg);
            toast.error(msg, {
              id: 'auth-account-blocked',
              title: 'Account Removed',
              duration: 9000,
            });
            syncedUidRef.current = null;
            clearEnsuredProfileCache(user.uid);
            storageService.clearLastCloudUid();
            storageService.clearLocalFlaggedQuestionsOnly();
            dispatch(resetLocalUserReactions());
            dispatch(resetLocalQuizHistory());
            void signOut(auth);
          }
          return;
        }

        hadProfileSnap = true;
        const data = snap.data();
        if (data.status === 'banned' || data.status === 'disabled') {
          const reason =
            typeof data.statusReason === 'string' ? data.statusReason : '';
          const blocked = new AccountBlockedError(data.status, reason);
          setAuthError(blocked.message);
          toast.error(blocked.message, {
            id: 'auth-account-blocked',
            title:
              data.status === 'banned' ? 'Account Banned' : 'Account Disabled',
            duration: 9000,
          });
          syncedUidRef.current = null;
          clearEnsuredProfileCache(user.uid);
          storageService.clearLastCloudUid();
          storageService.clearLocalFlaggedQuestionsOnly();
          dispatch(resetLocalUserReactions());
          dispatch(resetLocalQuizHistory());
          void signOut(auth);
        }
      },
      (error) => {
        reportFirestoreSnapshotError(error, OperationType.GET, userPath);
        if (isFirestoreOfflineError(error)) {
          toast.warning(
            'Cloud connection interrupted. Using cached session until reconnected.',
            { id: 'firebase-offline', title: 'Offline Mode' }
          );
          return;
        }
        toast.error(
          formatUserFriendlyError(
            error,
            'Unable to verify account status in real time.'
          ),
          { id: 'auth-profile-watch-err' }
        );
      }
    );
    return () => unsubscribe();
  }, [isAuthReady, user, dispatch]);

  const syncAuthenticatedUser = useCallback(
    async (firebaseUser: User) => {
      if (!firebaseUser.emailVerified) {
        syncedUidRef.current = firebaseUser.uid;
        return;
      }
      if (
        syncedUidRef.current === firebaseUser.uid ||
        syncingUidRef.current === firebaseUser.uid
      ) {
        return;
      }

      syncingUidRef.current = firebaseUser.uid;
      try {
        await ensureUserProfileDoc(firebaseUser);
        if (auth.currentUser?.uid !== firebaseUser.uid) return;

        const previousCloudUid = storageService.getLastCloudUid();
        if (previousCloudUid && previousCloudUid !== firebaseUser.uid) {
          storageService.clearLocalFlaggedQuestionsOnly();
          dispatch(resetLocalUserReactions());
          dispatch(resetLocalQuizHistory());
        }
        storageService.setLastCloudUid(firebaseUser.uid);

        // 1. Sync Quiz & OMR Attempts
        const remoteAttempts = await fetchUserQuizAttempts(firebaseUser.uid);
        if (remoteAttempts.length > 0) {
          dispatch(mergeRemoteQuizAttempts(remoteAttempts));
        }

        // 2. Sync Flagged Questions & Revision Notes (two-way merge)
        const cloudFlags = await store
          .dispatch(
            pscApi.endpoints.getUserFlaggedQuestions.initiate(
              firebaseUser.uid,
              { forceRefetch: true }
            )
          )
          .unwrap();
        const { toPushToCloud } =
          storageService.mergeCloudFlaggedQuestions(cloudFlags);
        for (const flagRecord of toPushToCloud) {
          if (auth.currentUser?.uid !== firebaseUser.uid) return;
          await upsertFlaggedQuestionInFirestore(firebaseUser.uid, flagRecord);
        }

        // 3. Sync User Reactions & Views (two-way merge + community stats sync)
        const cloudReactions = await store
          .dispatch(
            pscApi.endpoints.getUserCloudReactions.initiate(firebaseUser.uid, {
              forceRefetch: true,
            })
          )
          .unwrap();
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
          const cloudReaction = cloudReactions.userReactions[itemId] ?? 'none';
          const localViews = localReactionsState.itemViews[itemId] ?? 0;
          const cloudViews = cloudReactions.itemViews[itemId] ?? 0;
          const finalViews = Math.max(localViews, cloudViews);

          if (localReaction !== cloudReaction || localViews > cloudViews) {
            const itemType = resolveReactionItemType(
              itemId,
              localReactionsState.itemTypes[itemId]
            );
            const ack = await store
              .dispatch(
                pscApi.endpoints.syncReactionAndStats.initiate({
                  userId: firebaseUser.uid,
                  itemId,
                  itemType,
                  targetReaction: localReaction,
                  targetUserViews: finalViews,
                })
              )
              .unwrap();
            if (auth.currentUser?.uid === firebaseUser.uid) {
              dispatch(applyItemSyncAck(ack));
            }
            pushedAny = true;
          }
        }

        if (pushedAny && auth.currentUser?.uid === firebaseUser.uid) {
          const refreshedStats = await store
            .dispatch(
              pscApi.endpoints.getCloudItemStats.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap();
          if (auth.currentUser?.uid === firebaseUser.uid) {
            dispatch(setCloudItemStats(refreshedStats));
          }
        }

        if (auth.currentUser?.uid === firebaseUser.uid) {
          syncedUidRef.current = firebaseUser.uid;
        }
      } catch (err) {
        if (err instanceof AccountBlockedError) {
          setAuthError(err.message);
          toast.error(err.message, {
            id: 'auth-account-blocked',
            title:
              err.status === 'banned' ? 'Account Banned' : 'Account Disabled',
            duration: 9000,
          });
          syncedUidRef.current = null;
          clearEnsuredProfileCache(firebaseUser.uid);
          storageService.clearLastCloudUid();
          storageService.clearLocalFlaggedQuestionsOnly();
          dispatch(resetLocalUserReactions());
          dispatch(resetLocalQuizHistory());
          void signOut(auth);
          return;
        }

        syncedUidRef.current = null;

        if (isFirestoreOfflineError(err)) {
          console.warn(
            'Authenticated user cloud sync deferred while offline:',
            err instanceof Error ? err.message : err
          );
          toast.warning(
            'Cloud database is currently offline. Local progress is saved and will sync automatically when reconnected.',
            { id: 'firebase-offline', title: 'Offline Mode' }
          );
          return;
        }

        console.error('Failed to sync authenticated user data:', err);
        toast.error(
          formatUserFriendlyError(
            err,
            'Could not sync your cloud study progress right now.'
          ),
          { id: 'auth-cloud-sync-err', title: 'Cloud Sync Error' }
        );
      } finally {
        if (syncingUidRef.current === firebaseUser.uid) {
          syncingUidRef.current = null;
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (!firebaseUser) {
        const previousCloudUid = storageService.getLastCloudUid();
        syncedUidRef.current = null;
        syncingUidRef.current = null;
        clearEnsuredProfileCache();
        dispatch(
          pscApi.util.invalidateTags([
            'UserFlags',
            'UserReactions',
            'AdminUsers',
          ])
        );
        if (previousCloudUid) {
          storageService.clearLastCloudUid();
          storageService.clearLocalFlaggedQuestionsOnly();
          dispatch(resetLocalUserReactions());
          dispatch(resetLocalQuizHistory());
        } else {
          dispatch(resetCloudReactionSyncState());
        }
        return;
      }

      void syncAuthenticatedUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [dispatch, syncAuthenticatedUser]);

  // Automatically retry deferred cloud sync once browser connectivity returns
  useEffect(() => {
    const handleOnline = () => {
      if (needsPublicCloudReloadRef.current) {
        void loadPublicCloudData();
      }
      const activeUser = auth.currentUser;
      if (activeUser && syncedUidRef.current !== activeUser.uid) {
        void syncAuthenticatedUser(activeUser);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [loadPublicCloudData, syncAuthenticatedUser]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      setUser(credential.user);
      const name =
        credential.user.displayName || credential.user.email || 'your account';
      toast.success(`Signed in as ${name}.`, {
        id: 'auth-status',
        title: 'Welcome Back',
      });
      return credential.user;
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      setAuthError(mapped);
      toast.error(mapped, {
        id: 'auth-err',
        title: 'Sign-In Unsuccessful',
      });
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
      storageService.clearLastCloudUid();
      storageService.clearLocalFlaggedQuestionsOnly();
      dispatch(resetLocalUserReactions());
      dispatch(resetLocalQuizHistory());
      toast.info('Signed out successfully.', { id: 'auth-status' });
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      setAuthError(mapped);
      toast.error(mapped, {
        id: 'auth-err',
        title: 'Sign-Out Failed',
      });
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
