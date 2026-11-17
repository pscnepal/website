import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileDown,
  Inbox,
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  useDeleteContactInquiryMutation,
  useGetAdminContactInquiriesQuery,
  useUpdateAdminInquiryMutation,
} from '../../app/api/pscApi';
import { useAuth } from '../../context/AuthContext';
import { getInquiryCategoryLabel } from '../../data/contactContentData';
import type {
  ContactInquiryRecord,
  InquiryStatus,
} from '../../services/storageService';
import { toast } from '../../services/toastService';
import { copyWithToast } from '../../utils/clipboardHelpers';
import { formatUserFriendlyError } from '../../utils/errorHelpers';
import { formatRelativeDate } from '../../utils/pdfHelpers';
import { ActionButton } from '../common/ActionButton';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { SharedActionMenu } from '../common/SharedActionMenu';
import {
  SharedDataTable,
  type ColumnDef,
  type TableFilterDef,
} from '../common/SharedDataTable';
import { SharedSearchSelect } from '../common/SharedSearchSelect';
import { useDashboardSearch } from './DashboardLayout';

const STATUS_BADGE_STYLES: Record<
  InquiryStatus,
  { label: string; badgeClass: string }
> = {
  open: {
    label: 'Open',
    badgeClass:
      'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
  },
  'in-review': {
    label: 'In Review',
    badgeClass:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
  },
  resolved: {
    label: 'Resolved',
    badgeClass:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
  },
};

export function InquiriesTab() {
  const { isDashboardAdmin } = useAuth();
  const { searchQuery, setSearchQuery } = useDashboardSearch();

  const {
    data: inquiries = [],
    isLoading,
    isFetching,
  } = useGetAdminContactInquiriesQuery(undefined, {
    skip: !isDashboardAdmin,
  });

  const [updateAdminInquiry, { isLoading: isUpdating }] =
    useUpdateAdminInquiryMutation();
  const [deleteContactInquiry, { isLoading: isDeleting }] =
    useDeleteContactInquiryMutation();

  const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [selectedInquiry, setSelectedInquiry] =
    useState<ContactInquiryRecord | null>(null);
  const [draftStatus, setDraftStatus] = useState<InquiryStatus>('in-review');
  const [draftReply, setDraftReply] = useState('');
  const [deleteCandidate, setDeleteCandidate] =
    useState<ContactInquiryRecord | null>(null);

  useEffect(() => {
    if (!selectedInquiry) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedInquiry(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedInquiry]);

  const handleOpenInquiry = useCallback((record: ContactInquiryRecord) => {
    setSelectedInquiry(record);
    setDraftStatus(record.status || 'open');
    setDraftReply(record.adminReply || '');
  }, []);

  const handleSaveResponse = async () => {
    if (!selectedInquiry) return;
    const trimmedReply = draftReply.trim().slice(0, 2000);
    try {
      await updateAdminInquiry({
        inquiryId: selectedInquiry.id,
        status: draftStatus,
        adminReply: trimmedReply || undefined,
      }).unwrap();
      toast.success(`Updated inquiry ${selectedInquiry.ticketCode} (${draftStatus}).`);
      setSelectedInquiry(null);
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to update inquiry in Firestore.')
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const target = deleteCandidate;
    setDeleteCandidate(null);
    try {
      await deleteContactInquiry(target.id).unwrap();
      if (selectedInquiry?.id === target.id) {
        setSelectedInquiry(null);
      }
      toast.info(`Deleted inquiry ${target.ticketCode}.`);
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to delete inquiry record.')
      );
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.ticketCode.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.reference.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          (item.adminReply ?? '').toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [inquiries, statusFilter, categoryFilter, searchQuery]);

  const metrics = useMemo(() => {
    let openCount = 0;
    let inReviewCount = 0;
    let resolvedCount = 0;
    for (const item of inquiries) {
      if (item.status === 'resolved') resolvedCount += 1;
      else if (item.status === 'in-review') inReviewCount += 1;
      else openCount += 1;
    }
    return {
      total: inquiries.length,
      openCount,
      inReviewCount,
      resolvedCount,
    };
  }, [inquiries]);

  const handleExportJson = useCallback(() => {
    if (filteredInquiries.length === 0) return;
    try {
      const blob = new Blob([JSON.stringify(filteredInquiries, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `psc-nepal-inquiries-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(
        `Exported ${filteredInquiries.length} inquiry record${filteredInquiries.length === 1 ? '' : 's'} as JSON.`
      );
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to export inquiry records.')
      );
    }
  }, [filteredInquiries]);

  const columns: ColumnDef<ContactInquiryRecord>[] = useMemo(
    () => [
      {
        id: 'ticket',
        header: 'Ticket & Topic',
        sortable: true,
        sortKey: (item) => item.ticketCode,
        render: (item) => (
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {item.ticketCode}
              </span>
            </div>
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {getInquiryCategoryLabel(item.category)}
            </span>
          </div>
        ),
      },
      {
        id: 'reporter',
        header: 'Candidate',
        sortable: true,
        sortKey: (item) => item.name,
        render: (item) => (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {item.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {item.email}
            </p>
          </div>
        ),
      },
      {
        id: 'details',
        header: 'Message & Reference',
        render: (item) => (
          <div className="space-y-1 max-w-md min-w-0">
            {item.reference && (
              <span className="inline-block font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70">
                Ref: {item.reference}
              </span>
            )}
            <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2">
              {item.message}
            </p>
            {item.adminReply && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 line-clamp-1 font-medium">
                Reply: {item.adminReply}
              </p>
            )}
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        sortKey: (item) => item.status,
        render: (item) => {
          const style = STATUS_BADGE_STYLES[item.status] ?? STATUS_BADGE_STYLES.open;
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${style.badgeClass}`}
            >
              {style.label}
            </span>
          );
        },
      },
      {
        id: 'createdAt',
        header: 'Submitted',
        hideOnMobile: true,
        sortable: true,
        sortKey: (item) => new Date(item.createdAt).getTime(),
        render: (item) => (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            {formatRelativeDate(item.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        render: (item) => (
          <div className="flex items-center justify-end gap-1.5">
            <ActionButton
              label={item.adminReply ? 'Update' : 'Respond'}
              title="Inspect inquiry and update admin reply"
              icon={Eye}
              color="blue"
              variant="subtle"
              size="xs"
              onClick={() => handleOpenInquiry(item)}
            />
            <button
              type="button"
              onClick={() => setDeleteCandidate(item)}
              aria-label={`Delete inquiry ${item.ticketCode}`}
              title="Delete inquiry"
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [handleOpenInquiry, isDeleting]
  );

  const filters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'status',
        label: 'Status',
        value: statusFilter,
        onChange: (val) => setStatusFilter(val as 'all' | InquiryStatus),
        options: [
          { label: 'All Statuses', value: 'all' },
          { label: 'Open', value: 'open' },
          { label: 'In Review', value: 'in-review' },
          { label: 'Resolved', value: 'resolved' },
        ],
      },
      {
        id: 'category',
        label: 'Topic',
        value: categoryFilter,
        onChange: setCategoryFilter,
        options: [
          { label: 'All Topics', value: 'all' },
          { label: 'Quiz / Written Errata', value: 'quiz-errata' },
          { label: 'Material / Syllabus Request', value: 'material-request' },
          { label: 'PDF Reader Support', value: 'reader-support' },
          { label: 'General Inquiry', value: 'general' },
        ],
      },
    ],
    [statusFilter, categoryFilter]
  );

  const isFiltered =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Total Inquiries</span>
            <Inbox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {isLoading ? '—' : metrics.total}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Synced support &amp; errata tickets
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Open Queue</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? '—' : metrics.openCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Awaiting initial triage
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">In Review</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-blue-700 dark:text-blue-400">
            {isLoading ? '—' : metrics.inReviewCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Editorial verification active
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? '—' : metrics.resolvedCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Answered &amp; closed tickets
          </p>
        </div>
      </div>

      {/* Inquiries Data Table */}
      <SharedDataTable<ContactInquiryRecord>
        data={filteredInquiries}
        columns={columns}
        filters={filters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search ticket code, candidate, email, reference, or message..."
        keyExtractor={(item) => item.id}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        title="Candidate Contact & Errata Inbox"
        subtitle={
          isFetching && !isLoading
            ? 'Refreshing live Firestore inbox...'
            : 'Review question corrections, statutory material requests, and send official status replies'
        }
        actions={
          <SharedActionMenu
            label="Actions"
            icon={Sparkles}
            items={[
              {
                id: 'export',
                label: 'Export Inquiries (JSON)',
                description: 'Download filtered tickets as JSON',
                icon: FileDown,
                color: 'blue',
                disabled: filteredInquiries.length === 0,
                onClick: handleExportJson,
              },
            ]}
            color="zinc"
            variant="outline"
            size="sm"
            header="Inbox Tools"
          />
        }
        emptyMessage={
          isLoading
            ? 'Loading candidate inquiries...'
            : 'No Contact or Errata Inquiries Yet'
        }
        emptyDescription="When aspirants submit errata notes, document requests, or feedback via the Contact page, their tickets appear here for editorial review."
      />

      {/* Inspect & Respond Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-dialog-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {selectedInquiry.ticketCode}
                  </span>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    {getInquiryCategoryLabel(selectedInquiry.category)}
                  </span>
                  <span className="text-xs text-zinc-400">·</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatRelativeDate(selectedInquiry.createdAt)}
                  </span>
                </div>
                <h3
                  id="inquiry-dialog-title"
                  className="font-serif font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50"
                >
                  Inquiry from {selectedInquiry.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{selectedInquiry.email}</span>
                  <button
                    type="button"
                    onClick={() =>
                      void copyWithToast(
                        selectedInquiry.email,
                        'Candidate email copied.'
                      )
                    }
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close inquiry modal"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedInquiry.reference && (
              <div className="text-xs font-mono px-3 py-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/70 text-blue-800 dark:text-blue-300">
                Reference: {selectedInquiry.reference}
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Candidate Message
              </p>
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <SharedSearchSelect
                  id="admin-inquiry-status"
                  label="Ticket Status"
                  value={draftStatus}
                  onChange={(val) => setDraftStatus(val as InquiryStatus)}
                  options={[
                    { label: 'Open', value: 'open' },
                    { label: 'In Review', value: 'in-review' },
                    { label: 'Resolved', value: 'resolved' },
                  ]}
                  enableSearch={false}
                  size="sm"
                  className="w-full"
                  popoverWidth="w-full"
                />
              </div>

              <div className="flex items-end">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Re: [PSC Nepal ${selectedInquiry.ticketCode}]`)}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="admin-inquiry-reply"
                  className="font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  Official Admin Reply (visible in candidate&apos;s account)
                </label>
                <span className="font-mono text-[11px] text-zinc-400">
                  {draftReply.length}/2000
                </span>
              </div>
              <textarea
                id="admin-inquiry-reply"
                rows={4}
                maxLength={2000}
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                placeholder="Write a concise clarification, statutory amendment note, or resolution summary..."
                className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <ActionButton
                label="Delete Ticket"
                title="Permanently delete this inquiry"
                icon={Trash2}
                color="red"
                variant="outline"
                size="sm"
                onClick={() => setDeleteCandidate(selectedInquiry)}
              />

              <div className="flex items-center gap-2">
                <ActionButton
                  label="Cancel"
                  title="Close without saving"
                  color="zinc"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                />
                <ActionButton
                  label={isUpdating ? 'Saving...' : 'Save Reply & Status'}
                  title="Save inquiry status and reply to Firestore"
                  icon={Send}
                  color="blue"
                  variant="solid"
                  size="sm"
                  disabled={isUpdating}
                  onClick={handleSaveResponse}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteCandidate)}
        title="Delete Contact Inquiry?"
        description={
          deleteCandidate
            ? `Permanently delete ticket ${deleteCandidate.ticketCode} from Firestore? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete Inquiry"
        confirmColor="crimson"
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setDeleteCandidate(null)}
      />
    </div>
  );
}
