import AdminLayout from "@/components/layout/Adminlayout";
import ProductsPage from "@/components/sections/Productspage";
import { ProtectedRoute } from "@/utils/Protectedroute";
export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <ProductsPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
