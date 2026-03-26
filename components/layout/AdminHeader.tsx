"use client";

import { motion } from "framer-motion";
import { Search, Bell, Menu, X } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const AdminHeader = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="h-20 bg-[#1a1d29] border-b border-white/5 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl hover:bg-white/5 shrink-0 flex md:hidden"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5 text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-400" />
          )}
        </motion.button>

      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-3 rounded-xl hover:bg-white/5"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#b4182d] rounded-full ring-2 ring-[#1a1d29]" />
        </motion.button>
      </div>
    </header>
  );
};
