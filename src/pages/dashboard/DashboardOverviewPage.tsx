import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardOverviewTab } from '../../components/dashboard/DashboardOverviewTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardOverviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  // Handle legacy ?tab= query parameter redirects to the separate pages
  useEffect(() => {
    if (tabParam && ['quiz-bank', 'written-bank', 'materials', 'users', 'data'].includes(tabParam)) {
      navigate(`/dashboard/${tabParam}`, { replace: true });
    }
  }, [tabParam, navigate]);

  return (
    <PageTransition transitionKey="overview">
      <div id="dashboard-overview-page" className="space-y-6">
        <DashboardOverviewTab />
      </div>
    </PageTransition>
  );
}

export default DashboardOverviewPage;
