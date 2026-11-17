import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Eye,
  FileDown,
  Flag,
  HelpCircle,
  Sparkles,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { isBilingualQuizQuestion } from '../../data/quizData';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';
import { useAuth } from '../../context/AuthContext';
import { useDashboardUsers } from '../../context/DashboardUsersContext';
import { ActionButton } from '../common/ActionButton';
import { SharedActionMenu } from '../common/SharedActionMenu';
import { ReactionButtons } from '../common/ReactionButtons';
import { SharedDataTable } from '../common/SharedDataTable';
import type {
  ActionMenuItem,
  ColumnDef,
  FlagInspectContext as InspectContext,
  QuizOptionKey,
  QuizQuestion,
  TableFilterDef,
  UserSubmittedFlagReport,
} from '../../types';
import { useDashboardSearch } from './DashboardLayout';
import { toast } from '../../services/toastService';
import { copyWithToast } from '../../utils/clipboardHelpers';
import { formatUserFriendlyError } from '../../utils/errorHelpers';

export type { UserSubmittedFlagReport };

export function FlaggedQuestionsTab() {
  const { isDashboardAdmin } = useAuth();
  const { users: directoryUsers, isLoading: isUsersLoading } =
    useDashboardUsers();

  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const { searchQuery, setSearchQuery } = useDashboardSearch();
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [hasNotesFilter, setHasNotesFilter] = useState<
    'all' | 'with-notes' | 'without-notes'
  >('all');

  const [inspectContext, setInspectContext] = useState<InspectContext | null>(
    null
  );
  const [testSelectedOption, setTestSelectedOption] =
    useState<QuizOptionKey | null>(null);

  useEffect(() => {
    if (!inspectContext) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectContext(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectContext]);

  // Sync with live question bank edits
  useEffect(() => {
    const handleBankChange = () => {
      setQuestionBank(questionStorageService.loadQuizQuestions());
    };
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleBankChange);
    window.addEventListener('storage', handleBankChange);
    return () => {
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleBankChange);
      window.removeEventListener('storage', handleBankChange);
    };
  }, []);

  // Aggregate user-submitted flag reports from Firestore for super admin
  const userSubmittedReports = useMemo<UserSubmittedFlagReport[]>(() => {
    if (!isDashboardAdmin) return [];
    const byId = new Map<string, QuizQuestion>();
    questionBank.forEach((q) => byId.set(q.id, q));

    const reports: UserSubmittedFlagReport[] = [];
    for (const u of directoryUsers) {
      for (const f of u.flaggedQuestions ?? []) {
        reports.push({
          reportId: `${u.uid}:${f.questionId}`,
          user: u,
          flagMeta: f,
          question: byId.get(f.questionId) ?? null,
        });
      }
    }
    return reports.sort(
      (a, b) =>
        new Date(b.flagMeta.flaggedAt || 0).getTime() -
        new Date(a.flagMeta.flaggedAt || 0).getTime()
    );
  }, [isDashboardAdmin, directoryUsers, questionBank]);

  // Aggregate total flags per questionId
  const flagCountByQuestion = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const report of userSubmittedReports) {
      const qId = report.flagMeta.questionId;
      counts[qId] = (counts[qId] ?? 0) + 1;
    }
    return counts;
  }, [userSubmittedReports]);

  // Extract unique subjects among reported items
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    userSubmittedReports.forEach(({ question }) => {
      if (question?.subject) set.add(question.subject);
    });
    return Array.from(set).sort();
  }, [userSubmittedReports]);

  // Filter admin user-submitted flag reports
  const filteredReports = useMemo(() => {
    return userSubmittedReports.filter(({ user, flagMeta, question }) => {
      if (subjectFilter !== 'all' && question?.subject !== subjectFilter) {
        return false;
      }
      if (
        difficultyFilter !== 'all' &&
        question?.difficulty !== difficultyFilter
      ) {
        return false;
      }
      if (sourceFilter !== 'all' && flagMeta.source !== sourceFilter) {
        return false;
      }
      const hasDetails = Boolean(
        flagMeta.reason?.trim() || flagMeta.note?.trim()
      );
      if (hasNotesFilter === 'with-notes' && !hasDetails) {
        return false;
      }
      if (hasNotesFilter === 'without-notes' && hasDetails) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const showBilingual = question ? isBilingualQuizQuestion(question) : false;
        const matchesQuestion =
          flagMeta.questionId.toLowerCase().includes(query) ||
          (question?.question.toLowerCase().includes(query) ?? false) ||
          (showBilingual &&
            (question?.questionNe ?? '').toLowerCase().includes(query));
        const matchesUser =
          user.displayName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);
        const matchesReason = (flagMeta.reason || '').toLowerCase().includes(query);
        const matchesNote = (flagMeta.note || '').toLowerCase().includes(query);
        const matchesDeck = (flagMeta.deckTitle || '').toLowerCase().includes(query);
        return (
          matchesQuestion ||
          matchesUser ||
          matchesReason ||
          matchesNote ||
          matchesDeck
        );
      }
      return true;
    });
  }, [
    userSubmittedReports,
    searchQuery,
    subjectFilter,
    difficultyFilter,
    sourceFilter,
    hasNotesFilter,
  ]);

  const handleOpenInspect = useCallback((ctx: InspectContext) => {
    setInspectContext(ctx);
    setTestSelectedOption(null);
  }, []);

  const handleExportReportsJson = useCallback(() => {
    if (filteredReports.length === 0) return;
    try {
      const payload = filteredReports.map(({ user, flagMeta, question }) => ({
        questionId: flagMeta.questionId,
        totalQuestionFlags: flagCountByQuestion[flagMeta.questionId] ?? 1,
        questionPrompt: question?.question ?? null,
        subject: question?.subject ?? null,
        difficulty: question?.difficulty ?? null,
        reportedBy: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        },
        source: flagMeta.source,
        deckTitle: flagMeta.deckTitle || null,
        reason: flagMeta.reason || null,
        note: flagMeta.note || null,
        flaggedAt: flagMeta.flaggedAt || null,
      }));
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `psc-nepal-user-flag-reports-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(
        `Exported ${filteredReports.length} user flag report${filteredReports.length === 1 ? '' : 's'} as JSON.`
      );
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to export user flag reports.')
      );
    }
  }, [filteredReports, flagCountByQuestion]);

  // Admin All User Reports Columns
  const reportColumns = useMemo<ColumnDef<UserSubmittedFlagReport>[]>(() => {
    return [
      {
        id: 'question',
        header: 'Flagged Question',
        sortable: true,
        sortKey: (r) => r.flagMeta.questionId,
        render: ({ flagMeta, question }) => {
          const totalFlags = flagCountByQuestion[flagMeta.questionId] ?? 1;
          return (
            <div className="min-w-[240px] space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Flag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  {flagMeta.questionId}
                </span>
                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300">
                  {totalFlags} {totalFlags === 1 ? 'flag' : 'flags'}
                </span>
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {flagMeta.source}
                </span>
                {question && (
                  <span className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">
                    {question.subject}
                  </span>
                )}
              </div>
              {question ? (
                <p
                  lang={
                    question.subject.trim().toLowerCase() === 'nepali'
                      ? 'ne'
                      : undefined
                  }
                  className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2"
                >
                  {question.question}
                </p>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  Custom or archived question ({flagMeta.deckTitle || 'Deck N/A'})
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: 'reporter',
        header: 'Flagged By',
        width: 'w-48',
        sortable: true,
        sortKey: (r) => r.user.displayName,
        render: ({ user }) => (
          <div className="min-w-0">
            <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100 truncate">
              {user.displayName}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
              {user.email || user.uid}
            </p>
          </div>
        ),
      },
      {
        id: 'reason',
        header: 'Reason for Flagging',
        width: 'w-72',
        sortable: true,
        sortKey: (r) => r.flagMeta.reason || r.flagMeta.note || '',
        render: ({ flagMeta }) => {
          const reasonText = flagMeta.reason?.trim();
          const noteText = flagMeta.note?.trim();
          return (
            <div className="space-y-1 min-w-[200px]">
              {reasonText ? (
                <div className="flex items-start gap-1.5 text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 px-2.5 py-1.5 rounded-lg">
                  <Flag className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium leading-snug">{reasonText}</span>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-400 italic">
                  Legacy flag (no reason entered)
                </span>
              )}
              {noteText && (
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic line-clamp-2 pl-1">
                  Note: {noteText}
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: 'counts',
        header: 'Feedback Counts',
        width: 'w-32',
        hideOnTablet: true,
        render: ({ question }) =>
          question ? (
            <ReactionButtons
              itemId={question.id}
              itemType="question"
              size="xs"
              showViews={false}
              readOnly
            />
          ) : (
            <span className="text-xs text-zinc-400">—</span>
          ),
      },
      {
        id: 'flaggedAt',
        header: 'Flagged At',
        width: 'w-36',
        hideOnMobile: true,
        sortable: true,
        sortKey: (r) => r.flagMeta.flaggedAt || '',
        render: ({ flagMeta }) => (
          <div className="text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-300">
            {flagMeta.flaggedAt
              ? new Date(flagMeta.flaggedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : '—'}
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        width: 'w-32',
        align: 'right',
        render: ({ user, flagMeta, question }) => {
          const totalFlags = flagCountByQuestion[flagMeta.questionId] ?? 1;
          const menuItems: ActionMenuItem[] = [
            ...(question
              ? [
                  {
                    id: 'inspect',
                    label: 'Inspect Question',
                    description: 'Test recall & view official key',
                    icon: Eye,
                    color: 'blue' as const,
                    onClick: () =>
                      handleOpenInspect({
                        question,
                        reason: flagMeta.reason,
                        note: flagMeta.note,
                        flaggedAt: flagMeta.flaggedAt,
                        source: flagMeta.source,
                        reporterName: user.displayName,
                        reporterEmail: user.email,
                        totalFlagsForQuestion: totalFlags,
                      }),
                  },
                ]
              : []),
            {
              id: 'copy-id',
              label: `Copy Code (${flagMeta.questionId})`,
              icon: Copy,
              color: 'zinc',
              onClick: () => {
                void copyWithToast(
                  flagMeta.questionId,
                  `Copied ${flagMeta.questionId} to clipboard.`
                );
              },
            },
          ];

          return (
            <div className="flex items-center justify-end whitespace-nowrap">
              <SharedActionMenu
                items={menuItems}
                label="Actions"
                title={`Inspect flag report for ${flagMeta.questionId}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-56"
                header={flagMeta.questionId}
              />
            </div>
          );
        },
      },
    ];
  }, [flagCountByQuestion, handleOpenInspect]);

  // Filters definition for SharedDataTable
  const filters = useMemo<TableFilterDef[]>(() => {
    return [
      {
        id: 'subject',
        label: 'Subject',
        value: subjectFilter,
        onChange: setSubjectFilter,
        options: [
          { value: 'all', label: 'All Subjects' },
          ...availableSubjects.map((s) => ({ value: s, label: s })),
        ],
      },
      {
        id: 'difficulty',
        label: 'Difficulty',
        value: difficultyFilter,
        onChange: setDifficultyFilter,
        options: [
          { value: 'all', label: 'All Difficulties' },
          { value: 'Easy', label: 'Easy' },
          { value: 'Medium', label: 'Medium' },
          { value: 'Hard', label: 'Hard' },
        ],
      },
      {
        id: 'source',
        label: 'Source',
        value: sourceFilter,
        onChange: setSourceFilter,
        options: [
          { value: 'all', label: 'All Sources' },
          { value: 'quiz', label: 'Quiz Session' },
          { value: 'simulation', label: 'Exam Simulation' },
        ],
      },
      {
        id: 'notes',
        label: 'Reason / Notes',
        value: hasNotesFilter,
        onChange: (v) => setHasNotesFilter(v as typeof hasNotesFilter),
        options: [
          { value: 'all', label: 'All Reports' },
          { value: 'with-notes', label: 'With Reason / Notes' },
          { value: 'without-notes', label: 'Without Reason' },
        ],
      },
    ];
  }, [
    subjectFilter,
    difficultyFilter,
    sourceFilter,
    hasNotesFilter,
    availableSubjects,
  ]);

  const isFiltered =
    subjectFilter !== 'all' ||
    difficultyFilter !== 'all' ||
    sourceFilter !== 'all' ||
    hasNotesFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setSubjectFilter('all');
    setDifficultyFilter('all');
    setSourceFilter('all');
    setHasNotesFilter('all');
  };

  // Summary Metrics
  const uniqueQuestionsCount = useMemo(
    () => Object.keys(flagCountByQuestion).length,
    [flagCountByQuestion]
  );

  const reasonsCount = useMemo(
    () =>
      userSubmittedReports.filter(
        (r) => r.flagMeta.reason?.trim() || r.flagMeta.note?.trim()
      ).length,
    [userSubmittedReports]
  );

  const uniqueReportersCount = useMemo(() => {
    const uids = new Set<string>();
    userSubmittedReports.forEach((r) => uids.add(r.user.uid));
    return uids.size;
  }, [userSubmittedReports]);

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">User Flag Reports</span>
            <Flag className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-crimson-700 dark:text-crimson-400">
            {isUsersLoading ? '—' : userSubmittedReports.length}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Total flags across registered users
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Unique Questions</span>
            <HelpCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {isUsersLoading ? '—' : uniqueQuestionsCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Distinct bank questions flagged
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">With Flag Reasons</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {isUsersLoading ? '—' : reasonsCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Submitted reasons &amp; review notes
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Reporting Candidates</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isUsersLoading ? '—' : uniqueReportersCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Unique accounts reporting issues
          </p>
        </div>
      </div>

      <SharedDataTable<UserSubmittedFlagReport>
        data={filteredReports}
        columns={reportColumns}
        filters={filters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by user name, email, question ID, stem, or flag reason..."
        keyExtractor={(item) => item.reportId}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        title="Submitted User Flag Reports (Firestore)"
        subtitle="Read-only audit queue of question flags, aggregate flag counts, and reasons submitted by aspirants"
        actions={
          <SharedActionMenu
            label="Actions"
            icon={Sparkles}
            items={[
              {
                id: 'export',
                label: 'Export Flag Reports (JSON)',
                description: 'Download JSON snapshot of current flag reports',
                icon: FileDown,
                color: 'blue',
                disabled: filteredReports.length === 0,
                onClick: handleExportReportsJson,
              },
            ]}
            color="zinc"
            variant="outline"
            size="sm"
            header="Flag Report Tools"
          />
        }
        emptyMessage={
          isUsersLoading
            ? 'Loading user flag reports from Firestore...'
            : 'No User Flag Reports Submitted Yet'
        }
        emptyDescription="When aspirants flag a question during an Objective Quiz or OMR Simulation and submit a reason, their report and count appear here in real time."
        emptyAction={
          <ActionButton
            label="Browse Question Bank"
            title="Open MCQ question bank directory"
            icon={HelpCircle}
            color="blue"
            variant="solid"
            size="sm"
            to="/dashboard/quiz-bank"
          />
        }
      />

      {/* Inspect Modal */}
      {inspectContext && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-dialog-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {inspectContext.question.id}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300">
                    <Flag className="w-3 h-3" />
                    {inspectContext.totalFlagsForQuestion}{' '}
                    {inspectContext.totalFlagsForQuestion === 1 ? 'flag' : 'flags'}
                  </span>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    {inspectContext.question.subject}
                  </span>
                  <span className="text-xs text-zinc-400">·</span>
                  <span className="text-xs text-zinc-500">
                    {inspectContext.question.topic}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      inspectContext.question.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : inspectContext.question.difficulty === 'Hard'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {inspectContext.question.difficulty}
                  </span>
                </div>
                <h3
                  id="inspect-dialog-title"
                  lang={
                    inspectContext.question.subject.trim().toLowerCase() === 'nepali'
                      ? 'ne'
                      : undefined
                  }
                  className="font-serif font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 pt-1"
                >
                  {inspectContext.question.question}
                </h3>
                {isBilingualQuizQuestion(inspectContext.question) &&
                  inspectContext.question.questionNe?.trim() && (
                    <p
                      lang="ne"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1"
                    >
                      {inspectContext.question.questionNe}
                    </p>
                  )}
              </div>
              <button
                type="button"
                onClick={() => setInspectContext(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submitted Flag Reason & Reporter Callout */}
            {(inspectContext.reason?.trim() ||
              inspectContext.note?.trim() ||
              inspectContext.reporterName) && (
              <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-900/60 space-y-1 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-amber-800 dark:text-amber-300">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Flag className="w-3.5 h-3.5" />
                    Flag Reason
                    {inspectContext.reporterName
                      ? ` · Reported by ${inspectContext.reporterName}${inspectContext.reporterEmail ? ` (${inspectContext.reporterEmail})` : ''}`
                      : ''}
                  </span>
                  {inspectContext.flaggedAt && (
                    <span>
                      {new Date(inspectContext.flaggedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {inspectContext.reason?.trim() && (
                  <p className="text-amber-950 dark:text-amber-100 font-medium">
                    {inspectContext.reason}
                  </p>
                )}
                {inspectContext.note?.trim() && (
                  <p className="text-amber-900/80 dark:text-amber-200/80 italic">
                    Candidate Note: {inspectContext.note}
                  </p>
                )}
              </div>
            )}

            {/* Test Interactive Recall Options */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Select an option to verify key accuracy:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectContext.question.options.map((opt) => {
                  const isPicked = testSelectedOption === opt.key;
                  const isCorrect =
                    inspectContext.question.correct_options.includes(opt.key);
                  const showFeedback = testSelectedOption !== null;
                  const showBilingual = isBilingualQuizQuestion(
                    inspectContext.question
                  );
                  const optNe =
                    showBilingual &&
                    opt.textNe &&
                    opt.textNe.trim() !== opt.text.trim()
                      ? opt.textNe.trim()
                      : undefined;
                  const isParagraph =
                    opt.text.length > 50 ||
                    (optNe
                      ? optNe.length > 50 || opt.text.length + optNe.length > 65
                      : false) ||
                    opt.text.includes('\n') ||
                    Boolean(optNe?.includes('\n'));

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setTestSelectedOption(opt.key)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                        isParagraph ? 'sm:col-span-2' : 'sm:col-span-1'
                      } ${
                        showFeedback && isCorrect
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium'
                          : showFeedback && isPicked && !isCorrect
                            ? 'border-red-500 bg-red-50/70 dark:bg-red-950/40 text-red-950 dark:text-red-100'
                            : isPicked
                              ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="font-mono font-bold shrink-0 w-5">
                        {opt.key}.
                      </span>
                      <span
                        lang={
                          inspectContext.question.subject
                            .trim()
                            .toLowerCase() === 'nepali'
                            ? 'ne'
                            : undefined
                        }
                        className="flex-1 min-w-0 break-words leading-snug"
                      >
                        <span className="block">{opt.text}</span>
                        {optNe && (
                          <span
                            lang="ne"
                            className="block text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-snug"
                          >
                            {optNe}
                          </span>
                        )}
                      </span>
                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-auto" />
                      )}
                      {showFeedback && isPicked && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation & Source Citation */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Official Rationale &amp; Citation:
              </p>
              <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <p
                  lang={
                    inspectContext.question.subject.trim().toLowerCase() ===
                    'nepali'
                      ? 'ne'
                      : undefined
                  }
                >
                  {inspectContext.question.explanation}
                </p>
                {isBilingualQuizQuestion(inspectContext.question) &&
                  inspectContext.question.explanationNe?.trim() && (
                    <p
                      lang="ne"
                      className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 text-zinc-600 dark:text-zinc-400"
                    >
                      {inspectContext.question.explanationNe}
                    </p>
                  )}
              </div>
              {inspectContext.question.sourceTitle && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Source Document: {inspectContext.question.sourceTitle}
                </p>
              )}
            </div>

            {/* Modal Actions (Count-only reactions) */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <ReactionButtons
                itemId={inspectContext.question.id}
                itemType="question"
                size="sm"
                showLabels
                showViews={false}
                readOnly
              />
              <ActionButton
                label="Done"
                title="Close inspection dialog"
                variant="solid"
                color="zinc"
                size="sm"
                onClick={() => setInspectContext(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
