import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Database,
  HelpCircle,
  PenLine,
  Users,
} from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { useDashboardUsers } from '../../context/DashboardUsersContext';
import { ActionButton } from '../common/ActionButton';
import { READING_MATERIAL_CATEGORIES } from '../../data/readingMaterials';
import { storageService } from '../../services/storageService';
import {
  QUESTION_EVENTS,
  questionStorageService,
} from '../../services/questionStorageService';
import { formatCompactDuration } from '../../utils/pdfHelpers';

export interface DashboardOverviewTabProps {
  onSwitchTab?: (
    tab:
      | 'overview'
      | 'quiz-bank'
      | 'flagged'
      | 'written-bank'
      | 'users'
      | 'materials'
      | 'data'
  ) => void;
}

export function DashboardOverviewTab({ onSwitchTab }: DashboardOverviewTabProps) {
  const navigate = useNavigate();
  const { users: dbUsers, isLoading: isUsersLoading } = useDashboardUsers();
  const handleSwitchTab = (
    tab:
      | 'overview'
      | 'quiz-bank'
      | 'flagged'
      | 'written-bank'
      | 'users'
      | 'materials'
      | 'data'
  ) => {
    if (onSwitchTab) {
      onSwitchTab(tab);
    } else {
      navigate(tab === 'overview' ? '/dashboard' : `/dashboard/${tab}`);
    }
  };

  const [flaggedCount, setFlaggedCount] = useState<number>(() => {
    return Object.keys(storageService.loadFlaggedQuestions()).length;
  });
  const [quizCount, setQuizCount] = useState<number>(() => {
    return questionStorageService.loadQuizQuestions().length;
  });
  const [writtenCount, setWrittenCount] = useState<number>(() => {
    return questionStorageService.loadWrittenQuestions().length;
  });

  useEffect(() => {
    const handleSync = () => {
      setFlaggedCount(Object.keys(storageService.loadFlaggedQuestions()).length);
    };
    const handleSyncQuiz = () => {
      setQuizCount(questionStorageService.loadQuizQuestions().length);
    };
    const handleSyncWritten = () => {
      setWrittenCount(questionStorageService.loadWrittenQuestions().length);
    };

    window.addEventListener('psc_flagged_questions_changed', handleSync);
    window.addEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuiz);
    window.addEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncWritten);
    window.addEventListener('storage', handleSync);
    window.addEventListener('storage', handleSyncQuiz);
    window.addEventListener('storage', handleSyncWritten);

    return () => {
      window.removeEventListener('psc_flagged_questions_changed', handleSync);
      window.removeEventListener(QUESTION_EVENTS.QUIZ_CHANGED, handleSyncQuiz);
      window.removeEventListener(QUESTION_EVENTS.WRITTEN_CHANGED, handleSyncWritten);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('storage', handleSyncQuiz);
      window.removeEventListener('storage', handleSyncWritten);
    };
  }, []);

  const quizAttempts = useAppSelector((state) => state.quiz.attempts);
  const writtenRecords = useAppSelector((state) => state.written.records);
  const simulationRuns = useAppSelector((state) => state.psc.simulationHistory);
  const targetCadreId = useAppSelector((state) => state.psc.targetCadreId);
  const userReactions = useAppSelector((state) => state.reactions.userReactions);

  const totalLiked = useMemo(() => {
    return Object.values(userReactions).filter((r) => r === 'like').length;
  }, [userReactions]);

  // Compute aggregate statistics
  const totalMaterialsCount = useMemo(() => {
    return READING_MATERIAL_CATEGORIES.reduce(
      (sum, cat) => sum + cat.items.length,
      0
    );
  }, []);

  const totalPagesCount = useMemo(() => {
    return READING_MATERIAL_CATEGORIES.reduce(
      (sum, cat) => sum + cat.items.reduce((s, it) => s + it.pages, 0),
      0
    );
  }, []);

  const masteredWrittenCount = useMemo(() => {
    return Object.values(writtenRecords).filter(
      (rec) => rec.status === 'mastered'
    ).length;
  }, [writtenRecords]);

  const totalWrittenPracticeSeconds = useMemo(() => {
    return Object.values(writtenRecords).reduce(
      (sum, rec) => sum + (rec.timeSpentSeconds || 0),
      0
    );
  }, [writtenRecords]);

  const totalQuizQuestionsAnswered = useMemo(() => {
    return quizAttempts.reduce(
      (sum, att) => sum + (att.correctCount + att.wrongCount),
      0
    );
  }, [quizAttempts]);

  return (
    <div className="space-y-8">
      {/* Executive KPI Summary Strip */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Platform and Preparation KPIs
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">Objective MCQs</span>
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {quizCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              GK, Constitution &amp; IQ
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSwitchTab('flagged')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-600 space-y-1 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                Flagged for Review
              </span>
              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {flaggedCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              Review saved questions &rarr;
            </p>
          </button>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">Written Bank</span>
              <PenLine className="w-4 h-4 text-crimson-600 dark:text-crimson-400" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {writtenCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              Papers II, III &amp; IV Cases
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">Materials</span>
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {totalMaterialsCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              13 Editions ({totalPagesCount} pgs)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-xs font-medium">Registered Users</span>
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {isUsersLoading ? '—' : dbUsers.length}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              Firestore verified accounts
            </p>
          </div>
        </div>
      </section>

      {/* Candidate Personal Progress vs Cadre Benchmark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Your Study Standing */}
        <section className="lg:col-span-7 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
                  Target Cadre:{' '}
                  {targetCadreId === 'section-officer'
                    ? 'Section Officer'
                    : targetCadreId === 'nayab-subba'
                      ? 'Nayab Subba'
                      : 'Kharidar'}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Candidate Dossier
                </span>
              </div>
              <h3 className="mt-1 font-serif text-lg font-bold text-zinc-950 dark:text-zinc-50">
                Your Preparation Telemetry
              </h3>
            </div>

            <ActionButton
              to="/progress"
              label="Full Analytics →"
              title="Open full preparation analytics and metrics"
              color="blue"
              variant="ghost"
              size="xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-xs font-mono tabular-nums">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block font-sans">
                MCQs Answered
              </span>
              <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {totalQuizQuestionsAnswered}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block font-sans">
                Written Mastered
              </span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {masteredWrittenCount}/{writtenCount}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block font-sans">
                Exam Sittings
              </span>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {simulationRuns.length}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400 block font-sans">
                Writing Time
              </span>
              <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                {totalWrittenPracticeSeconds > 0
                  ? formatCompactDuration(totalWrittenPracticeSeconds)
                  : '0m'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 col-span-2 sm:col-span-1">
              <span className="text-zinc-500 dark:text-zinc-400 block font-sans">
                Saved for Revision
              </span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {totalLiked}
              </span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <ActionButton
              onClick={() => handleSwitchTab('quiz-bank')}
              label="Browse MCQ Bank"
              title="Filter and browse 50+ objective questions"
              color="blue"
              variant="solid"
              size="md"
              icon={HelpCircle}
            />

            <ActionButton
              onClick={() => handleSwitchTab('written-bank')}
              label="Written Question Bank"
              title="Browse subjective 5M, 10M, and 20M case analytical questions"
              color="crimson"
              variant="solid"
              size="md"
              icon={PenLine}
            />

            <ActionButton
              onClick={() => handleSwitchTab('materials')}
              label="Materials Inventory"
              title="Inspect 13 Nepal Parichaya editions and statutory documents"
              color="emerald"
              variant="solid"
              size="md"
              icon={BookOpen}
            />

            <ActionButton
              onClick={() => handleSwitchTab('users')}
              label="Aspirants Roster"
              title="View peer cohort candidates, ranks, and performance dossiers"
              color="zinc"
              variant="outline"
              size="md"
              icon={Users}
            />

            <ActionButton
              onClick={() => handleSwitchTab('data')}
              label="Backup & Storage"
              title="Export, backup, or reset local study telemetry"
              color="purple"
              variant="outline"
              size="md"
              icon={Database}
              className="ml-auto"
            />
          </div>
        </section>

        {/* Right Column: Live Registered Users Snapshot */}
        <section className="lg:col-span-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50">
                Registered Users (Firestore)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Recent Google-authenticated users &amp; quiz activity
              </p>
            </div>
            <ActionButton
              label={isUsersLoading ? 'View directory →' : `View all ${dbUsers.length} →`}
              title="View full Firestore users directory"
              color="blue"
              variant="ghost"
              size="xs"
              onClick={() => handleSwitchTab('users')}
            />
          </div>

          {isUsersLoading ? (
            <div className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Loading registered users from Firestore...
            </div>
          ) : dbUsers.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
              No signed-in user records found in Firestore yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {dbUsers.slice(0, 4).map((dbUser, idx) => (
                <div
                  key={dbUser.uid}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono tabular-nums text-zinc-400 w-4 text-center">
                      {idx + 1}
                    </span>
                    {dbUser.photoURL ? (
                      <img
                        src={dbUser.photoURL}
                        alt={dbUser.displayName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {dbUser.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {dbUser.displayName}
                        </p>
                        {dbUser.status !== 'active' && (
                          <span
                            className={`font-mono text-[9.5px] px-1.5 py-0.2 rounded border shrink-0 uppercase ${
                              dbUser.status === 'banned'
                                ? 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                                : 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {dbUser.status}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {dbUser.email || dbUser.uid}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono tabular-nums">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {dbUser.averageAccuracy !== null
                        ? `${dbUser.averageAccuracy}%`
                        : '—'}
                    </span>
                    <span className="block text-[10px] text-zinc-400">
                      {dbUser.quizAttemptsCount}{' '}
                      {dbUser.quizAttemptsCount === 1 ? 'attempt' : 'attempts'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Official Cadre Syllabus Frameworks */}
      <section className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-zinc-950 dark:text-zinc-50">
              Official Cadre Syllabus Architecture
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Curated Lok Sewa frameworks with stage structure, papers, passing marks, and exam durations
            </p>
          </div>
          <ActionButton
            to="/syllabus"
            label="Explore Interactive Syllabus →"
            title="Browse full Lok Sewa syllabus curriculum & units"
            color="blue"
            variant="ghost"
            size="xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-blue-800 dark:text-blue-400">
                Gazetted Class III
              </span>
              <span className="font-mono text-zinc-500">4 Papers · 400M</span>
            </div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Section Officer (शाखा अधिकृत)
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Phase I Screening (100M MCQ) &rarr; Phase II Subjective Core (Papers II Governance, III Economy, IV Service Delivery).
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Pass: 40% per paper</span>
              <ActionButton
                to="/syllabus/section-officer"
                label="Blueprint →"
                title="View Section Officer curriculum & exam architecture blueprint"
                color="blue"
                variant="ghost"
                size="xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-400">
                Non-Gazetted I
              </span>
              <span className="font-mono text-zinc-500">3 Papers · 300M</span>
            </div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Nayab Subba (नायब सुब्बा)
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Phase I GK &amp; IQ (100M) &rarr; Phase II Contemporary Affairs &amp; Service Management subjective papers.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Pass: 40% per paper</span>
              <ActionButton
                to="/syllabus/nayab-subba"
                label="Blueprint →"
                title="View Nayab Subba curriculum & exam architecture blueprint"
                color="blue"
                variant="ghost"
                size="xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-amber-800 dark:text-amber-400">
                Non-Gazetted II
              </span>
              <span className="font-mono text-zinc-500">3 Papers · 300M</span>
            </div>
            <h4 className="font-serif font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Kharidar (खरिदार)
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Paper I General Knowledge &amp; Basic Science &rarr; Paper II Office Management, Mathematics &amp; Nepali/English.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Pass: 40% per paper</span>
              <ActionButton
                to="/syllabus/kharidar"
                label="Blueprint →"
                title="View Kharidar curriculum & exam architecture blueprint"
                color="blue"
                variant="ghost"
                size="xs"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
