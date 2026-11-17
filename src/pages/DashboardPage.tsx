import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { DashboardTab } from '../types/dashboard';
import { DashboardOverviewPage } from './dashboard/DashboardOverviewPage';

export type { DashboardTab };

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (
      tabParam &&
      ['quiz-bank', 'flagged', 'written-bank', 'users', 'inquiries', 'materials', 'data'].includes(tabParam)
    ) {
      navigate(`/dashboard/${tabParam}`, { replace: true });
    }
  }, [tabParam, navigate]);

  return <DashboardOverviewPage />;
}

export default DashboardPage;
