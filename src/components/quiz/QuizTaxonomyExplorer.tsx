import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { formatReverseClock } from './QuizSessionDialog';
import { getQuizDeadlineSeconds } from '../../data/quizData';
import {
  buildQuizTaxonomyTree,
  filterQuestionsByTheme,
  PSC_QUIZ_THEMES,
} from '../../data/quizTaxonomy';
import type { QuizQuestion } from '../../types';

type ExplorerTab = 'subjects' | 'topics' | 'subtopics';

interface QuizTaxonomyExplorerProps {
  questions: QuizQuestion[];
  onStartThemeQuiz: (themeId: string) => void;
  onStartSubjectQuiz: (subject: string) => void;
  onStartTopicQuiz: (subject: string, topic: string) => void;
  onStartSubtopicQuiz: (subject: string, topic: string, subtopic: string) => void;
}

export function QuizTaxonomyExplorer({
  questions,
  onStartThemeQuiz,
  onStartSubjectQuiz,
  onStartTopicQuiz,
  onStartSubtopicQuiz,
}: QuizTaxonomyExplorerProps) {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('subjects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const subjectTree = useMemo(
    () => buildQuizTaxonomyTree(questions),
    [questions]
  );

  const themeCards = useMemo(() => {
    return PSC_QUIZ_THEMES.map((theme) => {
      const matched = filterQuestionsByTheme(questions, theme.id);
      const totalMarks = matched.reduce((sum, q) => sum + q.marks, 0);
      return {
        theme,
        count: matched.length,
        totalMarks,
        deadlineSeconds: getQuizDeadlineSeconds(Math.max(1, matched.length)),
      };
    }).filter((entry) => entry.count > 0);
  }, [questions]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredThemes = useMemo(() => {
    if (!normalizedQuery) return themeCards;
    return themeCards.filter(({ theme }) => {
      const haystack = `${theme.titleEn} ${theme.titleNe} ${theme.description} ${theme.sampleTopics.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [themeCards, normalizedQuery]);

  const filteredSubjects = useMemo(() => {
    if (!normalizedQuery) return subjectTree;
    return subjectTree.filter((s) => {
      const topicMatch = s.topics.some(
        (t) =>
          t.topic.toLowerCase().includes(normalizedQuery) ||
          t.subtopics.some((sub) =>
            sub.subtopic.toLowerCase().includes(normalizedQuery)
          )
      );
      return s.subject.toLowerCase().includes(normalizedQuery) || topicMatch;
    });
  }, [subjectTree, normalizedQuery]);

  const allTopics = useMemo(
    () => subjectTree.flatMap((s) => s.topics),
    [subjectTree]
  );

  const topicsForSelectedSubject = useMemo(() => {
    if (selectedSubject === 'All') return allTopics;
    return allTopics.filter((t) => t.subject === selectedSubject);
  }, [allTopics, selectedSubject]);

  const filteredTopics = useMemo(() => {
    return topicsForSelectedSubject.filter((t) => {
      if (!normalizedQuery) return true;
      const haystack = `${t.subject} ${t.topic} ${t.subtopics.map((s) => s.subtopic).join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [topicsForSelectedSubject, normalizedQuery]);

  const allSubtopics = useMemo(
    () => allTopics.flatMap((t) => t.subtopics),
    [allTopics]
  );

  const filteredSubtopics = useMemo(() => {
    return allSubtopics.filter((sub) => {
      if (selectedSubject !== 'All' && sub.subject !== selectedSubject) {
        return false;
      }
      if (selectedTopic !== 'All' && sub.topic !== selectedTopic) {
        return false;
      }
      if (!normalizedQuery) return true;
      const haystack = `${sub.subject} ${sub.topic} ${sub.subtopic}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [allSubtopics, selectedSubject, selectedTopic, normalizedQuery]);

  const handleDrillToSubjectTopics = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedTopic('All');
    setActiveTab('topics');
  };

  const handleDrillToTopicSubtopics = (subject: string, topic: string) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setActiveTab('subtopics');
  };

  return (
    <section
      aria-labelledby="quiz-taxonomy-heading"
      className="space-y-5"
    >
      {/* Header & View Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {subjectTree.length} Subjects · {allTopics.length} Topics ·{' '}
              {allSubtopics.length} Subtopics
            </span>
          </div>
          <h2
            id="quiz-taxonomy-heading"
            className="font-serif text-fluid-h2 font-semibold text-zinc-950 dark:text-zinc-50"
          >
            Take Quiz by Subject, Topic &amp; Subtopic
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            Jump directly into General Awareness, Contemporary Issues, History,
            Culture, Economy, or drill down into any individual Subject, Topic,
            or Subtopic.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search
              aria-hidden="true"
              className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject, topic, subtopic..."
              aria-label="Search quiz subjects, topics, and subtopics"
              className="w-full sm:w-64 h-10 pl-8 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
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

          {/* Segmented View Tabs */}
          <div
            role="tablist"
            aria-label="Quiz browse level"
            className="max-w-full overflow-x-auto inline-flex items-center p-1 rounded-lg bg-zinc-200/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs shrink-0"
          >
            {(
              [
                { id: 'subjects', label: 'Subjects & Themes' },
                { id: 'topics', label: `Topics (${allTopics.length})` },
                { id: 'subtopics', label: `Subtopics (${allSubtopics.length})` },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-8 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: SUBJECTS & PSC THEMES */}
      {activeTab === 'subjects' && (
        <div className="space-y-8">
          {/* Core Thematic PSC Tracks */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              PSC Thematic Tracks (General Awareness, History, Culture, Economy &amp; Contemporary)
            </h3>

            {filteredThemes.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 py-4 border-y border-zinc-200 dark:border-zinc-800">
                No thematic quiz tracks match &ldquo;{searchQuery}&rdquo;.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredThemes.map(({ theme, count, totalMarks, deadlineSeconds }) => (
                  <article
                    key={theme.id}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span className="font-sans text-zinc-600 dark:text-zinc-300" lang="ne">
                          {theme.titleNe}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{count} Qs</span>
                        <span aria-hidden="true">·</span>
                        <span>{totalMarks}M</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatReverseClock(deadlineSeconds)}</span>
                      </div>

                      <h4 className="font-serif text-base sm:text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                        {theme.titleEn}
                      </h4>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {theme.description}
                      </p>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="text-zinc-400 dark:text-zinc-500">
                          Focus:
                        </span>{' '}
                        {theme.sampleTopics.join(' · ')}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onStartThemeQuiz(theme.id)}
                        className="w-full min-h-10 px-3.5 py-2 rounded-lg bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Start Theme Quiz ({count} Qs)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* All Question Bank Subjects */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              All Subjects ({filteredSubjects.length})
            </h3>

            {filteredSubjects.length === 0 ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 py-4 border-y border-zinc-200 dark:border-zinc-800">
                No subjects match &ldquo;{searchQuery}&rdquo;.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSubjects.map((subj) => {
                  const deadline = getQuizDeadlineSeconds(subj.questions.length);
                  return (
                    <article
                      key={subj.subject}
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                          <span>{subj.questions.length} Qs</span>
                          <span aria-hidden="true">·</span>
                          <span>{subj.totalMarks} marks</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatReverseClock(deadline)}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {subj.topics.length}{' '}
                            {subj.topics.length === 1 ? 'topic' : 'topics'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{subj.subtopicCount} subtopics</span>
                        </div>

                        <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                          {subj.subject}
                        </h4>

                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          <span className="text-zinc-400 dark:text-zinc-500">
                            Topics:
                          </span>{' '}
                          {subj.topics.map((t) => t.topic).join(' · ')}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleDrillToSubjectTopics(subj.subject)
                          }
                          className="min-h-10 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:border-blue-600 dark:hover:border-blue-400 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          Browse Topics ({subj.topics.length})
                        </button>

                        <button
                          type="button"
                          onClick={() => onStartSubjectQuiz(subj.subject)}
                          className="min-h-10 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Start Subject Quiz</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BY TOPIC */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          {/* Subject Filter Strip */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('All');
                setSelectedTopic('All');
              }}
              className={`min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSubject === 'All'
                  ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              All Subjects ({allTopics.length})
            </button>
            {subjectTree.map((s) => (
              <button
                key={s.subject}
                type="button"
                onClick={() => {
                  setSelectedSubject(s.subject);
                  setSelectedTopic('All');
                }}
                className={`min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSubject === s.subject
                    ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                {s.subject} ({s.topics.length})
              </button>
            ))}
          </div>

          {filteredTopics.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 py-6 border-y border-zinc-200 dark:border-zinc-800">
              No topics match your current filter. Try clearing the search or
              selecting All Subjects.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => {
                const deadline = getQuizDeadlineSeconds(topic.questions.length);
                return (
                  <article
                    key={`${topic.subject}::${topic.topic}`}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between gap-4 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                        <span className="font-sans font-medium text-zinc-700 dark:text-zinc-300">
                          {topic.subject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{topic.questions.length} Qs</span>
                        <span aria-hidden="true">·</span>
                        <span>{topic.totalMarks}M</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatReverseClock(deadline)}</span>
                      </div>

                      <h4 className="font-serif text-fluid-h3 font-semibold text-zinc-950 dark:text-zinc-50">
                        {topic.topic}
                      </h4>

                      {/* Direct Clickable Subtopics */}
                      <div className="pt-1 space-y-1.5">
                        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                          Click any subtopic below for an instant micro-quiz:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.subtopics.map((sub) => (
                            <button
                              key={`${topic.topic}::${sub.subtopic}`}
                              type="button"
                              onClick={() =>
                                onStartSubtopicQuiz(
                                  topic.subject,
                                  topic.topic,
                                  sub.subtopic
                                )
                              }
                              className="min-h-8 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-crimson-700 dark:hover:border-crimson-400 hover:text-crimson-700 dark:hover:text-crimson-400 text-xs text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer text-left"
                            >
                              {sub.subtopic}{' '}
                              <span className="font-mono tabular-nums text-zinc-400">
                                ({sub.questions.length})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleDrillToTopicSubtopics(
                            topic.subject,
                            topic.topic
                          )
                        }
                        className="min-h-10 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:border-blue-600 dark:hover:border-blue-400 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        View Subtopics ({topic.subtopics.length})
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onStartTopicQuiz(topic.subject, topic.topic)
                        }
                        className="min-h-10 px-4 py-2 rounded-lg bg-crimson-700 hover:bg-crimson-800 dark:bg-crimson-600 dark:hover:bg-crimson-500 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Start Topic Quiz ({topic.questions.length} Qs)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BY SUBTOPIC */}
      {activeTab === 'subtopics' && (
        <div className="space-y-4">
          {/* Subject & Topic Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('All');
                setSelectedTopic('All');
              }}
              className={`min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSubject === 'All' && selectedTopic === 'All'
                  ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              All Subtopics ({allSubtopics.length})
            </button>

            {subjectTree.map((s) => (
              <button
                key={s.subject}
                type="button"
                onClick={() => {
                  setSelectedSubject(s.subject);
                  setSelectedTopic('All');
                }}
                className={`min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedSubject === s.subject
                    ? 'bg-blue-700 dark:bg-blue-600 text-white border-blue-700 dark:border-blue-600'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                {s.subject}
              </button>
            ))}

            {selectedTopic !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedTopic('All')}
                className="min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium border border-crimson-700/40 bg-crimson-50/70 dark:bg-crimson-950/30 text-crimson-700 dark:text-crimson-300 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Topic: {selectedTopic}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredSubtopics.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 py-6 border-y border-zinc-200 dark:border-zinc-800">
              No subtopics match your current filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSubtopics.map((sub) => {
                const deadline = getQuizDeadlineSeconds(sub.questions.length);
                return (
                  <article
                    key={`${sub.subject}::${sub.topic}::${sub.subtopic}`}
                    className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between gap-3 hover:border-blue-700/45 dark:hover:border-blue-400/45 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {sub.subject} · {sub.topic}
                      </p>
                      <h4 className="font-serif text-base font-semibold text-zinc-950 dark:text-zinc-50">
                        {sub.subtopic}
                      </h4>
                      <p className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                        {sub.questions.length}{' '}
                        {sub.questions.length === 1 ? 'question' : 'questions'}{' '}
                        · {sub.totalMarks}M · {formatReverseClock(deadline)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onStartSubtopicQuiz(
                          sub.subject,
                          sub.topic,
                          sub.subtopic
                        )
                      }
                      className="w-full min-h-9 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-crimson-700 dark:bg-zinc-800 dark:hover:bg-crimson-600 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <span>Start Subtopic Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
