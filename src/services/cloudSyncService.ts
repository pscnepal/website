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
  reportFirestoreSnapshotError,
} from '../lib/firebase';
import { WRITTEN_PAPERS } from '../data/writtenQuestionsData';
import type {
  BilingualRubricPoint,
  BilingualSection,
  BookReadingStats,
  CloudItemStatsEntry,
  CloudItemType,
  CloudMaterialOverride,
  CloudQuizQuestionOverride,
  CloudReactionValue,
  CloudUserDirectoryEntry,
  CloudUserFlaggedQuestionSummary,
  CloudUserQuizAttemptSummary,
  CloudUserStatus,
  CloudUserTargetCadre,
  CloudUserWorkspaceBundle,
  CloudWrittenQuestionOverride,
  ContactInquiryRecord,
  FlaggedQuestionRecord,
  FlashcardProgress,
  InquiryStatus,
  LeaderboardEntry,
  LeitnerBoxLevel,
  PscCadreId,
  QuizDifficulty,
  QuizOptionKey,
  QuizQuestion,
  ReadingMaterialItem,
  ReadingProgressEntry,
  RecentBookEntry,
  SimulationRunRecord,
  UpdateAdminUserDetailsInput,
  UpsertMaterialPayload,
  WorkspaceBookmarksPayload,
  WorkspaceLibraryPayload,
  WorkspacePreferencesPayload,
  WorkspaceSyllabusPayload,
  WrittenEvaluationRecord,
  WrittenPaperCode,
  WrittenQuestion,
  WrittenQuestionProgress,
  WrittenQuestionType,
} from '../types';

export type {
  CloudItemStatsEntry,
  CloudItemType,
  CloudMaterialOverride,
  CloudQuizQuestionOverride,
  CloudReactionValue,
  CloudUserDirectoryEntry,
  CloudUserFlaggedQuestionSummary,
  CloudUserQuizAttemptSummary,
  CloudUserStatus,
  CloudUserTargetCadre,
  CloudUserWorkspaceBundle,
  CloudWrittenQuestionOverride,
  LeaderboardEntry,
  UpdateAdminUserDetailsInput,
  UpsertMaterialPayload,
  WorkspaceBookmarksPayload,
  WorkspaceLibraryPayload,
  WorkspacePreferencesPayload,
  WorkspaceSyllabusPayload,
};

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

function isVerifiedCurrentUser(expectedUserId?: string): boolean {
  const current = auth.currentUser;
  if (!current || !current.emailVerified) return false;
  if (expectedUserId && current.uid !== expectedUserId) return false;
  return true;
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
      where('itemType', 'in', ['question', 'material', 'affair']),
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
    where('itemType', 'in', ['question', 'material', 'affair']),
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
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function fetchUserCloudReactions(userId: string): Promise<{
  userReactions: Record<string, 'like' | 'dislike'>;
  itemViews: Record<string, number>;
}> {
  if (!isVerifiedCurrentUser(userId)) {
    return { userReactions: {}, itemViews: {} };
  }
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
    if (!isVerifiedCurrentUser(userId)) {
      return { userReactions: {}, itemViews: {} };
    }
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
  if (!isVerifiedCurrentUser(userId)) {
    return {};
  }
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
    if (!isVerifiedCurrentUser(userId)) {
      return {};
    }
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

async function fetchUserDirectoryTelemetry(
  uid: string,
  isStale?: () => boolean
): Promise<{
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
  const emptyTelemetry = {
    quizAttemptsCount: 0,
    questionsAnswered: 0,
    averageAccuracy: null,
    bestAccuracy: null,
    flaggedCount: 0,
    reactionsCount: 0,
    viewsCount: 0,
    recentAttempts: [] as CloudUserQuizAttemptSummary[],
    flaggedQuestions: [] as CloudUserFlaggedQuestionSummary[],
  };

  if (!isVerifiedCurrentUser() || isStale?.()) {
    return emptyTelemetry;
  }

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
    if (!isVerifiedCurrentUser() || isStale?.()) return emptyTelemetry;
    handleFirestoreError(error, OperationType.LIST, attemptsPath);
  }

  if (!isVerifiedCurrentUser() || isStale?.()) {
    return emptyTelemetry;
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
    if (!isVerifiedCurrentUser() || isStale?.()) return emptyTelemetry;
    handleFirestoreError(error, OperationType.LIST, flagsPath);
  }

  if (!isVerifiedCurrentUser() || isStale?.()) {
    return emptyTelemetry;
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
    if (!isVerifiedCurrentUser() || isStale?.()) return emptyTelemetry;
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
  adminEmail: string,
  isStale?: () => boolean
): Promise<CloudUserDirectoryEntry[]> {
  if (!isVerifiedCurrentUser() || isStale?.()) {
    return [];
  }
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

      const telemetry = await fetchUserDirectoryTelemetry(uid, isStale);
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
  if (!isVerifiedCurrentUser()) {
    return [];
  }
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
    if (!isVerifiedCurrentUser()) {
      return [];
    }
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
      void buildDirectoryEntriesFromDocs(
        snapshot.docs,
        adminEmail,
        () => !active || !isVerifiedCurrentUser()
      )
        .then((entries) => {
          if (active && isVerifiedCurrentUser()) {
            onData(entries);
          }
        })
        .catch((err) => {
          if (active && isVerifiedCurrentUser() && onError) {
            onError(err);
          }
        });
    },
    (error) => {
      if (!active || !isVerifiedCurrentUser()) return;
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
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
  subcollection:
    | 'quizAttempts'
    | 'flaggedQuestions'
    | 'itemReactions'
    | 'writtenProgress'
    | 'writtenEvaluations'
    | 'simulationRuns'
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

const WORKSPACE_DOC_IDS = [
  'preferences',
  'syllabus',
  'bookmarks',
  'flashcards',
  'library',
] as const;

export async function deleteAdminUserFromFirestore(uid: string): Promise<void> {
  await deleteSubcollectionForUser(uid, 'quizAttempts');
  await deleteSubcollectionForUser(uid, 'flaggedQuestions');
  await deleteSubcollectionForUser(uid, 'itemReactions');
  await deleteSubcollectionForUser(uid, 'writtenProgress');
  await deleteSubcollectionForUser(uid, 'writtenEvaluations');
  await deleteSubcollectionForUser(uid, 'simulationRuns');

  for (const wsId of WORKSPACE_DOC_IDS) {
    const wsPath = `users/${uid}/workspace/${wsId}`;
    try {
      await deleteDoc(doc(db, 'users', uid, 'workspace', wsId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, wsPath);
    }
  }

  const leaderboardPath = `leaderboard/${uid}`;
  try {
    await deleteDoc(doc(db, 'leaderboard', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, leaderboardPath);
  }

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
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
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
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
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

// ============================================================================
// READING MATERIALS CLOUD SYNC (OVERRIDES / ADDITIONS / DELETIONS)
// ============================================================================

function parseMaterialOverrideDoc(
  docId: string,
  data: Record<string, unknown>
): CloudMaterialOverride | null {
  const id = String(data.id ?? docId).trim();
  if (!id) return null;

  const pagesNum = Math.round(Number(data.pages) || 1);
  const externalSourceUrl =
    typeof data.externalSourceUrl === 'string' && data.externalSourceUrl.trim()
      ? data.externalSourceUrl.trim()
      : undefined;

  const material: ReadingMaterialItem = {
    id,
    title: String(data.title ?? 'Untitled Study Material'),
    authority: String(data.authority ?? 'Public Service Commission, Nepal'),
    codeOrEdition: String(data.codeOrEdition ?? 'Official Release'),
    pages: Math.min(5000, Math.max(1, pagesNum)),
    path: String(data.path ?? ''),
    description: String(data.description ?? ''),
    ...(externalSourceUrl ? { externalSourceUrl } : {}),
  };

  return {
    material,
    categoryId: String(data.categoryId ?? 'official-psc-syllabi').trim() || 'official-psc-syllabi',
    ...(typeof data.categoryName === 'string' && data.categoryName.trim()
      ? { categoryName: data.categoryName.trim() }
      : {}),
    ...(typeof data.categorySubtitle === 'string' && data.categorySubtitle.trim()
      ? { categorySubtitle: data.categorySubtitle.trim() }
      : {}),
    ...(typeof data.categoryDescription === 'string' && data.categoryDescription.trim()
      ? { categoryDescription: data.categoryDescription.trim() }
      : {}),
    isDeleted: Boolean(data.isDeleted),
    updatedAtMs: toEpochMs(data.updatedAt) || toEpochMs(data.createdAt),
  };
}

export async function fetchAllCloudMaterialOverrides(): Promise<
  CloudMaterialOverride[]
> {
  const path = 'readingMaterials';
  try {
    const q = query(
      collection(db, 'readingMaterials'),
      where('isDeleted', 'in', [true, false]),
      limit(500)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseMaterialOverrideDoc(
          docSnap.id,
          docSnap.data() as Record<string, unknown>
        )
      )
      .filter((item): item is CloudMaterialOverride => Boolean(item))
      .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToCloudMaterialOverrides(
  onData: (overrides: CloudMaterialOverride[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'readingMaterials';
  const q = query(
    collection(db, 'readingMaterials'),
    where('isDeleted', 'in', [true, false]),
    limit(500)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) =>
          parseMaterialOverrideDoc(
            docSnap.id,
            docSnap.data() as Record<string, unknown>
          )
        )
        .filter((item): item is CloudMaterialOverride => Boolean(item))
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
      onData(items);
    },
    (error) => {
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function upsertReadingMaterialInFirestore(
  payloadInput: UpsertMaterialPayload,
  isDeleted = false
): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error(
      'Admin authentication is required to save reading materials to cloud.'
    );
  }

  const { item } = payloadInput;
  const safeId = sanitizeFirestoreId(item.id, 'psc-mat');
  const docPath = `readingMaterials/${safeId}`;
  const docRef = doc(db, 'readingMaterials', safeId);

  return enqueueItemTask(`reading-mat:${safeId}`, async () => {
    let existingSnap;
    try {
      existingSnap = await getDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const cleanCategoryId =
      (payloadInput.categoryId || 'official-psc-syllabi')
        .trim()
        .slice(0, 128) || 'official-psc-syllabi';
    const cleanTitle =
      (item.title || 'Untitled Study Material').trim().slice(0, 300) ||
      'Untitled Study Material';
    const cleanAuthority =
      (item.authority || 'Public Service Commission, Nepal')
        .trim()
        .slice(0, 240) || 'Public Service Commission, Nepal';
    const cleanCode =
      (item.codeOrEdition || 'Official Release').trim().slice(0, 160) ||
      'Official Release';
    const cleanPages = Math.min(
      5000,
      Math.max(1, Math.round(Number(item.pages) || 1))
    );
    const cleanPath =
      (item.path || '/materials/document.pdf').trim().slice(0, 1000) ||
      '/materials/document.pdf';
    const cleanDescription =
      (item.description || cleanTitle).trim().slice(0, 2000) || cleanTitle;

    const cleanCategoryName = payloadInput.categoryName?.trim().slice(0, 200);
    const cleanCategorySubtitle = payloadInput.categorySubtitle
      ?.trim()
      .slice(0, 240);
    const cleanCategoryDescription = payloadInput.categoryDescription
      ?.trim()
      .slice(0, 800);
    const cleanExternalUrl = item.externalSourceUrl?.trim().slice(0, 1000);

    const basePayload: Record<string, unknown> = {
      id: safeId,
      isDeleted: Boolean(isDeleted),
      categoryId: cleanCategoryId,
      title: cleanTitle,
      authority: cleanAuthority,
      codeOrEdition: cleanCode,
      pages: cleanPages,
      path: cleanPath,
      description: cleanDescription,
      updatedBy: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      const createPayload: Record<string, unknown> = {
        ...basePayload,
        createdAt: serverTimestamp(),
      };
      if (cleanCategoryName) createPayload.categoryName = cleanCategoryName;
      if (cleanCategorySubtitle) createPayload.categorySubtitle = cleanCategorySubtitle;
      if (cleanCategoryDescription) {
        createPayload.categoryDescription = cleanCategoryDescription;
      }
      if (cleanExternalUrl) createPayload.externalSourceUrl = cleanExternalUrl;

      try {
        await setDoc(docRef, createPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      const updatePayload: Record<string, unknown> = {
        ...basePayload,
        categoryName: cleanCategoryName ? cleanCategoryName : deleteField(),
        categorySubtitle: cleanCategorySubtitle
          ? cleanCategorySubtitle
          : deleteField(),
        categoryDescription: cleanCategoryDescription
          ? cleanCategoryDescription
          : deleteField(),
        externalSourceUrl: cleanExternalUrl ? cleanExternalUrl : deleteField(),
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

export async function resetAllMaterialOverridesInFirestore(): Promise<void> {
  const path = 'readingMaterials';
  let snapshot;
  try {
    const q = query(
      collection(db, 'readingMaterials'),
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

// ============================================================================
// USER PROFILE TARGET CADRE SYNC
// ============================================================================

export async function updateUserTargetCadreInFirestore(
  userId: string,
  targetCadre: PscCadreId
): Promise<void> {
  const path = `users/${userId}`;
  return enqueueItemTask(`profile-cadre:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        targetCadre,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  });
}

// ============================================================================
// USER STUDY WORKSPACE DOCS SYNC (Preferences, Syllabus, Bookmarks, Flashcards, Library)
// ============================================================================

function sanitizeBooleanMap(
  raw: unknown,
  maxEntries: number
): Record<string, boolean> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v && typeof k === 'string' && k.trim()) {
      result[k.trim().slice(0, 128)] = true;
      if (Object.keys(result).length >= maxEntries) break;
    }
  }
  return result;
}

function sanitizeStringArray(raw: unknown, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      const cleaned = item.trim().slice(0, 160);
      if (!seen.has(cleaned)) {
        seen.add(cleaned);
        out.push(cleaned);
        if (out.length >= maxLen) break;
      }
    }
  }
  return out;
}

export async function fetchUserWorkspaceBundle(
  userId: string
): Promise<CloudUserWorkspaceBundle> {
  if (!isVerifiedCurrentUser(userId)) {
    return {
      preferences: null,
      syllabus: null,
      bookmarks: null,
      flashcards: null,
      library: null,
    };
  }
  const readWorkspaceDoc = async (docName: (typeof WORKSPACE_DOC_IDS)[number]) => {
    const path = `users/${userId}/workspace/${docName}`;
    try {
      return await getDoc(doc(db, 'users', userId, 'workspace', docName));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  const [prefSnap, sylSnap, bmSnap, fcSnap, libSnap] = await Promise.all([
    readWorkspaceDoc('preferences'),
    readWorkspaceDoc('syllabus'),
    readWorkspaceDoc('bookmarks'),
    readWorkspaceDoc('flashcards'),
    readWorkspaceDoc('library'),
  ]);

  let preferences: WorkspacePreferencesPayload | null = null;
  if (prefSnap.exists()) {
    const d = prefSnap.data();
    preferences = {
      theme: d.theme === 'dark' ? 'dark' : 'light',
      defaultReadingMode:
        d.defaultReadingMode === 'standard' ? 'standard' : 'flipbook',
      defaultSoundEnabled:
        typeof d.defaultSoundEnabled === 'boolean' ? d.defaultSoundEnabled : true,
      preferredQuizMode: d.preferredQuizMode === 'study' ? 'study' : 'exam',
      preferredWrittenLanguage:
        d.preferredWrittenLanguage === 'en' || d.preferredWrittenLanguage === 'ne'
          ? d.preferredWrittenLanguage
          : 'bilingual',
      targetCadreId:
        d.targetCadreId === 'nayab-subba' || d.targetCadreId === 'kharidar'
          ? d.targetCadreId
          : 'section-officer',
    };
  }

  let syllabus: WorkspaceSyllabusPayload | null = null;
  if (sylSnap.exists()) {
    const d = sylSnap.data();
    syllabus = {
      completedUnitIds: sanitizeStringArray(d.completedUnitIds, 500),
      completedTopicIds: sanitizeStringArray(d.completedTopicIds, 2500),
      bookmarkedUnitIds: sanitizeStringArray(d.bookmarkedUnitIds, 500),
      examChecklist: sanitizeBooleanMap(d.examChecklist, 50),
    };
  }

  let bookmarks: WorkspaceBookmarksPayload | null = null;
  if (bmSnap.exists()) {
    const d = bmSnap.data();
    bookmarks = {
      pyqIds: sanitizeStringArray(d.pyqIds, 500),
      affairIds: sanitizeStringArray(d.affairIds, 500),
    };
  }

  let flashcards: Record<string, FlashcardProgress> | null = null;
  if (fcSnap.exists()) {
    const d = fcSnap.data();
    const rawMap =
      d.progressMap && typeof d.progressMap === 'object' ? d.progressMap : {};
    flashcards = {};
    for (const [cardId, val] of Object.entries(rawMap as Record<string, unknown>)) {
      if (!val || typeof val !== 'object') continue;
      const entry = val as Record<string, unknown>;
      const boxLevel: LeitnerBoxLevel =
        entry.boxLevel === 2 ? 2 : entry.boxLevel === 3 ? 3 : 1;
      flashcards[cardId] = {
        boxLevel,
        lastReviewedAt: Number(entry.lastReviewedAt) || 0,
        timesReviewed: Math.max(0, Number(entry.timesReviewed) || 0),
        timesCorrect: Math.max(0, Number(entry.timesCorrect) || 0),
      };
    }
  }

  let library: WorkspaceLibraryPayload | null = null;
  if (libSnap.exists()) {
    const d = libSnap.data();
    const rawBooks = Array.isArray(d.recentBooks) ? d.recentBooks : [];
    const recentBooks: RecentBookEntry[] = rawBooks
      .filter((b): b is Record<string, unknown> => Boolean(b && typeof b === 'object'))
      .slice(0, 12)
      .map((b) => ({
        id: String(b.id ?? ''),
        title: String(b.title ?? 'Study Material'),
        ...(typeof b.author === 'string' && b.author ? { author: b.author } : {}),
        sourceType: (b.sourceType === 'local' ? 'local' : 'url') as 'local' | 'url',
        url: b.sourceType === 'local' ? '' : String(b.url ?? ''),
        ...(typeof b.fileName === 'string' && b.fileName
          ? { fileName: b.fileName }
          : {}),
        ...(typeof b.fileSize === 'number' && b.fileSize >= 0
          ? { fileSize: b.fileSize }
          : {}),
        lastPage: Math.max(1, Number(b.lastPage) || 1),
        totalPages: Math.max(1, Number(b.totalPages) || 1),
        lastOpenedAt: String(b.lastOpenedAt ?? new Date().toISOString()),
      }))
      .filter((b) => Boolean(b.id));

    const readingProgress: Record<string, ReadingProgressEntry> = {};
    if (d.readingProgress && typeof d.readingProgress === 'object') {
      for (const [k, v] of Object.entries(
        d.readingProgress as Record<string, unknown>
      ).slice(0, 200)) {
        if (!v || typeof v !== 'object') continue;
        const p = v as Record<string, unknown>;
        readingProgress[k] = {
          lastPage: Math.max(1, Number(p.lastPage) || 1),
          totalPages: Math.max(1, Number(p.totalPages) || 1),
          updatedAt: String(p.updatedAt ?? new Date().toISOString()),
        };
      }
    }

    const readingStats: Record<string, BookReadingStats> = {};
    if (d.readingStats && typeof d.readingStats === 'object') {
      for (const [k, v] of Object.entries(
        d.readingStats as Record<string, unknown>
      ).slice(0, 200)) {
        if (!v || typeof v !== 'object') continue;
        const s = v as Record<string, unknown>;
        readingStats[k] = {
          totalReadingSeconds: Math.max(0, Number(s.totalReadingSeconds) || 0),
          pagesReadCount: Math.max(0, Number(s.pagesReadCount) || 0),
          pagesPerMinute: Math.max(0, Number(s.pagesPerMinute) || 0),
          uniquePagesVisited: Array.isArray(s.uniquePagesVisited)
            ? s.uniquePagesVisited
                .map((n) => Math.max(1, Number(n) || 1))
                .slice(0, 1000)
            : [],
          sessionsCount: Math.max(0, Number(s.sessionsCount) || 0),
          lastReadAt: String(s.lastReadAt ?? new Date().toISOString()),
        };
      }
    }

    library = { recentBooks, readingProgress, readingStats };
  }

  return { preferences, syllabus, bookmarks, flashcards, library };
}

export async function upsertWorkspacePreferencesInFirestore(
  userId: string,
  prefs: WorkspacePreferencesPayload
): Promise<void> {
  const docPath = `users/${userId}/workspace/preferences`;
  return enqueueItemTask(`ws-prefs:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'workspace', 'preferences');
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const fields = {
      theme: prefs.theme === 'dark' ? 'dark' : 'light',
      defaultReadingMode:
        prefs.defaultReadingMode === 'standard' ? 'standard' : 'flipbook',
      defaultSoundEnabled: Boolean(prefs.defaultSoundEnabled),
      preferredQuizMode: prefs.preferredQuizMode === 'study' ? 'study' : 'exam',
      preferredWrittenLanguage:
        prefs.preferredWrittenLanguage === 'en' ||
        prefs.preferredWrittenLanguage === 'ne'
          ? prefs.preferredWrittenLanguage
          : 'bilingual',
      targetCadreId:
        prefs.targetCadreId === 'nayab-subba' || prefs.targetCadreId === 'kharidar'
          ? prefs.targetCadreId
          : 'section-officer',
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function upsertWorkspaceSyllabusInFirestore(
  userId: string,
  syllabus: WorkspaceSyllabusPayload
): Promise<void> {
  const docPath = `users/${userId}/workspace/syllabus`;
  return enqueueItemTask(`ws-syl:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'workspace', 'syllabus');
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const fields = {
      completedUnitIds: sanitizeStringArray(syllabus.completedUnitIds, 500),
      completedTopicIds: sanitizeStringArray(syllabus.completedTopicIds, 2500),
      bookmarkedUnitIds: sanitizeStringArray(syllabus.bookmarkedUnitIds, 500),
      examChecklist: sanitizeBooleanMap(syllabus.examChecklist, 50),
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function upsertWorkspaceBookmarksInFirestore(
  userId: string,
  bookmarks: WorkspaceBookmarksPayload
): Promise<void> {
  const docPath = `users/${userId}/workspace/bookmarks`;
  return enqueueItemTask(`ws-bm:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'workspace', 'bookmarks');
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const fields = {
      pyqIds: sanitizeStringArray(bookmarks.pyqIds, 500),
      affairIds: sanitizeStringArray(bookmarks.affairIds, 500),
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function upsertWorkspaceFlashcardsInFirestore(
  userId: string,
  progressMap: Record<string, FlashcardProgress>
): Promise<void> {
  const docPath = `users/${userId}/workspace/flashcards`;
  return enqueueItemTask(`ws-fc:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'workspace', 'flashcards');
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const cleanMap: Record<string, FlashcardProgress> = {};
    for (const [k, v] of Object.entries(progressMap).slice(0, 500)) {
      if (!v) continue;
      cleanMap[k] = {
        boxLevel: v.boxLevel === 2 ? 2 : v.boxLevel === 3 ? 3 : 1,
        lastReviewedAt: Number(v.lastReviewedAt) || 0,
        timesReviewed: Math.max(0, Math.round(Number(v.timesReviewed) || 0)),
        timesCorrect: Math.max(0, Math.round(Number(v.timesCorrect) || 0)),
      };
    }

    const fields = {
      progressMap: cleanMap,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function upsertWorkspaceLibraryInFirestore(
  userId: string,
  library: WorkspaceLibraryPayload
): Promise<void> {
  const docPath = `users/${userId}/workspace/library`;
  return enqueueItemTask(`ws-lib:${userId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'workspace', 'library');
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const cleanBooks = library.recentBooks.slice(0, 12).map((b) => ({
      id: String(b.id).slice(0, 128),
      title: String(b.title || 'Study Material').slice(0, 260),
      ...(b.author ? { author: String(b.author).slice(0, 160) } : {}),
      sourceType: b.sourceType === 'local' ? 'local' : 'url',
      url: b.sourceType === 'local' ? '' : String(b.url || '').slice(0, 1000),
      ...(b.fileName ? { fileName: String(b.fileName).slice(0, 260) } : {}),
      ...(typeof b.fileSize === 'number' && b.fileSize >= 0
        ? { fileSize: Math.round(b.fileSize) }
        : {}),
      lastPage: Math.max(1, Math.round(Number(b.lastPage) || 1)),
      totalPages: Math.max(1, Math.round(Number(b.totalPages) || 1)),
      lastOpenedAt: String(b.lastOpenedAt || new Date().toISOString()).slice(0, 64),
    }));

    const cleanProgress: Record<string, ReadingProgressEntry> = {};
    for (const [k, v] of Object.entries(library.readingProgress).slice(0, 200)) {
      if (!v) continue;
      cleanProgress[k] = {
        lastPage: Math.max(1, Math.round(Number(v.lastPage) || 1)),
        totalPages: Math.max(1, Math.round(Number(v.totalPages) || 1)),
        updatedAt: String(v.updatedAt || new Date().toISOString()).slice(0, 64),
      };
    }

    const cleanStats: Record<string, BookReadingStats> = {};
    for (const [k, v] of Object.entries(library.readingStats).slice(0, 200)) {
      if (!v) continue;
      cleanStats[k] = {
        totalReadingSeconds: Math.max(
          0,
          Math.round(Number(v.totalReadingSeconds) || 0)
        ),
        pagesReadCount: Math.max(0, Math.round(Number(v.pagesReadCount) || 0)),
        pagesPerMinute: Math.max(
          0,
          Math.round((Number(v.pagesPerMinute) || 0) * 100) / 100
        ),
        uniquePagesVisited: Array.isArray(v.uniquePagesVisited)
          ? v.uniquePagesVisited
              .map((n) => Math.max(1, Math.round(Number(n) || 1)))
              .slice(0, 1000)
          : [],
        sessionsCount: Math.max(0, Math.round(Number(v.sessionsCount) || 0)),
        lastReadAt: String(v.lastReadAt || new Date().toISOString()).slice(0, 64),
      };
    }

    const fields = {
      recentBooks: cleanBooks,
      readingProgress: cleanProgress,
      readingStats: cleanStats,
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

// ============================================================================
// WRITTEN STUDY PROGRESS & DRAFTS CLOUD SYNC
// ============================================================================

export async function fetchUserWrittenProgress(
  userId: string
): Promise<Record<string, WrittenQuestionProgress>> {
  if (!isVerifiedCurrentUser(userId)) {
    return {};
  }
  const path = `users/${userId}/writtenProgress`;
  try {
    const q = query(
      collection(db, 'users', userId, 'writtenProgress'),
      where('userId', '==', userId),
      limit(300)
    );
    const snapshot = await getDocs(q);
    const map: Record<string, WrittenQuestionProgress> = {};
    snapshot.docs.forEach((docSnap) => {
      const d = docSnap.data();
      const qId = String(d.questionId ?? docSnap.id);
      map[qId] = {
        questionId: qId,
        status:
          d.status === 'mastered'
            ? 'mastered'
            : d.status === 'practicing'
              ? 'practicing'
              : 'unseen',
        checkedRubricIndices: Array.isArray(d.checkedRubricIndices)
          ? d.checkedRubricIndices
              .filter((n) => typeof n === 'number' && n >= 0)
              .slice(0, 50)
          : [],
        draftAnswer: typeof d.draftAnswer === 'string' ? d.draftAnswer : '',
        timeSpentSeconds: Math.max(0, Number(d.timeSpentSeconds) || 0),
        updatedAt: String(
          d.clientUpdatedAt ?? toIsoStringOrNull(d.updatedAt) ?? new Date().toISOString()
        ),
      };
    });
    return map;
  } catch (error) {
    if (!isVerifiedCurrentUser(userId)) {
      return {};
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function upsertWrittenProgressInFirestore(
  userId: string,
  record: WrittenQuestionProgress
): Promise<void> {
  const safeQId = sanitizeFirestoreId(record.questionId, 'wq');
  const docPath = `users/${userId}/writtenProgress/${safeQId}`;

  return enqueueItemTask(`wr-prog:${userId}:${safeQId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'writtenProgress', safeQId);
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const fields = {
      status:
        record.status === 'mastered'
          ? 'mastered'
          : record.status === 'practicing'
            ? 'practicing'
            : 'unseen',
      checkedRubricIndices: Array.isArray(record.checkedRubricIndices)
        ? record.checkedRubricIndices
            .filter((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0)
            .slice(0, 50)
        : [],
      draftAnswer: String(record.draftAnswer ?? '').slice(0, 30000),
      timeSpentSeconds: Math.min(
        360000,
        Math.max(0, Math.round(Number(record.timeSpentSeconds) || 0))
      ),
      clientUpdatedAt: (record.updatedAt || new Date().toISOString()).slice(0, 64),
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      try {
        await setDoc(ref, {
          userId,
          questionId: safeQId,
          ...fields,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      try {
        await updateDoc(ref, fields);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }
  });
}

export async function clearUserWrittenProgressInFirestore(
  userId: string
): Promise<void> {
  await deleteSubcollectionForUser(userId, 'writtenProgress');
}

// ============================================================================
// WRITTEN ANSWER EVALUATOR SCORECARDS CLOUD SYNC
// ============================================================================

export async function fetchUserWrittenEvaluations(
  userId: string
): Promise<WrittenEvaluationRecord[]> {
  if (!isVerifiedCurrentUser(userId)) {
    return [];
  }
  const path = `users/${userId}/writtenEvaluations`;
  try {
    const q = query(
      collection(db, 'users', userId, 'writtenEvaluations'),
      where('userId', '==', userId),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) => {
        const d = docSnap.data();
        return {
          id: String(d.id ?? docSnap.id),
          questionId: String(d.questionId ?? ''),
          questionTitleNe: String(d.questionTitleNe ?? ''),
          questionTitleEn: String(d.questionTitleEn ?? ''),
          marks: (Number(d.marks) === 5 ? 5 : 10) as 5 | 10,
          date: String(d.date ?? ''),
          evaluatedAt: String(
            d.evaluatedAt ?? toIsoStringOrNull(d.createdAt) ?? new Date().toISOString()
          ),
          scoreIntro: Number(d.scoreIntro) || 0,
          scoreCore: Number(d.scoreCore) || 0,
          scoreStatutes: Number(d.scoreStatutes) || 0,
          scoreConclusion: Number(d.scoreConclusion) || 0,
          totalScore: Number(d.totalScore) || 0,
          timeSpentSeconds: Math.max(0, Number(d.timeSpentSeconds) || 0),
          wordCount: Math.max(0, Number(d.wordCount) || 0),
          userDraft: String(d.userDraft ?? ''),
          feedbackNotes: String(d.feedbackNotes ?? ''),
        };
      })
      .sort((a, b) =>
        (b.evaluatedAt || '').localeCompare(a.evaluatedAt || '')
      );
  } catch (error) {
    if (!isVerifiedCurrentUser(userId)) {
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createWrittenEvaluationInFirestore(
  userId: string,
  record: WrittenEvaluationRecord
): Promise<void> {
  const safeId = sanitizeFirestoreId(record.id, 'eval');
  const safeQId = sanitizeFirestoreId(record.questionId, 'wq');
  const docPath = `users/${userId}/writtenEvaluations/${safeId}`;

  return enqueueItemTask(`wr-eval:${userId}:${safeId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'writtenEvaluations', safeId);
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }
    if (existingSnap.exists()) return;

    const marks: 5 | 10 = record.marks === 5 ? 5 : 10;
    const clampScore = (v: number) =>
      Math.min(marks, Math.max(0, Math.round((Number(v) || 0) * 100) / 100));

    try {
      await setDoc(ref, {
        id: safeId,
        userId,
        questionId: safeQId,
        questionTitleNe: String(record.questionTitleNe ?? '').slice(0, 400),
        questionTitleEn: String(record.questionTitleEn ?? '').slice(0, 400),
        marks,
        date: String(record.date ?? '').slice(0, 64),
        evaluatedAt: (record.evaluatedAt || new Date().toISOString()).slice(0, 64),
        scoreIntro: clampScore(record.scoreIntro),
        scoreCore: clampScore(record.scoreCore),
        scoreStatutes: clampScore(record.scoreStatutes),
        scoreConclusion: clampScore(record.scoreConclusion),
        totalScore: clampScore(record.totalScore),
        timeSpentSeconds: Math.min(
          36000,
          Math.max(0, Math.round(Number(record.timeSpentSeconds) || 0))
        ),
        wordCount: Math.min(
          50000,
          Math.max(0, Math.round(Number(record.wordCount) || 0))
        ),
        userDraft: String(record.userDraft ?? '').slice(0, 30000),
        feedbackNotes: String(record.feedbackNotes ?? '').slice(0, 5000),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  });
}

export async function deleteWrittenEvaluationInFirestore(
  userId: string,
  evalId: string
): Promise<void> {
  const safeId = sanitizeFirestoreId(evalId, 'eval');
  const docPath = `users/${userId}/writtenEvaluations/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'writtenEvaluations', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function clearUserWrittenEvaluationsInFirestore(
  userId: string
): Promise<void> {
  await deleteSubcollectionForUser(userId, 'writtenEvaluations');
}

// ============================================================================
// EXAM HALL SIMULATION RUNS CLOUD SYNC
// ============================================================================

export async function fetchUserSimulationRuns(
  userId: string
): Promise<SimulationRunRecord[]> {
  if (!isVerifiedCurrentUser(userId)) {
    return [];
  }
  const path = `users/${userId}/simulationRuns`;
  try {
    const q = query(
      collection(db, 'users', userId, 'simulationRuns'),
      where('userId', '==', userId),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) => {
        const d = docSnap.data();
        const cadreId: PscCadreId =
          d.cadreId === 'nayab-subba' || d.cadreId === 'kharidar'
            ? d.cadreId
            : 'section-officer';
        const bookletKey =
          d.bookletKey === 'B' || d.bookletKey === 'C' || d.bookletKey === 'D'
            ? d.bookletKey
            : 'A';
        return {
          id: String(d.id ?? docSnap.id),
          presetId: String(d.presetId ?? ''),
          presetTitle: String(d.presetTitle ?? 'PSC Simulation'),
          cadreId,
          simulationType: (
            d.simulationType === 'written-hall' ? 'written-hall' : 'omr-hall'
          ) as 'omr-hall' | 'written-hall',
          fullMarks: Math.max(1, Number(d.fullMarks) || 100),
          passMarks: Math.max(0, Number(d.passMarks) || 0),
          grossMarks: Math.max(0, Number(d.grossMarks) || 0),
          negativeDeduction: Math.max(0, Number(d.negativeDeduction) || 0),
          netMarks: Math.max(0, Number(d.netMarks) || 0),
          percentage: Math.max(0, Math.min(100, Number(d.percentage) || 0)),
          passed: Boolean(d.passed),
          totalItems: Math.max(1, Number(d.totalItems) || 1),
          attemptedItems: Math.max(0, Number(d.attemptedItems) || 0),
          correctItems: Math.max(0, Number(d.correctItems) || 0),
          wrongItems: Math.max(0, Number(d.wrongItems) || 0),
          durationSeconds: Math.max(0, Number(d.durationSeconds) || 0),
          allocatedSeconds: Math.max(1, Number(d.allocatedSeconds) || 1),
          rollNumber: String(d.rollNumber ?? ''),
          bookletKey: bookletKey as 'A' | 'B' | 'C' | 'D',
          completedAt: String(d.completedAt ?? new Date().toISOString()),
        };
      })
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  } catch (error) {
    if (!isVerifiedCurrentUser(userId)) {
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createSimulationRunInFirestore(
  userId: string,
  run: SimulationRunRecord
): Promise<void> {
  const safeId = sanitizeFirestoreId(run.id, 'sim');
  const docPath = `users/${userId}/simulationRuns/${safeId}`;

  return enqueueItemTask(`sim-run:${userId}:${safeId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'users', userId, 'simulationRuns', safeId);
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }
    if (existingSnap.exists()) return;

    const fullMarks = Math.min(1000, Math.max(1, Number(run.fullMarks) || 100));
    const clampMark = (v: number) =>
      Math.min(fullMarks, Math.max(0, Math.round((Number(v) || 0) * 100) / 100));
    const totalItems = Math.min(500, Math.max(1, Math.round(Number(run.totalItems) || 1)));
    const clampItems = (v: number) =>
      Math.min(totalItems, Math.max(0, Math.round(Number(v) || 0)));

    try {
      await setDoc(ref, {
        id: safeId,
        userId,
        presetId: String(run.presetId || 'preset').slice(0, 128),
        presetTitle: String(run.presetTitle || 'PSC Simulation').slice(0, 220),
        cadreId:
          run.cadreId === 'nayab-subba' || run.cadreId === 'kharidar'
            ? run.cadreId
            : 'section-officer',
        simulationType:
          run.simulationType === 'written-hall' ? 'written-hall' : 'omr-hall',
        fullMarks,
        passMarks: clampMark(run.passMarks),
        grossMarks: clampMark(run.grossMarks),
        negativeDeduction: clampMark(run.negativeDeduction),
        netMarks: clampMark(run.netMarks),
        percentage: Math.min(100, Math.max(0, Math.round((Number(run.percentage) || 0) * 10) / 10)),
        passed: Boolean(run.passed),
        totalItems,
        attemptedItems: clampItems(run.attemptedItems),
        correctItems: clampItems(run.correctItems),
        wrongItems: clampItems(run.wrongItems),
        durationSeconds: Math.min(
          36000,
          Math.max(0, Math.round(Number(run.durationSeconds) || 0))
        ),
        allocatedSeconds: Math.min(
          36000,
          Math.max(1, Math.round(Number(run.allocatedSeconds) || 1))
        ),
        rollNumber: String(run.rollNumber ?? '').slice(0, 64),
        bookletKey:
          run.bookletKey === 'B' || run.bookletKey === 'C' || run.bookletKey === 'D'
            ? run.bookletKey
            : 'A',
        completedAt: (run.completedAt || new Date().toISOString()).slice(0, 64),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }
  });
}

export async function clearUserSimulationRunsInFirestore(
  userId: string
): Promise<void> {
  await deleteSubcollectionForUser(userId, 'simulationRuns');
}

// ============================================================================
// CONTACT & ERRATA INQUIRIES CLOUD SYNC
// ============================================================================

function parseContactInquiryDoc(
  docId: string,
  d: Record<string, unknown>
): ContactInquiryRecord {
  return {
    id: String(d.id ?? docId),
    ...(typeof d.userId === 'string' && d.userId ? { userId: d.userId } : {}),
    ticketCode: String(d.ticketCode ?? 'PSC-INQ'),
    name: String(d.name ?? ''),
    email: String(d.email ?? ''),
    category:
      d.category === 'quiz-errata' ||
      d.category === 'material-request' ||
      d.category === 'reader-support'
        ? d.category
        : 'general',
    reference: String(d.reference ?? ''),
    message: String(d.message ?? ''),
    status:
      d.status === 'in-review' || d.status === 'resolved' ? d.status : 'open',
    ...(typeof d.adminReply === 'string' && d.adminReply
      ? { adminReply: d.adminReply }
      : {}),
    ...(typeof d.respondedBy === 'string' && d.respondedBy
      ? { respondedBy: d.respondedBy }
      : {}),
    ...(d.respondedAt
      ? { respondedAt: toIsoStringOrNull(d.respondedAt) ?? undefined }
      : {}),
    createdAt: String(
      d.clientCreatedAt ?? toIsoStringOrNull(d.createdAt) ?? new Date().toISOString()
    ),
    ...(d.updatedAt
      ? { updatedAt: toIsoStringOrNull(d.updatedAt) ?? undefined }
      : {}),
  };
}

export async function fetchUserContactInquiries(
  userId: string
): Promise<ContactInquiryRecord[]> {
  if (!isVerifiedCurrentUser(userId)) {
    return [];
  }
  const path = 'contactInquiries';
  try {
    const q = query(
      collection(db, 'contactInquiries'),
      where('userId', '==', userId),
      limit(100)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseContactInquiryDoc(docSnap.id, docSnap.data() as Record<string, unknown>)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if (!isVerifiedCurrentUser(userId)) {
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchAllContactInquiriesForAdmin(): Promise<
  ContactInquiryRecord[]
> {
  if (!isVerifiedCurrentUser()) {
    return [];
  }
  const path = 'contactInquiries';
  try {
    const q = query(
      collection(db, 'contactInquiries'),
      orderBy('createdAt', 'desc'),
      limit(300)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseContactInquiryDoc(docSnap.id, docSnap.data() as Record<string, unknown>)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    if (!isVerifiedCurrentUser()) {
      return [];
    }
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function createContactInquiryInFirestore(
  userId: string,
  inquiry: ContactInquiryRecord
): Promise<ContactInquiryRecord> {
  const safeId = sanitizeFirestoreId(inquiry.id, 'inq');
  const docPath = `contactInquiries/${safeId}`;

  return enqueueItemTask(`inquiry:${safeId}`, async () => {
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'contactInquiries', safeId);
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    if (existingSnap.exists()) {
      return parseContactInquiryDoc(
        existingSnap.id,
        existingSnap.data() as Record<string, unknown>
      );
    }

    const cleanMessage = inquiry.message.trim().slice(0, 4000);
    const cleanName = (inquiry.name.trim() || 'PSC Aspirant').slice(0, 120);
    const cleanEmail = (inquiry.email.trim() || 'aspirant@pscnepal.local').slice(
      0,
      254
    );
    const cleanTicket = (inquiry.ticketCode.trim() || `PSC-${Date.now()}`).slice(
      0,
      32
    );
    const clientCreatedAt = (
      inquiry.createdAt || new Date().toISOString()
    ).slice(0, 64);

    if (cleanMessage.length < 10) {
      throw new Error('Inquiry message must be at least 10 characters long.');
    }

    try {
      await setDoc(ref, {
        id: safeId,
        userId,
        ticketCode: cleanTicket,
        name: cleanName,
        email: cleanEmail,
        category:
          inquiry.category === 'quiz-errata' ||
          inquiry.category === 'material-request' ||
          inquiry.category === 'reader-support'
            ? inquiry.category
            : 'general',
        reference: (inquiry.reference || '').trim().slice(0, 300),
        message: cleanMessage,
        status: 'open',
        clientCreatedAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    }

    return {
      ...inquiry,
      id: safeId,
      userId,
      ticketCode: cleanTicket,
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      status: 'open',
      createdAt: clientCreatedAt,
    };
  });
}

export async function updateContactInquiryAdminInFirestore(params: {
  inquiryId: string;
  status: InquiryStatus;
  adminReply?: string;
}): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Admin authentication is required to update inquiries.');
  }
  const safeId = sanitizeFirestoreId(params.inquiryId, 'inq');
  const docPath = `contactInquiries/${safeId}`;
  const cleanReply = (params.adminReply ?? '').trim().slice(0, 2000);

  try {
    await updateDoc(doc(db, 'contactInquiries', safeId), {
      status:
        params.status === 'in-review' || params.status === 'resolved'
          ? params.status
          : 'open',
      adminReply: cleanReply ? cleanReply : deleteField(),
      respondedBy: currentUser.uid,
      respondedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteContactInquiryInFirestore(
  inquiryId: string
): Promise<void> {
  const safeId = sanitizeFirestoreId(inquiryId, 'inq');
  const docPath = `contactInquiries/${safeId}`;
  try {
    await deleteDoc(doc(db, 'contactInquiries', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ============================================================================
// PUBLIC ZERO-PII STUDY LEADERBOARD SYNC & SUBSCRIPTIONS
// ============================================================================

const leaderboardVisibilityCache = new Map<string, boolean>();

export function clearLeaderboardVisibilityCache(userId?: string): void {
  if (userId) {
    leaderboardVisibilityCache.delete(userId);
  } else {
    leaderboardVisibilityCache.clear();
  }
}

function parseLeaderboardDoc(
  docId: string,
  d: Record<string, unknown>
): LeaderboardEntry {
  const targetCadre: PscCadreId =
    d.targetCadre === 'nayab-subba' || d.targetCadre === 'kharidar'
      ? d.targetCadre
      : 'section-officer';

  const photoURL =
    typeof d.photoURL === 'string' && d.photoURL.trim()
      ? d.photoURL.trim()
      : undefined;

  return {
    userId: String(d.userId ?? docId),
    displayName: String(d.displayName ?? 'PSC Aspirant').trim() || 'PSC Aspirant',
    ...(photoURL ? { photoURL } : {}),
    targetCadre,
    isPublic: d.isPublic !== false,
    booksReadCount: Math.max(0, Math.round(Number(d.booksReadCount) || 0)),
    totalPagesRead: Math.max(0, Math.round(Number(d.totalPagesRead) || 0)),
    readingMinutes: Math.max(0, Math.round(Number(d.readingMinutes) || 0)),
    writtenPracticedCount: Math.max(
      0,
      Math.round(Number(d.writtenPracticedCount) || 0)
    ),
    writtenMasteredCount: Math.max(
      0,
      Math.round(Number(d.writtenMasteredCount) || 0)
    ),
    writtenEvaluationsCount: Math.max(
      0,
      Math.round(Number(d.writtenEvaluationsCount) || 0)
    ),
    writtenWordsCount: Math.max(
      0,
      Math.round(Number(d.writtenWordsCount) || 0)
    ),
    quizAttemptsCount: Math.max(
      0,
      Math.round(Number(d.quizAttemptsCount) || 0)
    ),
    omrSimulationsCount: Math.max(
      0,
      Math.round(Number(d.omrSimulationsCount) || 0)
    ),
    quizQuestionsSolved: Math.max(
      0,
      Math.round(Number(d.quizQuestionsSolved) || 0)
    ),
    quizAvgAccuracy: Math.min(
      100,
      Math.max(0, Math.round((Number(d.quizAvgAccuracy) || 0) * 10) / 10)
    ),
    quizTotalNetScore: Math.round((Number(d.quizTotalNetScore) || 0) * 100) / 100,
    totalScore: Math.max(0, Math.round(Number(d.totalScore) || 0)),
    updatedAt: toIsoStringOrNull(d.updatedAt),
    createdAt: toIsoStringOrNull(d.createdAt),
  };
}

export async function fetchOwnLeaderboardEntry(
  userId: string
): Promise<LeaderboardEntry | null> {
  if (!isVerifiedCurrentUser(userId)) {
    return null;
  }
  const docPath = `leaderboard/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'leaderboard', userId));
    if (!snap.exists()) return null;
    const parsed = parseLeaderboardDoc(
      snap.id,
      snap.data() as Record<string, unknown>
    );
    leaderboardVisibilityCache.set(userId, parsed.isPublic);
    return parsed;
  } catch (error) {
    if (!isVerifiedCurrentUser(userId)) {
      return null;
    }
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

export async function upsertLeaderboardEntryInFirestore(
  userId: string,
  payload: Omit<LeaderboardEntry, 'createdAt' | 'updatedAt'>,
  options?: { overrideIsPublic?: boolean }
): Promise<LeaderboardEntry | null> {
  if (!isVerifiedCurrentUser(userId)) {
    return null;
  }

  const docPath = `leaderboard/${userId}`;
  return enqueueItemTask(`leaderboard:${userId}`, async () => {
    if (!isVerifiedCurrentUser(userId)) {
      return null;
    }
    await ensureAuthenticatedUserDocExists(userId);
    const ref = doc(db, 'leaderboard', userId);
    let existingSnap;
    try {
      existingSnap = await getDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, docPath);
    }

    const existingPublic = existingSnap.exists()
      ? existingSnap.data().isPublic !== false
      : leaderboardVisibilityCache.get(userId) ?? true;

    const resolvedIsPublic =
      options?.overrideIsPublic !== undefined
        ? options.overrideIsPublic
        : existingPublic;

    leaderboardVisibilityCache.set(userId, resolvedIsPublic);

    const safeName =
      (payload.displayName || 'PSC Aspirant').trim().slice(0, 120) ||
      'PSC Aspirant';
    const safePhoto = payload.photoURL?.trim().slice(0, 512) || '';
    const safeCadre: PscCadreId =
      payload.targetCadre === 'nayab-subba' || payload.targetCadre === 'kharidar'
        ? payload.targetCadre
        : 'section-officer';

    const clampInt = (n: number, max: number) =>
      Math.min(max, Math.max(0, Math.round(Number(n) || 0)));

    const numericFields = {
      displayName: safeName,
      targetCadre: safeCadre,
      isPublic: Boolean(resolvedIsPublic),
      booksReadCount: clampInt(payload.booksReadCount, 1000),
      totalPagesRead: clampInt(payload.totalPagesRead, 500_000),
      readingMinutes: clampInt(payload.readingMinutes, 500_000),
      writtenPracticedCount: clampInt(payload.writtenPracticedCount, 1000),
      writtenMasteredCount: clampInt(payload.writtenMasteredCount, 1000),
      writtenEvaluationsCount: clampInt(payload.writtenEvaluationsCount, 500),
      writtenWordsCount: clampInt(payload.writtenWordsCount, 5_000_000),
      quizAttemptsCount: clampInt(payload.quizAttemptsCount, 1000),
      omrSimulationsCount: clampInt(payload.omrSimulationsCount, 1000),
      quizQuestionsSolved: clampInt(payload.quizQuestionsSolved, 100_000),
      quizAvgAccuracy: Math.min(
        100,
        Math.max(0, Math.round((Number(payload.quizAvgAccuracy) || 0) * 10) / 10)
      ),
      quizTotalNetScore: Math.min(
        50_000,
        Math.max(
          -5000,
          Math.round((Number(payload.quizTotalNetScore) || 0) * 100) / 100
        )
      ),
      totalScore: clampInt(payload.totalScore, 10_000_000),
      updatedAt: serverTimestamp(),
    };

    if (!existingSnap.exists()) {
      const createDoc: Record<string, unknown> = {
        userId,
        ...numericFields,
        createdAt: serverTimestamp(),
      };
      if (safePhoto) {
        createDoc.photoURL = safePhoto;
      }
      try {
        await setDoc(ref, createDoc);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, docPath);
      }
    } else {
      const updateDocPayload: Record<string, unknown> = {
        ...numericFields,
        photoURL: safePhoto ? safePhoto : deleteField(),
      };
      try {
        await updateDoc(ref, updateDocPayload);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, docPath);
      }
    }

    const nowIso = new Date().toISOString();
    return {
      userId,
      displayName: numericFields.displayName,
      ...(safePhoto ? { photoURL: safePhoto } : {}),
      targetCadre: numericFields.targetCadre,
      isPublic: numericFields.isPublic,
      booksReadCount: numericFields.booksReadCount,
      totalPagesRead: numericFields.totalPagesRead,
      readingMinutes: numericFields.readingMinutes,
      writtenPracticedCount: numericFields.writtenPracticedCount,
      writtenMasteredCount: numericFields.writtenMasteredCount,
      writtenEvaluationsCount: numericFields.writtenEvaluationsCount,
      writtenWordsCount: numericFields.writtenWordsCount,
      quizAttemptsCount: numericFields.quizAttemptsCount,
      omrSimulationsCount: numericFields.omrSimulationsCount,
      quizQuestionsSolved: numericFields.quizQuestionsSolved,
      quizAvgAccuracy: numericFields.quizAvgAccuracy,
      quizTotalNetScore: numericFields.quizTotalNetScore,
      totalScore: numericFields.totalScore,
      createdAt:
        existingSnap.exists()
          ? toIsoStringOrNull(existingSnap.data().createdAt) ?? nowIso
          : nowIso,
      updatedAt: nowIso,
    };
  });
}

export async function fetchPublicLeaderboard(
  limitCount = 150
): Promise<LeaderboardEntry[]> {
  const path = 'leaderboard';
  try {
    const q = query(
      collection(db, 'leaderboard'),
      where('isPublic', '==', true),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((docSnap) =>
        parseLeaderboardDoc(docSnap.id, docSnap.data() as Record<string, unknown>)
      )
      .sort((a, b) => b.totalScore - a.totalScore);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToPublicLeaderboard(
  onData: (entries: LeaderboardEntry[]) => void,
  onError?: (error: unknown) => void,
  limitCount = 150
): Unsubscribe {
  const path = 'leaderboard';
  const q = query(
    collection(db, 'leaderboard'),
    where('isPublic', '==', true),
    limit(limitCount)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs
        .map((docSnap) =>
          parseLeaderboardDoc(docSnap.id, docSnap.data() as Record<string, unknown>)
        )
        .sort((a, b) => b.totalScore - a.totalScore);
      onData(entries);
    },
    (error) => {
      reportFirestoreSnapshotError(error, OperationType.LIST, path);
      if (onError) {
        onError(error);
      }
    }
  );
}


