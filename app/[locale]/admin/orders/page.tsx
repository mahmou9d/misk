// app/admin/orders/page.tsx

import AdminLayout from "@/components/layout/Adminlayout";
import OrdersPage from "@/components/sections/Orderspage";
import { ProtectedRoute } from "@/utils/Protectedroute";

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <OrdersPage />
      </AdminLayout>
    </ProtectedRoute>
  );
}
