import { WrittenQuestionBankTab } from '../../components/dashboard/WrittenQuestionBankTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardWrittenBankPage() {
  return (
    <PageTransition transitionKey="written-bank">
      <div id="dashboard-written-bank-page" className="space-y-6">
        <WrittenQuestionBankTab />
      </div>
    </PageTransition>
  );
}

export default DashboardWrittenBankPage;
