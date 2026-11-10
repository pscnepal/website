import { DataBackupTab } from '../../components/dashboard/DataBackupTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardDataPage() {
  return (
    <PageTransition transitionKey="data">
      <div id="dashboard-data-page" className="space-y-6">
        <DataBackupTab />
      </div>
    </PageTransition>
  );
}

export default DashboardDataPage;
