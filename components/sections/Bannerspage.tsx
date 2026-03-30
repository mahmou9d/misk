/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  useGetBanners,
  useCreateBanner,
  usePatchBanner,
  useDeleteBanner,
  useGetDashboardSettings,
  usePatchDashboardSettings,
  useGetDashboardGovernorates,
  usePatchGovernorate,
  usePostGovernorate,
} from "@/hooks/useDashboard";
import { P } from "@/components/layout/Adminui";
import { NotificationState, Banner, ErrorResponse } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useTranslation } from "@/lib/Usetranslation";
import { RefreshCw, AlertCircle } from "lucide-react";

// ─── Image Size Limit ─────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

// ─── Shared Sub-components ────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  const { dir } = useTranslation();
  const isRTL = dir === "rtl";

  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        checked ? "bg-gradient-to-r from-[#fda481] to-[#b4182d]" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          isRTL
            ? checked
              ? "-translate-x-1"
              : "-translate-x-[26px]"
            : checked
              ? "translate-x-[26px]"
              : "translate-x-1"
        }`}
      />
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  const { t } = useTranslation();
  return (
    <span
      className={`text-sm font-semibold text-white rounded-full px-3 py-1 whitespace-nowrap ${
        active
          ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-[#fff] "
          : "bg-white/5 text-gray-500 "
      }`}
    >
      {active
        ? t.bannersSettings.status.active
        : t.bannersSettings.status.inactive}
    </span>
  );
}

const inputClass =
  "w-full h-10 rounded-xl border border-white/10 bg-[#0f1117] px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#fff]/50 focus:ring-2 focus:ring-[#fff]/20 transition";

// ─── Tab type ─────────────────────────────────────────────────────────────────

type Tab = "banners" | "governorates" | "settings";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BannersSettingsPage() {
  const { dir, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("banners");
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const showNotification = useShowNotification(setNotification);

  return (
    <div dir={dir} className="w-full">
      <P t={t.bannersSettings.title} s={t.bannersSettings.subtitle} />

      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      {/* Card */}
      <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden max-w-[860px]">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 px-6 pt-4">
          {(["banners", "governorates", "settings"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[16px] font-semibold capitalize rounded-t-md transition-colors -mb-px border-b-2 ${
                activeTab === tab
                  ? "border-[#fff] text-[#fff] bg-transparent"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab === "banners"
                ? t.bannersSettings.tabs.banners
                : tab === "governorates"
                  ? t.bannersSettings.tabs.governorates
                  : t.bannersSettings.tabs.settings}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="p-6">
            {activeTab === "banners" ? (
              <BannersTab showNotification={showNotification} />
            ) : activeTab === "governorates" ? (
              <GovernoratesTab showNotification={showNotification} />
            ) : (
              <SettingsTab showNotification={showNotification} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Banners Tab ──────────────────────────────────────────────────────────────

function BannersTab({
  showNotification,
}: {
  showNotification: (msg: string, type: "success" | "error") => void;
}) {
  const { t, isArabic } = useTranslation();
  const b = t.bannersSettings.banners;

  const { data: banners, isLoading, isError } = useGetBanners();
  const { mutate: createBanner, isPending: creating } = useCreateBanner();
  const { mutate: patchBanner, isPending: patching } = usePatchBanner();
  const { mutate: deleteBanner, isPending: deleting } = useDeleteBanner();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editFields, setEditFields] = useState<{
    title_en: string;
    title_ar: string;
    link: string;
    order: number;
    is_active: boolean;
  }>({ title_en: "", title_ar: "", link: "", order: 1, is_active: true });

  // ── Create form state ──
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newOrder, setNewOrder] = useState(1);
  const [newIsActive, setNewIsActive] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // ── Image size validation helper ──
  const validateImageSize = (file: File): boolean => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      showNotification(
        isArabic
          ? `حجم الصورة يجب أن يكون أقل من ${MAX_IMAGE_SIZE_MB} ميجا`
          : `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`,
        "error",
      );
      return false;
    }
    return true;
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] ?? null;

  if (file && !validateImageSize(file)) {
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  setNewImage(file);
  setPreviewUrl(file ? URL.createObjectURL(file) : null);
};

  const resetCreateForm = () => {
    setNewTitleEn("");
    setNewTitleAr("");
    setNewLink("");
    setNewOrder(1);
    setNewIsActive(true);
    setNewImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowCreateForm(false);
  };

  const handleCreate = () => {
    if (!newImage) return;
    const fd = new FormData();
    fd.append("title_en", newTitleEn);
    fd.append("title_ar", newTitleAr);
    fd.append("link", newLink);
    fd.append("order", String(newOrder));
    fd.append("is_active", String(newIsActive));
    fd.append("image", newImage);
    createBanner(fd, {
      onSuccess: () => {
        showNotification(b.notifications.created, "success");
        resetCreateForm();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(
          error?.response?.data?.message || b.notifications.createFailed,
          "error",
        );
      },
    });
  };

  const handleEditOpen = (banner: Banner) => {
    setEditingId(banner.id);
    setEditFields({
      title_en: banner.title_en,
      title_ar: banner.title_ar,
      link: banner.link,
      order: banner.order,
      is_active: banner.is_active,
    });
    setEditImage(null);
    setEditImagePreview(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const handleEditSave = (id: number) => {
    const onSuccess = () => {
      showNotification(b.notifications.updated, "success");
      setEditingId(null);
      setEditImage(null);
      setEditImagePreview(null);
    };
    const onError = (error: AxiosError<ErrorResponse>) => {
      showNotification(
        error?.response?.data?.message || error?.message,
        "error",
      );
    };

    if (editImage) {
      const fd = new FormData();
      fd.append("title_en", editFields.title_en);
      fd.append("title_ar", editFields.title_ar);
      fd.append("link", editFields.link);
      fd.append("order", String(editFields.order));
      fd.append("is_active", String(editFields.is_active));
      fd.append("image", editImage);
      console.log(editFields.title_en);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      patchBanner({ id, body: fd as any }, { onSuccess, onError });
    } else {
      patchBanner({ id, body: editFields }, { onSuccess, onError });
    }
  };

  const handleToggleActive = (banner: Banner) => {
    patchBanner(
      { id: banner.id, body: { is_active: !banner.is_active } },
      {
        onSuccess: () => showNotification(b.notifications.toggled, "success"),
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              error?.response?.data?.status ||
              error?.response?.data?.non_field_errors ||
              error?.response?.data?.name ||
              error?.message,
            "error",
          );
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteBanner(id, {
      onSuccess: () => {
        showNotification(b.notifications.deleted, "success");
        setDeletingId(null);
        setExpandedId(null);
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.response?.data?.error ||
            error?.response?.data?.status ||
            error?.response?.data?.non_field_errors ||
            error?.response?.data?.name ||
            error?.message,
          "error",
        );
        setDeletingId(null);
      },
    });
  };

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-start mb-5">
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="text-sm font-bold px-6 py-2.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl shadow-lg shadow-[#fff]/20 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span> {b.addBtn}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-5 p-5 border border-white/10 rounded-2xl bg-[#0f1117]">
          <p className="text-sm font-bold text-gray-400 mb-4 uppercase -wider">
            {b.newBanner}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Title EN */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {b.fields.title_en}{" "}
                <span className="text-[#fff] font-normal text-xs">(EN)</span>
              </label>
              <input
                className={inputClass}
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder="Summer Sale"
                dir="ltr"
              />
            </div>

            {/* Title AR */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {b.fields.title_ar}{" "}
                <span className="text-[#fff] font-normal text-xs">(AR)</span>
              </label>
              <input
                className={inputClass}
                value={newTitleAr}
                onChange={(e) => setNewTitleAr(e.target.value)}
                placeholder="تخفيضات الصيف"
                dir="rtl"
              />
            </div>

            {/* Link */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {b.fields.linkUrl}
              </label>
              <input
                className={inputClass}
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com/sale"
              />
            </div>

            {/* Order */}
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {b.fields.order}
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={newOrder}
                onChange={(e) => setNewOrder(Number(e.target.value))}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-end gap-3 pb-1">
              <label className="text-sm text-gray-400 font-bold">
                {b.fields.active}
              </label>
              <Toggle
                checked={newIsActive}
                onChange={() => setNewIsActive((v) => !v)}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 mb-1.5 block font-bold">
              {b.fields.image}
              <span className="text-gray-600 font-normal text-xs ml-2">
                {isArabic
                  ? `(الحد الأقصى ${MAX_IMAGE_SIZE_MB} ميجا)`
                  : `(max ${MAX_IMAGE_SIZE_MB}MB)`}
              </span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-400 file:ml-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-[#fda481] file:to-[#b4182d] file:text-white hover:file:opacity-90 cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10 w-full max-w-xs h-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating || !newImage}
              className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {creating ? b.actions.saving : b.actions.save}
            </button>
            <button
              onClick={resetCreateForm}
              className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              {b.actions.cancel}
            </button>
          </div>
        </div>
      )}

      {/* States */}
      {isLoading && (
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <p className="text-sm">{b.loading}</p>
        </div>
      )}
      {isError && (
        <p className="text-sm text-red-400 font-medium">{b.loadError}</p>
      )}
      {!isLoading && banners?.length === 0 && (
        <p className="text-sm text-gray-500 italic">{b.empty}</p>
      )}

      {/* List */}
      <div className="flex flex-col gap-2.5">
        {banners?.map((banner: Banner) => {
          const isExpanded = expandedId === banner.id;
          const isEditing = editingId === banner.id;
          return (
            <div
              key={banner.id}
              className="border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : banner.id)}
                className="flex items-center gap-3 p-4 bg-[#0f1117] cursor-pointer hover:bg-white/5 transition-colors flex-wrap"
              >
                <div className="w-14 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                  {banner.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={banner.img_url}
                      alt={banner.title_en}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      IMG
                    </div>
                  )}
                </div>

                <span className="text-sm text-gray-600 shrink-0 min-w-[24px] font-mono">
                  #{banner.order}
                </span>

                <div className="flex-1 min-w-[100px]">
                  <p className="text-sm font-bold text-white leading-tight">
                    {banner.title_en || "—"}
                  </p>
                  {banner.title_ar && (
                    <p
                      className="text-xs text-[#fff]/70 leading-tight mt-0.5"
                      dir="rtl"
                    >
                      {banner.title_ar}
                    </p>
                  )}
                  {banner.link && (
                    <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
                      {banner.link}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <StatusBadge active={banner.is_active} />
                </div>

                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <Toggle
                    checked={banner.is_active}
                    onChange={() => handleToggleActive(banner)}
                    disabled={patching}
                  />
                </div>

                <span
                  className={`text-xs text-gray-600 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                >
                  ▼
                </span>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="bg-[#1a1d29] border-t border-white/10 p-5">
                  {banner.img_url && (
                    <div className="mb-5 rounded-xl overflow-hidden border border-white/10 w-full max-h-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.img_url}
                        alt={banner.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title EN */}
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            {b.fields.title_en}{" "}
                            <span className="text-[#fff] font-normal text-xs">
                              (EN)
                            </span>
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.title_en}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                title_en: e.target.value,
                              }))
                            }
                            dir="ltr"
                          />
                        </div>

                        {/* Title AR */}
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            {b.fields.title_ar}{" "}
                            <span className="text-[#fff] font-normal text-xs">
                              (AR)
                            </span>
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.title_ar}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                title_ar: e.target.value,
                              }))
                            }
                            placeholder="العنوان بالعربي"
                            dir="rtl"
                          />
                        </div>

                        {/* Link */}
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            {b.fields.linkUrl}
                          </label>
                          <input
                            className={inputClass}
                            value={editFields.link}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                link: e.target.value,
                              }))
                            }
                          />
                        </div>

                        {/* Order */}
                        <div>
                          <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                            {b.fields.order}
                          </label>
                          <input
                            type="number"
                            min={1}
                            className={inputClass}
                            value={editFields.order}
                            onChange={(e) =>
                              setEditFields((f) => ({
                                ...f,
                                order: Number(e.target.value),
                              }))
                            }
                          />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-end gap-3 pb-1">
                          <label className="text-sm text-gray-400 font-bold">
                            {b.fields.active}
                          </label>
                          <Toggle
                            checked={editFields.is_active}
                            onChange={() =>
                              setEditFields((f) => ({
                                ...f,
                                is_active: !f.is_active,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                          {b.fields.replaceImage}{" "}
                          <span className="text-gray-600 font-normal text-sm">
                            {b.fields.optional}
                          </span>
                          <span className="text-gray-600 font-normal text-xs ml-2">
                            {isArabic
                              ? `(الحد الأقصى ${MAX_IMAGE_SIZE_MB} ميجا)`
                              : `(max ${MAX_IMAGE_SIZE_MB}MB)`}
                          </span>
                        </label>
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;

                            if (file && !validateImageSize(file)) {
                              if (editFileInputRef.current)
                                editFileInputRef.current.value = "";
                              return;
                            }

                            setEditImage(file);
                            setEditImagePreview(
                              file ? URL.createObjectURL(file) : null,
                            );
                          }}
                          className="text-sm text-gray-400 file:ml-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-[#fda481] file:to-[#b4182d] file:text-white hover:file:opacity-90 cursor-pointer"
                        />
                        {editImagePreview && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-white/10 w-full max-w-xs h-28">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={editImagePreview}
                              alt="new preview"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                        <button
                          onClick={() => handleEditSave(banner.id)}
                          disabled={patching}
                          className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                        >
                          {patching ? b.actions.saving : b.actions.save}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
                        >
                          {b.actions.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOpen(banner);
                        }}
                        className="text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <span>✏</span> {b.actions.edit}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(b.actions.deleteConfirm))
                            handleDelete(banner.id);
                        }}
                        disabled={deleting && deletingId === banner.id}
                        className="text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <span>🗑</span>{" "}
                        {deleting && deletingId === banner.id
                          ? b.actions.deleting
                          : b.actions.delete}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Governorates Tab ──────────────────────────────────────────────────────────────

function GovernoratesTab({
  showNotification,
}: {
  showNotification: (msg: string, type: "success" | "error") => void;
}) {
  const { data, isLoading, isError } = useGetDashboardGovernorates();
  const { mutate: patchGov, isPending: patching } = usePatchGovernorate();
  const { mutate: postGov, isPending: posting } = usePostGovernorate();
  const { t, isArabic } = useTranslation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<{
    name_en: string;
    name_ar: string;
    shipping_fee: number;
    is_active: boolean;
  }>({ name_en: "", name_ar: "", shipping_fee: 0, is_active: true });

  const [showCreate, setShowCreate] = useState(false);
  const [newFields, setNewFields] = useState({
    name_en: "",
    name_ar: "",
    shipping_fee: 0,
  });

  const govList = Array.isArray(data) ? data : ((data as any)?.results ?? []);

  const handleEditOpen = (gov: any) => {
    setEditingId(gov.id);
    setEditFields({
      name_en: gov.name_en,
      name_ar: gov.name_ar,
      shipping_fee: gov.shipping_fee,
      is_active: gov.is_active,
    });
  };

  const handleEditSave = (id: number) => {
    patchGov(
      { id, body: editFields },
      {
        onSuccess: () => {
          showNotification(
            isArabic ? "تم التحديث بنجاح" : "Updated successfully",
            "success",
          );
          setEditingId(null);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              (isArabic ? "حدث خطأ" : "Something went wrong"),
            "error",
          );
        },
      },
    );
  };

  const handleCreate = () => {
    postGov(newFields, {
      onSuccess: () => {
        showNotification(
          isArabic ? "تم الإضافة بنجاح" : "Added successfully",
          "success",
        );
        setShowCreate(false);
        setNewFields({ name_en: "", name_ar: "", shipping_fee: 0 });
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(
          error?.response?.data?.message ||
            (isArabic ? "حدث خطأ" : "Something went wrong"),
          "error",
        );
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-sm">{isArabic ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );

  if (isError)
    return (
      <p className="text-sm text-red-400 font-medium">
        {isArabic ? "حدث خطأ في التحميل" : "Failed to load"}
      </p>
    );

  return (
    <div>
      {/* Add Button */}
      <div className="flex justify-start mb-5">
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="text-sm font-bold px-6 py-2.5 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span>
          {isArabic ? "إضافة محافظة" : "Add Governorate"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-5 p-5 border border-white/10 rounded-2xl bg-[#0f1117]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {isArabic ? "الاسم" : "Name"} (EN)
              </label>
              <input
                className={inputClass}
                value={newFields.name_en}
                onChange={(e) =>
                  setNewFields((f) => ({ ...f, name_en: e.target.value }))
                }
                placeholder="Cairo"
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {isArabic ? "الاسم" : "Name"} (AR)
              </label>
              <input
                className={inputClass}
                value={newFields.name_ar}
                onChange={(e) =>
                  setNewFields((f) => ({ ...f, name_ar: e.target.value }))
                }
                placeholder="القاهرة"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {isArabic ? "رسوم الشحن (EGP)" : "Shipping Fee (EGP)"}
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={newFields.shipping_fee}
                onChange={(e) =>
                  setNewFields((f) => ({
                    ...f,
                    shipping_fee: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={posting}
              className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50"
            >
              {posting
                ? isArabic
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isArabic
                  ? "حفظ"
                  : "Save"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2">
        {govList.map((gov: any) => (
          <div
            key={gov.id}
            className="border border-white/10 rounded-2xl overflow-hidden"
          >
            {editingId === gov.id ? (
              <div className="p-5 bg-[#0f1117]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                      {isArabic ? "الاسم" : "Name"} (EN)
                    </label>
                    <input
                      className={inputClass}
                      value={editFields.name_en}
                      onChange={(e) =>
                        setEditFields((f) => ({
                          ...f,
                          name_en: e.target.value,
                        }))
                      }
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                      {isArabic ? "الاسم" : "Name"} (AR)
                    </label>
                    <input
                      className={inputClass}
                      value={editFields.name_ar}
                      onChange={(e) =>
                        setEditFields((f) => ({
                          ...f,
                          name_ar: e.target.value,
                        }))
                      }
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                      {isArabic ? "رسوم الشحن (EGP)" : "Shipping Fee (EGP)"}
                    </label>
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={editFields.shipping_fee}
                      onChange={(e) =>
                        setEditFields((f) => ({
                          ...f,
                          shipping_fee: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm text-gray-400 font-bold">
                    {isArabic ? "مفعل" : "Active"}
                  </label>
                  <Toggle
                    checked={editFields.is_active}
                    onChange={() =>
                      setEditFields((f) => ({ ...f, is_active: !f.is_active }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSave(gov.id)}
                    disabled={patching}
                    className="h-10 px-6 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {patching
                      ? isArabic
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : isArabic
                        ? "حفظ"
                        : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="h-10 px-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl text-sm"
                  >
                    {isArabic ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-[#0f1117] flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">
                    {isArabic ? gov.name_ar : gov.name_en}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isArabic ? gov.name_en : gov.name_ar}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#c9a84c]">
                  EGP {gov.shipping_fee}
                </span>
                <StatusBadge active={gov.is_active} />
                <button
                  onClick={() => handleEditOpen(gov)}
                  className="text-sm font-bold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
                >
                  ✏ {isArabic ? "تعديل" : "Edit"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({
  showNotification,
}: {
  showNotification: (msg: string, type: "success" | "error") => void;
}) {
  const { t } = useTranslation();
  const s = t.bannersSettings.settings;

  const { data, isLoading, isError } = useGetDashboardSettings();
  const { mutate: patchSettings, isPending: patching } =
    usePatchDashboardSettings();

  const [announcementTextEn, setAnnouncementTextEn] = useState("");
  const [announcementTextAr, setAnnouncementTextAr] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data) {
      setAnnouncementTextEn(data.announcement_text_en ?? "");
      setAnnouncementTextAr(data.announcement_text_ar ?? "");
      setAnnouncementLink(data.announcement_link ?? "");
      setIsAnnouncementActive(data.is_announcement_active ?? false);
      setIsDirty(false);
    }
  }, [data]);

  const handleSave = () => {
    patchSettings(
      {
        announcement_text_en: announcementTextEn,
        announcement_text_ar: announcementTextAr,
        announcement_link: announcementLink,
        is_announcement_active: isAnnouncementActive,
      },
      {
        onSuccess: () => {
          showNotification(s.notifications.updated, "success");
          setIsDirty(false);
        },
        onError: (e: AxiosError<ErrorResponse>) => {
          showNotification(
            e?.response?.data?.detail || s.notifications.updateFailed,
            "error",
          );
        },
      },
    );
  };

  if (isLoading)
    return (
      <div className="flex items-center gap-3 text-gray-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-sm">{s.loading}</p>
      </div>
    );

  if (isError)
    return <p className="text-sm text-red-400 font-medium">{s.loadError}</p>;

  return (
    <div className="flex flex-col gap-5">
      {/* Announcement Bar Section */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0f1117] border-b border-white/10">
          <p className="text-sm font-bold text-gray-400 uppercase -wider">
            {s.announcementBar}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {isAnnouncementActive
                ? t.bannersSettings.status.active
                : t.bannersSettings.status.inactive}
            </span>
            <Toggle
              checked={isAnnouncementActive}
              onChange={() => {
                setIsAnnouncementActive((v) => !v);
                setIsDirty(true);
              }}
              disabled={patching}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div
          className={`px-5 py-3 text-sm font-medium text-center transition-colors ${
            isAnnouncementActive
              ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 text-[#fff] border-b border-[#fff]/10"
              : "bg-white/5 text-gray-600 line-through border-b border-white/5"
          }`}
        >
          {announcementTextEn || s.announcementPreview}
          {announcementTextAr && <span className="mx-2 opacity-50">|</span>}
          {announcementTextAr && <span dir="rtl">{announcementTextAr}</span>}
          {announcementLink && isAnnouncementActive && (
            <span className="mr-2 underline opacity-60 text-sm">{s.link}</span>
          )}
        </div>

        {/* Fields */}
        <div className="bg-[#1a1d29] p-5 flex flex-col gap-4">
          {/* Announcement Text EN + AR side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {s.announcementText}{" "}
                <span className="text-[#fff] font-normal text-xs">(EN)</span>
              </label>
              <input
                className={inputClass}
                value={announcementTextEn}
                onChange={(e) => {
                  setAnnouncementTextEn(e.target.value);
                  setIsDirty(true);
                }}
                placeholder={s.announcementPlaceholder}
                dir="ltr"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block font-bold">
                {s.announcementText}{" "}
                <span className="text-[#fff] font-normal text-xs">(AR)</span>
              </label>
              <input
                className={inputClass}
                value={announcementTextAr}
                onChange={(e) => {
                  setAnnouncementTextAr(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="نص الإعلان بالعربي"
                dir="rtl"
              />
            </div>
          </div>

          {/* Announcement Link */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block font-bold">
              {s.announcementLink}{" "}
              <span className="text-gray-600 font-normal text-sm">
                {s.optional}
              </span>
            </label>
            <input
              className={inputClass}
              value={announcementLink}
              onChange={(e) => {
                setAnnouncementLink(e.target.value);
                setIsDirty(true);
              }}
              placeholder={s.announcementLinkPlaceholder}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={patching || !isDirty}
          className="h-10 px-8 bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#fff]/20 disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {patching ? (
            <>
              <RefreshCw className="animate-spin w-4 h-4" />
              {s.saving}
            </>
          ) : (
            s.saveChanges
          )}
        </button>
        {isDirty && !patching && (
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{s.unsaved}</span>
          </div>
        )}
      </div>
    </div>
  );
}
