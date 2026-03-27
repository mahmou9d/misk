/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { useGetRecentOrders, usePatchOrders } from "@/hooks/useDashboard";
import { ErrorResponse, NotificationState, OrderStatus } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useTranslation } from "@/lib/Usetranslation";
import { AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Check,
  Clock,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// ── status config ────────────────────────────────────────────────────────────
const statusOptions = [
  {
    value: "all",
    labelEn: "All Status",
    labelAr: "كل الحالات",
    icon: Filter,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
  },
  {
    value: "pending",
    labelEn: "Pending",
    labelAr: "قيد الانتظار",
    icon: Clock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    value: "paid",
    labelEn: "Paid",
    labelAr: "مدفوع",
    icon: CreditCard,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "shipped",
    labelEn: "Shipped",
    labelAr: "تم الشحن",
    icon: Truck,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "delivered",
    labelEn: "Delivered",
    labelAr: "تم التسليم",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    value: "cancelled",
    labelEn: "Cancelled",
    labelAr: "ملغي",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
];

const orderStatusOptions = statusOptions.filter((o) => o.value !== "all");

export default function OrdersPage() {
  const { t, isArabic, dir } = useTranslation();
  const o = t.adminOrders;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const filterRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const showNotification = useShowNotification(setNotification);

  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(h);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setIsFilterOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setIsStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const apiStatus = status === "all" ? "" : status;
  const isFiltered = debouncedSearch.trim() !== "" || apiStatus !== "";

  const { data, isLoading, isError } = useGetRecentOrders(
    page,
    debouncedSearch,
    apiStatus,
  );
  const {
    mutate: patch,
    isPending: patching,
    isSuccess: patchSuccess,
    isError: patchError,
  } = usePatchOrders();

  const ordersData = data?.orders || [];

  // ── helpers ──────────────────────────────────────────────────────────────────
  const getLabel = (opt: (typeof statusOptions)[0]) =>
    isArabic ? opt.labelAr : opt.labelEn;

  const statusWithCounts = statusOptions.map((opt) => ({
    ...opt,
    count:
      opt.value === "all"
        ? ordersData.length
        : ordersData.filter((ord: any) => ord.status === opt.value).length,
  }));

  const selectedFilter =
    statusWithCounts.find((s) => s.value === status) || statusWithCounts[0];

  const tableHeaders = isArabic
    ? [
        "رقم الطلب",
        "العميل",
        "المنتجات",
        "الإجمالي",
        "الحالة",
        "التاريخ",
        "الإجراءات",
      ]
    : [
        "Order ID",
        "Customer",
        "Products",
        "Total",
        "Status",
        "Date",
        "Actions",
      ];

  const handleSave = (id: string) => {
    patch(
      { id, status: newStatus },
      {
        onSuccess: () => {
          showNotification(o.updateSuccess, "success");
          setEditingOrder(null);
          setIsStatusOpen(false);
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
              o.updateError,
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
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">{o.title}</h1>
        <p className="text-gray-400 text-base">{o.subtitle}</p>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        {/* Status Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-5 py-3 bg-[#1a1d29] border border-white/10 text-white rounded-xl font-semibold text-[16px] hover:border-[#fff]/30 flex items-center gap-3 min-w-[200px]"
          >
            <div
              className={`w-8 h-8 rounded-lg ${selectedFilter.bgColor} flex items-center justify-center`}
            >
              <selectedFilter.icon
                className={`w-4 h-4 ${selectedFilter.color}`}
              />
            </div>
            <div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
              <p className="text-[16px] text-gray-400">
                {isArabic ? "الحالة" : "Status"}
              </p>
              <p className="font-bold text-white text-[16px]">
                {getLabel(selectedFilter)}
              </p>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <div
                className={`absolute top-full ${isArabic ? "right-0" : "left-0"} mt-2 w-full min-w-[260px] bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50`}
              >
                <div className="p-2">
                  {statusWithCounts.map((opt) => {
                    const isSelected = opt.value === status;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatus(opt.value);
                          setPage(1);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 border border-[#fff]/30"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${opt.bgColor} flex items-center justify-center shrink-0`}
                        >
                          <Icon className={`w-5 h-5 ${opt.color}`} />
                        </div>
                        <div
                          className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}
                        >
                          <p
                            className={`font-semibold text-[16px] ${isSelected ? "text-white" : "text-gray-300"}`}
                          >
                            {getLabel(opt)}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#fff] flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <div className={`flex-1 w-full ${isArabic ? "mr-auto" : "ml-auto"}`}>
          <div className="relative">
            <Search
              className={`absolute ${isArabic ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={isArabic ? "ابحث عن الطلبات..." : "Search orders..."}
              className={`w-full ${isArabic ? "pr-12 pl-4" : "pl-12 pr-4"} py-3 bg-[#1a1d29] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#fff]/50`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className={`absolute ${isArabic ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-white`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-[#1a1d29] rounded-2xl border border-white/10 overflow-hidden">
        {isLoading && (
          <p className="text-[16px] text-gray-400 animate-pulse p-6">
            {o.loading}
          </p>
        )}
        {isError && (
          <p className="text-[16px] text-red-400 font-medium p-6">
            {o.loadError}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f1117] border-b border-white/10">
              <tr>
                {tableHeaders.map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-5 ${isArabic ? "text-right" : "text-left"} text-[16px] font-bold text-[#fff] uppercase tracking-wider`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ordersData.length > 0
                ? ordersData.map((order: any) => {
                    const isExpanded = expandedId === String(order.id);
                    const isEditing = editingOrder?.id === String(order.id);
                    const currentOpt =
                      orderStatusOptions.find(
                        (s) =>
                          s.value === (isEditing ? newStatus : order.status),
                      ) || orderStatusOptions[0];

                    return (
                      <>
                        <tr
                          key={order.id}
                          className="hover:bg-white/5 cursor-pointer"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : String(order.id))
                          }
                        >
                          {/* Order ID */}
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="font-bold text-white text-[16px]">
                              #{String(order.id).slice(0, 8)}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-5">
                            <p className="font-bold text-white mb-0.5">
                              {order.full_name || o.customer}
                            </p>
                            <p
                              className={`text-[16px] text-gray-400 flex items-center gap-1 ${isArabic ? "flex-row-reverse justify-end" : ""}`}
                            >
                              <MapPin className="w-3 h-3" />
                              {order.country || "—"}
                            </p>
                          </td>

                          {/* Products */}
                          <td className="px-6 py-5">
                            <div
                              className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center">
                                <Package className="w-4 h-4 text-[#fff]" />
                              </div>
                              <div>
                                <p className="text-white font-medium text-[16px]">
                                  {order.items?.[0]?.variant_name || "—"}
                                </p>
                                {order.items?.length > 1 && (
                                  <p className="text-[16px] text-gray-400">
                                    +{order.items.length - 1}{" "}
                                    {isArabic ? "أكثر" : "more"}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Total */}
                          <td className="px-6 py-5">
                            <span className="font-bold text-white text-lg">
                              LE{" "}
                              {parseFloat(
                                order.total_price || 0,
                              ).toLocaleString()}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[16px] font-bold border ${currentOpt.bgColor} ${currentOpt.color} border-current/20`}
                            >
                              <currentOpt.icon className="w-3 h-3" />
                              {isArabic
                                ? getLabel(currentOpt)
                                : order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-gray-400 font-medium text-[16px]">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString(
                                  isArabic ? "ar-EG" : "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">
                            <div
                              className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(String(order.id));
                                }}
                                className="p-2.5 rounded-xl hover:bg-white/5 text-[#fff]"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ── Expanded Panel ── */}
                        {isExpanded && (
                          <tr key={`${order.id}-expanded`}>
                            <td colSpan={7} className="px-6 py-0">
                              <div className="bg-white/[0.03] border border-white/10 rounded-xl mb-4">
                                {/* Items */}
                                {order.items?.length > 0 && (
                                  <div className="p-5 border-b border-white/10">
                                    <p className="text-[16px] font-bold text-[#fff] uppercase tracking-wider mb-3">
                                      {o.items}
                                    </p>
                                    <div className="space-y-2">
                                      {order.items.map(
                                        (item: any, i: number) => (
                                          <div
                                            key={i}
                                            className={`flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 ${isArabic ? "flex-row-reverse" : ""}`}
                                          >
                                            <div
                                              className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}
                                            >
                                              <div className="w-6 h-6 rounded-md bg-[#fff]/10 border border-[#fff]/20 flex items-center justify-center">
                                                <span className="text-[#fff] text-[16px] font-bold">
                                                  {i + 1}
                                                </span>
                                              </div>
                                              <span className="text-[16px] text-white font-medium">
                                                {item.variant_name}
                                                {item.variant_volume
                                                  ? ` · ${item.variant_volume}`
                                                  : ""}
                                                <span className="text-gray-400 mx-1">
                                                  ×
                                                </span>
                                                {item.quantity}
                                              </span>
                                            </div>
                                            <span className="text-[16px] font-bold text-white">
                                              LE{" "}
                                              {parseFloat(
                                                item.subtotal ||
                                                  item.price ||
                                                  0,
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Address + Phone */}
                                <div className="p-5 border-b border-white/10 space-y-2">
                                  {(order.full_address || order.country) && (
                                    <p
                                      className={`text-[16px] text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                      <MapPin className="w-4 h-4 text-[#fff] shrink-0" />
                                      {[order.full_address, order.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                  )}
                                  {order.phone_number && (
                                    <p
                                      className={`text-[16px] text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                      <Phone className="w-4 h-4 text-[#fff] shrink-0" />
                                      {order.phone_number}
                                    </p>
                                  )}
                                  {order.created_at && (
                                    <p
                                      className={`text-[16px] text-gray-400 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                      <Calendar className="w-4 h-4 text-[#fff] shrink-0" />
                                      {new Date(
                                        order.created_at,
                                      ).toLocaleDateString(
                                        isArabic ? "ar-EG" : "en-US",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )}
                                    </p>
                                  )}
                                </div>

                                {/* Status Change */}
                                <div className="p-5">
                                  {isEditing ? (
                                    <div
                                      className={`flex flex-wrap gap-3 items-center`}
                                      ref={statusRef}
                                    >
                                      <div className="relative min-w-[200px] z-[100]">
                                        <button
                                          onClick={() =>
                                            setIsStatusOpen(!isStatusOpen)
                                          }
                                          className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl flex items-center gap-3 hover:border-[#fff]/30"
                                        >
                                          <div
                                            className={`w-8 h-8 rounded-lg ${currentOpt.bgColor} flex items-center justify-center`}
                                          >
                                            <currentOpt.icon
                                              className={`w-4 h-4 ${currentOpt.color}`}
                                            />
                                          </div>
                                          <div
                                            className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}
                                          >
                                            <p className="text-[16px] text-gray-400">
                                              {o.newStatus}
                                            </p>
                                            <p className="font-bold text-white text-[16px]">
                                              {getLabel(currentOpt)}
                                            </p>
                                          </div>
                                          <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </button>
                                        {isStatusOpen && (
                                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl z-50">
                                            <div className="p-2">
                                              {orderStatusOptions.map((opt) => {
                                                const Icon = opt.icon;
                                                const isSel =
                                                  opt.value === newStatus;
                                                return (
                                                  <button
                                                    key={opt.value}
                                                    onClick={() => {
                                                      setNewStatus(
                                                        opt.value as OrderStatus,
                                                      );
                                                      setIsStatusOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                                                      isSel
                                                        ? "bg-gradient-to-r from-[#fff]/20 to-[#000]/20 border border-[#fff]/30"
                                                        : "hover:bg-white/5 border border-transparent"
                                                    } ${isArabic ? "flex-row-reverse" : ""}`}
                                                  >
                                                    <div
                                                      className={`w-8 h-8 rounded-lg ${opt.bgColor} flex items-center justify-center`}
                                                    >
                                                      <Icon
                                                        className={`w-4 h-4 ${opt.color}`}
                                                      />
                                                    </div>
                                                    <span
                                                      className={`text-[16px] font-semibold flex-1 ${isArabic ? "text-right" : ""} ${isSel ? "text-white" : "text-gray-300"}`}
                                                    >
                                                      {getLabel(opt)}
                                                    </span>
                                                    {isSel && (
                                                      <Check className="w-4 h-4 text-[#fff]" />
                                                    )}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <button
                                        onClick={() =>
                                          handleSave(String(order.id))
                                        }
                                        disabled={patching}
                                        className="px-6 py-3 bg-gradient-to-r from-[#ffffff69] to-black text-white rounded-xl font-bold text-[16px] disabled:opacity-50 flex items-center gap-2"
                                      >
                                        {patching ? (
                                          <>
                                            <span className="animate-spin">
                                              ↻
                                            </span>{" "}
                                            {o.saving}
                                          </>
                                        ) : (
                                          o.save
                                        )}
                                      </button>
                                      <button
                                        onClick={() => setEditingOrder(null)}
                                        className="px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-[16px] hover:bg-white/10"
                                      >
                                        {o.cancel}
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingOrder({
                                          id: String(order.id),
                                        });
                                        setNewStatus(order.status);
                                      }}
                                      className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[16px] font-medium hover:border-[#fff]/30 hover:bg-white/10 flex items-center gap-2"
                                    >
                                      ✏ {o.changeStatus}
                                    </button>
                                  )}

                                  {patchSuccess && (
                                    <div
                                      className={`mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                      <span className="text-emerald-400 text-[16px] font-medium">
                                        {o.updateSuccess}
                                      </span>
                                    </div>
                                  )}
                                  {patchError && (
                                    <div
                                      className={`mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
                                    >
                                      <AlertCircle className="w-4 h-4 text-red-400" />
                                      <span className="text-red-400 text-[16px] font-medium">
                                        {o.updateError}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                : !isLoading && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-20" />
                        <p className="text-gray-400 font-semibold text-lg">
                          {o.empty}
                        </p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!isFiltered && (data?.next || data?.previous || page > 1) && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-t border-white/10 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <p className="text-[16px] text-gray-400">
              {o.page} <span className="font-bold text-white">{page}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data?.previous}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isArabic ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
              <span className="text-[16px] text-gray-400 px-2">
                {o.page} {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data?.next}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isArabic ? (
                  <ChevronLeft className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
