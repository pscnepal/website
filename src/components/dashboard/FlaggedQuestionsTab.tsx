import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Eye,
  FileDown,
  Flag,
  HelpCircle,
  Sparkles,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import {
  isBilingualQuizQuestion,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';
import {
  storageService,
  type FlaggedQuestionRecord,
} from '../../services/storageService';
import type {
  CloudUserDirectoryEntry,
  CloudUserFlaggedQuestionSummary,
} from '../../services/cloudSyncService';
import { useAuth } from '../../context/AuthContext';
import { useDashboardUsers } from '../../context/DashboardUsersContext';
import { ActionButton } from '../common/ActionButton';
import {
  SharedActionMenu,
  type ActionMenuItem,
} from '../common/SharedActionMenu';
import { ReactionButtons } from '../common/ReactionButtons';
import {
  SharedDataTable,
  type ColumnDef,
  type TableFilterDef,
} from '../common/SharedDataTable';
import { useDashboardSearch } from './DashboardLayout';
import { toast } from '../../services/toastService';
import { copyWithToast } from '../../utils/clipboardHelpers';
import { formatUserFriendlyError } from '../../utils/errorHelpers';

export interface EnrichedFlaggedQuestion {
  question: QuizQuestion;
  flagMeta: FlaggedQuestionRecord;
}

export interface UserSubmittedFlagReport {
  reportId: string;
  user: CloudUserDirectoryEntry;
  flagMeta: CloudUserFlaggedQuestionSummary;
  question: QuizQuestion | null;
}

interface InspectContext {
  question: QuizQuestion;
  reason?: string;
  note?: string;
  flaggedAt?: string;
  source?: string;
  reporterName?: string;
  reporterEmail?: string;
}

export function FlaggedQuestionsTab() {
  const dispatch = useAppDispatch();
  const { isDashboardAdmin } = useAuth();
  const { users: directoryUsers, isLoading: isUsersLoading } =
    useDashboardUsers();

  // State
  const [activeTab, setActiveTab] = useState<'reports' | 'personal'>(() =>
    isDashboardAdmin ? 'reports' : 'personal'
  );
  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const [flaggedMap, setFlaggedMap] = useState<Record<string, FlaggedQuestionRecord>>(() =>
    storageService.loadFlaggedQuestions()
  );
  const { searchQuery, setSearchQuery } = useDashboardSearch();
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [hasNotesFilter, setHasNotesFilter] = useState<'all' | 'with-notes' | 'without-notes'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [inspectContext, setInspectContext] = useState<InspectContext | null>(
    null
  );
  const [testSelectedOption, setTestSelectedOption] = useState<QuizOptionKey | null>(null);
  const [noteEditQuestion, setNoteEditQuestion] = useState<EnrichedFlaggedQuestion | null>(null);
  const [reasonDraft, setReasonDraft] = useState('');
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    if (!isDashboardAdmin && activeTab === 'reports') {
      setActiveTab('personal');
    }
  }, [isDashboardAdmin, activeTab]);

  // Sync with global flag & question bank changes
  useEffect(() => {
    const handleFlagChange = () => {
      setFlaggedMap(storageService.loadFlaggedQuestions());
    };
    const handleBankChange = () => {
      setQuestionBank(questionStorageService.loadQuizQuestions());
    };
    window.addEventListener('psc_flagged_questions_changed', handleFlagChange);
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleBankChange);
    window.addEventListener('storage', handleFlagChange);
    window.addEventListener('storage', handleBankChange);
    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleFlagChange);
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleBankChange);
      window.removeEventListener('storage', handleFlagChange);
      window.removeEventListener('storage', handleBankChange);
    };
  }, []);

  // Aggregate user-submitted flag reports from Firestore for verified admin
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

  // Map question bank with personal flagged records
  const enrichedQuestions = useMemo<EnrichedFlaggedQuestion[]>(() => {
    const list: EnrichedFlaggedQuestion[] = [];
    for (const [qId, meta] of Object.entries(flaggedMap)) {
      const q = questionBank.find((item) => item.id === qId);
      if (q) {
        list.push({ question: q, flagMeta: meta });
      }
    }
    // Newest flagged first by default
    return list.sort(
      (a, b) =>
        new Date(b.flagMeta.flaggedAt).getTime() -
        new Date(a.flagMeta.flaggedAt).getTime()
    );
  }, [flaggedMap, questionBank]);

  // Extract unique subjects among flagged items
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    enrichedQuestions.forEach(({ question }) => {
      if (question.subject) set.add(question.subject);
    });
    userSubmittedReports.forEach(({ question }) => {
      if (question?.subject) set.add(question.subject);
    });
    return Array.from(set).sort();
  }, [enrichedQuestions, userSubmittedReports]);

  // Filter personal flagged questions
  const filteredQuestions = useMemo(() => {
    return enrichedQuestions.filter(({ question, flagMeta }) => {
      if (subjectFilter !== 'all' && question.subject !== subjectFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && question.difficulty !== difficultyFilter) {
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
        const showBilingual = isBilingualQuizQuestion(question);
        const matchesPrompt =
          question.question.toLowerCase().includes(query) ||
          (showBilingual &&
            (question.questionNe ?? '').toLowerCase().includes(query));
        const matchesId = question.id.toLowerCase().includes(query);
        const matchesTopic = (question.topic + ' ' + question.subtopic).toLowerCase().includes(query);
        const matchesReason = (flagMeta.reason || '').toLowerCase().includes(query);
        const matchesNote = (flagMeta.note || '').toLowerCase().includes(query);
        const matchesOptions = question.options.some(
          (opt) =>
            opt.text.toLowerCase().includes(query) ||
            (showBilingual && (opt.textNe ?? '').toLowerCase().includes(query))
        );
        const matchesExplanation =
          question.explanation.toLowerCase().includes(query) ||
          (showBilingual &&
            (question.explanationNe ?? '').toLowerCase().includes(query));
        return (
          matchesPrompt ||
          matchesId ||
          matchesTopic ||
          matchesReason ||
          matchesNote ||
          matchesOptions ||
          matchesExplanation
        );
      }
      return true;
    });
  }, [
    enrichedQuestions,
    searchQuery,
    subjectFilter,
    difficultyFilter,
    sourceFilter,
    hasNotesFilter,
  ]);

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
            ((question?.questionNe ?? '').toLowerCase().includes(query)));
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

  // Actions
  const handleRemoveFlag = useCallback((questionId: string) => {
    storageService.removeFlaggedQuestion(questionId);
    setFlaggedMap(storageService.loadFlaggedQuestions());
    toast.info(`Removed flag from ${questionId}.`);
  }, []);

  const handleClearAll = useCallback(() => {
    if (enrichedQuestions.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to clear all ${enrichedQuestions.length} flagged questions? This cannot be undone.`
      )
    ) {
      storageService.clearAllFlaggedQuestions();
      setFlaggedMap({});
      toast.info('Cleared all flagged questions.');
    }
  }, [enrichedQuestions.length]);

  const handlePreloadSamples = useCallback(() => {
    const sampleReasons: Record<string, string> = {
      'PSC-GEO-101': 'Needs revision / difficult concept',
      'PSC-CON-201': 'Want to verify exact constitutional article citation',
      'PSC-ADM-301': 'Confusing statutory deadline details',
      'PSC-LANG-110': 'Tricky Nepali grammar exception to review before exam',
    };
    const sampleIds = Object.keys(sampleReasons);
    let added = 0;
    sampleIds.forEach((id) => {
      const q = questionBank.find((item) => item.id === id);
      if (q) {
        storageService.flagQuestionWithReason(id, {
          source: 'quiz',
          deckTitle: `${q.subject} High Yield`,
          reason: sampleReasons[id],
          note: `High-yield candidate review priority for ${q.subject}.`,
        });
        added += 1;
      }
    });
    setFlaggedMap(storageService.loadFlaggedQuestions());
    if (added > 0) {
      toast.success(`Added ${added} sample flagged questions with reasons.`);
    }
  }, [questionBank]);

  const handleCopyQuestion = useCallback((q: QuizQuestion) => {
    const showBilingual = isBilingualQuizQuestion(q);
    const questionPart =
      showBilingual && q.questionNe?.trim()
        ? `${q.question}\n${q.questionNe}`
        : q.question;
    const optionsPart = q.options
      .map((o) =>
        showBilingual && o.textNe && o.textNe.trim() !== o.text.trim()
          ? `${o.key}. ${o.text} (${o.textNe})`
          : `${o.key}. ${o.text}`
      )
      .join('\n');
    const explanationPart =
      showBilingual && q.explanationNe?.trim()
        ? `${q.explanation}\n${q.explanationNe}`
        : q.explanation;

    const text = `Q (${q.id}): ${questionPart}\n${optionsPart}\nAnswer: ${q.correct_options.join(', ')}\nExplanation: ${explanationPart}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(q.id);
        toast.success(`Copied ${q.id} to clipboard.`);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        toast.error('Clipboard access was denied by your browser.');
      });
  }, []);

  const handleExportDeck = useCallback(() => {
    if (enrichedQuestions.length === 0) return;
    try {
      const payload = enrichedQuestions.map(({ question, flagMeta }) => {
        const showBilingual = isBilingualQuizQuestion(question);
        return {
          id: question.id,
          question: question.question,
          ...(showBilingual && question.questionNe
            ? { questionNe: question.questionNe }
            : {}),
          subject: question.subject,
          topic: question.topic,
          difficulty: question.difficulty,
          options: question.options,
          correct_options: question.correct_options,
          explanation: question.explanation,
          ...(showBilingual && question.explanationNe
            ? { explanationNe: question.explanationNe }
            : {}),
          flaggedAt: flagMeta.flaggedAt,
          source: flagMeta.source,
          flagReason: flagMeta.reason || null,
          userNote: flagMeta.note || null,
        };
      });
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `psc-nepal-flagged-questions-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(
        `Exported ${enrichedQuestions.length} flagged questions as JSON.`
      );
    } catch (err) {
      toast.error(
        formatUserFriendlyError(err, 'Failed to export flagged questions.')
      );
    }
  }, [enrichedQuestions]);

  const handleOpenInspect = useCallback(
    (ctx: InspectContext) => {
      setInspectContext(ctx);
      setTestSelectedOption(null);
      dispatch(recordView({ itemId: ctx.question.id, itemType: 'question' }));
    },
    [dispatch]
  );

  const handleSaveNote = () => {
    if (!noteEditQuestion) return;
    const cleanReason = reasonDraft.trim();
    if (!cleanReason) {
      toast.warning('Please enter a reason for flagging this question.');
      return;
    }
    storageService.updateFlaggedQuestionDetails(noteEditQuestion.question.id, {
      reason: cleanReason,
      note: noteDraft.trim(),
    });
    setFlaggedMap(storageService.loadFlaggedQuestions());
    toast.success(`Updated flag reason & note for ${noteEditQuestion.question.id}.`);
    setNoteEditQuestion(null);
  };

  // Table Columns
  const columns = useMemo<ColumnDef<EnrichedFlaggedQuestion>[]>(() => {
    return [
      {
        id: 'code',
        header: 'Code / Flagged',
        width: 'w-36',
        sortable: true,
        sortKey: (item) => item.flagMeta.flaggedAt,
        render: ({ question, flagMeta }) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {question.id}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span
                className={`px-1 rounded text-[9px] font-semibold uppercase ${
                  flagMeta.source === 'simulation'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                }`}
              >
                {flagMeta.source || 'Quiz'}
              </span>
              <span>
                {new Date(flagMeta.flaggedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'question',
        header: 'Question Prompt',
        sortable: true,
        sortKey: (item) => item.question.question,
        render: ({ question, flagMeta }) => (
          <div className="min-w-[260px] space-y-1">
            <p
              lang={question.subject.trim().toLowerCase() === 'nepali' ? 'ne' : undefined}
              className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2"
            >
              {question.question}
            </p>
            {isBilingualQuizQuestion(question) && question.questionNe?.trim() && (
              <p
                lang="ne"
                className="text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-1"
              >
                {question.questionNe}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="font-mono">
                {question.options.length} options · +{question.marks.toFixed(2)}M
              </span>
              {flagMeta.deckTitle && (
                <span className="truncate max-w-[180px] text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {flagMeta.deckTitle}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        id: 'reason',
        header: 'Flag Reason & Notes',
        width: 'w-64',
        sortable: true,
        sortKey: (item) =>
          item.flagMeta.reason || item.flagMeta.note || '',
        render: ({ flagMeta }) => {
          const reasonText = flagMeta.reason?.trim();
          const noteText = flagMeta.note?.trim();
          return (
            <div className="space-y-1.5 min-w-[190px]">
              {reasonText ? (
                <div className="flex items-start gap-1.5 text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 px-2.5 py-1.5 rounded-lg">
                  <Flag className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span className="line-clamp-2 font-medium leading-snug">
                    {reasonText}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-400 italic">
                  No reason specified
                </span>
              )}
              {noteText && (
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 italic pl-1">
                  Note: {noteText}
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: 'subject',
        header: 'Subject & Topic',
        width: 'w-40',
        hideOnMobile: true,
        sortable: true,
        sortKey: (item) => item.question.subject,
        render: ({ question }) => (
          <div className="text-xs space-y-0.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
              {question.subject}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate">
              {question.topic}
            </span>
          </div>
        ),
      },
      {
        id: 'answer',
        header: 'Key / Answer',
        width: 'w-36',
        hideOnMobile: true,
        render: ({ question }) => {
          const showBilingual = isBilingualQuizQuestion(question);
          return (
            <div className="space-y-1 text-xs">
              <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3 h-3" />
                Opt {question.correct_options.join(', ')}
              </span>
              <p
                lang={question.subject.trim().toLowerCase() === 'nepali' ? 'ne' : undefined}
                className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1"
              >
                {question.options
                  .filter((o) => question.correct_options.includes(o.key))
                  .map((o) =>
                    showBilingual && o.textNe && o.textNe.trim() !== o.text.trim()
                      ? `${o.text} (${o.textNe})`
                      : o.text
                  )
                  .join('; ')}
              </p>
            </div>
          );
        },
      },
      {
        id: 'difficulty',
        header: 'Difficulty',
        width: 'w-24',
        hideOnTablet: true,
        sortable: true,
        sortKey: (item) =>
          item.question.difficulty === 'Easy'
            ? 1
            : item.question.difficulty === 'Medium'
              ? 2
              : 3,
        render: ({ question }) => (
          <span
            className={`font-mono text-[11px] font-semibold ${
              question.difficulty === 'Easy'
                ? 'text-emerald-700 dark:text-emerald-400'
                : question.difficulty === 'Hard'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {question.difficulty}
          </span>
        ),
      },
      {
        id: 'reactions',
        header: 'Feedback',
        width: 'w-24',
        hideOnTablet: true,
        render: ({ question }) => (
          <ReactionButtons
            itemId={question.id}
            size="xs"
            showViews={false}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Review Actions',
        width: 'w-44',
        render: (item) => {
          const { question } = item;
          const isCopied = copiedId === question.id;

          const menuItems: ActionMenuItem[] = [
            {
              id: 'inspect',
              label: 'Inspect & Rationale',
              description: 'Review options, reason & official explanation',
              icon: Eye,
              color: 'blue',
              onClick: () =>
                handleOpenInspect({
                  question,
                  reason: item.flagMeta.reason,
                  note: item.flagMeta.note,
                  flaggedAt: item.flagMeta.flaggedAt,
                  source: item.flagMeta.source,
                }),
            },
            {
              id: 'note',
              label: 'Edit Reason & Note',
              description: 'Update flag reason or personal study note',
              icon: Edit3,
              color: 'amber',
              onClick: () => {
                setNoteEditQuestion(item);
                setReasonDraft(item.flagMeta.reason || '');
                setNoteDraft(item.flagMeta.note || '');
              },
            },
            {
              id: 'copy',
              label: isCopied ? 'Question Copied!' : 'Copy Question Stem',
              description: 'Copy prompt, options and official key',
              icon: isCopied ? Check : Copy,
              color: 'zinc',
              onClick: () => handleCopyQuestion(question),
              divider: true,
            },
            {
              id: 'unflag',
              label: 'Remove from Flagged',
              description: 'Mark question as reviewed and unflag',
              icon: BookmarkCheck,
              color: 'crimson',
              onClick: () => handleRemoveFlag(question.id),
            },
          ];

          return (
            <div className="flex items-center justify-end whitespace-nowrap">
              <SharedActionMenu
                items={menuItems}
                label="Actions"
                title={`Actions for question ${question.id}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-56"
                header={`Question ${question.id}`}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId, handleCopyQuestion, handleOpenInspect, handleRemoveFlag]);

  // Admin All User Reports Columns
  const reportColumns = useMemo<ColumnDef<UserSubmittedFlagReport>[]>(() => {
    return [
      {
        id: 'question',
        header: 'Flagged Question',
        sortable: true,
        sortKey: (r) => r.flagMeta.questionId,
        render: ({ flagMeta, question }) => (
          <div className="min-w-[240px] space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Flag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                {flagMeta.questionId}
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
        ),
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
  }, [handleOpenInspect]);

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
          { value: 'dashboard', label: 'Question Bank' },
        ],
      },
      {
        id: 'notes',
        label: 'Reason / Notes',
        value: hasNotesFilter,
        onChange: (v) => setHasNotesFilter(v as typeof hasNotesFilter),
        options: [
          { value: 'all', label: 'All Questions' },
          { value: 'with-notes', label: 'With Reason / Notes' },
          { value: 'without-notes', label: 'Without Reason' },
        ],
      },
    ];
  }, [subjectFilter, difficultyFilter, sourceFilter, hasNotesFilter, availableSubjects]);

  // Header quick action items
  const headerActionItems = useMemo<ActionMenuItem[]>(() => {
    return [
      {
        id: 'export',
        label: 'Export Flagged JSON',
        description: 'Download offline study dossier',
        icon: FileDown,
        color: 'blue',
        disabled: enrichedQuestions.length === 0,
        onClick: handleExportDeck,
      },
      {
        id: 'preload',
        label: 'Pre-load Sample Flags',
        description: 'Add 4 high-yield representative questions',
        icon: Sparkles,
        color: 'purple',
        onClick: handlePreloadSamples,
        divider: true,
      },
      {
        id: 'clear',
        label: 'Clear All Flags',
        description: 'Reset flagged status across all questions',
        icon: Trash2,
        color: 'crimson',
        disabled: enrichedQuestions.length === 0,
        onClick: handleClearAll,
      },
    ];
  }, [enrichedQuestions.length, handleExportDeck, handlePreloadSamples, handleClearAll]);

  // Summary Metrics
  const hardCount = useMemo(
    () =>
      enrichedQuestions.filter((q) => q.question.difficulty === 'Hard').length,
    [enrichedQuestions]
  );
  const reasonsCount = useMemo(() => {
    if (isDashboardAdmin && activeTab === 'reports') {
      return userSubmittedReports.filter(
        (r) => r.flagMeta.reason?.trim() || r.flagMeta.note?.trim()
      ).length;
    }
    return enrichedQuestions.filter(
      (q) => q.flagMeta.reason?.trim() || q.flagMeta.note?.trim()
    ).length;
  }, [isDashboardAdmin, activeTab, userSubmittedReports, enrichedQuestions]);

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">My Flagged Queue</span>
            <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {enrichedQuestions.length}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Saved from Quiz &amp; OMR sessions
          </p>
        </div>

        {isDashboardAdmin ? (
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">User Flag Reports</span>
              <Users className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
            </div>
            <p className="font-mono tabular-nums text-2xl font-bold text-crimson-700 dark:text-crimson-400">
              {isUsersLoading ? '—' : userSubmittedReports.length}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Across all registered accounts
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">High Difficulty</span>
              <span className="w-2 h-2 rounded-full bg-red-500" />
            </div>
            <p className="font-mono tabular-nums text-2xl font-bold text-red-600 dark:text-red-400">
              {hardCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Challenging questions requiring recall
            </p>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">With Flag Reasons</span>
            <Flag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {reasonsCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Submitted reasons &amp; study notes
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Verified Rationale</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {enrichedQuestions.filter((q) => q.question.explanation).length}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Detailed citations attached
          </p>
        </div>
      </div>

      {/* Admin View Switcher between User Reports & Personal Flagged Queue */}
      {isDashboardAdmin && (
        <div
          role="tablist"
          aria-label="Flagged questions view"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'reports'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-crimson-600 dark:text-crimson-400" />
            <span>
              User Flag Reports ({isUsersLoading ? '…' : userSubmittedReports.length})
            </span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'personal'}
            onClick={() => setActiveTab('personal')}
            className={`px-3.5 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'personal'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>My Flagged Queue ({enrichedQuestions.length})</span>
          </button>
        </div>
      )}

      {isDashboardAdmin && activeTab === 'reports' ? (
        <SharedDataTable<UserSubmittedFlagReport>
          data={filteredReports}
          columns={reportColumns}
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by user name, email, question ID, stem, or flag reason..."
          keyExtractor={(item) => item.reportId}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          title="Submitted User Flag Reports (Firestore)"
          subtitle="All question flags and user-entered reasons submitted across registered accounts"
          emptyMessage={
            isUsersLoading
              ? 'Loading user flag reports from Firestore...'
              : 'No User Flag Reports Submitted Yet'
          }
          emptyDescription="When aspirants flag a question during an Objective Quiz or OMR Simulation and submit a reason, their report appears here in real time."
          emptyAction={
            enrichedQuestions.length > 0 ? (
              <ActionButton
                label="View My Flagged Queue"
                title="Switch to personal flagged queue"
                icon={Bookmark}
                color="amber"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('personal')}
              />
            ) : undefined
          }
        />
      ) : (
        <SharedDataTable<EnrichedFlaggedQuestion>
          data={filteredQuestions}
          columns={columns}
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search flagged questions by prompt, topic, reason, note, or options..."
          keyExtractor={(item) => item.question.id}
          defaultPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          title="Flagged Questions Registry"
          actions={
            <SharedActionMenu
              label="Actions"
              icon={Sparkles}
              items={headerActionItems}
              color="zinc"
              variant="outline"
              size="sm"
              header="Flagged Review Tools"
            />
          }
          emptyMessage="No Flagged Questions in Registry"
          emptyDescription="During any Objective Quiz or OMR Exam Simulation, press F or tap the Flag for Review button and enter a reason. They will appear here."
          emptyAction={
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <ActionButton
                label="Pre-load Sample Flags"
                title="Pre-populate 4 representative questions to test review workflow"
                icon={Sparkles}
                color="blue"
                variant="outline"
                size="sm"
                onClick={handlePreloadSamples}
              />
              <ActionButton
                label="Browse Question Bank"
                title="Open full question bank directory"
                icon={HelpCircle}
                color="blue"
                variant="solid"
                size="sm"
                to="/dashboard/quiz-bank"
              />
            </div>
          }
        />
      )}

      {/* Inspect & Test Interactive Recall Modal */}
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
                    Personal Note: {inspectContext.note}
                  </p>
                )}
              </div>
            )}

            {/* Test Interactive Recall Options with Responsive Flexible Layout */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Select an option to test your recall:
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

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <ReactionButtons
                itemId={inspectContext.question.id}
                size="sm"
                showViews={false}
              />
              <div className="flex items-center gap-2">
                {Boolean(flaggedMap[inspectContext.question.id]) && (
                  <ActionButton
                    label="Remove Flag"
                    title="Remove this question from my flagged review queue"
                    icon={BookmarkCheck}
                    color="crimson"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleRemoveFlag(inspectContext.question.id);
                      setInspectContext(null);
                    }}
                  />
                )}
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
        </div>
      )}

      {/* Reason & Note Editor Modal */}
      {noteEditQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="note-dialog-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="note-dialog-title"
                  className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100"
                >
                  Edit Flag Reason &amp; Study Note
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  {noteEditQuestion.question.id} · {noteEditQuestion.question.subject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNoteEditQuestion(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 space-y-1">
              <p
                lang={
                  noteEditQuestion.question.subject.trim().toLowerCase() === 'nepali'
                    ? 'ne'
                    : undefined
                }
                className="font-serif line-clamp-2"
              >
                {noteEditQuestion.question.question}
              </p>
              {isBilingualQuizQuestion(noteEditQuestion.question) &&
                noteEditQuestion.question.questionNe?.trim() && (
                  <p lang="ne" className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {noteEditQuestion.question.questionNe}
                  </p>
                )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="flag-reason-edit-input"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block"
              >
                Reason for flagging <span className="text-crimson-600">*</span>
              </label>
              <textarea
                id="flag-reason-edit-input"
                rows={2}
                maxLength={500}
                value={reasonDraft}
                onChange={(e) => setReasonDraft(e.target.value)}
                placeholder="e.g., Needs revision / difficult concept, Suspected wrong answer key, etc."
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="revision-note-input"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block"
              >
                Personal Study Mnemonic / Note (Optional)
              </label>
              <textarea
                id="revision-note-input"
                rows={3}
                maxLength={1000}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="e.g., Don't confuse Section 20 amassing disproportionate wealth with Section 19 document forgery; 35-day deadline to appeal."
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <ActionButton
                label="Cancel"
                title="Discard changes"
                variant="outline"
                color="zinc"
                size="sm"
                onClick={() => setNoteEditQuestion(null)}
              />
              <ActionButton
                label="Save Changes"
                title="Save flag reason and note for this question"
                icon={Check}
                variant="solid"
                color="blue"
                size="sm"
                onClick={handleSaveNote}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
