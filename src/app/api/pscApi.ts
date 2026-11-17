import { createApi } from '@reduxjs/toolkit/query/react';
import {
  createContactInquiryInFirestore,
  deleteAdminUserFromFirestore,
  deleteContactInquiryInFirestore,
  fetchAdminUsersDirectory,
  fetchAllCloudItemStats,
  fetchAllCloudMaterialOverrides,
  fetchAllCloudQuizOverrides,
  fetchAllCloudWrittenOverrides,
  fetchAllContactInquiriesForAdmin,
  fetchUserCloudReactions,
  fetchUserContactInquiries,
  fetchUserFlaggedQuestions,
  fetchUserSimulationRuns,
  fetchUserWrittenEvaluations,
  resetAllMaterialOverridesInFirestore,
  resetAllQuizOverridesInFirestore,
  resetAllWrittenOverridesInFirestore,
  syncReactionAndStatsToFirestore,
  updateAdminUserDetails,
  updateAdminUserStatus,
  updateContactInquiryAdminInFirestore,
  upsertQuizQuestionInFirestore,
  upsertReadingMaterialInFirestore,
  upsertWrittenQuestionInFirestore,
} from '../../services/cloudSyncService';
import type {
  CloudItemStatsEntry,
  CloudItemType,
  CloudMaterialOverride,
  CloudQuizQuestionOverride,
  CloudReactionValue,
  CloudUserDirectoryEntry,
  CloudUserStatus,
  CloudWrittenQuestionOverride,
  ContactInquiryRecord,
  FlaggedQuestionRecord,
  InquiryStatus,
  QuizQuestion,
  SimulationRunRecord,
  UpdateAdminUserDetailsInput,
  UpsertMaterialPayload,
  WrittenEvaluationRecord,
  WrittenQuestion,
} from '../../types';
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
    'ContactInquiries',
    'AdminInquiries',
    'WrittenEvaluations',
    'SimulationRuns',
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

    getUserWrittenEvaluations: builder.query<
      WrittenEvaluationRecord[],
      string
    >({
      query: (userId) => ({
        kind: 'firestore',
        operation: 'fetchUserWrittenEvaluations',
        run: () => fetchUserWrittenEvaluations(userId),
      }),
      providesTags: ['WrittenEvaluations'],
    }),

    getUserSimulationRuns: builder.query<SimulationRunRecord[], string>({
      query: (userId) => ({
        kind: 'firestore',
        operation: 'fetchUserSimulationRuns',
        run: () => fetchUserSimulationRuns(userId),
      }),
      providesTags: ['SimulationRuns'],
    }),

    // -----------------------------------------------------------------------
    // Contact & Errata Inquiries (User & Admin)
    // -----------------------------------------------------------------------
    getUserContactInquiries: builder.query<ContactInquiryRecord[], string>({
      query: (userId) => ({
        kind: 'firestore',
        operation: 'fetchUserContactInquiries',
        run: () => fetchUserContactInquiries(userId),
      }),
      providesTags: ['ContactInquiries'],
    }),

    createContactInquiry: builder.mutation<
      ContactInquiryRecord,
      { userId: string; inquiry: ContactInquiryRecord }
    >({
      query: ({ userId, inquiry }) => ({
        kind: 'firestore',
        operation: 'createContactInquiryInFirestore',
        run: () => createContactInquiryInFirestore(userId, inquiry),
      }),
      invalidatesTags: ['ContactInquiries', 'AdminInquiries'],
    }),

    getAdminContactInquiries: builder.query<ContactInquiryRecord[], void>({
      query: () => ({
        kind: 'firestore',
        operation: 'fetchAllContactInquiriesForAdmin',
        run: () => fetchAllContactInquiriesForAdmin(),
      }),
      providesTags: ['AdminInquiries'],
    }),

    updateAdminInquiry: builder.mutation<
      null,
      { inquiryId: string; status: InquiryStatus; adminReply?: string }
    >({
      query: (params) => ({
        kind: 'firestore',
        operation: 'updateContactInquiryAdminInFirestore',
        run: async () => {
          await updateContactInquiryAdminInFirestore(params);
          return null;
        },
      }),
      invalidatesTags: ['AdminInquiries', 'ContactInquiries'],
    }),

    deleteContactInquiry: builder.mutation<null, string>({
      query: (inquiryId) => ({
        kind: 'firestore',
        operation: 'deleteContactInquiryInFirestore',
        run: async () => {
          await deleteContactInquiryInFirestore(inquiryId);
          return null;
        },
      }),
      invalidatesTags: ['AdminInquiries', 'ContactInquiries'],
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
  useGetUserWrittenEvaluationsQuery,
  useGetUserSimulationRunsQuery,
  useGetUserContactInquiriesQuery,
  useCreateContactInquiryMutation,
  useGetAdminContactInquiriesQuery,
  useUpdateAdminInquiryMutation,
  useDeleteContactInquiryMutation,
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
