export interface ParsedFirestoreError {
  error: string;
  operationType?: string;
  path?: string | null;
}

/**
 * Attempts to parse structured FirestoreErrorInfo JSON strings thrown by handleFirestoreError.
 */
export function parseFirestoreErrorPayload(
  rawMessage: string
): ParsedFirestoreError | null {
  const trimmed = rawMessage.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed) as Partial<ParsedFirestoreError>;
    if (typeof parsed.error === 'string' && parsed.error.length > 0) {
      return {
        error: parsed.error,
        operationType:
          typeof parsed.operationType === 'string'
            ? parsed.operationType
            : undefined,
        path: parsed.path ?? null,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function isFirestoreQuotaError(error: unknown): boolean {
  const raw = extractRawErrorMessage(error).toLowerCase();
  return (
    raw.includes('quota exceeded') ||
    raw.includes('free daily read units') ||
    raw.includes('resource-exhausted')
  );
}

export function extractRawErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null) {
    if (
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      return (error as { message: string }).message;
    }
    if (
      'error' in error &&
      typeof (error as { error?: unknown }).error === 'string'
    ) {
      return (error as { error: string }).error;
    }
    if ('data' in error) {
      const data = (error as { data?: unknown }).data;
      if (typeof data === 'string') return data;
      if (
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string'
      ) {
        return (data as { message: string }).message;
      }
    }
  }
  return '';
}

function getFirebaseCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return '';
}

export function isFirestoreOfflineError(error: unknown): boolean {
  if (!error) return false;

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: unknown }).name === 'FirestoreOfflineError'
  ) {
    return true;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: unknown }).status === 'FETCH_ERROR'
  ) {
    return true;
  }

  const code = getFirebaseCode(error);
  if (code === 'unavailable' || code === 'auth/network-request-failed') {
    return true;
  }

  const rawMessage = extractRawErrorMessage(error);
  const firestorePayload = rawMessage
    ? parseFirestoreErrorPayload(rawMessage)
    : null;
  const effectiveMessage = (firestorePayload?.error || rawMessage || '').trim();
  const lower = effectiveMessage.toLowerCase();

  return (
    lower.includes('the client is offline') ||
    lower.includes('client is offline') ||
    lower.includes('failed to get document because the client is offline') ||
    lower.includes('network-request-failed') ||
    lower.includes('failed to fetch')
  );
}

/**
 * Converts Firebase Auth errors, structured Firestore JSON errors, network failures,
 * and unexpected runtime exceptions into concise, user-facing messages.
 */
export function formatUserFriendlyError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!error) return fallback;

  const code = getFirebaseCode(error);
  const rawMessage = extractRawErrorMessage(error);
  const firestorePayload = rawMessage
    ? parseFirestoreErrorPayload(rawMessage)
    : null;
  const effectiveMessage = (firestorePayload?.error || rawMessage || '').trim();
  const lower = effectiveMessage.toLowerCase();

  // 1. Quota & rate limits
  if (
    lower.includes('quota exceeded') ||
    lower.includes('free daily read units') ||
    code === 'resource-exhausted'
  ) {
    return 'Daily database quota exceeded. Access will automatically reset tomorrow.';
  }
  if (code === 'auth/too-many-requests' || lower.includes('too-many-requests')) {
    return 'Too many requests right now. Please wait a few minutes and try again.';
  }

  // 2. Permissions & authorization
  if (
    lower.includes('missing or insufficient permissions') ||
    code === 'permission-denied' ||
    lower.includes('permission-denied')
  ) {
    return 'You do not have permission for this action. Please verify your signed-in account and try again.';
  }

  // 3. Offline & connectivity errors
  if (isFirestoreOfflineError(error)) {
    return 'Network unavailable or offline. Check your internet connection and retry.';
  }

  // 4. Browser storage quota
  if (
    (error instanceof DOMException && error.name === 'QuotaExceededError') ||
    lower.includes('quotaexceedederror')
  ) {
    return 'Browser storage limit reached. Export a backup or clear old drafts to free space.';
  }

  // 5. Common Firebase Auth errors if not already mapped
  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in window was closed before completing Google login.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'A Google sign-in request is already open.';
  }
  if (code === 'auth/requires-recent-login') {
    return 'For security, please re-authenticate with Google and try again.';
  }

  if (effectiveMessage) {
    return effectiveMessage;
  }

  return fallback;
}
