import { QuizQuestionBankTab } from '../../components/dashboard/QuizQuestionBankTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardQuizBankPage() {
  return (
    <PageTransition transitionKey="quiz-bank">
      <div id="dashboard-quiz-bank-page" className="space-y-6">
        <QuizQuestionBankTab />
      </div>
    </PageTransition>
  );
}

export default DashboardQuizBankPage;
