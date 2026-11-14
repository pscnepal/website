import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  LayoutGrid,
  List,
  Mail,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ThumbsUp,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardUsers } from '../../context/DashboardUsersContext';
import type {
  CloudUserDirectoryEntry,
  CloudUserStatus,
  CloudUserTargetCadre,
} from '../../services/cloudSyncService';
import { ActionButton } from '../common/ActionButton';
import {
  SharedActionMenu,
  type ActionMenuItem,
} from '../common/SharedActionMenu';
import {
  SharedDataTable,
  type ColumnDef,
  type TableFilterDef,
} from '../common/SharedDataTable';
import { SharedSearchSelect } from '../common/SharedSearchSelect';
import { useDashboardSearch } from './DashboardLayout';

function formatShortDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatCadreLabel(cadre: CloudUserTargetCadre | ''): string {
  if (cadre === 'section-officer') return 'Section Officer';
  if (cadre === 'nayab-subba') return 'Nayab Subba';
  if (cadre === 'kharidar') return 'Kharidar';
  return 'Not specified';
}

function getStatusBadgeClasses(status: CloudUserStatus): string {
  if (status === 'banned') {
    return 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
  }
  if (status === 'disabled') {
    return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  }
  return 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
}

function getStatusLabel(status: CloudUserStatus): string {
  if (status === 'banned') return 'Banned';
  if (status === 'disabled') return 'Disabled';
  return 'Active';
}

function UserAvatar({
  user,
  size = 'sm',
}: {
  user: CloudUserDirectoryEntry;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const dims =
    size === 'lg'
      ? 'w-12 h-12 text-base'
      : size === 'md'
        ? 'w-11 h-11 text-sm'
        : 'w-8 h-8 text-xs';

  if (user.photoURL && !imgFailed) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${dims} rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-2xs`}
      />
    );
  }

  return (
    <div
      className={`${dims} rounded-full ${
        user.status === 'banned'
          ? 'bg-gradient-to-tr from-red-600 to-rose-700'
          : user.status === 'disabled'
            ? 'bg-gradient-to-tr from-amber-500 to-orange-600'
            : user.role === 'admin'
              ? 'bg-gradient-to-tr from-blue-600 to-crimson-600'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-700'
      } text-white flex items-center justify-center font-bold shrink-0 shadow-2xs`}
    >
      {user.displayName.charAt(0).toUpperCase()}
    </div>
  );
}

interface StatusActionState {
  user: CloudUserDirectoryEntry;
  targetStatus: CloudUserStatus;
}

export function UsersDirectoryTab() {
  const { user: currentUser } = useAuth();
  const {
    users,
    isLoading,
    isRefreshing,
    error,
    lastSyncedAt,
    refreshUsers,
    updateUserStatus,
    updateUserDetails,
    deleteUser,
    sendPasswordReset,
    updateOwnPassword,
  } = useDashboardUsers();

  const { searchQuery, setSearchQuery } = useDashboardSearch();
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [actionBanner, setActionBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal targets
  const [selectedUser, setSelectedUser] =
    useState<CloudUserDirectoryEntry | null>(null);
  const [editingUser, setEditingUser] =
    useState<CloudUserDirectoryEntry | null>(null);
  const [passwordModalUser, setPasswordModalUser] =
    useState<CloudUserDirectoryEntry | null>(null);
  const [statusAction, setStatusAction] = useState<StatusActionState | null>(
    null
  );
  const [deletingUser, setDeletingUser] =
    useState<CloudUserDirectoryEntry | null>(null);

  // Edit details modal form state
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'aspirant'>('aspirant');
  const [editStatus, setEditStatus] = useState<CloudUserStatus>('active');
  const [editStatusReason, setEditStatusReason] = useState('');
  const [editTargetCadre, setEditTargetCadre] = useState<
    CloudUserTargetCadre | ''
  >('');
  const [editPhone, setEditPhone] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Status moderation modal state
  const [statusReasonInput, setStatusReasonInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusModalError, setStatusModalError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Password modal state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordBusy, setIsPasswordBusy] = useState(false);
  const [passwordModalFeedback, setPasswordModalFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Keep open dossier synced if user list refreshes
  useEffect(() => {
    if (!selectedUser) return;
    const latest = users.find((u) => u.uid === selectedUser.uid);
    if (!latest) {
      setSelectedUser(null);
    } else if (latest !== selectedUser) {
      setSelectedUser(latest);
    }
  }, [users, selectedUser]);

  const openEditModal = (u: CloudUserDirectoryEntry) => {
    setEditingUser(u);
    setEditDisplayName(u.displayName);
    setEditEmail(u.email);
    setEditPhotoURL(u.photoURL);
    setEditRole(u.role);
    setEditStatus(u.status);
    setEditStatusReason(u.statusReason);
    setEditTargetCadre(u.targetCadre);
    setEditPhone(u.phone);
    setEditAdminNotes(u.adminNotes);
    setEditError(null);
  };

  const openStatusModal = (
    u: CloudUserDirectoryEntry,
    targetStatus: CloudUserStatus
  ) => {
    setStatusAction({ user: u, targetStatus });
    setStatusReasonInput(targetStatus === 'active' ? '' : u.statusReason || '');
    setStatusModalError(null);
  };

  const openDeleteModal = (u: CloudUserDirectoryEntry) => {
    setDeletingUser(u);
    setDeleteConfirmText('');
    setDeleteError(null);
  };

  const openPasswordModal = (u: CloudUserDirectoryEntry) => {
    setPasswordModalUser(u);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setPasswordModalFeedback(null);
  };

  const handleSaveDetails = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const cleanName = editDisplayName.trim();
    if (!cleanName) {
      setEditError('Display name is required.');
      return;
    }

    setIsSavingDetails(true);
    setEditError(null);
    try {
      const isSelf = currentUser?.uid === editingUser.uid;
      const finalStatus: CloudUserStatus = isSelf ? 'active' : editStatus;
      const cleanReason =
        finalStatus === 'active' ? '' : editStatusReason.trim();
      const statusChanged =
        finalStatus !== editingUser.status ||
        cleanReason !== editingUser.statusReason;

      await updateUserDetails({
        uid: editingUser.uid,
        displayName: cleanName,
        email: editEmail.trim(),
        photoURL: editPhotoURL.trim(),
        role: editRole,
        status: finalStatus,
        statusReason: cleanReason,
        statusChanged,
        targetCadre: editTargetCadre,
        phone: editPhone.trim(),
        adminNotes: editAdminNotes.trim(),
      });
      setActionBanner({
        type: 'success',
        message: `Updated account details for ${cleanName}.`,
      });
      setEditingUser(null);
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : 'Failed to update user details.'
      );
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleConfirmStatusChange = async (e: FormEvent) => {
    e.preventDefault();
    if (!statusAction) return;

    setIsUpdatingStatus(true);
    setStatusModalError(null);
    try {
      await updateUserStatus({
        uid: statusAction.user.uid,
        status: statusAction.targetStatus,
        reason: statusReasonInput,
      });
      const verb =
        statusAction.targetStatus === 'banned'
          ? 'banned'
          : statusAction.targetStatus === 'disabled'
            ? 'disabled'
            : 'restored to active';
      setActionBanner({
        type: 'success',
        message: `${statusAction.user.displayName} has been ${verb}.`,
      });
      setStatusAction(null);
    } catch (err) {
      setStatusModalError(
        err instanceof Error ? err.message : 'Failed to update account status.'
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleConfirmDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!deletingUser) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm permanent removal.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);
    try {
      const targetName = deletingUser.displayName;
      await deleteUser(deletingUser.uid);
      if (selectedUser?.uid === deletingUser.uid) {
        setSelectedUser(null);
      }
      setDeletingUser(null);
      setActionBanner({
        type: 'success',
        message: `Deleted Firestore profile and study telemetry for ${targetName}.`,
      });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete user record.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendPasswordResetEmail = async () => {
    if (!passwordModalUser) return;
    setIsPasswordBusy(true);
    setPasswordModalFeedback(null);
    try {
      await sendPasswordReset(passwordModalUser.email);
      setPasswordModalFeedback({
        type: 'success',
        message: `Password reset / setup email dispatched to ${passwordModalUser.email}.`,
      });
    } catch (err) {
      setPasswordModalFeedback({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Unable to send password reset email.',
      });
    } finally {
      setIsPasswordBusy(false);
    }
  };

  const handleDirectPasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || currentUser?.uid !== passwordModalUser.uid) return;
    if (newPassword.length < 8) {
      setPasswordModalFeedback({
        type: 'error',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordModalFeedback({
        type: 'error',
        message: 'Passwords do not match.',
      });
      return;
    }

    setIsPasswordBusy(true);
    setPasswordModalFeedback(null);
    try {
      const result = await updateOwnPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordModalFeedback({
        type: 'success',
        message:
          result === 'linked'
            ? 'Email/password sign-in credential linked and password set for your account.'
            : 'Your Firebase Auth password has been updated.',
      });
    } catch (err) {
      setPasswordModalFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to update password.',
      });
    } finally {
      setIsPasswordBusy(false);
    }
  };

  const aggregateStats = useMemo(() => {
    let activeQuizTakers = 0;
    let totalQuizAttempts = 0;
    let restrictedCount = 0;

    for (const u of users) {
      if (u.quizAttemptsCount > 0) activeQuizTakers += 1;
      if (u.status === 'banned' || u.status === 'disabled') {
        restrictedCount += 1;
      }
      totalQuizAttempts += u.quizAttemptsCount;
    }

    return {
      totalUsers: users.length,
      activeQuizTakers,
      totalQuizAttempts,
      restrictedCount,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) {
        return false;
      }
      if (statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }
      if (activityFilter === 'attempted' && u.quizAttemptsCount === 0) {
        return false;
      }
      if (
        activityFilter === 'engaged' &&
        u.viewsCount === 0 &&
        u.reactionsCount === 0 &&
        u.flaggedCount === 0
      ) {
        return false;
      }
      if (
        activityFilter === 'new' &&
        (u.quizAttemptsCount > 0 || u.flaggedCount > 0 || u.viewsCount > 0)
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.displayName.toLowerCase().includes(q);
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchUid = u.uid.toLowerCase().includes(q);
        const matchPhone = u.phone.toLowerCase().includes(q);
        return matchName || matchEmail || matchUid || matchPhone;
      }

      return true;
    });
  }, [users, roleFilter, statusFilter, activityFilter, searchQuery]);

  const buildUserActionItems = (u: CloudUserDirectoryEntry): ActionMenuItem[] => {
    const isSelf = currentUser?.uid === u.uid;
    return [
      {
        id: 'dossier',
        label: 'View User Telemetry',
        description: `${u.quizAttemptsCount} quizzes · ${u.flaggedCount} flagged`,
        icon: UserCheck,
        color: 'blue',
        onClick: () => setSelectedUser(u),
      },
      {
        id: 'edit-details',
        label: 'Update Details',
        description: 'Edit name, email, role, cadre, phone & notes',
        icon: Edit3,
        color: 'purple',
        onClick: () => openEditModal(u),
      },
      {
        id: 'update-password',
        label: 'Update Password',
        description: isSelf
          ? 'Change password or send reset link'
          : 'Send password reset / setup email',
        icon: KeyRound,
        color: 'blue',
        onClick: () => openPasswordModal(u),
      },
      ...(u.status === 'disabled'
        ? [
            {
              id: 'enable',
              label: 'Re-enable Account',
              description: 'Restore active login and quiz access',
              icon: ShieldCheck,
              color: 'emerald' as const,
              divider: true,
              disabled: isSelf,
              onClick: () => openStatusModal(u, 'active'),
            },
          ]
        : [
            {
              id: 'disable',
              label: 'Disable Account',
              description: isSelf
                ? 'Cannot disable active admin session'
                : 'Temporarily pause login & study writes',
              icon: UserX,
              color: 'amber' as const,
              divider: true,
              disabled: isSelf,
              onClick: () => openStatusModal(u, 'disabled'),
            },
          ]),
      ...(u.status === 'banned'
        ? [
            {
              id: 'unban',
              label: 'Unban Account',
              description: 'Lift permanent suspension and restore access',
              icon: ShieldCheck,
              color: 'emerald' as const,
              disabled: isSelf,
              onClick: () => openStatusModal(u, 'active'),
            },
          ]
        : [
            {
              id: 'ban',
              label: 'Ban Account',
              description: isSelf
                ? 'Cannot ban active admin session'
                : 'Permanently block access & sign out session',
              icon: Ban,
              color: 'red' as const,
              disabled: isSelf,
              onClick: () => openStatusModal(u, 'banned'),
            },
          ]),
      {
        id: 'delete',
        label: 'Delete User',
        description: isSelf
          ? 'Cannot delete active admin session'
          : 'Remove profile, attempts, flags & reactions',
        icon: Trash2,
        danger: true,
        divider: true,
        disabled: isSelf,
        onClick: () => openDeleteModal(u),
      },
      ...(u.email
        ? [
            {
              id: 'copy-email',
              label: 'Copy Email Address',
              description: u.email,
              icon: Copy,
              color: 'zinc' as const,
              divider: true,
              onClick: () => {
                navigator.clipboard.writeText(u.email);
              },
            },
          ]
        : []),
      {
        id: 'copy-uid',
        label: 'Copy Firebase UID',
        description: u.uid,
        icon: Copy,
        color: 'zinc',
        divider: !u.email,
        onClick: () => {
          navigator.clipboard.writeText(u.uid);
        },
      },
    ];
  };

  const columns: ColumnDef<CloudUserDirectoryEntry>[] = [
    {
      id: 'user',
      header: 'User & Email',
      className: 'min-w-[230px]',
      sortable: true,
      sortKey: (u) => u.displayName,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <UserAvatar user={u} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-[13px] leading-tight truncate">
                {u.displayName}
              </p>
              {u.role === 'admin' && (
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
              {u.email || u.uid}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: 'w-28',
      align: 'center',
      sortable: true,
      sortKey: (u) => u.status,
      render: (u) => (
        <div className="inline-flex flex-col items-center">
          <span
            title={u.statusReason || undefined}
            className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded border inline-block ${getStatusBadgeClasses(u.status)}`}
          >
            {getStatusLabel(u.status)}
          </span>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      width: 'w-28',
      align: 'center',
      sortable: true,
      sortKey: (u) => u.role,
      render: (u) => (
        <span
          className={`font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded border inline-block ${
            u.role === 'admin'
              ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
          }`}
        >
          {u.role === 'admin' ? 'Admin' : 'Aspirant'}
        </span>
      ),
    },
    {
      id: 'lastLoginAt',
      header: 'Last Active',
      width: 'w-40',
      hideOnMobile: true,
      sortable: true,
      sortKey: (u) => u.lastLoginAt ?? '',
      render: (u) => (
        <div className="text-xs">
          <span className="text-zinc-800 dark:text-zinc-200 font-medium block">
            {formatShortDate(u.lastLoginAt)}
          </span>
          <span className="text-[10.5px] text-zinc-400 block">
            Joined {formatShortDate(u.createdAt)}
          </span>
        </div>
      ),
    },
    {
      id: 'attempts',
      header: 'Quiz Attempts',
      width: 'w-32',
      align: 'center',
      sortable: true,
      sortKey: (u) => u.quizAttemptsCount,
      render: (u) => (
        <div className="font-mono tabular-nums text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {u.quizAttemptsCount}
          </span>
          <span className="block text-[10px] text-zinc-400">
            {u.questionsAnswered} MCQs
          </span>
        </div>
      ),
    },
    {
      id: 'accuracy',
      header: 'Avg Accuracy',
      width: 'w-28',
      align: 'center',
      sortable: true,
      sortKey: (u) => u.averageAccuracy ?? -1,
      render: (u) =>
        u.averageAccuracy !== null ? (
          <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
            {u.averageAccuracy}%
          </span>
        ) : (
          <span className="font-mono text-zinc-400 text-xs">—</span>
        ),
    },
    {
      id: 'engagement',
      header: 'Flags & Views',
      width: 'w-32',
      align: 'center',
      hideOnTablet: true,
      sortable: true,
      sortKey: (u) => u.flaggedCount + u.viewsCount,
      render: (u) => (
        <div className="font-mono tabular-nums text-[11px] text-zinc-600 dark:text-zinc-300">
          <span>{u.flaggedCount} flagged</span>
          <span className="block text-[10px] text-zinc-400">
            {u.viewsCount} views · {u.reactionsCount} rated
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      width: 'w-32',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end whitespace-nowrap">
          <SharedActionMenu
            items={buildUserActionItems(u)}
            label="Manage"
            title={`Manage ${u.displayName}`}
            color="zinc"
            variant="outline"
            size="xs"
            width="w-68"
            header={u.displayName}
          />
        </div>
      ),
    },
  ];

  const tableFilters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'status',
        label: 'Status',
        value: statusFilter,
        onChange: setStatusFilter,
        options: [
          { label: 'All Statuses', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Disabled', value: 'disabled' },
          { label: 'Banned', value: 'banned' },
        ],
      },
      {
        id: 'role',
        label: 'Role',
        value: roleFilter,
        onChange: setRoleFilter,
        options: [
          { label: 'All Roles', value: 'all' },
          { label: 'Aspirants', value: 'aspirant' },
          { label: 'Administrators', value: 'admin' },
        ],
      },
      {
        id: 'activity',
        label: 'Activity',
        value: activityFilter,
        onChange: setActivityFilter,
        options: [
          { label: 'All Accounts', value: 'all' },
          { label: 'Took Quizzes', value: 'attempted' },
          { label: 'Active Readers / Raters', value: 'engaged' },
          { label: 'New (No Activity Yet)', value: 'new' },
        ],
      },
    ],
    [statusFilter, roleFilter, activityFilter]
  );

  const isFiltered =
    roleFilter !== 'all' ||
    statusFilter !== 'all' ||
    activityFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setActivityFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Real-Time DB Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Firestore Accounts</span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {isLoading ? '—' : aggregateStats.totalUsers}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {lastSyncedAt
              ? `Synced ${formatDateTime(lastSyncedAt)}`
              : 'Live Cloud Firestore DB'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Quiz Takers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {isLoading ? '—' : aggregateStats.activeQuizTakers}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Users with completed attempts
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Total DB Attempts</span>
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {isLoading ? '—' : aggregateStats.totalQuizAttempts}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Recorded MCQ &amp; OMR sittings
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Disabled / Banned</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-red-600 dark:text-red-400">
            {isLoading ? '—' : aggregateStats.restrictedCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Restricted accounts in DB
          </p>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionBanner && (
        <div
          role="status"
          className={`rounded-xl border p-3.5 flex items-center justify-between gap-3 text-xs ${
            actionBanner.type === 'success'
              ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
              : 'border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span className="font-medium">{actionBanner.message}</span>
          </div>
          <ActionButton
            title="Dismiss notification"
            icon={X}
            color="zinc"
            variant="ghost"
            size="xs"
            onClick={() => setActionBanner(null)}
          />
        </div>
      )}

      {/* Firestore Error Alert */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800 dark:text-red-300"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="space-y-0.5">
              <p className="font-semibold">
                Unable to load users from Firestore
              </p>
              <p className="font-mono text-[11px] opacity-90 break-all">
                {error}
              </p>
            </div>
          </div>
          <ActionButton
            title="Retry loading users from Firestore"
            label="Retry"
            icon={RefreshCw}
            color="red"
            variant="outline"
            size="xs"
            onClick={() => void refreshUsers()}
          />
        </div>
      )}

      {/* Real DB Users Table / Cards */}
      <SharedDataTable<CloudUserDirectoryEntry>
        title="Registered Users Directory (Firestore)"
        subtitle="Manage real-time authenticated user accounts, moderation status, details, and passwords synced with Cloud Firestore"
        totalCount={users.length}
        data={filteredUsers}
        columns={columns}
        keyExtractor={(u) => u.uid}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by display name, email, phone, or Firebase UID..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        enableCsvExport={true}
        csvFilename="psc-nepal-users-directory.csv"
        pagination={true}
        defaultPageSize={12}
        pageSizeOptions={[12, 24, 48]}
        viewMode={viewMode}
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-0.5">
              <ActionButton
                title="Table view"
                icon={List}
                variant={viewMode === 'table' ? 'solid' : 'ghost'}
                color="zinc"
                size="xs"
                onClick={() => setViewMode('table')}
              />
              <ActionButton
                title="Grid cards view"
                icon={LayoutGrid}
                variant={viewMode === 'cards' ? 'solid' : 'ghost'}
                color="zinc"
                size="xs"
                onClick={() => setViewMode('cards')}
              />
            </div>

            <ActionButton
              label={isRefreshing ? 'Syncing...' : 'Refresh DB'}
              title="Re-fetch users and subcollection telemetry from Firestore"
              color="blue"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              disabled={isRefreshing}
              onClick={() => void refreshUsers()}
            />
          </div>
        }
        renderCard={(u) => (
          <article
            key={u.uid}
            className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-colors shadow-2xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <UserAvatar user={u} size="md" />
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span
                    className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeClasses(u.status)}`}
                  >
                    {getStatusLabel(u.status)}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      u.role === 'admin'
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {u.role === 'admin' ? 'Admin' : 'Aspirant'}
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <h4 className="font-serif font-bold text-zinc-950 dark:text-zinc-50 text-base leading-snug truncate">
                  {u.displayName}
                </h4>
                <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">
                  {u.email || u.uid}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">
                  Last login {formatShortDate(u.lastLoginAt)}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Quiz Attempts
                  </span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {u.quizAttemptsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Avg Accuracy
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {u.averageAccuracy !== null ? `${u.averageAccuracy}%` : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{u.flaggedCount} flagged</span>
                <span>{u.viewsCount} views</span>
                <span>{u.reactionsCount} rated</span>
              </div>

              <SharedActionMenu
                items={buildUserActionItems(u)}
                label="Manage User"
                title={`Manage ${u.displayName}`}
                color="zinc"
                variant="outline"
                size="sm"
                width="w-68"
                header={u.displayName}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
          </article>
        )}
        emptyMessage={
          isLoading
            ? 'Loading users from Firestore...'
            : 'No registered users matched your filters'
        }
        emptyDescription={
          isLoading
            ? 'Fetching real-time account profiles and quiz telemetry from Cloud Firestore.'
            : 'Users appear here automatically after signing in with Google.'
        }
      />

      {/* ================================================================== */}
      {/* 1. USER TELEMETRY DOSSIER MODAL                                    */}
      {/* ================================================================== */}
      {selectedUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar user={selectedUser} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      id="user-dossier-title"
                      className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50 truncate"
                    >
                      {selectedUser.displayName}
                    </h4>
                    <span
                      className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeClasses(selectedUser.status)}`}
                    >
                      {getStatusLabel(selectedUser.status)}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        selectedUser.role === 'admin'
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {selectedUser.role === 'admin' ? 'Admin' : 'Aspirant'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">
                    {selectedUser.email || 'No email on profile'}
                  </p>
                </div>
              </div>
              <ActionButton
                title="Close user dossier"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setSelectedUser(null)}
              />
            </div>

            {selectedUser.status !== 'active' && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  selectedUser.status === 'banned'
                    ? 'border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300'
                    : 'border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
                }`}
              >
                <p className="font-semibold">
                  Account {getStatusLabel(selectedUser.status)}
                  {selectedUser.statusUpdatedAt
                    ? ` · ${formatDateTime(selectedUser.statusUpdatedAt)}`
                    : ''}
                </p>
                {selectedUser.statusReason && (
                  <p className="mt-1 opacity-90">{selectedUser.statusReason}</p>
                )}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase block">
                    Firebase UID
                  </span>
                  <span className="font-mono text-[11px] text-zinc-800 dark:text-zinc-200 break-all">
                    {selectedUser.uid}
                  </span>
                  <span className="text-[11px] text-zinc-500 block mt-1.5">
                    Cadre: {formatCadreLabel(selectedUser.targetCadre)}
                    {selectedUser.phone ? ` · ${selectedUser.phone}` : ''}
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-zinc-400 uppercase block">
                    Account Timeline
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-200 block">
                    Joined {formatDateTime(selectedUser.createdAt)}
                  </span>
                  <span className="text-zinc-500 block">
                    Last login {formatDateTime(selectedUser.lastLoginAt)}
                  </span>
                </div>
              </div>

              {selectedUser.adminNotes && (
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/50">
                  <span className="font-mono text-[10px] text-blue-700 dark:text-blue-400 uppercase block mb-1">
                    Administrator Notes
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {selectedUser.adminNotes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono tabular-nums text-center">
                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Quiz Attempts
                  </span>
                  <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {selectedUser.quizAttemptsCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {selectedUser.questionsAnswered} MCQs
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Avg Accuracy
                  </span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedUser.averageAccuracy !== null
                      ? `${selectedUser.averageAccuracy}%`
                      : '—'}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {selectedUser.bestAccuracy !== null
                      ? `Best ${selectedUser.bestAccuracy}%`
                      : 'No quizzes yet'}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Flagged Items
                  </span>
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {selectedUser.flaggedCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    Saved in cloud
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] text-zinc-400 block font-sans">
                    Views &amp; Ratings
                  </span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1 justify-center">
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    {selectedUser.viewsCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                    <ThumbsUp className="w-2.5 h-2.5" />
                    {selectedUser.reactionsCount} rated
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300 block">
                  Recent Quiz &amp; OMR Attempts ({selectedUser.recentAttempts.length})
                </span>
                {selectedUser.recentAttempts.length === 0 ? (
                  <p className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-500">
                    No quiz attempts recorded in Firestore for this user yet.
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 rounded-lg border border-zinc-200/80 dark:border-zinc-800 overflow-hidden">
                    {selectedUser.recentAttempts.map((att) => (
                      <div
                        key={att.id}
                        className="px-3 py-2.5 bg-zinc-50/70 dark:bg-zinc-950/70 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {att.deckTitle}
                          </p>
                          <p className="text-[10.5px] text-zinc-500 font-mono">
                            {att.mode.toUpperCase()} · {att.correctCount}/
                            {att.totalQuestions} correct ·{' '}
                            {formatShortDate(att.completedAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0 font-mono tabular-nums">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            {att.accuracyPercent}%
                          </span>
                          <span className="block text-[10px] text-zinc-400">
                            Net {att.pscNetScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-2">
                <ActionButton
                  label="Edit Details"
                  title="Update user profile details"
                  icon={Edit3}
                  color="purple"
                  variant="outline"
                  size="xs"
                  onClick={() => openEditModal(selectedUser)}
                />
                <ActionButton
                  label="Update Password"
                  title="Manage user password or send reset email"
                  icon={KeyRound}
                  color="blue"
                  variant="outline"
                  size="xs"
                  onClick={() => openPasswordModal(selectedUser)}
                />
                {currentUser?.uid !== selectedUser.uid && (
                  <>
                    <ActionButton
                      label={
                        selectedUser.status === 'disabled'
                          ? 'Enable'
                          : 'Disable'
                      }
                      title={
                        selectedUser.status === 'disabled'
                          ? 'Re-enable user account'
                          : 'Temporarily disable user account'
                      }
                      icon={
                        selectedUser.status === 'disabled'
                          ? ShieldCheck
                          : UserX
                      }
                      color={
                        selectedUser.status === 'disabled' ? 'emerald' : 'amber'
                      }
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        openStatusModal(
                          selectedUser,
                          selectedUser.status === 'disabled'
                            ? 'active'
                            : 'disabled'
                        )
                      }
                    />
                    <ActionButton
                      label={selectedUser.status === 'banned' ? 'Unban' : 'Ban'}
                      title={
                        selectedUser.status === 'banned'
                          ? 'Unban user account'
                          : 'Ban user account'
                      }
                      icon={
                        selectedUser.status === 'banned' ? ShieldCheck : Ban
                      }
                      color={
                        selectedUser.status === 'banned' ? 'emerald' : 'red'
                      }
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        openStatusModal(
                          selectedUser,
                          selectedUser.status === 'banned' ? 'active' : 'banned'
                        )
                      }
                    />
                    <ActionButton
                      label="Delete"
                      title="Delete user profile and telemetry from Firestore"
                      icon={Trash2}
                      color="red"
                      variant="outline"
                      size="xs"
                      onClick={() => openDeleteModal(selectedUser)}
                    />
                  </>
                )}
              </div>

              <ActionButton
                label="Close"
                title="Close user dossier"
                color="zinc"
                variant="solid"
                size="sm"
                onClick={() => setSelectedUser(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 2. UPDATE USER DETAILS MODAL                                       */}
      {/* ================================================================== */}
      {editingUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <form
            onSubmit={(e) => void handleSaveDetails(e)}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h4
                  id="edit-user-title"
                  className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
                >
                  Update User Details
                </h4>
                <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">
                  UID: {editingUser.uid}
                </p>
              </div>
              <ActionButton
                title="Close modal"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setEditingUser(null)}
              />
            </div>

            {editError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
                {editError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    maxLength={254}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    maxLength={32}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Role
                  </label>
                  <SharedSearchSelect
                    value={editRole}
                    onChange={(val) =>
                      setEditRole(val === 'admin' ? 'admin' : 'aspirant')
                    }
                    options={[
                      { value: 'aspirant', label: 'Aspirant' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                    enableSearch={false}
                    size="sm"
                    className="w-full"
                    triggerClassName="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                    ariaLabel="Select user role"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Cadre
                  </label>
                  <SharedSearchSelect
                    value={editTargetCadre}
                    onChange={(val) =>
                      setEditTargetCadre(val as CloudUserTargetCadre | '')
                    }
                    options={[
                      { value: '', label: 'Not specified' },
                      { value: 'section-officer', label: 'Section Officer' },
                      { value: 'nayab-subba', label: 'Nayab Subba' },
                      { value: 'kharidar', label: 'Kharidar' },
                    ]}
                    enableSearch={false}
                    size="sm"
                    className="w-full"
                    triggerClassName="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                    ariaLabel="Select target cadre"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Account Status
                  </label>
                  <SharedSearchSelect
                    value={editStatus}
                    disabled={currentUser?.uid === editingUser.uid}
                    onChange={(val) => setEditStatus(val as CloudUserStatus)}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'disabled', label: 'Disabled' },
                      { value: 'banned', label: 'Banned' },
                    ]}
                    enableSearch={false}
                    size="sm"
                    className="w-full"
                    triggerClassName="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                    ariaLabel="Select account status"
                  />
                </div>
              </div>

              {editStatus !== 'active' &&
                currentUser?.uid !== editingUser.uid && (
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Restriction Reason ({getStatusLabel(editStatus)})
                    </label>
                    <input
                      type="text"
                      maxLength={300}
                      value={editStatusReason}
                      onChange={(e) => setEditStatusReason(e.target.value)}
                      placeholder="Explain why this account is disabled or banned..."
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  maxLength={512}
                  value={editPhotoURL}
                  onChange={(e) => setEditPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Administrator Notes
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="Internal moderation or support notes (max 1,000 characters)..."
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <ActionButton
                label="Cancel"
                title="Discard edits"
                color="zinc"
                variant="outline"
                size="sm"
                onClick={() => setEditingUser(null)}
              />
              <ActionButton
                type="submit"
                label={isSavingDetails ? 'Saving...' : 'Save Changes'}
                title="Save updated user details to Firestore"
                color="blue"
                variant="solid"
                size="sm"
                disabled={isSavingDetails}
              />
            </div>
          </form>
        </div>
      )}

      {/* ================================================================== */}
      {/* 3. UPDATE / RESET PASSWORD MODAL                                   */}
      {/* ================================================================== */}
      {passwordModalUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h4
                  id="password-modal-title"
                  className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
                >
                  Update User Password
                </h4>
                <p className="text-xs text-zinc-500 font-mono truncate mt-0.5">
                  {passwordModalUser.email || passwordModalUser.displayName}
                </p>
              </div>
              <ActionButton
                title="Close modal"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setPasswordModalUser(null)}
              />
            </div>

            {passwordModalFeedback && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  passwordModalFeedback.type === 'success'
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                }`}
              >
                {passwordModalFeedback.message}
              </div>
            )}

            {/* Option A: Send Official Firebase Password Reset / Setup Email */}
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Send Firebase Password Reset / Setup Email</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Dispatches a secure Firebase Auth password reset link to{' '}
                <span className="font-mono text-zinc-900 dark:text-zinc-200">
                  {passwordModalUser.email || 'no email on profile'}
                </span>{' '}
                so the user can create or update their password.
              </p>
              <ActionButton
                label={
                  isPasswordBusy ? 'Sending Email...' : 'Send Reset Link Email'
                }
                title="Send Firebase Authentication password reset email"
                icon={Mail}
                color="blue"
                variant="solid"
                size="sm"
                disabled={isPasswordBusy || !passwordModalUser.email}
                onClick={() => void handleSendPasswordResetEmail()}
              />
            </div>

            {/* Option B: Direct password update for currently signed-in admin account OR explanatory security notice */}
            {currentUser?.uid === passwordModalUser.uid ? (
              <form
                onSubmit={(e) => void handleDirectPasswordUpdate(e)}
                className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs"
              >
                <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Set New Password (Your Account)</span>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    New Password (min 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      minLength={8}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter strong password"
                      className="w-full px-3 py-2 pr-9 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <ActionButton
                  type="submit"
                  label={isPasswordBusy ? 'Updating...' : 'Update My Password'}
                  title="Update or link password credential on your Firebase Auth account"
                  color="purple"
                  variant="solid"
                  size="sm"
                  disabled={isPasswordBusy}
                />
              </form>
            ) : (
              <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Note: Firebase Client Auth restricts overwriting another user&apos;s
                password directly from the browser for security. Use{' '}
                <strong className="text-zinc-700 dark:text-zinc-300">
                  Send Reset Link Email
                </strong>{' '}
                above, or use a trusted server-side Firebase Admin SDK endpoint if
                silent password assignment is required.
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ActionButton
                label="Close"
                title="Close password modal"
                color="zinc"
                variant="outline"
                size="sm"
                onClick={() => setPasswordModalUser(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 4. BAN / DISABLE / RESTORE STATUS MODAL                            */}
      {/* ================================================================== */}
      {statusAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-action-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <form
            onSubmit={(e) => void handleConfirmStatusChange(e)}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h4
                  id="status-action-title"
                  className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
                >
                  {statusAction.targetStatus === 'banned'
                    ? 'Ban User Account'
                    : statusAction.targetStatus === 'disabled'
                      ? 'Disable User Account'
                      : 'Restore Active Account'}
                </h4>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {statusAction.user.displayName} ({statusAction.user.email || statusAction.user.uid})
                </p>
              </div>
              <ActionButton
                title="Close modal"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setStatusAction(null)}
              />
            </div>

            {statusModalError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
                {statusModalError}
              </div>
            )}

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {statusAction.targetStatus === 'banned'
                ? 'Banning immediately revokes quiz and study sync access, blocks Firestore writes via security rules, and signs out any active session.'
                : statusAction.targetStatus === 'disabled'
                  ? 'Disabling pauses this account so the user cannot sign in or record quiz/reaction writes until re-enabled.'
                  : 'Restoring sets the account status back to active so the user can sign in and resume normal preparation.'}
            </p>

            {statusAction.targetStatus !== 'active' && (
              <div className="text-xs">
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Reason (shown to user if they attempt login)
                </label>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={statusReasonInput}
                  onChange={(e) => setStatusReasonInput(e.target.value)}
                  placeholder={
                    statusAction.targetStatus === 'banned'
                      ? 'e.g., Violation of portal usage terms'
                      : 'e.g., Account temporarily paused pending review'
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ActionButton
                label="Cancel"
                title="Cancel status change"
                color="zinc"
                variant="outline"
                size="sm"
                onClick={() => setStatusAction(null)}
              />
              <ActionButton
                type="submit"
                label={
                  isUpdatingStatus
                    ? 'Applying...'
                    : statusAction.targetStatus === 'banned'
                      ? 'Confirm Ban'
                      : statusAction.targetStatus === 'disabled'
                        ? 'Confirm Disable'
                        : 'Restore Active'
                }
                title="Apply account moderation status in Firestore"
                color={
                  statusAction.targetStatus === 'banned'
                    ? 'red'
                    : statusAction.targetStatus === 'disabled'
                      ? 'amber'
                      : 'emerald'
                }
                variant="solid"
                size="sm"
                disabled={isUpdatingStatus}
              />
            </div>
          </form>
        </div>
      )}

      {/* ================================================================== */}
      {/* 5. DELETE USER CONFIRMATION MODAL                                  */}
      {/* ================================================================== */}
      {deletingUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-user-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <form
            onSubmit={(e) => void handleConfirmDelete(e)}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/60 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h4
                  id="delete-user-title"
                  className="font-serif text-lg font-bold text-red-700 dark:text-red-400"
                >
                  Delete User Data
                </h4>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {deletingUser.displayName} ({deletingUser.email || deletingUser.uid})
                </p>
              </div>
              <ActionButton
                title="Close modal"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setDeletingUser(null)}
              />
            </div>

            {deleteError && (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs text-red-700 dark:text-red-300">
                {deleteError}
              </div>
            )}

            <div className="p-3 rounded-lg bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 space-y-1">
              <p className="font-semibold">
                This permanently removes all Firestore data for this user:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>User profile document ({deletingUser.uid})</li>
                <li>{deletingUser.quizAttemptsCount} quiz &amp; OMR attempt records</li>
                <li>{deletingUser.flaggedCount} flagged question bookmarks</li>
                <li>All personal item view &amp; like/dislike records</li>
              </ul>
            </div>

            <div className="text-xs">
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </label>
              <input
                type="text"
                required
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <ActionButton
                label="Cancel"
                title="Cancel user deletion"
                color="zinc"
                variant="outline"
                size="sm"
                onClick={() => setDeletingUser(null)}
              />
              <ActionButton
                type="submit"
                label={isDeleting ? 'Deleting...' : 'Permanently Delete'}
                title="Delete user profile and subcollections from Firestore"
                icon={Trash2}
                color="red"
                variant="solid"
                size="sm"
                disabled={
                  isDeleting || deleteConfirmText.trim().toUpperCase() !== 'DELETE'
                }
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
