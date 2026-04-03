"use client";

import { useState } from "react";
import { SidebarUI } from "./SidebarUI";
import { AdminHeader } from "./AdminHeader";
import { useTranslation } from "@/lib/Usetranslation"; // استيراد الترجنة

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isArabic } = useTranslation(); 


  return (
    <div
      // إضافة dir للتحكم في اتجاه الصفحة بالكامل
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0f1117] flex relative overflow-hidden"
    >
      {/* الـ Sidebar سيتمركز تلقائياً بسبب flex و الـ dir */}
      <SidebarUI sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col relative z-10 bg-[#0f1117] w-full min-w-0">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* الحواشي (Padding) ستنعكس تلقائياً مع المحتوى */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
