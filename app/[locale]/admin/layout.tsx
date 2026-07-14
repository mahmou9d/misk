import AdminLayout from "@/components/admin/Adminlayout";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
