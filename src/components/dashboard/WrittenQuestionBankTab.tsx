import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Copy,
  Download,
  Edit3,
  Eye,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import {
  WRITTEN_PAPERS,
  type WrittenQuestion,
} from '../../data/writtenQuestionsData';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
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
import { WrittenQuestionFormModal } from './WrittenQuestionFormModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function WrittenQuestionBankTab() {
  const dispatch = useAppDispatch();
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const [questions, setQuestions] = useState<WrittenQuestion[]>(() =>
    questionStorageService.loadWrittenQuestions()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [paperFilter, setPaperFilter] = useState('all');
  const [marksFilter, setMarksFilter] = useState<'all' | '5' | '10'>('all');
  const [reactionFilter, setReactionFilter] = useState<'all' | 'liked' | 'disliked' | 'unrated'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<WrittenQuestion | null>(null);
  const [modalLang, setModalLang] = useState<'bilingual' | 'en' | 'ne'>('bilingual');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CRUD State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<WrittenQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<WrittenQuestion | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    const handleSyncQuestions = () => {
      setQuestions(questionStorageService.loadWrittenQuestions());
    };
    window.addEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncQuestions);
    window.addEventListener('storage', handleSyncQuestions);
    return () => {
      window.removeEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncQuestions);
      window.removeEventListener('storage', handleSyncQuestions);
    };
  }, []);

  // Filter written questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (paperFilter !== 'all' && q.paper !== paperFilter) {
        return false;
      }
      if (marksFilter !== 'all' && q.marks !== Number(marksFilter)) {
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
        const matchesEn = (q.en.title + ' ' + q.en.question).toLowerCase().includes(query);
        const matchesNe = (q.ne.title + ' ' + q.ne.question).toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesSubject = q.subject.toLowerCase().includes(query);
        return matchesEn || matchesNe || matchesId || matchesSubject;
      }
      return true;
    });
  }, [questions, searchQuery, paperFilter, marksFilter, reactionFilter, userReactions]);

  const handleSaveQuestion = (saved: WrittenQuestion) => {
    if (questionToEdit) {
      questionStorageService.updateWrittenQuestion(saved);
    } else {
      questionStorageService.createWrittenQuestion(saved);
    }
    setQuestions(questionStorageService.loadWrittenQuestions());
  };

  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;
    questionStorageService.deleteWrittenQuestion(questionToDelete.id);
    setQuestions(questionStorageService.loadWrittenQuestions());
    if (selectedQuestion?.id === questionToDelete.id) {
      setSelectedQuestion(null);
    }
    setQuestionToDelete(null);
  };

  const handleResetToDefault = () => {
    questionStorageService.resetWrittenQuestionsToDefault();
    setQuestions(questionStorageService.loadWrittenQuestions());
    setIsResetConfirmOpen(false);
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'psc-nepal-written-question-bank.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopy = (q: WrittenQuestion) => {
    const text = `PSC Written (${q.id}) - ${q.paper} [${q.marks} Marks]:\n\nEnglish:\n${q.en.title}\n${q.en.question}\n\nNepali:\n${q.ne.title}\n${q.ne.question}\n\nModel Answer (Intro):\n${q.en.introduction}\n\nExaminer Criteria:\n${q.rubric.map((r, i) => `${i + 1}. ${r.en}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Shared table columns definition with sorting
  const columns = useMemo<ColumnDef<WrittenQuestion>[]>(() => {
    return [
      {
        id: 'code',
        header: 'Code',
        width: 'w-28',
        sortable: true,
        sortKey: (q) => q.id,
        render: (q) => (
          <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
            {q.id}
          </span>
        ),
      },
      {
        id: 'title',
        header: 'Written Title & Question (Bilingual)',
        sortable: true,
        sortKey: (q) => q.en.title,
        render: (q) => (
          <div className="min-w-[280px]">
            <p className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100">
              {q.en.title}
            </p>
            <p lang="ne" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              {q.ne.title}
            </p>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1">
              {q.en.question}
            </p>
          </div>
        ),
      },
      {
        id: 'paper',
        header: 'Paper',
        width: 'w-36',
        hideOnMobile: true,
        sortable: true,
        sortKey: (q) => q.paper,
        render: (q) => (
          <div className="text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200 block">
              {q.paper}
            </span>
            <span className="text-[11px] text-zinc-500 block truncate max-w-[130px]">
              {q.subject}
            </span>
          </div>
        ),
      },
      {
        id: 'marks',
        header: 'Marks / Limit',
        align: 'center',
        width: 'w-28',
        sortable: true,
        sortKey: (q) => q.marks,
        render: (q) => (
          <div className="font-mono tabular-nums whitespace-nowrap">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
              {q.marks} Marks
            </span>
            <span className="text-[11px] text-zinc-500">
              {q.recommendedMinutes}:00 limit
            </span>
          </div>
        ),
      },
      {
        id: 'rubric',
        header: 'Rubric',
        align: 'center',
        width: 'w-20',
        hideOnTablet: true,
        render: (q) => (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {q.rubric.length} pts
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
        width: 'w-36',
        render: (q) => {
          const isCopied = copiedId === q.id;

          const actionMenuItems: ActionMenuItem[] = [
            {
              id: 'inspect-answer',
              label: 'Inspect Model Answer',
              description: `Bilingual breakdown & ${q.rubric.length}-point rubric`,
              icon: Eye,
              color: 'blue',
              onClick: () => {
                dispatch(recordView({ itemId: q.id }));
                setSelectedQuestion(q);
              },
            },
            {
              id: 'edit',
              label: 'Edit Question & Rubric',
              description: 'Modify prompts, model answers & scoring criteria',
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
              description: 'Permanently remove from written question bank',
              icon: Trash2,
              color: 'crimson',
              danger: true,
              onClick: () => {
                setQuestionToDelete(q);
              },
            },
            {
              id: 'copy-text',
              label: isCopied ? 'Rubric Copied!' : 'Copy Prompt & Rubric',
              description: 'Formatted English & Nepali prompts',
              icon: isCopied ? Check : Copy,
              color: isCopied ? 'emerald' : 'zinc',
              onClick: () => handleCopy(q),
              divider: true,
            },
            {
              id: 'paper-info',
              label: `${q.paper} Syllabus Info`,
              description: q.subject,
              icon: BookOpen,
              color: 'purple',
              onClick: () => {
                dispatch(recordView({ itemId: q.id }));
                setSelectedQuestion(q);
              },
            },
          ];

          return (
            <div className="flex items-center justify-end whitespace-nowrap">
              <SharedActionMenu
                items={actionMenuItems}
                label="Actions"
                title={`Actions for written prompt ${q.id}`}
                color="zinc"
                variant="outline"
                size="xs"
                width="w-64"
                header={`${q.id} · ${q.marks} Marks`}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId, dispatch]);

  const tableFilters: TableFilterDef[] = useMemo(
    () => [
      {
        id: 'paper',
        label: 'Paper',
        value: paperFilter,
        onChange: setPaperFilter,
        options: [
          { label: `All Papers (${questions.length})`, value: 'all' },
          ...WRITTEN_PAPERS.map((paper) => ({ label: paper, value: paper })),
        ],
      },
      {
        id: 'marks',
        label: 'Marks',
        value: marksFilter,
        onChange: (val) => setMarksFilter(val as any),
        options: [
          { label: 'All Marks', value: 'all' },
          { label: '10 Marks (18m)', value: '10' },
          { label: '5 Marks (9m)', value: '5' },
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
    [paperFilter, marksFilter, reactionFilter]
  );

  const isFiltered =
    paperFilter !== 'all' ||
    marksFilter !== 'all' ||
    reactionFilter !== 'all' ||
    Boolean(searchQuery.trim());

  const handleResetFilters = () => {
    setSearchQuery('');
    setPaperFilter('all');
    setMarksFilter('all');
    setReactionFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Integrated Shared Data Table with Search, Filters, CSV Export, and Pagination */}
      <SharedDataTable<WrittenQuestion>
        title="PSC Written Exam Long Questions Bank"
        subtitle="Curated Lok Sewa subjective questions for Section Officer Papers II, III, and IV with bilingual model solutions"
        totalCount={questions.length}
        data={filteredQuestions}
        columns={columns}
        keyExtractor={(q) => q.id}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search in English or नेपाली (Federalism, 16th Plan, RTI, सुशासन)..."
        filters={tableFilters}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              label="Add Written Prompt"
              title="Create a new subjective written question with rubric"
              icon={Plus}
              color="crimson"
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
                  label: 'Export Written Bank (JSON)',
                  description: 'Download JSON backup of all written questions',
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
              title="Written Question Bank Administration"
              color="zinc"
              variant="outline"
              size="sm"
            />
          </div>
        }
        enableCsvExport={true}
        csvFilename="psc-written-question-bank.csv"
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
        emptyMessage="No written questions match your search filters"
        emptyDescription="Try clearing your search query or selecting All Papers."
      />

      {/* Model Answer Preview Modal */}
      {selectedQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="written-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-zinc-500">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedQuestion.id}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuestion.paper}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedQuestion.marks} Marks ({selectedQuestion.recommendedMinutes}m)</span>
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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 id="written-modal-title" className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                  {selectedQuestion.en.title}
                </h4>
                <p lang="ne" className="text-sm text-zinc-500 font-medium">
                  {selectedQuestion.ne.title}
                </p>
              </div>

              {/* Language Switcher */}
              <div
                role="group"
                aria-label="Modal answer language"
                className="inline-flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs self-start sm:self-auto gap-1"
              >
                {(
                  [
                    { id: 'bilingual', label: 'Bilingual (EN+ने)' },
                    { id: 'en', label: 'English' },
                    { id: 'ne', label: 'नेपाली' },
                  ] as const
                ).map((opt) => (
                  <ActionButton
                    key={opt.id}
                    label={opt.label}
                    title={`Switch model answer language to ${opt.label}`}
                    color="zinc"
                    variant={modalLang === opt.id ? 'solid' : 'ghost'}
                    size="xs"
                    onClick={() => setModalLang(opt.id)}
                  />
                ))}
              </div>
            </div>

            {/* Prompt Display */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2">
              <span className="font-mono text-[11px] font-semibold text-zinc-500">
                Official Examination Prompt:
              </span>
              {modalLang !== 'ne' && (
                <p className="text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                  {selectedQuestion.en.question}
                </p>
              )}
              {modalLang !== 'en' && (
                <p lang="ne" className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  {selectedQuestion.ne.question}
                </p>
              )}
            </div>

            {/* Model Structure Preview */}
            <div className="space-y-4 pt-1">
              <div>
                <h5 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  1. Official Introduction
                </h5>
                <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1.5">
                  {modalLang !== 'ne' && <p>{selectedQuestion.en.introduction}</p>}
                  {modalLang !== 'en' && <p lang="ne">{selectedQuestion.ne.introduction}</p>}
                </div>
              </div>

              <div>
                <h5 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  2. Core Analytical Headings
                </h5>
                <div className="mt-2 space-y-3">
                  {(modalLang === 'ne' ? selectedQuestion.ne.sections : selectedQuestion.en.sections).map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-1 text-xs"
                    >
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {sec.heading}
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                        {sec.points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-serif text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  3. Examiner Evaluation Rubric ({selectedQuestion.rubric.length} Criteria)
                </h5>
                <div className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800/80 border-t border-b border-zinc-100 dark:border-zinc-800/80">
                  {selectedQuestion.rubric.map((r, rIdx) => (
                    <div key={rIdx} className="py-2 text-xs flex items-start gap-2">
                      <span className="font-mono tabular-nums text-zinc-400 w-4">
                        {rIdx + 1}.
                      </span>
                      <div className="space-y-0.5">
                        {modalLang !== 'ne' && (
                          <p className="text-zinc-800 dark:text-zinc-200">{r.en}</p>
                        )}
                        {modalLang !== 'en' && (
                          <p lang="ne" className="text-zinc-500 dark:text-zinc-400">{r.ne}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <ReactionButtons
                itemId={selectedQuestion.id}
                itemType="question"
                size="sm"
                showLabels
              />

              <div className="flex items-center gap-2">
                <ActionButton
                  label="Edit Question"
                  title="Edit written problem statement, model answers, or rubric"
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
                  label={copiedId === selectedQuestion.id ? 'Copied!' : 'Copy Rubric'}
                  title={`Copy rubric for ${selectedQuestion.id}`}
                  icon={copiedId === selectedQuestion.id ? Check : Copy}
                  color={copiedId === selectedQuestion.id ? 'emerald' : 'zinc'}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(selectedQuestion)}
                />
                <ActionButton
                  label="Close"
                  title="Close answer preview"
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

      {/* Create / Edit Written Question Modal */}
      <WrittenQuestionFormModal
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
        title={`Delete Written Question ${questionToDelete?.id}?`}
        description={
          <div>
            <p>
              Are you sure you want to permanently delete this written prompt
              from the bank?
            </p>
            {questionToDelete && (
              <p className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] line-clamp-2">
                "{questionToDelete.en.title}"
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
        title="Restore Official Written Questions?"
        description="This will restore all authentic Lok Sewa Papers II, III, and IV written questions. Any custom questions or edits will be reset."
        confirmLabel="Restore Defaults"
        confirmColor="crimson"
        onConfirm={handleResetToDefault}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
