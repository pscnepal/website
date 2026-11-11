import { FlaggedQuestionsTab } from '../../components/dashboard/FlaggedQuestionsTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardFlaggedPage() {
  return (
    <PageTransition transitionKey="flagged">
      <div id="dashboard-flagged-page" className="space-y-6">
        <FlaggedQuestionsTab />
      </div>
    </PageTransition>
  );
}

export default DashboardFlaggedPage;
