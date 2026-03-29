"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Image, // للـ banners
  Tag, // للـ categories
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";


export const SidebarUI = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, isArabic } = useTranslation();
  const a = t.admin;

  const handleMenuClick = (href: string) => {
    router.push(href);
    if (typeof window !== "undefined" && window.innerWidth < 768)
      setSidebarOpen(false);
  };

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: a.dashboard,
    href: `/${locale.toLowerCase()}/admin`,
  },
  {
    id: "categories",
    icon: Tag,
    label: a.categories,
    href: `/${locale.toLowerCase()}/admin/categories`,
  },
  {
    id: "products",
    icon: Package,
    label: a.products,
    href: `/${locale.toLowerCase()}/admin/products`,
  },
  {
    id: "orders",
    icon: ShoppingCart,
    label: a.orders,
    href: `/${locale.toLowerCase()}/admin/orders`,
  },
  {
    id: "banners",
    icon: Image,
    label: a.banners,
    href: `/${locale.toLowerCase()}/admin/banners`,
  },
];

  const SidebarContent = () => (
    <>
      <div
        className={`h-20 flex items-center justify-between px-6 border-b border-white/5 ${isArabic ? "flex-row-reverse" : ""}`}
      >
        {sidebarOpen && (
          <div
            className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center shadow-xl shadow-[#fff]/20">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white">MyStore</span>
              <p className="text-xs text-gray-500 font-medium">Pro Dashboard</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
console.log(isActive);
          return (
            <button
              key={item.id}
              dir="ltr"
              onClick={() => handleMenuClick(item.href)}
              className={`w-full flex items-center gap-3 px-3.5 py-3.5 rounded-xl relative group transition-all ${
                isArabic ? "flex-row-reverse text-right " : ""
              } ${
                isActive
                  ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white shadow-xl shadow-[#fff]/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-semibold text-sm whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-white/5">
          <div
            className={`flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer group ${isArabic ? "flex-row-reverse text-right" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">webvitas</p>
            </div>
            {isArabic ? (
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            // يعتمد الدخول من اليمين أو اليسار حسب اللغة
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "100%" : "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`md:hidden fixed top-0 bottom-0 w-[280px] bg-[#1a1d29] border-white/5 flex flex-col z-50 ${
              isArabic ? "right-0 border-l" : "left-0 border-r"
            }`}
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? "280px" : "80px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`hidden md:flex bg-[#1a1d29] flex-col relative z-10 ${
          isArabic
            ? "border-l border-white/5 right-0"
            : "border-r border-white/5 left-0"
        }`}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};
