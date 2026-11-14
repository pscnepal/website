import {
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import type { QuizDifficulty, QuizOptionKey, QuizQuestion } from '../data/quizData';
import {
  WRITTEN_PAPERS,
  type BilingualRubricPoint,
  type BilingualSection,
  type WrittenPaperCode,
  type WrittenQuestion,
  type WrittenQuestionType,
} from '../data/writtenQuestionsData';
import type { FlaggedQuestionRecord } from './storageService';

export type CloudItemType = 'question' | 'material';
export type CloudReactionValue = 'like' | 'dislike' | 'none';

export interface CloudItemStatsEntry {
  views: number;
  likes: number;
  dislikes: number;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export function sanitizeFirestoreId(raw: string, fallbackPrefix = 'item'): string {
  const cleaned = (raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 128);
  if (cleaned.length > 0 && VALID_ID_REGEX.test(cleaned)) {
    return cleaned;
  }
  return `${fallbackPrefix}-${Date.now()}`;
}

// Per-item queue ensures rapid clicks/views for the same itemId execute sequentially
const itemSyncQueues = new Map<string, Promise<void>>();

function enqueueItemTask<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = itemSyncQueues.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(task);
  const tail = next.then(
    () => undefined,
    () => undefined
  );
  itemSyncQueues.set(key, tail);
  void tail.finally(() => {
    if (itemSyncQueues.get(key) === tail) {
      itemSyncQueues.delete(key);
    }
  });
  return next;
}

const ensuredProfiles = new Set<string>();

async function ensureAuthenticatedUserDocExists(userId: string): Promise<void> {
  if (ensuredProfiles.has(userId)) return;

  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) return;

  const userPath = `users/${userId}`;
  const userRef = doc(db, 'users', userId);
  let snap;
  try {
    snap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (!snap.exists()) {
    const displayName = (
      currentUser.displayName?.trim() ||
      currentUser.email?.split('@')[0] ||
      'PSC Aspirant'
    ).slice(0, 120);

    const payload: Record<string, unknown> = {
      uid: userId,
      displayName,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };
    if (currentUser.email?.trim()) {
      payload.email = currentUser.email.trim().slice(0, 254);
    }
    if (currentUser.photoURL?.trim()) {
      payload.photoURL = currentUser.photoURL.trim().slice(0, 512);
    }

    try {
      await setDoc(userRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }
  }

  ensuredProfiles.add(userId);
}

export function clearEnsuredProfileCache(userId?: string): void {
  if (userId) {
    ensuredProfiles.delete(userId);
  } else {
    ensuredProfiles.clear();
  }
}

// ============================================================================
// COMMUNITY ITEM STATS (Public Read / Atomic Transaction Write)
// ============================================================================

export async function fetchAllCloudItemStats(): Promise<
  Record<string, CloudItemStatsEntry>
> {
  const path = 'itemStats';
  try {
    const q = query(
      collection(db, 'itemStats'),
      where('itemType', 'in', ['question', 'material']),
      limit(1000)
    );
    const snapshot = await getDocs(q);
    const map: Record<string, CloudItemStatsEntry> = {};
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const id = String(data.itemId ?? docSnap.id);
      map[id] = {
        views: Math.max(0, Number(data.viewsCount ?? 0)),
        likes: Math.max(0, Number(data.likesCount ?? 0)),
        dislikes: Math.max(0, Number(data.dislikesCount ?? 0)),
      };
    });
    return map;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToCloudItemStats(
  onData: (stats: Record<string, CloudItemStatsEntry>) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'itemStats';
  const q = query(
    collection(db, 'itemStats'),
    where('itemType', 'in', ['question', 'material']),
    limit(1000)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const map: Record<string, CloudItemStatsEntry> = {};
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const id = String(data.itemId ?? docSnap.id);
        map[id] = {
          views: Math.max(0, Number(data.viewsCount ?? 0)),
          likes: Math.max(0, Number(data.likesCount ?? 0)),
          dislikes: Math.max(0, Number(data.dislikesCount ?? 0)),
        };
      });
      onData(map);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function fetchUserCloudReactions(userId: string): Promise<{
  userReactions: Record<string, 'like' | 'dislike'>;
  itemViews: Record<string, number>;
}> {
  const path = `users/${userId}/itemReactions`;
  try {
    const q = query(
      collection(db, 'users', userId, 'itemReactions'),
      where('userId', '==', userId),
      limit(300)
    );
    const snapshot = await getDocs(q);
    const userReactions: Record<string, 'like' | 'dislike'> = {};
    const itemViews: Record<string, number> = {};

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const id = String(data.itemId ?? docSnap.id);
      if (data.reaction === 'like' || data.reaction === 'dislike') {
        userReactions[id] = data.reaction;
      }
      const vc = Number(data.viewCount ?? 0);
      if (vc > 0) {
        itemViews[id] = vc;
      }
    });

    return { userReactions, itemViews };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function syncReactionAndStatsToFirestore(params: {
  userId: string;
  itemId: string;
  itemType: CloudItemType;
  targetReaction: CloudReactionValue;
  targetUserViews: number;
}): Promise<{
  itemId: string;
  syncedReaction: 'like' | 'dislike' | null;
  syncedViews: number;
  stats: CloudItemStatsEntry;
}> {
  const safeId = sanitizeFirestoreId(params.itemId, 'item');
  const queueKey = `${params.userId}:${safeId}`;

  return enqueueItemTask(queueKey, async () => {
    await ensureAuthenticatedUserDocExists(params.userId);

    const reactionPath = `users/${params.userId}/itemReactions/${safeId}`;
    const statsPath = `itemStats/${safeId}`;
    const reactionRef = doc(db, 'users', params.userId, 'itemReactions', safeId);
    const statsRef = doc(db, 'itemStats', safeId);

    try {
      return await runTransaction(db, async (tx) => {
        const reactionSnap = await tx.get(reactionRef);
        const statsSnap = await tx.get(statsRef);

        const prevReaction: CloudReactionValue = reactionSnap.exists()
          ? (reactionSnap.data().reaction as CloudReactionValue) ?? 'none'
          : 'none';
        const prevUserViews = reactionSnap.exists()
          ? Math.max(0, Number(reactionSnap.data().viewCount ?? 0))
          : 0;

        const nextReaction: CloudReactionValue = params.targetReaction;
        const clampedTargetViews = Math.max(
          prevUserViews,
          Math.min(100000, Math.round(params.targetUserViews))
        );
        const viewDelta = Math.max(
          0,
          Math.min(100, clampedTargetViews - prevUserViews)
        );
        const nextUserViews = prevUserViews + viewDelta;

        const likeDelta =
          (nextReaction === 'like' ? 1 : 0) - (prevReaction === 'like' ? 1 : 0);
        const dislikeDelta =
          (nextReaction === 'dislike' ? 1 : 0) -
          (prevReaction === 'dislike' ? 1 : 0);

        const existingViews = statsSnap.exists()
          ? Math.max(0, Number(statsSnap.data().viewsCount ?? 0))
          : 0;
        const existingLikes = statsSnap.exists()
          ? Math.max(0, Number(statsSnap.data().likesCount ?? 0))
          : 0;
        const existingDislikes = statsSnap.exists()
          ? Math.max(0, Number(statsSnap.data().dislikesCount ?? 0))
          : 0;

        const nextStats: CloudItemStatsEntry = {
          views: Math.min(10000000, Math.max(0, existingViews + viewDelta)),
          likes: Math.min(1000000, Math.max(0, existingLikes + likeDelta)),
          dislikes: Math.min(
            1000000,
            Math.max(0, existingDislikes + dislikeDelta)
          ),
        };

        if (!reactionSnap.exists()) {
          tx.set(reactionRef, {
            itemId: safeId,
            userId: params.userId,
            itemType: params.itemType,
            reaction: nextReaction,
            viewCount: nextUserViews,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          tx.update(reactionRef, {
            reaction: nextReaction,
            viewCount: nextUserViews,
            updatedAt: serverTimestamp(),
          });
        }

        if (!statsSnap.exists()) {
          tx.set(statsRef, {
            itemId: safeId,
            itemType: params.itemType,
            viewsCount: nextStats.views,
            likesCount: nextStats.likes,
            dislikesCount: nextStats.dislikes,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          tx.update(statsRef, {
            viewsCount: nextStats.views,
            likesCount: nextStats.likes,
            dislikesCount: nextStats.dislikes,
            updatedAt: serverTimestamp(),
          });
        }

        return {
          itemId: safeId,
          syncedReaction: nextReaction === 'none' ? null : nextReaction,
          syncedViews: nextUserViews,
          stats: nextStats,
        };
      });
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `${reactionPath} + ${statsPath}`
      );
    }
  });
}

export async function clearUserReactionsInFirestore(userId: string): Promise<void> {
  const path = `users/${userId}/itemReactions`;
  let snapshot;
  try {
    const q = query(
      collection(db, 'users', userId, 'itemReactions'),
      where('userId', '==', userId),
      limit(300)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  if (snapshot.empty) return;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const safeId = sanitizeFirestoreId(String(data.itemId ?? docSnap.id), 'item');
    const prevReaction = data.reaction;
    const prevViews = Math.max(0, Number(data.viewCount ?? 0));

    if (prevReaction !== 'like' && prevReaction !== 'dislike' && prevViews === 0) {
      continue;
    }

    await enqueueItemTask(`${userId}:${safeId}`, async () => {
      const reactionPath = `users/${userId}/itemReactions/${safeId}`;
      const statsPath = `itemStats/${safeId}`;
      const reactionRef = doc(db, 'users', userId, 'itemReactions', safeId);
      const statsRef = doc(db, 'itemStats', safeId);

      try {
        await runTransaction(db, async (tx) => {
          const currentReactionSnap = await tx.get(reactionRef);
          if (!currentReactionSnap.exists()) return;

          const currentData = currentReactionSnap.data();
          const currentReaction = currentData.reaction;
          const likeDelta = currentReaction === 'like' ? -1 : 0;
          const dislikeDelta = currentReaction === 'dislike' ? -1 : 0;

          if (likeDelta !== 0 || dislikeDelta !== 0) {
            const statsSnap = await tx.get(statsRef);
            if (statsSnap.exists()) {
              const existingViews = Math.max(
                0,
                Number(statsSnap.data().viewsCount ?? 0)
              );
              const existingLikes = Math.max(
                0,
                Number(statsSnap.data().likesCount ?? 0)
              );
              const existingDislikes = Math.max(
                0,
                Number(statsSnap.data().dislikesCount ?? 0)
              );

              tx.update(statsRef, {
                viewsCount: existingViews,
                likesCount: Math.max(0, existingLikes + likeDelta),
                dislikesCount: Math.max(0, existingDislikes + dislikeDelta),
                updatedAt: serverTimestamp(),
              });
            }
          }

          tx.update(reactionRef, {
            reaction: 'none',
            viewCount: 0,
            updatedAt: serverTimestamp(),
          });
        });
      } catch (error) {
        handleFirestoreError(
          error,
          OperationType.WRITE,
          `${reactionPath} + ${statsPath}`
        );
      }
    });
  }
}

// ============================================================================
// FLAGGED QUESTIONS CLOUD SYNC
// ============================================================================

export async function fetchUserFlaggedQuestions(
  userId: string
): Promise<Record<string, FlaggedQuestionRecord>> {
  const path = `users/${userId}/flaggedQuestions`;
  try {
    const q = query(
      collection(db, 'users', userId, 'flaggedQuestions'),
      where('userId', '==', userId),
      limit(300)
    );
    const snapshot = await getDocs(q);
    const map: Record<string, FlaggedQuestionRecord> = {};
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const qId = String(data.questionId ?? docSnap.id);
      map[qId] = {
        questionId: qId,
        flaggedAt: String(data.flaggedAt ?? new Date().toISOString()),
        source:
          data.source === 'simulation'
            ? 'simulation'
            : data.source === 'dashboard'
              ? 'dashboard'
              : 'quiz',
        ...(typeof data.deckTitle === 'string' && data.deckTitle
          ? { deckTitle: data.deckTitle }
          : {}),
        ...(typeof data.cadreId === 'string' && data.cadreId
          ? { cadreId: data.cadreId }
          : {}),
        ...(typeof data.reason === 'string' ? { reason: data.reason } : { reason: '' }),
        ...(typeof data.note === 'string' ? { note: data.note } : { note: '' }),
      };
    });
    return map;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function upsertFlaggedQuestionInFirestore(
  userId: string,
  record: FlaggedQuestionRecord
): Promise<void> {
  const safeId = sanitizeFirestoreId(record.questionId, 'q');
  const flagPath = `users/${userId}/flaggedQuestions/${safeId}`;

  return enqueueItemTask(`flag:${userId}:${safeId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);

    const flagRef = doc(db, 'users', userId, 'flaggedQuestions', safeId);
    let snap;
    try {
      snap = await getDoc(flagRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, flagPath);
    }

    const source =
      record.source === 'simulation'
        ? 'simulation'
        : record.source === 'dashboard'
          ? 'dashboard'
          : 'quiz';

    const optionalFields: Record<string, string> = {};
    if (record.deckTitle && record.deckTitle.trim()) {
      optionalFields.deckTitle = record.deckTitle.trim().slice(0, 220);
    }
    if (record.cadreId && record.cadreId.trim()) {
      optionalFields.cadreId = record.cadreId.trim().slice(0, 64);
    }
    if (typeof record.reason === 'string') {
      optionalFields.reason = record.reason.trim().slice(0, 500);
    }
    if (typeof record.note === 'string') {
      optionalFields.note = record.note.slice(0, 1000);
    }

    const flaggedAt = (record.flaggedAt || new Date().toISOString()).slice(
      0,
      64
    );

    if (!snap.exists()) {
      try {
        await setDoc(flagRef, {
          questionId: safeId,
          userId,
          flaggedAt,
          source,
          ...optionalFields,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, flagPath);
      }
    } else {
      try {
        await updateDoc(flagRef, {
          flaggedAt,
          source,
          ...optionalFields,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, flagPath);
      }
    }
  });
}

export async function deleteFlaggedQuestionInFirestore(
  userId: string,
  questionId: string
): Promise<void> {
  const safeId = sanitizeFirestoreId(questionId, 'q');
  const flagPath = `users/${userId}/flaggedQuestions/${safeId}`;

  return enqueueItemTask(`flag:${userId}:${safeId}`, async () => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'flaggedQuestions', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, flagPath);
    }
  });
}

export async function clearAllFlaggedQuestionsInFirestore(
  userId: string
): Promise<void> {
  const path = `users/${userId}/flaggedQuestions`;
  let snapshot;
  try {
    const q = query(
      collection(db, 'users', userId, 'flaggedQuestions'),
      where('userId', '==', userId),
      limit(300)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  if (snapshot.empty) return;

  try {
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearUserQuizAttemptsInFirestore(
  userId: string
): Promise<void> {
  const path = `users/${userId}/quizAttempts`;
  let snapshot;
  try {
    const q = query(
      collection(db, 'users', userId, 'quizAttempts'),
      where('userId', '==', userId),
      limit(300)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  if (snapshot.empty) return;

  try {
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// ADMIN USERS DIRECTORY & TELEMETRY (Read-Only for Verified Dashboard Admin)
// ============================================================================

export type CloudUserStatus = 'active' | 'disabled' | 'banned';
export type CloudUserTargetCadre = 'section-officer' | 'nayab-subba' | 'kharidar';

export interface CloudUserQuizAttemptSummary {
  id: string;
  deckTitle: string;
  mode: 'exam' | 'study';
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracyPercent: number;
  pscNetScore: number;
  durationSeconds: number;
  completedAt: string;
}

export interface CloudUserFlaggedQuestionSummary {
  questionId: string;
  flaggedAt: string;
  source: 'quiz' | 'simulation' | 'dashboard';
  deckTitle: string;
  cadreId: string;
  reason: string;
  note: string;
}

export interface CloudUserDirectoryEntry {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'admin' | 'aspirant';
  status: CloudUserStatus;
  statusReason: string;
  targetCadre: CloudUserTargetCadre | '';
  phone: string;
  adminNotes: string;
  statusUpdatedAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
  quizAttemptsCount: number;
  questionsAnswered: number;
  averageAccuracy: number | null;
  bestAccuracy: number | null;
  flaggedCount: number;
  reactionsCount: number;
  viewsCount: number;
  recentAttempts: CloudUserQuizAttemptSummary[];
  flaggedQuestions: CloudUserFlaggedQuestionSummary[];
}

function toIsoStringOrNull(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw;
  if (
    typeof raw === 'object' &&
    raw !== null &&
    'toDate' in raw &&
    typeof (raw as { toDate?: () => Date }).toDate === 'function'
  ) {
    try {
      return (raw as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchUserDirectoryTelemetry(uid: string): Promise<{
  quizAttemptsCount: number;
  questionsAnswered: number;
  averageAccuracy: number | null;
  bestAccuracy: number | null;
  flaggedCount: number;
  reactionsCount: number;
  viewsCount: number;
  recentAttempts: CloudUserQuizAttemptSummary[];
  flaggedQuestions: CloudUserFlaggedQuestionSummary[];
}> {
  const attemptsPath = `users/${uid}/quizAttempts`;
  const flagsPath = `users/${uid}/flaggedQuestions`;
  const reactionsPath = `users/${uid}/itemReactions`;

  let attemptsSnap;
  try {
    attemptsSnap = await getDocs(
      query(
        collection(db, 'users', uid, 'quizAttempts'),
        where('userId', '==', uid),
        limit(100)
      )
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, attemptsPath);
  }

  let flagsSnap;
  try {
    flagsSnap = await getDocs(
      query(
        collection(db, 'users', uid, 'flaggedQuestions'),
        where('userId', '==', uid),
        limit(300)
      )
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, flagsPath);
  }

  let reactionsSnap;
  try {
    reactionsSnap = await getDocs(
      query(
        collection(db, 'users', uid, 'itemReactions'),
        where('userId', '==', uid),
        limit(300)
      )
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, reactionsPath);
  }

  const attempts: CloudUserQuizAttemptSummary[] = attemptsSnap.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        id: String(data.id ?? docSnap.id),
        deckTitle: String(data.deckTitle ?? 'PSC Practice Quiz'),
        mode: data.mode === 'study' ? ('study' as const) : ('exam' as const),
        totalQuestions: Math.max(0, Number(data.totalQuestions ?? 0)),
        correctCount: Math.max(0, Number(data.correctCount ?? 0)),
        wrongCount: Math.max(0, Number(data.wrongCount ?? 0)),
        accuracyPercent: Math.max(0, Math.min(100, Number(data.accuracyPercent ?? 0))),
        pscNetScore: Math.max(0, Number(data.pscNetScore ?? 0)),
        durationSeconds: Math.max(0, Number(data.durationSeconds ?? 0)),
        completedAt: String(data.completedAt ?? ''),
      };
    })
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const quizAttemptsCount = attempts.length;
  const questionsAnswered = attempts.reduce(
    (sum, att) => sum + att.correctCount + att.wrongCount,
    0
  );
  const averageAccuracy =
    quizAttemptsCount > 0
      ? Math.round(
          (attempts.reduce((sum, att) => sum + att.accuracyPercent, 0) /
            quizAttemptsCount) *
            10
        ) / 10
      : null;
  const bestAccuracy =
    quizAttemptsCount > 0
      ? Math.round(
          Math.max(...attempts.map((att) => att.accuracyPercent)) * 10
        ) / 10
      : null;

  let reactionsCount = 0;
  let viewsCount = 0;
  reactionsSnap.docs.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.reaction === 'like' || data.reaction === 'dislike') {
      reactionsCount += 1;
    }
    viewsCount += Math.max(0, Number(data.viewCount ?? 0));
  });

  const flaggedQuestions: CloudUserFlaggedQuestionSummary[] = flagsSnap.docs
    .map((docSnap) => {
      const data = docSnap.data();
      return {
        questionId: String(data.questionId ?? docSnap.id),
        flaggedAt: String(data.flaggedAt ?? ''),
        source:
          data.source === 'simulation'
            ? ('simulation' as const)
            : data.source === 'dashboard'
              ? ('dashboard' as const)
              : ('quiz' as const),
        deckTitle: typeof data.deckTitle === 'string' ? data.deckTitle : '',
        cadreId: typeof data.cadreId === 'string' ? data.cadreId : '',
        reason: typeof data.reason === 'string' ? data.reason : '',
        note: typeof data.note === 'string' ? data.note : '',
      };
    })
    .sort((a, b) => b.flaggedAt.localeCompare(a.flaggedAt));

  return {
    quizAttemptsCount,
    questionsAnswered,
    averageAccuracy,
    bestAccuracy,
    flaggedCount: flagsSnap.size,
    reactionsCount,
    viewsCount,
    recentAttempts: attempts.slice(0, 10),
    flaggedQuestions,
  };
}

async function buildDirectoryEntriesFromDocs(
  docs: Array<{ id: string; data: () => Record<string, unknown> }>,
  adminEmail: string
): Promise<CloudUserDirectoryEntry[]> {
  const normalizedAdmin = adminEmail.trim().toLowerCase();

  const entries = await Promise.all(
    docs.map(async (docSnap) => {
      const data = docSnap.data();
      const uid = String(data.uid ?? docSnap.id);
      const email = typeof data.email === 'string' ? data.email.trim() : '';
      const displayName =
        typeof data.displayName === 'string' && data.displayName.trim()
          ? data.displayName.trim()
          : email.split('@')[0] || 'PSC Aspirant';
      const photoURL =
        typeof data.photoURL === 'string' ? data.photoURL.trim() : '';

      const telemetry = await fetchUserDirectoryTelemetry(uid);
      const rawRole = data.role;
      const role: 'admin' | 'aspirant' =
        rawRole === 'admin' || email.toLowerCase() === normalizedAdmin
          ? 'admin'
          : 'aspirant';
      const status: CloudUserStatus =
        data.status === 'banned'
          ? 'banned'
          : data.status === 'disabled'
            ? 'disabled'
            : 'active';
      const targetCadre: CloudUserTargetCadre | '' =
        data.targetCadre === 'section-officer' ||
        data.targetCadre === 'nayab-subba' ||
        data.targetCadre === 'kharidar'
          ? data.targetCadre
          : '';

      return {
        uid,
        displayName,
        email,
        photoURL,
        role,
        status,
        statusReason:
          typeof data.statusReason === 'string' ? data.statusReason : '',
        targetCadre,
        phone: typeof data.phone === 'string' ? data.phone : '',
        adminNotes: typeof data.adminNotes === 'string' ? data.adminNotes : '',
        statusUpdatedAt: toIsoStringOrNull(data.statusUpdatedAt),
        updatedAt: toIsoStringOrNull(data.updatedAt),
        createdAt: toIsoStringOrNull(data.createdAt),
        lastLoginAt: toIsoStringOrNull(data.lastLoginAt),
        ...telemetry,
      };
    })
  );

  return entries;
}

export async function fetchAdminUsersDirectory(
  adminEmail: string
): Promise<CloudUserDirectoryEntry[]> {
  const path = 'users';
  let snapshot;
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('lastLoginAt', 'desc'),
      limit(200)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  return buildDirectoryEntriesFromDocs(snapshot.docs, adminEmail);
}

export function subscribeToAdminUsersDirectory(
  adminEmail: string,
  onData: (users: CloudUserDirectoryEntry[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'users';
  const q = query(
    collection(db, 'users'),
    orderBy('lastLoginAt', 'desc'),
    limit(200)
  );
  let active = true;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      void buildDirectoryEntriesFromDocs(snapshot.docs, adminEmail)
        .then((entries) => {
          if (active) {
            onData(entries);
          }
        })
        .catch((err) => {
          if (active && onError) {
            onError(err);
          }
        });
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return () => {
    active = false;
    unsubscribe();
  };
}

// ============================================================================
// ADMIN USER MANAGEMENT MUTATIONS (BAN, DISABLE, DETAILS, DELETE, PASSWORD)
// ============================================================================

export async function updateAdminUserStatus(params: {
  uid: string;
  status: CloudUserStatus;
  reason?: string;
}): Promise<void> {
  const userPath = `users/${params.uid}`;
  const userRef = doc(db, 'users', params.uid);
  const trimmedReason = (params.reason ?? '').trim().slice(0, 300);

  try {
    await updateDoc(userRef, {
      status: params.status,
      statusReason:
        params.status === 'active'
          ? deleteField()
          : trimmedReason ||
            (params.status === 'banned'
              ? 'Account banned by administrator.'
              : 'Account temporarily disabled by administrator.'),
      statusUpdatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

export interface UpdateAdminUserDetailsInput {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  role: 'admin' | 'aspirant';
  status?: CloudUserStatus;
  statusReason?: string;
  targetCadre?: CloudUserTargetCadre | '';
  phone?: string;
  adminNotes?: string;
  statusChanged?: boolean;
}

export async function updateAdminUserDetails(
  params: UpdateAdminUserDetailsInput
): Promise<void> {
  const userPath = `users/${params.uid}`;
  const userRef = doc(db, 'users', params.uid);
  const cleanName = params.displayName.trim().slice(0, 120);
  if (!cleanName) {
    throw new Error('Display name cannot be empty.');
  }

  const cleanEmail = (params.email ?? '').trim().slice(0, 254);
  const cleanPhoto = (params.photoURL ?? '').trim().slice(0, 512);
  const cleanPhone = (params.phone ?? '').trim().slice(0, 32);
  const cleanNotes = (params.adminNotes ?? '').trim().slice(0, 1000);
  const cleanReason = (params.statusReason ?? '').trim().slice(0, 300);

  const payload: Record<string, unknown> = {
    displayName: cleanName,
    email: cleanEmail ? cleanEmail : deleteField(),
    photoURL: cleanPhoto ? cleanPhoto : deleteField(),
    role: params.role === 'admin' ? 'admin' : 'aspirant',
    targetCadre: params.targetCadre ? params.targetCadre : deleteField(),
    phone: cleanPhone ? cleanPhone : deleteField(),
    adminNotes: cleanNotes ? cleanNotes : deleteField(),
    updatedAt: serverTimestamp(),
  };

  if (params.statusChanged && params.status) {
    payload.status = params.status;
    payload.statusReason =
      params.status === 'active'
        ? deleteField()
        : cleanReason || deleteField();
    payload.statusUpdatedAt = serverTimestamp();
  }

  try {
    await updateDoc(userRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

async function deleteSubcollectionForUser(
  uid: string,
  subcollection: 'quizAttempts' | 'flaggedQuestions' | 'itemReactions'
): Promise<void> {
  const colPath = `users/${uid}/${subcollection}`;
  let hasMore = true;

  while (hasMore) {
    let snap;
    try {
      const q = query(
        collection(db, 'users', uid, subcollection),
        where('userId', '==', uid),
        limit(300)
      );
      snap = await getDocs(q);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }

    if (snap.empty) {
      hasMore = false;
      break;
    }

    try {
      const batch = writeBatch(db);
      snap.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, colPath);
    }

    if (snap.size < 300) {
      hasMore = false;
    }
  }
}

export async function deleteAdminUserFromFirestore(uid: string): Promise<void> {
  await deleteSubcollectionForUser(uid, 'quizAttempts');
  await deleteSubcollectionForUser(uid, 'flaggedQuestions');
  await deleteSubcollectionForUser(uid, 'itemReactions');

  const userPath = `users/${uid}`;
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, userPath);
  }
}

export async function sendUserPasswordReset(email: string): Promise<void> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    throw new Error('This user profile does not have an email address.');
  }

  try {
    await sendPasswordResetEmail(auth, trimmedEmail);
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';

    if (code === 'auth/user-not-found') {
      throw new Error(
        'No Firebase Authentication account was found with this email address.'
      );
    }
    if (code === 'auth/invalid-email') {
      throw new Error('The email address on this user profile is invalid.');
    }
    if (code === 'auth/operation-not-allowed') {
      throw new Error(
        'Email/Password sign-in is currently disabled in Firebase Console Authentication providers. Enable Email/Password in Firebase Auth settings to send password reset links.'
      );
    }
    if (code === 'auth/too-many-requests') {
      throw new Error(
        'Too many reset emails were sent recently. Please wait a few minutes and try again.'
      );
    }
    throw error instanceof Error
      ? error
      : new Error('Unable to send password reset email.');
  }
}

export async function updateCurrentAdminPassword(
  newPassword: string
): Promise<'updated' | 'linked'> {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.email) {
    throw new Error('No authenticated admin session with an email address.');
  }
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const hasPasswordProvider = currentUser.providerData.some(
    (p) => p.providerId === 'password'
  );

  try {
    if (hasPasswordProvider) {
      await updatePassword(currentUser, newPassword);
      return 'updated';
    }
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      newPassword
    );
    await linkWithCredential(currentUser, credential);
    return 'linked';
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';

    if (code === 'auth/requires-recent-login') {
      try {
        await reauthenticateWithPopup(currentUser, googleProvider);
      } catch (reauthErr) {
        const reauthCode =
          typeof reauthErr === 'object' &&
          reauthErr !== null &&
          'code' in reauthErr
            ? String((reauthErr as { code?: unknown }).code)
            : '';
        if (reauthCode === 'auth/popup-closed-by-user') {
          throw new Error(
            'Re-authentication popup was closed before completing Google verification.'
          );
        }
        if (reauthCode === 'auth/popup-blocked') {
          throw new Error(
            'Re-authentication popup was blocked by your browser. Please allow pop-ups and try again.'
          );
        }
        if (reauthCode === 'auth/cancelled-popup-request') {
          throw new Error('A verification popup is already open.');
        }
        throw reauthErr instanceof Error
          ? reauthErr
          : new Error('Unable to re-authenticate with Google.');
      }

      if (hasPasswordProvider) {
        await updatePassword(currentUser, newPassword);
        return 'updated';
      }
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        newPassword
      );
      await linkWithCredential(currentUser, credential);
      return 'linked';
    }
    if (code === 'auth/operation-not-allowed') {
      throw new Error(
        'Email/Password sign-in is currently disabled in Firebase Console Authentication providers. Enable Email/Password in Firebase Auth settings to set a password.'
      );
    }
    if (code === 'auth/weak-password') {
      throw new Error(
        'Firebase rejected the password as too weak. Choose a stronger password.'
      );
    }
    throw error instanceof Error
      ? error
      : new Error('Failed to update Firebase Auth password.');
  }
}

// ============================================================================
// QUESTION BANK CLOUD SYNC (MCQ & WRITTEN OVERRIDES / ADDITIONS / DELETIONS)
// ============================================================================

export interface CloudQuizQuestionOverride {
  question: QuizQuestion;
  isDeleted: boolean;
  updatedAtMs: number;
}

export interface CloudWrittenQuestionOverride {
  question: WrittenQuestion;
  isDeleted: boolean;
  updatedAtMs: number;
}

function toEpochMs(raw: unknown): number {
  if (!raw) return 0;
  if (
    typeof raw === 'object' &&
    raw !== null &&
    'toMillis' in raw &&
    typeof (raw as { toMillis?: () => number }).toMillis === 'function'
  ) {
    try {
      return (raw as { toMillis: () => number }).toMillis();
    } catch {
      return 0;
    }
  }
  if (typeof raw === 'string') {
    const parsed = Date.parse(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function parseQuizOverrideDoc(
  docId: string,
  data: Record<string, unknown>
): CloudQuizQuestionOverride | null {
  const id = String(data.id ?? docId).trim();
  if (!id) return null;

  const rawOptions = Array.isArray(data.options) ? data.options : [];
  const options = rawOptions
    .map((opt) => {
      if (!opt || typeof opt !== 'object') return null;
      const o = opt as Record<string, unknown>;
      const key = String(o.key ?? 'A') as QuizOptionKey;
      const text = String(o.text ?? '');
      const textNe = typeof o.textNe === 'string' && o.textNe.trim() ? o.textNe : undefined;
      return { key, text, ...(textNe ? { textNe } : {}) };
    })
    .filter((o): o is QuizQuestion['options'][number] => Boolean(o));

  const rawCorrect = Array.isArray(data.correct_options)
    ? data.correct_options.map((k) => String(k) as QuizOptionKey)
    : (['A'] as QuizOptionKey[]);

  const difficulty: QuizDifficulty =
    data.difficulty === 'Easy' || data.difficulty === 'Hard'
      ? data.difficulty
      : 'Medium';

  const question: QuizQuestion = {
    id,
    level: String(data.level ?? 'Gazetted Third Class'),
    service: String(data.service ?? 'Federal Civil Service preparation'),
    group: String(data.group ?? 'General Administration'),
    post: String(data.post ?? 'Section Officer / general competitive examination target'),
    paper: String(data.paper ?? 'Paper I: Administrative Aptitude Test'),
    subject: String(data.subject ?? 'Geography of Nepal'),
    topicId: String(data.topicId ?? 'custom-topic'),
    topic: String(data.topic ?? 'General Overview'),
    subtopicId: String(data.subtopicId ?? 'custom-subtopic'),
    subtopic: String(data.subtopic ?? 'Core Analysis'),
    question: String(data.question ?? ''),
    ...(typeof data.questionNe === 'string' && data.questionNe.trim()
      ? { questionNe: data.questionNe }
      : {}),
    options:
      options.length >= 2
        ? options
        : [
            { key: 'A', text: 'Option A' },
            { key: 'B', text: 'Option B' },
            { key: 'C', text: 'Option C' },
            { key: 'D', text: 'Option D' },
          ],
    correct_options: rawCorrect.length > 0 ? rawCorrect : ['A'],
    is_multi_select: Boolean(data.is_multi_select),
    explanation: String(data.explanation ?? ''),
    ...(typeof data.explanationNe === 'string' && data.explanationNe.trim()
      ? { explanationNe: data.explanationNe }
      : {}),
    difficulty,
    marks: Number(data.marks) || 1,
    ...(typeof data.sourceTitle === 'string' && data.sourceTitle.trim()
      ? { sourceTitle: data.sourceTitle }
      : {}),
    ...(typeof data.sourcePath === 'string' && data.sourcePath.trim()
      ? { sourcePath: data.sourcePath }
      : {}),
  };

  return {
    question,
    isDeleted: Boolean(data.isDeleted),
    updatedAtMs: toEpochMs(data.updatedAt) || toEpochMs(data.createdAt),
  };
}

function parseWrittenOverrideDoc(
  docId: string,
  data: Record<string, unknown>
): CloudWrittenQuestionOverride | null {
  const id = String(data.id ?? docId).trim();
  if (!id) return null;

  const paperRaw = String(data.paper ?? '');
  const paper: WrittenPaperCode = (WRITTEN_PAPERS as readonly string[]).includes(
    paperRaw
  )
    ? (paperRaw as WrittenPaperCode)
    : 'Paper II: Governance Systems';

  const marks = Number(data.marks) === 5 ? 5 : 10;
  const questionType: WrittenQuestionType =
    data.questionType === 'Short Analytical' || data.questionType === 'Case Study'
      ? data.questionType
      : 'Long Analytical';

  const parseLocalizedBlock = (
    raw: unknown,
    fallbackMarksLabel: string
  ): WrittenQuestion['en'] => {
    const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
    const sections: BilingualSection[] = rawSections
      .map((s) => {
        if (!s || typeof s !== 'object') return null;
        const sec = s as Record<string, unknown>;
        const heading = String(sec.heading ?? '').trim();
        const points = Array.isArray(sec.points)
          ? sec.points.map((p) => String(p ?? '').trim()).filter(Boolean)
          : [];
        if (!heading && points.length === 0) return null;
        return {
          heading: heading || 'Key Analytical Points',
          points: points.length > 0 ? points : ['Analysis point'],
        };
      })
      .filter((s): s is BilingualSection => Boolean(s));

    return {
      title: String(obj.title ?? 'Written Question'),
      question: String(obj.question ?? ''),
      marksAllocation: String(obj.marksAllocation ?? fallbackMarksLabel),
      introduction: String(obj.introduction ?? ''),
      sections:
        sections.length > 0
          ? sections
          : [{ heading: 'Key Analytical Points', points: ['Analysis point'] }],
      conclusion: String(obj.conclusion ?? ''),
    };
  };

  const rawRubric = Array.isArray(data.rubric) ? data.rubric : [];
  const rubric: BilingualRubricPoint[] = rawRubric
    .map((r) => {
      if (!r || typeof r !== 'object') return null;
      const item = r as Record<string, unknown>;
      return {
        en: String(item.en ?? ''),
        ne: String(item.ne ?? ''),
      };
    })
    .filter((r): r is BilingualRubricPoint => Boolean(r && (r.en || r.ne)));

  const question: WrittenQuestion = {
    id,
    paper,
    subject: String(data.subject ?? 'Governance & Administration'),
    postTarget: String(data.postTarget ?? 'Section Officer / Nayab Subba'),
    marks,
    recommendedMinutes: Math.max(
      1,
      Number(data.recommendedMinutes) || (marks === 5 ? 9 : 18)
    ),
    questionType,
    sourceTitle: String(
      data.sourceTitle ?? 'Constitution of Nepal (2072) — Core Articles & Rights'
    ),
    sourcePath: String(
      data.sourcePath ?? '/materials/constitution-of-nepal-2072.pdf'
    ),
    en: parseLocalizedBlock(data.en, `${marks} Marks`),
    ne: parseLocalizedBlock(data.ne, `${marks} अङ्क`),
    rubric:
      rubric.length > 0
        ? rubric
        : [{ en: 'Core statutory points covered.', ne: 'मुख्य कानुनी पक्ष समेटिएको ।' }],
  };

  return {
    question,
    isDeleted: Boolean(data.isDeleted),
    updatedAtMs: toEpochMs(data.updatedAt) || toEpochMs(data.createdAt),
  };
}

export async function fetchAllCloudQuizOverrides(): Promise<
  CloudQuizQuestionOverride[]
> {
  const path = 'quizQuestions';
  try {
    const q = query(
      collection(db, 'quizQuestions'),
      where('isDeleted', 'in', [true, false]),
      limit(1000)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseQuizOverrideDoc(docSnap.id, docSnap.data() as Record<string, unknown>)
      )
      .filter((item): item is CloudQuizQuestionOverride => Boolean(item))
      .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToCloudQuizOverrides(
  onData: (overrides: CloudQuizQuestionOverride[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'quizQuestions';
  const q = query(
    collection(db, 'quizQuestions'),
    where('isDeleted', 'in', [true, false]),
    limit(1000)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) =>
          parseQuizOverrideDoc(
            docSnap.id,
            docSnap.data() as Record<string, unknown>
          )
        )
        .filter((item): item is CloudQuizQuestionOverride => Boolean(item))
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
      onData(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function upsertQuizQuestionInFirestore(
  question: QuizQuestion,
  isDeleted = false
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Admin authentication is required to save questions to cloud.');
  }

  const safeId = sanitizeFirestoreId(question.id, 'PSC-MCQ');
  const docPath = `quizQuestions/${safeId}`;
  const docRef = doc(db, 'quizQuestions', safeId);

  return enqueueItemTask(`quiz-bank:${safeId}`, async () => {
    let existingSnap;
    try {
      existingSnap = await getDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const sanitizedOptions = (question.options || [])
      .slice(0, 6)
      .map((opt) => ({
        key: opt.key,
        text: (opt.text || `Option ${opt.key}`).trim().slice(0, 500) || `Option ${opt.key}`,
        ...(opt.textNe?.trim()
          ? { textNe: opt.textNe.trim().slice(0, 500) }
          : {}),
      }));

    while (sanitizedOptions.length < 2) {
      const nextKey = sanitizedOptions.length === 0 ? 'A' : 'B';
      sanitizedOptions.push({ key: nextKey as QuizOptionKey, text: `Option ${nextKey}` });
    }

    const sanitizedCorrect = (question.correct_options || [])
      .slice(0, 6)
      .filter(Boolean);

    const basePayload: Record<string, unknown> = {
      id: safeId,
      isDeleted: Boolean(isDeleted),
      level: (question.level || 'Gazetted Third Class').trim().slice(0, 160) || 'Gazetted Third Class',
      service:
        (question.service || 'Federal Civil Service preparation').trim().slice(0, 160) ||
        'Federal Civil Service preparation',
      group: (question.group || 'General Administration').trim().slice(0, 160) || 'General Administration',
      post:
        (question.post || 'Section Officer / general competitive examination target')
          .trim()
          .slice(0, 200) || 'Section Officer / general competitive examination target',
      paper:
        (question.paper || 'Paper I: Administrative Aptitude Test').trim().slice(0, 160) ||
        'Paper I: Administrative Aptitude Test',
      subject: (question.subject || 'Geography of Nepal').trim().slice(0, 160) || 'Geography of Nepal',
      topicId: (question.topicId || 'custom-topic').trim().slice(0, 128) || 'custom-topic',
      topic: (question.topic || 'General Overview').trim().slice(0, 200) || 'General Overview',
      subtopicId: (question.subtopicId || 'custom-subtopic').trim().slice(0, 128) || 'custom-subtopic',
      subtopic: (question.subtopic || 'Core Analysis').trim().slice(0, 200) || 'Core Analysis',
      question: (question.question || '').trim().slice(0, 3000) || 'Question stem',
      options: sanitizedOptions,
      correct_options: sanitizedCorrect.length > 0 ? sanitizedCorrect : ['A'],
      is_multi_select: Boolean(question.is_multi_select),
      explanation:
        (question.explanation || '').trim().slice(0, 5000) || 'Official rationale pending.',
      difficulty:
        question.difficulty === 'Easy' || question.difficulty === 'Hard'
          ? question.difficulty
          : 'Medium',
      marks: Math.min(20, Math.max(0.5, Number(question.marks) || 1)),
      updatedBy: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    const qNe = question.questionNe?.trim().slice(0, 3000);
    const eNe = question.explanationNe?.trim().slice(0, 5000);
    const sTitle = question.sourceTitle?.trim().slice(0, 300);
    const sPath = question.sourcePath?.trim().slice(0, 512);

    if (!existingSnap.exists()) {
      const createPayload: Record<string, unknown> = {
        ...basePayload,
        createdAt: serverTimestamp(),
      };
      if (qNe) createPayload.questionNe = qNe;
      if (eNe) createPayload.explanationNe = eNe;
      if (sTitle) createPayload.sourceTitle = sTitle;
      if (sPath) createPayload.sourcePath = sPath;

      try {
        await setDoc(docRef, createPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      const updatePayload: Record<string, unknown> = {
        ...basePayload,
        questionNe: qNe ? qNe : deleteField(),
        explanationNe: eNe ? eNe : deleteField(),
        sourceTitle: sTitle ? sTitle : deleteField(),
        sourcePath: sPath ? sPath : deleteField(),
      };
      delete updatePayload.id;

      try {
        await updateDoc(docRef, updatePayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function resetAllQuizOverridesInFirestore(): Promise<void> {
  const path = 'quizQuestions';
  let snapshot;
  try {
    const q = query(
      collection(db, 'quizQuestions'),
      where('isDeleted', 'in', [true, false]),
      limit(1000)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  if (snapshot.empty) return;

  try {
    for (let i = 0; i < snapshot.docs.length; i += 400) {
      const batch = writeBatch(db);
      snapshot.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchAllCloudWrittenOverrides(): Promise<
  CloudWrittenQuestionOverride[]
> {
  const path = 'writtenQuestions';
  try {
    const q = query(
      collection(db, 'writtenQuestions'),
      where('isDeleted', 'in', [true, false]),
      limit(500)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseWrittenOverrideDoc(
          docSnap.id,
          docSnap.data() as Record<string, unknown>
        )
      )
      .filter((item): item is CloudWrittenQuestionOverride => Boolean(item))
      .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToCloudWrittenOverrides(
  onData: (overrides: CloudWrittenQuestionOverride[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'writtenQuestions';
  const q = query(
    collection(db, 'writtenQuestions'),
    where('isDeleted', 'in', [true, false]),
    limit(500)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) =>
          parseWrittenOverrideDoc(
            docSnap.id,
            docSnap.data() as Record<string, unknown>
          )
        )
        .filter((item): item is CloudWrittenQuestionOverride => Boolean(item))
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
      onData(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function upsertWrittenQuestionInFirestore(
  question: WrittenQuestion,
  isDeleted = false
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Admin authentication is required to save written questions to cloud.');
  }

  const safeId = sanitizeFirestoreId(question.id, 'PSC-WR');
  const docPath = `writtenQuestions/${safeId}`;
  const docRef = doc(db, 'writtenQuestions', safeId);

  return enqueueItemTask(`written-bank:${safeId}`, async () => {
    let existingSnap;
    try {
      existingSnap = await getDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const validPaper: WrittenPaperCode = (
      WRITTEN_PAPERS as readonly string[]
    ).includes(question.paper)
      ? question.paper
      : 'Paper II: Governance Systems';

    const marks = question.marks === 5 ? 5 : 10;

    const sanitizeBlock = (
      block: WrittenQuestion['en'],
      fallbackMarks: string,
      fallbackHeading: string
    ) => {
      const sections = (block.sections || [])
        .slice(0, 20)
        .map((s) => ({
          heading: (s.heading || fallbackHeading).trim().slice(0, 300) || fallbackHeading,
          points: (s.points || [])
            .map((p) => p.trim().slice(0, 1200))
            .filter(Boolean),
        }))
        .map((s) => ({
          ...s,
          points: s.points.length > 0 ? s.points : [fallbackHeading],
        }));

      return {
        title: (block.title || 'Written Question').trim().slice(0, 400) || 'Written Question',
        question: (block.question || 'Exam prompt').trim().slice(0, 3000) || 'Exam prompt',
        marksAllocation:
          (block.marksAllocation || fallbackMarks).trim().slice(0, 120) || fallbackMarks,
        introduction:
          (block.introduction || block.question || 'Introduction').trim().slice(0, 5000) ||
          'Introduction',
        sections:
          sections.length > 0
            ? sections
            : [{ heading: fallbackHeading, points: [fallbackHeading] }],
        conclusion:
          (block.conclusion || 'Conclusion & way forward.').trim().slice(0, 3000) ||
          'Conclusion & way forward.',
      };
    };

    const sanitizedRubric = (question.rubric || [])
      .slice(0, 30)
      .map((r) => ({
        en: (r.en || r.ne || 'Core analytical criteria').trim().slice(0, 800),
        ne: (r.ne || r.en || 'मुख्य विश्लेषणात्मक आधार').trim().slice(0, 800),
      }))
      .filter((r) => r.en || r.ne);

    if (sanitizedRubric.length === 0) {
      sanitizedRubric.push({
        en: 'Core statutory and analytical points covered.',
        ne: 'मुख्य कानुनी तथा विश्लेषणात्मक पक्ष समेटिएको ।',
      });
    }

    const basePayload: Record<string, unknown> = {
      id: safeId,
      isDeleted: Boolean(isDeleted),
      paper: validPaper,
      subject:
        (question.subject || 'Governance & Public Management').trim().slice(0, 200) ||
        'Governance & Public Management',
      postTarget:
        (question.postTarget || 'Section Officer / Nayab Subba').trim().slice(0, 200) ||
        'Section Officer / Nayab Subba',
      marks,
      recommendedMinutes: Math.min(
        120,
        Math.max(1, Math.round(Number(question.recommendedMinutes) || (marks === 5 ? 9 : 18)))
      ),
      questionType:
        question.questionType === 'Short Analytical' ||
        question.questionType === 'Case Study'
          ? question.questionType
          : 'Long Analytical',
      sourceTitle:
        (question.sourceTitle || 'Official PSC Nepal Syllabus & Statutes')
          .trim()
          .slice(0, 300) || 'Official PSC Nepal Syllabus & Statutes',
      sourcePath:
        (question.sourcePath || '/materials/constitution-of-nepal-2072.pdf')
          .trim()
          .slice(0, 512) || '/materials/constitution-of-nepal-2072.pdf',
      en: sanitizeBlock(question.en, `${marks} Marks`, 'Key Analytical Points'),
      ne: sanitizeBlock(question.ne, `${marks} अङ्क`, 'मुख्य विश्लेषणात्मक बुँदाहरू'),
      rubric: sanitizedRubric,
      updatedBy: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(docRef, {
          ...basePayload,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      const updatePayload = { ...basePayload };
      delete updatePayload.id;
      try {
        await updateDoc(docRef, updatePayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function resetAllWrittenOverridesInFirestore(): Promise<void> {
  const path = 'writtenQuestions';
  let snapshot;
  try {
    const q = query(
      collection(db, 'writtenQuestions'),
      where('isDeleted', 'in', [true, false]),
      limit(500)
    );
    snapshot = await getDocs(q);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  if (snapshot.empty) return;

  try {
    for (let i = 0; i < snapshot.docs.length; i += 400) {
      const batch = writeBatch(db);
      snapshot.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

