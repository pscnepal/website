import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { auth } from '../../lib/firebase';
import {
  extractRawErrorMessage,
  isFirestoreOfflineError,
} from '../../utils/errorHelpers';

export interface FirestoreQueryArgs<T = unknown> {
  kind: 'firestore';
  operation: string;
  run: () => Promise<T>;
}

export type AppBaseQueryArgs = string | FetchArgs | FirestoreQueryArgs;

export type AppBaseQueryError =
  | FetchBaseQueryError
  | {
      status: 'CUSTOM_ERROR';
      error: string;
      data?: string;
    };

export const rawFetchBaseQuery = fetchBaseQuery({
  baseUrl: '/',
  prepareHeaders: async (headers) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        headers.set('authorization', `Bearer ${token}`);
      } catch {
        // Proceed without Bearer token if auth refresh fails or offline
      }
    }
    return headers;
  },
});

function isFirestoreArgs(args: AppBaseQueryArgs): args is FirestoreQueryArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'kind' in args &&
    args.kind === 'firestore'
  );
}

/**
 * Cloud-first RTK Query baseQuery composing Redux Toolkit's `fetchBaseQuery`
 * (for HTTP/asset requests with automatic Firebase Bearer auth headers)
 * alongside typed Cloud Firestore operations with normalized error states.
 */
export const appBaseQuery: BaseQueryFn<
  AppBaseQueryArgs,
  unknown,
  AppBaseQueryError
> = async (args, api, extraOptions) => {
  if (!isFirestoreArgs(args)) {
    return rawFetchBaseQuery(args, api, extraOptions);
  }

  try {
    const data = await args.run();
    return { data };
  } catch (err) {
    const message =
      extractRawErrorMessage(err) || `Cloud request failed (${args.operation}).`;
    if (isFirestoreOfflineError(err)) {
      return {
        error: {
          status: 'FETCH_ERROR',
          error: message,
        },
      };
    }
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: message,
        data: message,
      },
    };
  }
};
