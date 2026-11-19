import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  disableNetwork,
  doc,
  enableNetwork,
  getDocFromServer,
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { toast } from '../services/toastService';
import type { FirestoreErrorInfo } from '../types/cloud';
import { isFirestoreOfflineError } from '../utils/errorHelpers';

export type { FirestoreErrorInfo };

const app = initializeApp(firebaseConfig);

function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    try {
      return initializeFirestore(
        app,
        {
          localCache: memoryLocalCache(),
          experimentalForceLongPolling: true,
        },
        firebaseConfig.firestoreDatabaseId
      );
    } catch {
      return getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  }
}

// CRITICAL: Pass the provisioned named firestoreDatabaseId from firebase-applet-config.json
export const db = createFirestoreInstance();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export class FirestoreOfflineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirestoreOfflineError';
  }
}

function buildFirestoreErrorInfo(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  return {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
}

export function reportFirestoreSnapshotError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path);
  if (isFirestoreOfflineError(error)) {
    console.warn('Firestore Snapshot Offline: ', JSON.stringify(errInfo));
    return;
  }
  console.error('Firestore Snapshot Error: ', JSON.stringify(errInfo));
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path);
  const serialized = JSON.stringify(errInfo);
  if (isFirestoreOfflineError(error)) {
    console.warn('Firestore Offline/Unavailable: ', serialized);
    throw new FirestoreOfflineError(serialized);
  }
  console.error('Firestore Error: ', serialized);
  throw new Error(serialized);
}

let hasVerifiedConnection = false;

async function testConnection() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return;
  }
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    hasVerifiedConnection = true;
  } catch (error) {
    if (isFirestoreOfflineError(error)) {
      console.warn('Firestore initial connection check: client is offline.');
      toast.warning(
        'Cloud database appears offline. Local progress will still be saved on this device.',
        { id: 'firebase-offline', title: 'Cloud Sync Unavailable' }
      );
    } else {
      hasVerifiedConnection = true;
    }
  }
}

if (typeof window !== 'undefined') {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    void disableNetwork(db).catch(() => undefined);
  } else {
    void testConnection();
  }

  window.addEventListener('offline', () => {
    void disableNetwork(db).catch(() => undefined);
  });

  window.addEventListener('online', () => {
    void enableNetwork(db)
      .then(() => {
        if (!hasVerifiedConnection) {
          return testConnection();
        }
        return undefined;
      })
      .catch(() => undefined);
  });
} else {
  void testConnection();
}
