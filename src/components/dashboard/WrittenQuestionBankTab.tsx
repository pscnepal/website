import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Eye,
  PenLine,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  WRITTEN_PAPERS,
  WRITTEN_QUESTIONS,
  type WrittenQuestion,
} from '../../data/writtenQuestionsData';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { recordView } from '../../features/reactions/reactionsSlice';
import { ActionButton } from '../common/ActionButton';
import { ReactionButtons } from '../common/ReactionButtons';
import { SharedTable, type ColumnDef } from '../common/SharedTable';

export function WrittenQuestionBankTab() {
  const dispatch = useAppDispatch();
  const userReactions = useAppSelector((state) => state.reactions.userReactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [paperFilter, setPaperFilter] = useState('all');
  const [marksFilter, setMarksFilter] = useState<'all' | '5' | '10'>('all');
  const [reactionFilter, setReactionFilter] = useState<'all' | 'liked' | 'disliked' | 'unrated'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<WrittenQuestion | null>(null);
  const [modalLang, setModalLang] = useState<'bilingual' | 'en' | 'ne'>('bilingual');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter written questions
  const filteredQuestions = useMemo(() => {
    return WRITTEN_QUESTIONS.filter((q) => {
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
  }, [searchQuery, paperFilter, marksFilter, reactionFilter, userReactions]);

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
          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
              <ActionButton
                label="Answer"
                title={`Inspect model answer for ${q.id}`}
                icon={Eye}
                color="zinc"
                variant="outline"
                size="xs"
                onClick={() => {
                  dispatch(recordView({ itemId: q.id }));
                  setSelectedQuestion(q);
                }}
              />

              <ActionButton
                label="Practice"
                title={`Launch Timed Writing Sandbox for ${q.id}`}
                icon={PenLine}
                color="crimson"
                variant="solid"
                size="xs"
                to={`/written/${q.id}`}
              />

              <ActionButton
                title={isCopied ? 'Copied' : 'Copy question & rubric'}
                icon={isCopied ? Check : Copy}
                color={isCopied ? 'emerald' : 'zinc'}
                variant="outline"
                size="xs"
                onClick={() => handleCopy(q)}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
              PSC Written Exam Long Questions Bank
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Curated Lok Sewa subjective questions for Section Officer Papers II, III, and IV with bilingual model solutions
            </p>
          </div>
          <span className="font-mono tabular-nums text-xs font-semibold px-2.5 py-1 rounded-md bg-crimson-50 dark:bg-crimson-950/80 text-crimson-800 dark:text-crimson-300 border border-crimson-200 dark:border-crimson-800 self-start sm:self-auto">
            {filteredQuestions.length} of {WRITTEN_QUESTIONS.length} Questions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in English or नेपाली (Federalism, 16th Plan, RTI, सुशासन)..."
              className="w-full h-9 pl-8 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <ActionButton
                  title="Clear search"
                  icon={X}
                  color="zinc"
                  variant="ghost"
                  size="xs"
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}
          </div>

          {/* Paper Select */}
          <div className="sm:col-span-3">
            <select
              value={paperFilter}
              onChange={(e) => setPaperFilter(e.target.value)}
              aria-label="Filter by PSC written paper"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Papers (Papers II, III &amp; IV)</option>
              {WRITTEN_PAPERS.map((paper) => (
                <option key={paper} value={paper}>
                  {paper}
                </option>
              ))}
            </select>
          </div>

          {/* Marks Filter */}
          <div className="sm:col-span-2">
            <select
              value={marksFilter}
              onChange={(e) => setMarksFilter(e.target.value as any)}
              aria-label="Filter by marks weightage"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-mono"
            >
              <option value="all">All Marks</option>
              <option value="10">10 Marks (18m)</option>
              <option value="5">5 Marks (9m)</option>
            </select>
          </div>

          {/* Reaction / Bookmark Filter */}
          <div className="sm:col-span-2">
            <select
              value={reactionFilter}
              onChange={(e) => setReactionFilter(e.target.value as any)}
              aria-label="Filter by candidate rating"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
            >
              <option value="all">All Ratings</option>
              <option value="liked">Liked (★ Saved)</option>
              <option value="disliked">Disliked</option>
              <option value="unrated">Unrated Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shared Written Question Table */}
      <SharedTable<WrittenQuestion>
        data={filteredQuestions}
        columns={columns}
        keyExtractor={(q) => q.id}
        pagination={true}
        defaultPageSize={15}
        pageSizeOptions={[10, 15, 25]}
        emptyMessage="No written questions match your search filters"
        emptyDescription="Try clearing your search query or selecting All Papers."
        emptyAction={
          <ActionButton
            label="Reset Filters"
            title="Reset written bank filters"
            icon={RotateCcw}
            color="crimson"
            variant="solid"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setPaperFilter('all');
              setMarksFilter('all');
              setReactionFilter('all');
            }}
          />
        }
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
                  label="Launch Timed Sandbox"
                  title={`Open ${selectedQuestion.id} in timed writing studio`}
                  icon={PenLine}
                  color="crimson"
                  variant="solid"
                  size="sm"
                  to={`/written/${selectedQuestion.id}`}
                />
                <ActionButton
                  label="Close"
                  title="Close answer preview"
                  color="zinc"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuestion(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
