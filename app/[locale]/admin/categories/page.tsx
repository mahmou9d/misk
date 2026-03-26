import AdminLayout from "@/components/layout/Adminlayout";
import CategoriesPage from "@/components/sections/Categoriespage";
import { ProtectedRoute } from "@/utils/Protectedroute";
export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <CategoriesPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
