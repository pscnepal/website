import { MaterialsInventoryTab } from '../../components/dashboard/MaterialsInventoryTab';
import { PageTransition } from '../../components/layout/PageTransition';

export function DashboardMaterialsPage() {
  return (
    <PageTransition transitionKey="materials">
      <div id="dashboard-materials-page" className="space-y-6">
        <MaterialsInventoryTab />
      </div>
    </PageTransition>
  );
}

export default DashboardMaterialsPage;
