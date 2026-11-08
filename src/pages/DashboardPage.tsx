import { useEffect, useState } from 'react';
import {
  BookOpen,
  Database,
  HelpCircle,
  LayoutDashboard,
  PenLine,
  Users,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ActionButton } from '../components/common/ActionButton';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { PageTransition } from '../components/layout/PageTransition';
import { DashboardOverviewTab } from '../components/dashboard/DashboardOverviewTab';
import { QuizQuestionBankTab } from '../components/dashboard/QuizQuestionBankTab';
import { WrittenQuestionBankTab } from '../components/dashboard/WrittenQuestionBankTab';
import { UsersDirectoryTab } from '../components/dashboard/UsersDirectoryTab';
import { MaterialsInventoryTab } from '../components/dashboard/MaterialsInventoryTab';
import { DataBackupTab } from '../components/dashboard/DataBackupTab';
import { ALL_QUIZ_QUESTIONS } from '../data/quizData';
import { WRITTEN_QUESTIONS } from '../data/writtenQuestionsData';
import { INITIAL_CANDIDATE_USERS } from '../data/candidateUsersData';

export type DashboardTab =
  | 'overview'
  | 'quiz-bank'
  | 'written-bank'
  | 'users'
  | 'materials'
  | 'data';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as DashboardTab | null;

  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    if (
      tabParam &&
      ['overview', 'quiz-bank', 'written-bank', 'users', 'materials', 'data'].includes(
        tabParam
      )
    ) {
      return tabParam;
    }
    return 'overview';
  });

  useEffect(() => {
    if (
      tabParam &&
      ['overview', 'quiz-bank', 'written-bank', 'users', 'materials', 'data'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <PageTransition transitionKey={activeTab}>
        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-8">
            {/* Breadcrumb & Header */}
            <div className="space-y-2">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Link
                  to="/"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">
                  Command Dashboard
                </span>
              </nav>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                    PSC Nepal Dashboard &amp; Question Banks
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
                    Executive repository indexing objective MCQs, subjective written questions, candidate aspirants roster, and official publications.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <ActionButton
                    to="/simulate"
                    label="Exam Simulation"
                    title="Launch timed PSC exam simulation hall"
                    color="amber"
                    variant="solid"
                    size="sm"
                  />
                  <ActionButton
                    to="/written"
                    label="Written Practice"
                    title="Open written answer practice sandbox"
                    color="crimson"
                    variant="outline"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Segmented Horizontal Tabs Navigation */}
            <div
              role="tablist"
              aria-label="Dashboard views"
              className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-none"
            >
              <ActionButton
                label="Executive Overview"
                title="Switch to executive dashboard overview"
                icon={LayoutDashboard}
                color="zinc"
                variant={activeTab === 'overview' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('overview')}
                className="whitespace-nowrap shrink-0"
              />

              <ActionButton
                label={`Quiz Question Bank (${ALL_QUIZ_QUESTIONS.length})`}
                title="Browse and test 50+ objective questions"
                icon={HelpCircle}
                color={activeTab === 'quiz-bank' ? 'blue' : 'zinc'}
                variant={activeTab === 'quiz-bank' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('quiz-bank')}
                className="whitespace-nowrap shrink-0"
              />

              <ActionButton
                label={`Written Question Bank (${WRITTEN_QUESTIONS.length})`}
                title="Inspect subjective questions and model solutions"
                icon={PenLine}
                color={activeTab === 'written-bank' ? 'crimson' : 'zinc'}
                variant={activeTab === 'written-bank' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('written-bank')}
                className="whitespace-nowrap shrink-0"
              />

              <ActionButton
                label={`Aspirants / Users (${INITIAL_CANDIDATE_USERS.length})`}
                title="View candidate directory and peer cohort"
                icon={Users}
                color={activeTab === 'users' ? 'amber' : 'zinc'}
                variant={activeTab === 'users' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('users')}
                className="whitespace-nowrap shrink-0"
              />

              <ActionButton
                label="Materials Inventory"
                title="Browse 13 official Nepal Parichaya editions and statutory documents"
                icon={BookOpen}
                color={activeTab === 'materials' ? 'emerald' : 'zinc'}
                variant={activeTab === 'materials' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('materials')}
                className="whitespace-nowrap shrink-0"
              />

              <ActionButton
                label="Data & Backup"
                title="Export or reset local browser study progress"
                icon={Database}
                color={activeTab === 'data' ? 'purple' : 'zinc'}
                variant={activeTab === 'data' ? 'solid' : 'ghost'}
                size="md"
                onClick={() => handleTabChange('data')}
                className="whitespace-nowrap shrink-0"
              />
            </div>

            {/* Active Tab Panel */}
            <div role="tabpanel" className="pt-2">
              {activeTab === 'overview' && (
                <DashboardOverviewTab onSwitchTab={handleTabChange} />
              )}
              {activeTab === 'quiz-bank' && <QuizQuestionBankTab />}
              {activeTab === 'written-bank' && <WrittenQuestionBankTab />}
              {activeTab === 'users' && <UsersDirectoryTab />}
              {activeTab === 'materials' && <MaterialsInventoryTab />}
              {activeTab === 'data' && <DataBackupTab />}
            </div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}
export default DashboardPage;
