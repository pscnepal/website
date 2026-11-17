import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DASHBOARD_ADMIN_EMAIL, useAuth } from './AuthContext';
import {
  useDeleteAdminUserMutation,
  useLazyGetAdminUsersDirectoryQuery,
  useUpdateAdminUserDetailsMutation,
  useUpdateAdminUserStatusMutation,
} from '../app/api/pscApi';
import {
  sendUserPasswordReset,
  subscribeToAdminUsersDirectory,
  updateCurrentAdminPassword,
} from '../services/cloudSyncService';
import type {
  CloudUserDirectoryEntry,
  CloudUserStatus,
  DashboardUsersContextValue,
  UpdateAdminUserDetailsInput,
} from '../types';
import { toast } from '../services/toastService';
import { formatUserFriendlyError } from '../utils/errorHelpers';

export type { DashboardUsersContextValue };

const DashboardUsersContext = createContext<DashboardUsersContextValue | null>(
  null
);

export function DashboardUsersProvider({ children }: { children: ReactNode }) {
  const { isAuthReady, isDashboardAdmin, user } = useAuth();
  const [users, setUsers] = useState<CloudUserDirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const [triggerGetAdminUsers] = useLazyGetAdminUsersDirectoryQuery();
  const [triggerUpdateAdminUserStatus] = useUpdateAdminUserStatusMutation();
  const [triggerUpdateAdminUserDetails] = useUpdateAdminUserDetailsMutation();
  const [triggerDeleteAdminUser] = useDeleteAdminUserMutation();

  useEffect(() => {
    if (!isAuthReady || !isDashboardAdmin || !user) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToAdminUsersDirectory(
      DASHBOARD_ADMIN_EMAIL,
      (entries) => {
        setUsers(entries);
        setIsLoading(false);
        setIsRefreshing(false);
        setError(null);
        setLastSyncedAt(new Date().toISOString());
      },
      (err) => {
        setIsLoading(false);
        setIsRefreshing(false);
        const friendly = formatUserFriendlyError(
          err,
          'Unable to load registered users from Firestore.'
        );
        setError(friendly);
        toast.error(friendly, { id: 'dashboard-users-load-err' });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isAuthReady, isDashboardAdmin, user]);

  const refreshUsers = useCallback(async () => {
    if (!isAuthReady || !isDashboardAdmin || !user) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const entries = await triggerGetAdminUsers(
        DASHBOARD_ADMIN_EMAIL,
        false
      ).unwrap();
      setUsers(entries);
      setLastSyncedAt(new Date().toISOString());
      toast.success('User directory synced with Firestore.', {
        id: 'dashboard-users-refresh',
      });
    } catch (err) {
      const friendly = formatUserFriendlyError(
        err,
        'Failed to refresh users from Firestore.'
      );
      setError(friendly);
      toast.error(friendly, { id: 'dashboard-users-load-err' });
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [isAuthReady, isDashboardAdmin, user, triggerGetAdminUsers]);

  const handleUpdateUserStatus = useCallback(
    async (params: { uid: string; status: CloudUserStatus; reason?: string }) => {
      await triggerUpdateAdminUserStatus(params).unwrap();
    },
    [triggerUpdateAdminUserStatus]
  );

  const handleUpdateUserDetails = useCallback(
    async (params: UpdateAdminUserDetailsInput) => {
      await triggerUpdateAdminUserDetails(params).unwrap();
    },
    [triggerUpdateAdminUserDetails]
  );

  const handleDeleteUser = useCallback(
    async (uid: string) => {
      await triggerDeleteAdminUser(uid).unwrap();
      setUsers((prev) => prev.filter((item) => item.uid !== uid));
      setLastSyncedAt(new Date().toISOString());
    },
    [triggerDeleteAdminUser]
  );

  const handleSendPasswordReset = useCallback(async (email: string) => {
    await sendUserPasswordReset(email);
  }, []);

  const handleUpdateOwnPassword = useCallback(async (newPassword: string) => {
    return updateCurrentAdminPassword(newPassword);
  }, []);

  const value = useMemo<DashboardUsersContextValue>(
    () => ({
      users,
      isLoading,
      isRefreshing,
      error,
      lastSyncedAt,
      refreshUsers,
      updateUserStatus: handleUpdateUserStatus,
      updateUserDetails: handleUpdateUserDetails,
      deleteUser: handleDeleteUser,
      sendPasswordReset: handleSendPasswordReset,
      updateOwnPassword: handleUpdateOwnPassword,
    }),
    [
      users,
      isLoading,
      isRefreshing,
      error,
      lastSyncedAt,
      refreshUsers,
      handleUpdateUserStatus,
      handleUpdateUserDetails,
      handleDeleteUser,
      handleSendPasswordReset,
      handleUpdateOwnPassword,
    ]
  );

  return (
    <DashboardUsersContext.Provider value={value}>
      {children}
    </DashboardUsersContext.Provider>
  );
}

export function useDashboardUsers(): DashboardUsersContextValue {
  const ctx = useContext(DashboardUsersContext);
  if (!ctx) {
    throw new Error(
      'useDashboardUsers must be used inside a DashboardUsersProvider'
    );
  }
  return ctx;
}
