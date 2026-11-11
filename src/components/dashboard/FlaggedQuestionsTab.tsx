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
  Play,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import {
  ALL_QUIZ_QUESTIONS,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import {
  storageService,
  type FlaggedQuestionRecord,
} from '../../services/storageService';
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

export interface EnrichedFlaggedQuestion {
  question: QuizQuestion;
  flagMeta: FlaggedQuestionRecord;
}

export function FlaggedQuestionsTab() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State
  const [flaggedMap, setFlaggedMap] = useState<Record<string, FlaggedQuestionRecord>>(() =>
    storageService.loadFlaggedQuestions()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [hasNotesFilter, setHasNotesFilter] = useState<'all' | 'with-notes' | 'without-notes'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [inspectQuestion, setInspectQuestion] = useState<QuizQuestion | null>(null);
  const [testSelectedOption, setTestSelectedOption] = useState<QuizOptionKey | null>(null);
  const [noteEditQuestion, setNoteEditQuestion] = useState<EnrichedFlaggedQuestion | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Sync with global flag changes
  useEffect(() => {
    const handleFlagChange = () => {
      setFlaggedMap(storageService.loadFlaggedQuestions());
    };
    window.addEventListener('psc_flagged_questions_changed', handleFlagChange);
    window.addEventListener('storage', handleFlagChange);
    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleFlagChange);
      window.removeEventListener('storage', handleFlagChange);
    };
  }, []);

  // Map question bank with flagged records
  const enrichedQuestions = useMemo<EnrichedFlaggedQuestion[]>(() => {
    const list: EnrichedFlaggedQuestion[] = [];
    for (const [qId, meta] of Object.entries(flaggedMap)) {
      const q = ALL_QUIZ_QUESTIONS.find((item) => item.id === qId);
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
  }, [flaggedMap]);

  // Extract unique subjects among flagged items
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    enrichedQuestions.forEach(({ question }) => {
      if (question.subject) set.add(question.subject);
    });
    return Array.from(set).sort();
  }, [enrichedQuestions]);

  // Filter enriched questions
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
      if (hasNotesFilter === 'with-notes' && !flagMeta.note?.trim()) {
        return false;
      }
      if (hasNotesFilter === 'without-notes' && flagMeta.note?.trim()) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPrompt = question.question.toLowerCase().includes(query);
        const matchesId = question.id.toLowerCase().includes(query);
        const matchesTopic = (question.topic + ' ' + question.subtopic).toLowerCase().includes(query);
        const matchesNote = (flagMeta.note || '').toLowerCase().includes(query);
        const matchesOptions = question.options.some((opt) =>
          opt.text.toLowerCase().includes(query)
        );
        return matchesPrompt || matchesId || matchesTopic || matchesNote || matchesOptions;
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

  // Actions
  const handleRemoveFlag = useCallback((questionId: string) => {
    storageService.removeFlaggedQuestion(questionId);
    setFlaggedMap(storageService.loadFlaggedQuestions());
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
    }
  }, [enrichedQuestions.length]);

  const handlePreloadSamples = useCallback(() => {
    const sampleIds = ['so-gk-001', 'so-const-001', 'so-adm-001', 'so-iq-001'];
    sampleIds.forEach((id) => {
      const q = ALL_QUIZ_QUESTIONS.find((item) => item.id === id);
      if (q) {
        storageService.toggleFlaggedQuestion(id, {
          source: 'quiz',
          deckTitle: `${q.subject} High Yield`,
          note: `High-yield candidate review priority for ${q.subject}.`,
        });
      }
    });
    setFlaggedMap(storageService.loadFlaggedQuestions());
  }, []);

  const handleCopyQuestion = useCallback((q: QuizQuestion) => {
    const text = `Q (${q.id}): ${q.question}\n${q.options
      .map((o) => `${o.key}. ${o.text}`)
      .join('\n')}\nAnswer: ${q.correct_options.join(', ')}\nExplanation: ${q.explanation}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const handleExportDeck = useCallback(() => {
    if (enrichedQuestions.length === 0) return;
    const payload = enrichedQuestions.map(({ question, flagMeta }) => ({
      id: question.id,
      question: question.question,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      options: question.options,
      correct_options: question.correct_options,
      explanation: question.explanation,
      flaggedAt: flagMeta.flaggedAt,
      source: flagMeta.source,
      userNote: flagMeta.note || null,
    }));
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
  }, [enrichedQuestions]);

  const handleOpenInspect = (q: QuizQuestion) => {
    setSelectedQuestionInspect(q);
    dispatch(recordView({ itemId: q.id }));
  };

  const setSelectedQuestionInspect = (q: QuizQuestion) => {
    setInspectQuestion(q);
    setTestSelectedOption(null);
  };

  const handleSaveNote = () => {
    if (!noteEditQuestion) return;
    storageService.updateFlaggedQuestionNote(
      noteEditQuestion.question.id,
      noteDraft.trim()
    );
    setFlaggedMap(storageService.loadFlaggedQuestions());
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
            <p className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2">
              {question.question}
            </p>
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
            {flagMeta.note && (
              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 px-2 py-1 rounded-md">
                <Edit3 className="w-3 h-3 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <span className="line-clamp-2 italic">{flagMeta.note}</span>
              </div>
            )}
          </div>
        ),
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
        render: ({ question }) => (
          <div className="space-y-1 text-xs">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <Check className="w-3 h-3" />
              Opt {question.correct_options.join(', ')}
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {question.options
                .filter((o) => question.correct_options.includes(o.key))
                .map((o) => o.text)
                .join('; ')}
            </p>
          </div>
        ),
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
              label: 'Practice / Inspect',
              description: 'Interactive recall tester & explanation',
              icon: Eye,
              color: 'blue',
              onClick: () => handleOpenInspect(question),
            },
            {
              id: 'note',
              label: item.flagMeta.note ? 'Edit Revision Note' : 'Add Revision Note',
              description: 'Attach personal study tip or memory hook',
              icon: Edit3,
              color: 'amber',
              onClick: () => {
                setNoteEditQuestion(item);
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
            <div className="flex items-center gap-1.5 justify-end">
              <ActionButton
                label="Practice"
                title={`Practice & test recall for ${question.id}`}
                icon={Eye}
                size="xs"
                variant="outline"
                color="blue"
                onClick={() => handleOpenInspect(question)}
              />
              <SharedActionMenu
                items={menuItems}
                variant="ghost"
                size="xs"
                color="zinc"
                align="right"
                width="w-56"
                header={`Question ${question.id}`}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId, handleCopyQuestion, handleRemoveFlag]);

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
        label: 'Notes Status',
        value: hasNotesFilter,
        onChange: (v) => setHasNotesFilter(v as typeof hasNotesFilter),
        options: [
          { value: 'all', label: 'All Questions' },
          { value: 'with-notes', label: 'With Study Notes' },
          { value: 'without-notes', label: 'Without Notes' },
        ],
      },
    ];
  }, [subjectFilter, difficultyFilter, sourceFilter, hasNotesFilter, availableSubjects]);

  // Header quick action items
  const headerActionItems = useMemo<ActionMenuItem[]>(() => {
    return [
      {
        id: 'practice',
        label: 'Practice Flagged Deck',
        description: 'Launch timed quiz with only flagged questions',
        icon: Play,
        color: 'emerald',
        disabled: enrichedQuestions.length === 0,
        to: '/quiz/custom?filter=flagged',
      },
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
  const notesCount = useMemo(
    () =>
      enrichedQuestions.filter((q) => q.flagMeta.note?.trim()).length,
    [enrichedQuestions]
  );

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Flagged for Review</span>
            <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {enrichedQuestions.length}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Saved from Quiz &amp; OMR sessions
          </p>
        </div>

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

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Active Study Notes</span>
            <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="font-mono tabular-nums text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            {notesCount}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Custom mnemonics &amp; revision tags
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-xs font-medium">Quick Revision Set</span>
            <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="pt-0.5">
            <button
              type="button"
              disabled={enrichedQuestions.length === 0}
              onClick={() => navigate('/quiz/custom?filter=flagged')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Practice Now</span>
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Interactive timed quiz session
          </p>
        </div>
      </div>

      {/* Main Flagged Questions Data Table */}
      <SharedDataTable<EnrichedFlaggedQuestion>
        data={filteredQuestions}
        columns={columns}
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search flagged questions by prompt, topic, note, or options..."
        keyExtractor={(item) => item.question.id}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        title="Flagged Questions Registry"
        actions={
          <div className="flex items-center gap-2">
            {enrichedQuestions.length > 0 && (
              <ActionButton
                label="Practice Flagged"
                title="Launch timed quiz on flagged questions"
                icon={Play}
                color="emerald"
                variant="solid"
                size="sm"
                to="/quiz/custom?filter=flagged"
              />
            )}
            <SharedActionMenu
              label="Actions"
              icon={Sparkles}
              items={headerActionItems}
              color="zinc"
              variant="outline"
              size="sm"
              header="Flagged Review Tools"
            />
          </div>
        }
        emptyMessage="No Flagged Questions in Registry"
        emptyDescription="During any Objective Quiz or OMR Exam Simulation, press F or tap the Flag for Review button to bookmark tricky questions. They will automatically appear here."
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
              label="Start Practice Quiz"
              title="Open full question bank practice quiz"
              icon={Play}
              color="emerald"
              variant="solid"
              size="sm"
              to="/quiz"
            />
          </div>
        }
      />

      {/* Inspect & Test Interactive Recall Modal */}
      {inspectQuestion && (
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
                    {inspectQuestion.id}
                  </span>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    {inspectQuestion.subject}
                  </span>
                  <span className="text-xs text-zinc-400">·</span>
                  <span className="text-xs text-zinc-500">
                    {inspectQuestion.topic}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      inspectQuestion.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : inspectQuestion.difficulty === 'Hard'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {inspectQuestion.difficulty}
                  </span>
                </div>
                <h3
                  id="inspect-dialog-title"
                  className="font-serif font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 pt-1"
                >
                  {inspectQuestion.question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectQuestion(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Interactive Recall Options with Responsive Flexible Layout */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Select an option to test your recall:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectQuestion.options.map((opt) => {
                  const isPicked = testSelectedOption === opt.key;
                  const isCorrect = inspectQuestion.correct_options.includes(
                    opt.key
                  );
                  const showFeedback = testSelectedOption !== null;
                  const isParagraph =
                    opt.text.length > 55 || opt.text.includes('\n');

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
                      <span className="flex-1 min-w-0 break-words leading-snug">
                        {opt.text}
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
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                {inspectQuestion.explanation}
              </p>
              {inspectQuestion.sourceTitle && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Source Document: {inspectQuestion.sourceTitle}
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <ReactionButtons
                itemId={inspectQuestion.id}
                size="sm"
                showViews={false}
              />
              <div className="flex items-center gap-2">
                <ActionButton
                  label="Remove Flag"
                  title="Remove this question from flagged review"
                  icon={BookmarkCheck}
                  color="crimson"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleRemoveFlag(inspectQuestion.id);
                    setInspectQuestion(null);
                  }}
                />
                <ActionButton
                  label="Done"
                  title="Close inspection dialog"
                  variant="solid"
                  color="zinc"
                  size="sm"
                  onClick={() => setInspectQuestion(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
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
                  Personal Revision Note
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

            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif line-clamp-2 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
              {noteEditQuestion.question.question}
            </p>

            <div className="space-y-1.5">
              <label
                htmlFor="revision-note-input"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block"
              >
                Why did you flag this question? (Mnemonics, statutory clauses, confusion points):
              </label>
              <textarea
                id="revision-note-input"
                rows={4}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="e.g., Don't confuse Section 20 amassing disproportionate wealth with Section 19 document forgery; 35-day deadline to appeal."
                className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <ActionButton
                label="Cancel"
                title="Discard note changes"
                variant="outline"
                color="zinc"
                size="sm"
                onClick={() => setNoteEditQuestion(null)}
              />
              <ActionButton
                label="Save Note"
                title="Save revision note for this question"
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
