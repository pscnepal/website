import { createApi } from '@reduxjs/toolkit/query/react';
import type { QuizQuestion } from '../../data/quizData';
import type { WrittenQuestion } from '../../data/writtenQuestionsData';
import {
  deleteAdminUserFromFirestore,
  fetchAdminUsersDirectory,
  fetchAllCloudItemStats,
  fetchAllCloudMaterialOverrides,
  fetchAllCloudQuizOverrides,
  fetchAllCloudWrittenOverrides,
  fetchUserCloudReactions,
  fetchUserFlaggedQuestions,
  resetAllMaterialOverridesInFirestore,
  resetAllQuizOverridesInFirestore,
  resetAllWrittenOverridesInFirestore,
  syncReactionAndStatsToFirestore,
  updateAdminUserDetails,
  updateAdminUserStatus,
  upsertQuizQuestionInFirestore,
  upsertReadingMaterialInFirestore,
  upsertWrittenQuestionInFirestore,
  type CloudItemStatsEntry,
  type CloudItemType,
  type CloudMaterialOverride,
  type CloudQuizQuestionOverride,
  type CloudReactionValue,
  type CloudUserDirectoryEntry,
  type CloudUserStatus,
  type CloudWrittenQuestionOverride,
  type UpdateAdminUserDetailsInput,
  type UpsertMaterialPayload,
} from '../../services/cloudSyncService';
import type { FlaggedQuestionRecord } from '../../services/storageService';
import { appBaseQuery } from './baseQuery';

export const pscApi = createApi({
  reducerPath: 'pscApi',
  baseQuery: appBaseQuery,
  refetchOnReconnect: true,
  tagTypes: [
    'ItemStats',
    'QuizBank',
    'WrittenBank',
    'Materials',
    'UserFlags',
    'UserReactions',
    'AdminUsers',
    'RemoteAsset',
  ],
  endpoints: (builder) => ({
    // -----------------------------------------------------------------------
    // HTTP / Asset Requests via fetchBaseQuery
    // -----------------------------------------------------------------------
    fetchBinaryAsset: builder.query<Blob, string>({
      query: (url) => ({
        url,
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`Asset fetch failed (${response.status})`);
          }
          return response.blob();
        },
      }),
      keepUnusedDataFor: 60,
      providesTags: (_result, _error, url) => [{ type: 'RemoteAsset', id: url }],
    }),

    // -----------------------------------------------------------------------
    // Public Cloud-First Community & Question/Material Catalog Queries
    // -----------------------------------------------------------------------
    getCloudItemStats: builder.query<
      Record<string, CloudItemStatsEntry>,
      void
    >({
      query: () => ({
        kind: 'firestore',
        operation: 'fetchAllCloudItemStats',
        run: () => fetchAllCloudItemStats(),
      }),
      providesTags: ['ItemStats'],
    }),

    getCloudQuizBank: builder.query<CloudQuizQuestionOverride[], void>({
      query: () => ({
        kind: 'firestore',
        operation: 'fetchAllCloudQuizOverrides',
        run: () => fetchAllCloudQuizOverrides(),
      }),
      providesTags: ['QuizBank'],
    }),

    getCloudWrittenBank: builder.query<CloudWrittenQuestionOverride[], void>({
      query: () => ({
        kind: 'firestore',
        operation: 'fetchAllCloudWrittenOverrides',
        run: () => fetchAllCloudWrittenOverrides(),
      }),
      providesTags: ['WrittenBank'],
    }),

    getCloudMaterials: builder.query<CloudMaterialOverride[], void>({
      query: () => ({
        kind: 'firestore',
        operation: 'fetchAllCloudMaterialOverrides',
        run: () => fetchAllCloudMaterialOverrides(),
      }),
      providesTags: ['Materials'],
    }),

    // -----------------------------------------------------------------------
    // Authenticated Aspirant User Cloud Queries & Mutations
    // -----------------------------------------------------------------------
    getUserFlaggedQuestions: builder.query<
      Record<string, FlaggedQuestionRecord>,
      string
    >({
      query: (userId) => ({
        kind: 'firestore',
        operation: 'fetchUserFlaggedQuestions',
        run: () => fetchUserFlaggedQuestions(userId),
      }),
      providesTags: ['UserFlags'],
    }),

    getUserCloudReactions: builder.query<
      {
        userReactions: Record<string, 'like' | 'dislike'>;
        itemViews: Record<string, number>;
      },
      string
    >({
      query: (userId) => ({
        kind: 'firestore',
        operation: 'fetchUserCloudReactions',
        run: () => fetchUserCloudReactions(userId),
      }),
      providesTags: ['UserReactions'],
    }),

    syncReactionAndStats: builder.mutation<
      {
        itemId: string;
        syncedReaction: 'like' | 'dislike' | null;
        syncedViews: number;
        stats: CloudItemStatsEntry;
      },
      {
        userId: string;
        itemId: string;
        itemType: CloudItemType;
        targetReaction: CloudReactionValue;
        targetUserViews: number;
      }
    >({
      query: (params) => ({
        kind: 'firestore',
        operation: 'syncReactionAndStatsToFirestore',
        run: () => syncReactionAndStatsToFirestore(params),
      }),
      invalidatesTags: ['UserReactions', 'ItemStats'],
    }),

    // -----------------------------------------------------------------------
    // Super Admin Users Directory & Management
    // -----------------------------------------------------------------------
    getAdminUsersDirectory: builder.query<CloudUserDirectoryEntry[], string>({
      query: (adminEmail) => ({
        kind: 'firestore',
        operation: 'fetchAdminUsersDirectory',
        run: () => fetchAdminUsersDirectory(adminEmail),
      }),
      providesTags: ['AdminUsers'],
    }),

    updateAdminUserStatus: builder.mutation<
      null,
      { uid: string; status: CloudUserStatus; reason?: string }
    >({
      query: (params) => ({
        kind: 'firestore',
        operation: 'updateAdminUserStatus',
        run: async () => {
          await updateAdminUserStatus(params);
          return null;
        },
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    updateAdminUserDetails: builder.mutation<null, UpdateAdminUserDetailsInput>(
      {
        query: (params) => ({
          kind: 'firestore',
          operation: 'updateAdminUserDetails',
          run: async () => {
            await updateAdminUserDetails(params);
            return null;
          },
        }),
        invalidatesTags: ['AdminUsers'],
      }
    ),

    deleteAdminUser: builder.mutation<null, string>({
      query: (uid) => ({
        kind: 'firestore',
        operation: 'deleteAdminUserFromFirestore',
        run: async () => {
          await deleteAdminUserFromFirestore(uid);
          return null;
        },
      }),
      invalidatesTags: ['AdminUsers'],
    }),

    // -----------------------------------------------------------------------
    // Super Admin Content Bank Mutations (MCQ, Written, Materials)
    // -----------------------------------------------------------------------
    upsertQuizQuestion: builder.mutation<
      null,
      { question: QuizQuestion; isDeleted?: boolean }
    >({
      query: ({ question, isDeleted = false }) => ({
        kind: 'firestore',
        operation: 'upsertQuizQuestionInFirestore',
        run: async () => {
          await upsertQuizQuestionInFirestore(question, isDeleted);
          return null;
        },
      }),
      invalidatesTags: ['QuizBank'],
    }),

    resetQuizBankOverrides: builder.mutation<null, void>({
      query: () => ({
        kind: 'firestore',
        operation: 'resetAllQuizOverridesInFirestore',
        run: async () => {
          await resetAllQuizOverridesInFirestore();
          return null;
        },
      }),
      invalidatesTags: ['QuizBank'],
    }),

    upsertWrittenQuestion: builder.mutation<
      null,
      { question: WrittenQuestion; isDeleted?: boolean }
    >({
      query: ({ question, isDeleted = false }) => ({
        kind: 'firestore',
        operation: 'upsertWrittenQuestionInFirestore',
        run: async () => {
          await upsertWrittenQuestionInFirestore(question, isDeleted);
          return null;
        },
      }),
      invalidatesTags: ['WrittenBank'],
    }),

    resetWrittenBankOverrides: builder.mutation<null, void>({
      query: () => ({
        kind: 'firestore',
        operation: 'resetAllWrittenOverridesInFirestore',
        run: async () => {
          await resetAllWrittenOverridesInFirestore();
          return null;
        },
      }),
      invalidatesTags: ['WrittenBank'],
    }),

    upsertReadingMaterial: builder.mutation<
      null,
      { payload: UpsertMaterialPayload; isDeleted?: boolean }
    >({
      query: ({ payload, isDeleted = false }) => ({
        kind: 'firestore',
        operation: 'upsertReadingMaterialInFirestore',
        run: async () => {
          await upsertReadingMaterialInFirestore(payload, isDeleted);
          return null;
        },
      }),
      invalidatesTags: ['Materials'],
    }),

    resetMaterialOverrides: builder.mutation<null, void>({
      query: () => ({
        kind: 'firestore',
        operation: 'resetAllMaterialOverridesInFirestore',
        run: async () => {
          await resetAllMaterialOverridesInFirestore();
          return null;
        },
      }),
      invalidatesTags: ['Materials'],
    }),
  }),
});

export const {
  useLazyFetchBinaryAssetQuery,
  useGetCloudItemStatsQuery,
  useGetCloudQuizBankQuery,
  useGetCloudWrittenBankQuery,
  useGetCloudMaterialsQuery,
  useGetUserFlaggedQuestionsQuery,
  useGetUserCloudReactionsQuery,
  useSyncReactionAndStatsMutation,
  useGetAdminUsersDirectoryQuery,
  useLazyGetAdminUsersDirectoryQuery,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminUserDetailsMutation,
  useDeleteAdminUserMutation,
  useUpsertQuizQuestionMutation,
  useResetQuizBankOverridesMutation,
  useUpsertWrittenQuestionMutation,
  useResetWrittenBankOverridesMutation,
  useUpsertReadingMaterialMutation,
  useResetMaterialOverridesMutation,
} = pscApi;
