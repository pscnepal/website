import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Eye,
  RotateCcw,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import { ALL_QUIZ_QUESTIONS, type QuizOptionKey, type QuizQuestion } from '../../data/quizData';
import { ActionButton } from '../common/ActionButton';
import { ReactionButtons } from '../common/ReactionButtons';
import { SharedTable, type ColumnDef } from '../common/SharedTable';

export function QuizQuestionBankTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);
  const [testSelectedOption, setTestSelectedOption] = useState<QuizOptionKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique subjects
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    ALL_QUIZ_QUESTIONS.forEach((q) => {
      if (q.subject) set.add(q.subject);
    });
    return Array.from(set).sort();
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return ALL_QUIZ_QUESTIONS.filter((q) => {
      if (subjectFilter !== 'all' && q.subject !== subjectFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesPrompt = q.question.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesTopic = (q.topic + ' ' + q.subtopic).toLowerCase().includes(query);
        const matchesOptions = q.options.some((opt) => opt.text.toLowerCase().includes(query));
        return matchesPrompt || matchesId || matchesTopic || matchesOptions;
      }
      return true;
    });
  }, [searchQuery, subjectFilter, difficultyFilter]);

  const handleCopyQuestion = (q: QuizQuestion) => {
    const text = `Q (${q.id}): ${q.question}\n${q.options.map((o) => `${o.key}. ${o.text}`).join('\n')}\nAnswer: ${q.correct_options.join(', ')}\nExplanation: ${q.explanation}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Shared table columns definition
  const columns = useMemo<ColumnDef<QuizQuestion>[]>(() => {
    return [
      {
        id: 'code',
        header: 'Code',
        width: 'w-28',
        render: (q) => (
          <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
            {q.id}
          </span>
        ),
      },
      {
        id: 'prompt',
        header: 'Question Prompt',
        render: (q) => (
          <div className="min-w-[260px]">
            <p className="font-serif text-[13px] font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2">
              {q.question}
            </p>
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
        header: 'Ratings',
        width: 'w-32',
        render: (q) => (
          <ReactionButtons itemId={q.id} itemType="question" size="xs" />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        width: 'w-28',
        render: (q) => {
          const isCopied = copiedId === q.id;
          return (
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
              <ActionButton
                label="View"
                title={`Inspect ${q.id} and test options`}
                icon={Eye}
                color="blue"
                variant="outline"
                size="xs"
                onClick={() => {
                  setSelectedQuestion(q);
                  setTestSelectedOption(null);
                }}
              />

              <ActionButton
                title={isCopied ? 'Copied to clipboard' : 'Copy question text'}
                icon={isCopied ? Check : Copy}
                color={isCopied ? 'emerald' : 'zinc'}
                variant="outline"
                size="xs"
                onClick={() => handleCopyQuestion(q)}
              />
            </div>
          );
        },
      },
    ];
  }, [copiedId]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
              Objective MCQ Question Bank
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Complete index of authentic Lok Sewa multiple-choice questions with verified keys and rationale
            </p>
          </div>
          <span className="font-mono tabular-nums text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
            {filteredQuestions.length} of {ALL_QUIZ_QUESTIONS.length} Questions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, topic, question ID, or option..."
              className="w-full h-9 pl-8 pr-8 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Filter */}
          <div className="sm:col-span-3">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              aria-label="Filter by subject"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Subjects ({ALL_QUIZ_QUESTIONS.length})</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="sm:col-span-3">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Filter by difficulty"
              className="w-full h-9 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy (Foundation)</option>
              <option value="Medium">Medium (Cadre Standard)</option>
              <option value="Hard">Hard (High Discriminator)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shared Question Table */}
      <SharedTable<QuizQuestion>
        data={filteredQuestions}
        columns={columns}
        keyExtractor={(q) => q.id}
        emptyMessage="No objective questions match your search filters"
        emptyDescription="Try clearing your search query or selecting All Subjects."
        emptyAction={
          <ActionButton
            label="Reset Filters"
            title="Reset question bank filters"
            icon={RotateCcw}
            color="blue"
            variant="solid"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSubjectFilter('all');
              setDifficultyFilter('all');
            }}
          />
        }
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
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                aria-label="Close modal"
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 id="question-modal-title" className="font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {selectedQuestion.question}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedQuestion.topic} / {selectedQuestion.subtopic}
              </p>
            </div>

            {/* Test Interactive Options */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Select an option to test your recall:
              </p>
              <div className="space-y-2">
                {selectedQuestion.options.map((opt) => {
                  const isPicked = testSelectedOption === opt.key;
                  const isCorrect = selectedQuestion.correct_options.includes(opt.key);
                  const showFeedback = testSelectedOption !== null;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setTestSelectedOption(opt.key)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
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
                      <span className="flex-1">{opt.text}</span>
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
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                {selectedQuestion.explanation}
              </p>
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
      )}
    </div>
  );
}
