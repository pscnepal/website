import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardOverviewPage } from './dashboard/DashboardOverviewPage';

export type DashboardTab =
  | 'overview'
  | 'quiz-bank'
  | 'written-bank'
  | 'users'
  | 'materials'
  | 'data';

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (
      tabParam &&
      ['quiz-bank', 'written-bank', 'users', 'materials', 'data'].includes(tabParam)
    ) {
      navigate(`/dashboard/${tabParam}`, { replace: true });
    }
  }, [tabParam, navigate]);

  return <DashboardOverviewPage />;
}

export default DashboardPage;
