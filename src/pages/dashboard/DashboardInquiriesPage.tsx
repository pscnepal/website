import { InquiriesTab } from '../../components/dashboard/InquiriesTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardInquiriesPage() {
  return (
    <PageTransition transitionKey="inquiries">
      <div id="dashboard-inquiries-page" className="space-y-6">
        <InquiriesTab />
      </div>
    </PageTransition>
  );
}

export default DashboardInquiriesPage;
