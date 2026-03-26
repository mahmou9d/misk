import AdminLayout from "@/components/layout/Adminlayout";
import Bannerspage from "@/components/sections/Bannerspage";
import { ProtectedRoute } from "@/utils/Protectedroute";
export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Bannerspage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
