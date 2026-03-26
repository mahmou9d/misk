import AdminLayout from "@/components/layout/Adminlayout";
import OverviewPage from "@/components/layout/Overviewpage";
import { ProtectedRoute } from "@/utils/Protectedroute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OverviewPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
