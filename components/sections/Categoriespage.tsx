"use client";
import { useState } from "react";
import {
  FolderPlus,
  Tag,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useGetCategory, useCreateCategory } from "@/hooks/useDashboard";
import { useShowNotification } from "@/utils/showNotification";
import { ErrorResponse, NotificationState } from "@/type/type";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useTranslation } from "@/lib/Usetranslation";

export default function CategoriesPage() {
  const { t, dir } = useTranslation();
  const c = t.adminCategories;

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const showNotification = useShowNotification(setNotification);

  const { data: categories, isLoading } = useGetCategory();
  const { mutate, isPending, isSuccess, isError } = useCreateCategory();

  const create = () => {
    if (!name.trim()) return;
    mutate(
      { name, name_ar: nameAr },
      {
        onSuccess: () => {
          showNotification(`"${name}" ${c.created}`, "success");
          setName("");
          setNameAr("");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              error?.response?.data?.status ||
              error?.response?.data?.non_field_errors ||
              error?.response?.data?.name ||
              error?.message ||
              c.createFailed,
            "error",
          );
        },
      },
    );
  };

  return (
    <div dir={dir}>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">{c.title}</h1>
        <p className="text-gray-400 text-base">{c.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl items-start">
        {/* Create Category Card */}
        <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center">
                <FolderPlus className="w-8 h-8 text-[#fff]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {c.newCategory}
                </h2>
                <p className="text-sm text-gray-400">{c.nameLabel}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="mb-6 flex flex-col gap-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  {c.nameLabel}{" "}
                  <span className="text-[#fff] font-normal text-xs">
                    (EN)
                  </span>{" "}
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder={c.namePlaceholder}
                    disabled={isPending}
                    dir="ltr"
                    className="w-full pl-12 pr-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />
                </div>
              </div>

              {/* Name AR */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  {c.nameLabel}{" "}
                  <span className="text-[#fff] font-normal text-xs">(AR)</span>
                </label>
                <div className="relative">
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="اسم الفئة بالعربي"
                    disabled={isPending}
                    dir="rtl"
                    className="w-full pr-12 pl-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Error */}
              {isError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 font-medium">
                    {c.createFailed}
                  </span>
                </div>
              )}

              {/* Success */}
              {isSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-medium">
                    {c.created}
                  </span>
                </div>
              )}
            </div>

            {/* Button */}
            <button
              onClick={create}
              disabled={isPending || !name.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#fff]/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <RefreshCw className="animate-spin w-6 h-6" />
                  {c.createBtn}...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  {c.createBtn}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Existing Categories Card */}
        <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/20 flex items-center justify-center">
                <Tag className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {c.existing}
                </h2>
                <p className="text-sm text-gray-400">
                  {categories?.length ?? 0} {c.title}
                </p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="p-8">
            {isLoading && (
              <div className="flex items-center gap-3 text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <p className="text-sm">{c.loading}</p>
              </div>
            )}

            {categories?.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Tag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">{c.empty}</p>
              </div>
            )}

            <div className="space-y-3">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#fff]/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-[#fff]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {cat.name}
                      </span>
                      {cat.name_ar && (
                        <span
                          className="text-xs text-[#fff]/70 block"
                          dir="rtl"
                        >
                          {cat.name_ar}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    #{cat.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="mt-6 p-6 bg-[#1a1d29]/50 border border-white/5 rounded-xl max-w-4xl">
        <div className="flex items-center gap-2 text-gray-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">
            {c.nameLabel} — {c.namePlaceholder}
          </p>
        </div>
      </div>
    </div>
  );
}
