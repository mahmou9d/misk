"use client";
import { useState } from "react";
import {
  FolderPlus,
  Tag,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import {
  useGetCategory,
  useCreateCategory,
  usePatchCategory,
  useDeleteCategory,
} from "@/hooks/useDashboard";
import { useShowNotification } from "@/utils/showNotification";
import { ErrorResponse, NotificationState } from "@/type/type";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useTranslation } from "@/lib/Usetranslation";

export default function CategoriesPage() {
  const { t, dir, isArabic } = useTranslation();
  const c = t.adminCategories;

  const [name_en, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  // Per-item patching state (replaces global `patching` boolean)
  const [patchingId, setPatchingId] = useState<number | null>(null);

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const showNotification = useShowNotification(setNotification);

  const { data: categories, isLoading } = useGetCategory({ all: true });
  const { mutate, isPending, isSuccess, isError } = useCreateCategory();
  const { mutate: patchCategory } = usePatchCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory({
    hard: true,
  });

  const create = () => {
    if (!name_en.trim()) return;
    mutate(
      { name_en, name_ar: nameAr },
      {
        onSuccess: () => {
          showNotification(`"${name_en}" ${c.created}`, "success");
          setNameEn("");
          setNameAr("");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message || c.createFailed,
            "error",
          );
        },
      },
    );
  };

  const startEdit = (cat: {
    id: number;
    name_en: string;
    name_ar?: string;
    is_active?: boolean;
  }) => {
    setEditingId(cat.id);
    setEditName(cat.name_en ?? "");
    setEditNameAr(cat.name_ar ?? "");
    setEditIsActive(cat.is_active ?? true);
    setConfirmDeleteId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditNameAr("");
    setEditIsActive(true);
  };

  const saveEdit = (id: number) => {
    if (!editName.trim()) return;
    setPatchingId(id);
    patchCategory(
      {
        id,
        body: {
          name_en: editName,
          name_ar: editNameAr,
          is_active: editIsActive,
        },
      },
      {
        onSuccess: () => {
          showNotification(`"${editName}" updated`, "success");
          setPatchingId(null);
          cancelEdit();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message || "Update failed",
            "error",
          );
          setPatchingId(null);
        },
      },
    );
  };

  const handleDelete = (id: number, catName: string) => {
    deleteCategory(id, {
      onSuccess: () => {
        showNotification(`"${catName}" deleted`, "success");
        setConfirmDeleteId(null);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(
          error?.response?.data?.message || "Delete failed",
          "error",
        );
        setConfirmDeleteId(null);
      },
    });
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl items-start">
        {/* Create Category Card */}
        <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
          {/* Card Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fda481] to-[#b4182d] flex items-center justify-center">
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
                  <span className="text-[#fff] font-normal text-xs">(EN)</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name_en}
                    onChange={(e) => setNameEn(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder={c.namePlaceholder}
                    disabled={isPending}
                    dir="ltr"
                    className="w-full pl-12 pr-4 py-4 bg-[#0f1117] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isPending || !name_en.trim()}
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
          <div className="md:p-8">
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
                  className={`rounded-xl border transition-all overflow-hidden ${
                    editingId === cat.id
                      ? "border-white/20 bg-white/5"
                      : cat.is_active
                        ? "border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/5"
                        : "border-white/5 hover:border-white/15 hover:bg-white/3"
                  }`}
                >
                  {/* Normal row */}
                  {editingId !== cat.id && (
                    <div className="flex justify-between items-center p-4">
                      {/* Left: icon + names */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            cat.is_active
                              ? "bg-emerald-500/15 border border-emerald-500/30"
                              : "bg-white/5 border border-white/10"
                          }`}
                        >
                          <Tag
                            className={`w-4 h-4 ${
                              cat.is_active
                                ? "text-emerald-400"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {cat.name_en}
                            </span>
                            {/* Active / Inactive badge */}
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                                cat.is_active
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                  : "bg-gray-700/50 text-gray-500 border border-gray-600/30"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  cat.is_active
                                    ? "bg-emerald-400"
                                    : "bg-gray-500"
                                }`}
                              />
                              {cat.is_active
                                ? isArabic
                                  ? "مفعل"
                                  : "Active"
                                : isArabic
                                  ? "غير مفعل"
                                  : "Inactive"}
                            </span>
                          </div>
                          {cat.name_ar && (
                            <span
                              className="text-xs text-white/50 block mt-0.5"
                              dir="rtl"
                            >
                              {cat.name_ar}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: id + action buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Toggle active — green pill button */}
                        <button
                          onClick={() => {
                            setPatchingId(cat.id);
                            patchCategory(
                              {
                                id: cat.id,
                                body: { is_active: !cat.is_active },
                              },
                              {
                                onSuccess: () => {
                                  setPatchingId(null);
                                  showNotification(
                                    `"${cat.name_en}" ${cat.is_active ? "deactivated" : "activated"}`,
                                    "success",
                                  );
                                },
                                onError: (error: AxiosError<ErrorResponse>) => {
                                  setPatchingId(null);
                                  showNotification(
                                    error?.response?.data?.message ||
                                      "Update failed",
                                    "error",
                                  );
                                },
                              },
                            );
                          }}
                          disabled={patchingId === cat.id}
                          title={cat.is_active ? "Deactivate" : "Activate"}
                          className={`h-10 px-2.5 rounded-lg border text-[10px] font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                            cat.is_active
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-gray-700/40 border-gray-600/30 text-gray-500 hover:bg-gray-600/40 hover:text-gray-300"
                          }`}
                        >
                          {patchingId === cat.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : cat.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {isArabic ? "مفعل" : "Active"}
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                              {isArabic ? "غير مفعل" : "Inactive"}
                            </>
                          )}
                        </button>
                        <div className="flex flex-col md:flex-row gap-2">
                          {/* Edit — blue */}
                          <button
                            onClick={() => startEdit(cat)}
                            title="Edit"
                            className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/25 hover:border-blue-500/50 flex items-center justify-center transition-all"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>

                          {/* Delete / Confirm delete — red */}
                          {confirmDeleteId === cat.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleDelete(cat.id, cat.name_en)
                                }
                                disabled={deleting}
                                title="Confirm delete"
                                className="w-10 h-10 rounded-lg bg-red-500/25 border border-red-500/50 text-red-400 hover:bg-red-500/40 flex items-center justify-center transition-all"
                              >
                                {deleting ? (
                                  <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                title="Cancel"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 flex items-center justify-center transition-all"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setConfirmDeleteId(cat.id);
                                cancelEdit();
                              }}
                              title="Delete"
                              className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/25 hover:border-red-500/40 hover:text-red-400 flex items-center justify-center transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit inline row */}
                  {editingId === cat.id && (
                    <div className="p-4 bg-white/5 border border-white/20 rounded-xl space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        dir="ltr"
                        placeholder="Category name (EN)"
                        className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                      />
                      <input
                        type="text"
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        dir="rtl"
                        placeholder="اسم الفئة بالعربي"
                        className="w-full px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-white/40"
                      />

                      {/* is_active toggle */}
                      <button
                        type="button"
                        onClick={() => setEditIsActive((v) => !v)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all w-full ${
                          editIsActive
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <span
                          className={`w-8 h-4 rounded-full flex items-center transition-all duration-200 px-0.5 ${
                            editIsActive ? "bg-emerald-500" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${
                              editIsActive
                                ? isArabic
                                  ? "-translate-x-4"
                                  : "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            editIsActive ? "text-emerald-400" : "text-gray-500"
                          }`}
                        >
                          {editIsActive ? "Active" : "Inactive"}
                        </span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(cat.id)}
                          disabled={patchingId === cat.id || !editName.trim()}
                          className="flex-1 py-2 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {patchingId === cat.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          {isArabic ? "حفظ" : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                          {isArabic ? "إلغاء" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
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
