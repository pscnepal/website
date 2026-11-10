import { UsersDirectoryTab } from '../../components/dashboard/UsersDirectoryTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardUsersPage() {
  return (
    <PageTransition transitionKey="users">
      <div id="dashboard-users-page" className="space-y-6">
        <UsersDirectoryTab />
      </div>
    </PageTransition>
  );
}

export default DashboardUsersPage;
