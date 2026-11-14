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
  deleteAdminUserFromFirestore,
  fetchAdminUsersDirectory,
  sendUserPasswordReset,
  subscribeToAdminUsersDirectory,
  updateAdminUserDetails,
  updateAdminUserStatus,
  updateCurrentAdminPassword,
  type CloudUserDirectoryEntry,
  type CloudUserStatus,
  type UpdateAdminUserDetailsInput,
} from '../services/cloudSyncService';

interface DashboardUsersContextValue {
  users: CloudUserDirectoryEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastSyncedAt: string | null;
  refreshUsers: () => Promise<void>;
  updateUserStatus: (params: {
    uid: string;
    status: CloudUserStatus;
    reason?: string;
  }) => Promise<void>;
  updateUserDetails: (params: UpdateAdminUserDetailsInput) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateOwnPassword: (newPassword: string) => Promise<'updated' | 'linked'>;
}

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
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load registered users from Firestore.'
        );
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
      const entries = await fetchAdminUsersDirectory(DASHBOARD_ADMIN_EMAIL);
      setUsers(entries);
      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to refresh users from Firestore.'
      );
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [isAuthReady, isDashboardAdmin, user]);

  const handleUpdateUserStatus = useCallback(
    async (params: { uid: string; status: CloudUserStatus; reason?: string }) => {
      await updateAdminUserStatus(params);
    },
    []
  );

  const handleUpdateUserDetails = useCallback(
    async (params: UpdateAdminUserDetailsInput) => {
      await updateAdminUserDetails(params);
    },
    []
  );

  const handleDeleteUser = useCallback(async (uid: string) => {
    await deleteAdminUserFromFirestore(uid);
    setUsers((prev) => prev.filter((item) => item.uid !== uid));
    setLastSyncedAt(new Date().toISOString());
  }, []);

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
