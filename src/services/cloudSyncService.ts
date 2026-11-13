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
  onData: (stats: Record<string, CloudItemStatsEntry>) => void
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

  return {
    quizAttemptsCount,
    questionsAnswered,
    averageAccuracy,
    bestAccuracy,
    flaggedCount: flagsSnap.size,
    reactionsCount,
    viewsCount,
    recentAttempts: attempts.slice(0, 10),
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

  if (params.status) {
    payload.status = params.status;
    payload.statusReason =
      params.status === 'active'
        ? deleteField()
        : cleanReason || deleteField();
    if (params.statusChanged) {
      payload.statusUpdatedAt = serverTimestamp();
    }
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
      await reauthenticateWithPopup(currentUser, googleProvider);
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
