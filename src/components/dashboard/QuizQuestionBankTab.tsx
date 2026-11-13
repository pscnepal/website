import { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Plus,
  RotateCcw,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import {
  isBilingualQuizQuestion,
  type QuizOptionKey,
  type QuizQuestion,
} from '../../data/quizData';
import { storageService } from '../../services/storageService';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';
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
import { QuizQuestionFormModal } from './QuizQuestionFormModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function QuizQuestionBankTab() {
  const dispatch = useAppDispatch();
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    questionStorageService.loadQuizQuestions()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<'all' | 'flagged' | 'unflagged'>('all');
  const [reactionFilter, setReactionFilter] = useState<'all' | 'liked' | 'disliked' | 'unrated'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [testSelectedOption, setTestSelectedOption] = useState<QuizOptionKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [flaggedMap, setFlaggedMap] = useState<Record<string, unknown>>(() =>
    storageService.loadFlaggedQuestions()
  );

  // CRUD State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<QuizQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    const handleSync = () => {
      setFlaggedMap(storageService.loadFlaggedQuestions());
    };
    const handleSyncQuestions = () => {
      setQuestions(questionStorageService.loadQuizQuestions());
    };

    window.addEventListener('psc_flagged_questions_changed', handleSync);
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuestions);
    window.addEventListener('storage', handleSync);
    window.addEventListener('storage', handleSyncQuestions);

    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleSync);
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuestions);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('storage', handleSyncQuestions);
    };
  }, []);

  // Extract unique subjects
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set).sort();
  }, [questions]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (subjectFilter !== 'all' && q.subject !== subjectFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
        return false;
      }
      const isFlagged = Boolean(flaggedMap[q.id]);
      if (flaggedFilter === 'flagged' && !isFlagged) {
        return false;
      }
      if (flaggedFilter === 'unflagged' && isFlagged) {
        return false;
      }
      if (reactionFilter === 'liked' && userReactions[q.id] !== 'like') {
        return false;
      }
      if (reactionFilter === 'disliked' && userReactions[q.id] !== 'dislike') {
        return false;
      }
      if (reactionFilter === 'unrated' && userReactions[q.id]) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const showBilingual = isBilingualQuizQuestion(q);
        const matchesPrompt =
          q.question.toLowerCase().includes(query) ||
          (showBilingual && (q.questionNe ?? '').toLowerCase().includes(query));
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesTopic = (q.topic + ' ' + q.subtopic).toLowerCase().includes(query);
        const matchesOptions = q.options.some(
          (opt) =>
            opt.text.toLowerCase().includes(query) ||
            (showBilingual && (opt.textNe ?? '').toLowerCase().includes(query))
        );
        const matchesExplanation =
          q.explanation.toLowerCase().includes(query) ||
          (showBilingual && (q.explanationNe ?? '').toLowerCase().includes(query));
        return (
          matchesPrompt ||
          matchesId ||
          matchesTopic ||
          matchesOptions ||
          matchesExplanation
        );
      }
      return true;
    });
  }, [
    questions,
    searchQuery,
    subjectFilter,
    difficultyFilter,
    flaggedFilter,
    flaggedMap,
    reactionFilter,
    userReactions,
  ]);

  const handleSaveQuestion = (saved: QuizQuestion) => {
    if (questionToEdit) {
      questionStorageService.updateQuizQuestion(saved);
    } else {
      questionStorageService.createQuizQuestion(saved);
    }
    setQuestions(questionStorageService.loadQuizQuestions());
  };

  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;
    questionStorageService.deleteQuizQuestion(questionToDelete.id);
    setQuestions(questionStorageService.loadQuizQuestions());
    if (selectedQuestion?.id === questionToDelete.id) {
      setSelectedQuestion(null);
    }
    setQuestionToDelete(null);
  };

  const handleResetToDefault = () => {
    questionStorageService.resetQuizQuestionsToDefault();
    setQuestions(questionStorageService.loadQuizQuestions());
    setIsResetConfirmOpen(false);
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'psc-nepal-mcq-question-bank.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyQuestion = (q: QuizQuestion) => {
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
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Shared table columns definition with sorting
  const columns = useMemo<ColumnDef<QuizQuestion>[]>(() => {
    return [
      {
        id: 'code',
        header: 'Code',
        width: 'w-28',
        sortable: true,
        sortKey: (q) => q.id,
        render: (q) => {
          const isFlagged = Boolean(flaggedMap[q.id]);
          return (
            <div className="flex items-center gap-1.5">
              {isFlagged && (
                <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              )}
              <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                {q.id}
              </span>
            </div>
          );
        },
      },
      {
        id: 'prompt',
        header: 'Question Prompt',
        sortable: true,
        sortKey: (q) => q.question,
        render: (q) => (
          <div className="min-w-[260px]">
            <p
              lang={q.subject.trim().toLowerCase() === 'nepali' ? 'ne' : undefined}
              className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2"
            >
              {q.question}
            </p>
            {isBilingualQuizQuestion(q) && q.questionNe?.trim() && (
              <p
                lang="ne"
                className="mt-0.5 text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-1"
              >
                {q.questionNe}
              </p>
            )}
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
              {q.options.length} options · +{q.marks.toFixed(2)} / -
              {(q.marks * 0.2).toFixed(2)}M
            </p>
          </div>
        ),
      },
      {
        id: 'topic',
        header: 'Topic',
        width: 'w-36',
        hideOnMobile: true,
        sortable: true,
        sortKey: (q) => q.topic,
        render: (q) => (
          <div className="text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
              {q.subject}
            </span>
            <span className="text-[11px] text-zinc-500 truncate block max-w-[140px]">
              {q.topic}
            </span>
          </div>
        ),
      },
      {
        id: 'difficulty',
        header: 'Difficulty',
        width: 'w-24',
        hideOnTablet: true,
        sortable: true,
        sortKey: (q) =>
          q.difficulty === 'Easy' ? 1 : q.difficulty === 'Medium' ? 2 : 3,
        render: (q) => (
          <span
            className={`font-mono text-[11px] font-semibold ${
              q.difficulty === 'Easy'
                ? 'text-emerald-700 dark:text-emerald-400'
                : q.difficulty === 'Hard'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {q.difficulty}
          </span>
        ),
      },
      {
        id: 'correct',
        header: 'Correct',
        align: 'center',
        width: 'w-20',
        render: (q) => (
          <span className="inline-flex items-center justify-center font-mono font-bold text-xs w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
            {q.correct_options.join(',')}
          </span>
        ),
      },
      {
        id: 'ratings',
        header: 'Views & Ratings',
        width: 'w-44',
        render: (q) => (
          <ReactionButtons itemId={q.id} itemType="question" size="xs" />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        width: 'w-32',
        render: (q) => {
          const isCopied = copiedId === q.id;

          const actionMenuItems: ActionMenuItem[] = [
            {
              id: 'inspect',
              label: 'View & Test Question',
              description: `${q.options.length} verified options with rationale`,
              icon: Eye,
              color: 'blue',
              onClick: () => {
                dispatch(recordView({ itemId: q.id, itemType: 'question' }));
                setSelectedQuestion(q);
                setTestSelectedOption(null);
              },
            },
            {
              id: 'edit',
              label: 'Edit Question',
              description: 'Modify stem, options, key, or rationale',
              icon: Edit3,
              color: 'amber',
              onClick: () => {
                setQuestionToEdit(q);
                setIsFormModalOpen(true);
              },
            },
            {
              id: 'delete',
              label: 'Delete Question',
              description: 'Permanently remove from question bank',
              icon: Trash2,
              color: 'crimson',
              danger: true,
              onClick: () => {
                setQuestionToDelete(q);
              },
            },
            {
              id: 'toggle-flag',
              label: Boolean(flaggedMap[q.id])
                ? 'Remove from Flagged'
                : 'Flag for Review',
              description: 'Bookmark tricky MCQ for dedicated dashboard review',
              icon: Bookmark,
              color: 'amber',
              onClick: () => {
                storageService.toggleFlaggedQuestion(q.id, {
                  source: 'quiz',
                  deckTitle: q.subject,
                });
                setFlaggedMap(storageService.loadFlaggedQuestions());
              },
              divider: true,
            },
            {
              id: 'copy-text',
              label: isCopied ? 'Question Copied!' : 'Copy Question Text',
              description: 'Formatted with options & explanation',
              icon: isCopied ? Check : Copy,
              color: isCopied ? 'emerald' : 'zinc',
              onClick: () => handleCopyQuestion(q),
            },
            {
              id: 'copy-id',
              label: `Copy Code (${q.id})`,
              icon: FileText,
              color: 'purple',
              onClick: () => {
                navigator.clipboard.writeText(q.id);
                setCopiedId(q.id);
                setTimeout(() => setCopiedId(null), 2000);
              },
            },
          ];

          return (
            <div className="flex items-center justify-end whitespace-nowrap">
              <SharedActionMenu
                items={actionMenuItems}
                label="Actions"
                title={`Actions for question ${q.id}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-60"
                header={`MCQ ${q.id}`}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId, dispatch, flaggedMap]);

  const tableFilters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'subject',
        label: 'Subject',
        value: subjectFilter,
        onChange: setSubjectFilter,
        options: [
          { label: `All Subjects (${questions.length})`, value: 'all' },
          ...availableSubjects.map((sub) => ({ label: sub, value: sub })),
        ],
      },
      {
        id: 'difficulty',
        label: 'Difficulty',
        value: difficultyFilter,
        onChange: setDifficultyFilter,
        options: [
          { label: 'All Difficulties', value: 'all' },
          { label: 'Easy (Foundation)', value: 'Easy' },
          { label: 'Medium (Standard)', value: 'Medium' },
          { label: 'Hard (Discriminator)', value: 'Hard' },
        ],
      },
      {
        id: 'flagged',
        label: 'Flagged for Review',
        value: flaggedFilter,
        onChange: (val) => setFlaggedFilter(val as typeof flaggedFilter),
        options: [
          { label: 'All Questions', value: 'all' },
          { label: 'Flagged Only', value: 'flagged' },
          { label: 'Unflagged Only', value: 'unflagged' },
        ],
      },
      {
        id: 'rating',
        label: 'Rating',
        value: reactionFilter,
        onChange: (val) => setReactionFilter(val as any),
        options: [
          { label: 'All Ratings', value: 'all' },
          { label: 'Liked (★ Saved)', value: 'liked' },
          { label: 'Disliked', value: 'disliked' },
          { label: 'Unrated Only', value: 'unrated' },
        ],
      },
    ],
    [
      subjectFilter,
      difficultyFilter,
      flaggedFilter,
      reactionFilter,
      availableSubjects,
      questions.length,
    ]
  );

  const isFiltered =
    subjectFilter !== 'all' ||
    difficultyFilter !== 'all' ||
    flaggedFilter !== 'all' ||
    reactionFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setSubjectFilter('all');
    setDifficultyFilter('all');
    setFlaggedFilter('all');
    setReactionFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Integrated Shared Data Table with Search, Filters, CSV Export, and Pagination */}
      <SharedDataTable<QuizQuestion>
        title="Objective MCQ Question Bank"
        subtitle="Complete repository of authentic Lok Sewa multiple-choice questions with verified keys and official rationale"
        totalCount={questions.length}
        data={filteredQuestions}
        columns={columns}
        keyExtractor={(q) => q.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by keyword, topic, question ID, or option text..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              label="Add MCQ"
              title="Create a new objective MCQ question"
              icon={Plus}
              color="blue"
              variant="solid"
              size="sm"
              onClick={() => {
                setQuestionToEdit(null);
                setIsFormModalOpen(true);
              }}
            />
            <SharedActionMenu
              items={[
                {
                  id: 'export-json',
                  label: 'Export Question Bank (JSON)',
                  description: 'Download JSON backup of all questions',
                  icon: Download,
                  color: 'emerald',
                  onClick: handleExportJson,
                },
                {
                  id: 'reset-default',
                  label: 'Restore Official Questions',
                  description: 'Reset all modifications to default Lok Sewa seed data',
                  icon: RotateCcw,
                  color: 'crimson',
                  danger: true,
                  onClick: () => setIsResetConfirmOpen(true),
                },
              ]}
              label="Bank Tools"
              title="MCQ Question Bank Administration"
              color="zinc"
              variant="outline"
              size="sm"
            />
          </div>
        }
        enableCsvExport={true}
        csvFilename="psc-objective-mcq-question-bank.csv"
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
        emptyMessage="No objective questions match your search filters"
        emptyDescription="Try clearing your search query or choosing All Subjects."
      />

      {/* Inspect & Test Modal */}
      {selectedQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="question-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-zinc-500">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedQuestion.id}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuestion.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuestion.difficulty}</span>
              </div>
              <ActionButton
                title="Close modal"
                icon={X}
                color="zinc"
                variant="ghost"
                size="xs"
                onClick={() => setSelectedQuestion(null)}
              />
            </div>

            <div className="space-y-2">
              <h4
                id="question-modal-title"
                lang={
                  selectedQuestion.subject.trim().toLowerCase() === 'nepali'
                    ? 'ne'
                    : undefined
                }
                className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50"
              >
                {selectedQuestion.question}
              </h4>
              {isBilingualQuizQuestion(selectedQuestion) &&
                selectedQuestion.questionNe?.trim() && (
                  <p
                    lang="ne"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed"
                  >
                    {selectedQuestion.questionNe}
                  </p>
                )}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedQuestion.topic} / {selectedQuestion.subtopic}
              </p>
            </div>

            {/* Test Interactive Options */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Select an option to test your recall:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedQuestion.options.map((opt) => {
                  const isPicked = testSelectedOption === opt.key;
                  const isCorrect = selectedQuestion.correct_options.includes(opt.key);
                  const showFeedback = testSelectedOption !== null;
                  const showBilingual = isBilingualQuizQuestion(selectedQuestion);
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
                          selectedQuestion.subject.trim().toLowerCase() === 'nepali'
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
                Official Rationale &amp; Explanation:
              </p>
              <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <p
                  lang={
                    selectedQuestion.subject.trim().toLowerCase() === 'nepali'
                      ? 'ne'
                      : undefined
                  }
                >
                  {selectedQuestion.explanation}
                </p>
                {isBilingualQuizQuestion(selectedQuestion) &&
                  selectedQuestion.explanationNe?.trim() && (
                    <p
                      lang="ne"
                      className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800/70 text-zinc-600 dark:text-zinc-400"
                    >
                      {selectedQuestion.explanationNe}
                    </p>
                  )}
              </div>
              {selectedQuestion.sourceTitle && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                  Source Document: {selectedQuestion.sourceTitle}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <ReactionButtons
                itemId={selectedQuestion.id}
                itemType="question"
                size="sm"
                showLabels
              />
              <div className="flex items-center gap-2">
                <ActionButton
                  label="Edit Question"
                  title="Modify question stem, options, or explanation"
                  icon={Edit3}
                  color="blue"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const toEdit = selectedQuestion;
                    setSelectedQuestion(null);
                    setQuestionToEdit(toEdit);
                    setIsFormModalOpen(true);
                  }}
                />
                <ActionButton
                  label="Done"
                  title="Close question inspector"
                  color="zinc"
                  variant="solid"
                  size="sm"
                  onClick={() => setSelectedQuestion(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <QuizQuestionFormModal
        isOpen={isFormModalOpen}
        questionToEdit={questionToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setQuestionToEdit(null);
        }}
        onSave={handleSaveQuestion}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(questionToDelete)}
        title={`Delete Question ${questionToDelete?.id}?`}
        description={
          <div>
            <p>
              Are you sure you want to permanently delete this question from the
              bank?
            </p>
            {questionToDelete && (
              <p className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] line-clamp-2">
                "{questionToDelete.question}"
              </p>
            )}
          </div>
        }
        confirmLabel="Delete Question"
        confirmColor="crimson"
        onConfirm={handleDeleteQuestion}
        onClose={() => setQuestionToDelete(null)}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Restore Official Question Bank?"
        description="This will restore the original 120+ authentic Lok Sewa questions. Any custom questions you added will be removed."
        confirmLabel="Restore Defaults"
        confirmColor="crimson"
        onConfirm={handleResetToDefault}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
