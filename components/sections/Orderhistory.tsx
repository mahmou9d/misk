"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderHistory } from "@/hooks/usePayment";
import { useTranslation } from "@/lib/Usetranslation";
import Link from "next/link";

const statusConfig: Record<string, { color: string; bg: string; dot: string }> =
  {
    pending: { color: "#92650a", bg: "rgba(251,191,36,0.13)", dot: "#f59e0b" },
    shipped: { color: "#1d4ed8", bg: "rgba(59,130,246,0.12)", dot: "#3b82f6" },
    delivered: { color: "#166534", bg: "rgba(34,197,94,0.12)", dot: "#22c55e" },
    cancelled: { color: "#991b1b", bg: "rgba(239,68,68,0.12)", dot: "#ef4444" },
    paid: { color: "#065f46", bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  };

const filterKeys = [
  "all",
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

function StatusBadge({ status, label }: { status: string; label: string }) {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
      style={{
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.dot}30`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
      />
      {label}
    </span>
  );
}

function OrderCard({
  order,
  index,
  isArabic,
}: {
  order: NonNullable<ReturnType<typeof useOrderHistory>["data"]>[number];
  index: number;
  isArabic: boolean;
}) {
  const { t } = useTranslation();
  const tran = t.orderHistory;
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[order.status] ?? statusConfig.pending;
  const visibleItems = expanded ? order.items : order.items.slice(0, 2);
  const hiddenCount = order.items.length - 2;

  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(isArabic ? "ar-EG" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative bg-white rounded-3xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(201,168,76,0.2)",
        boxShadow:
          "0 4px 24px rgba(45,27,105,0.07), 0 1px 6px rgba(201,168,76,0.1)",
      }}
    >
      <div
        className="absolute top-0 bottom-0 w-1"
        style={{ insetInlineStart: 0, background: cfg.dot, opacity: 0.7 }}
      />

      {/* Header */}
      <div className="px-7 pt-6 pb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {tran.orderNumber}
            </span>
            <span
              className="font-mono text-xl font-extrabold tracking-tight"
              style={{ color: "#2d1b69" }}
            >
              {order.id}
            </span>
            <span className="text-sm text-gray-400 mt-0.5">
              {formattedDate} · {formattedTime}
            </span>
          </div>
          <StatusBadge
            status={order.status}
            label={tran.status[order.status as keyof typeof tran.status]}
          />
        </div>

        <div
          className="my-5 h-px"
          style={{
            background:
              "linear-gradient(to left, transparent, rgba(201,168,76,0.25))",
          }}
        />

        {/* Items */}
        <div className="flex flex-col gap-3">
          {visibleItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-xl"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#c9a84c,#e8b840)",
                  }}
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-gray-800 truncate">
                    {item.variant_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.variant_volume}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm text-gray-400 font-medium">
                  ×{item.quantity}
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "#2d1b69" }}
                >
                  {item.subtotal.toLocaleString(isArabic ? "ar-EG" : "en-US")}
                  <span className="text-xs font-normal ms-1">
                    {tran.currency}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {order.items.length > 2 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-sm font-semibold hover:opacity-75 transition-opacity"
            style={{ color: "#c9a84c" }}
          >
            {expanded
              ? tran.showLess
              : tran.showMore.replace("{{count}}", String(hiddenCount))}
          </button>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-7 py-4 flex items-center justify-between flex-wrap gap-4"
        style={{
          background: "rgba(201,168,76,0.05)",
          borderTop: "1.5px solid rgba(201,168,76,0.12)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(201,168,76,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              {tran.address}
            </p>
            <p className="text-sm text-gray-600 font-medium max-w-[220px]">
              {order.full_address}، {order.governorate_name}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {order.shipping_fee && parseFloat(order.shipping_fee) > 0 && (
            <div className="flex items-center gap-1.5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(201,168,76,0.7)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span className="text-[15px] text-gray-400 font-medium">
                {tran.shippingFee}
              </span>
              <span
                className="text-[15px] font-bold"
                style={{ color: "#92650a" }}
              >
                {parseFloat(order.shipping_fee).toLocaleString(
                  isArabic ? "ar-EG" : "en-US",
                )}
                <span className="font-normal ms-0.5">{tran.currency}</span>
              </span>
            </div>
          )}

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs text-gray-400 font-medium">
              {tran.total}
            </span>
            <span
              className="text-2xl font-extrabold"
              style={{
                background: "linear-gradient(135deg,#c9a84c 0%,#a3720c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
              }}
            >
              {order.total_price.toLocaleString(isArabic ? "ar-EG" : "en-US")}
              <span
                className="text-sm font-bold ms-1"
                style={{ WebkitTextFillColor: "#c9a84c" }}
              >
                {tran.currency}
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function OrderHistoryPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const tran = t.orderHistory;
  const { data: orders = [], isLoading, refetch } = useOrderHistory();

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filtered =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  return (
    <main
      className="min-h-screen pb-28 pt-10 px-4 sm:px-6 lg:px-8"
      dir={dir}
      style={{
        background: "linear-gradient(160deg, #fafaf9 0%, #f5f0e8 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className="text-4xl font-extrabold mb-2 tracking-tight"
            style={{ color: "#2d1b69" }}
          >
            {tran.pageTitle}
          </h1>
          <p className="text-base text-gray-400 font-medium">
            {orders.length > 0
              ? tran.pageSubtitle.withOrders.replace(
                  "{{count}}",
                  String(orders.length),
                )
              : tran.pageSubtitle.empty}
          </p>
          <div
            className="mt-4 h-1 w-16 rounded-full"
            style={{ background: "linear-gradient(90deg,#c9a84c,transparent)" }}
          />

          {/* ── Home Button ── */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-5"
          >
            <Link
              href={`/${locale.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#666] hover:text-[#2d1b69] transition-colors duration-200 group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${isArabic ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"}`}
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {isArabic ? "الرئيسية" : "Home"}
            </Link>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-7">
          {filterKeys.map((key) => {
            const count =
              key === "all"
                ? orders.length
                : orders.filter((o) => o.status === key).length;
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg,#c9a84c,#e8b840)"
                    : "rgba(255,255,255,0.85)",
                  color: active ? "#1a0a3d" : "#666",
                  border: active
                    ? "1.5px solid transparent"
                    : "1.5px solid rgba(201,168,76,0.2)",
                  boxShadow: active
                    ? "0 4px 12px rgba(201,168,76,0.35)"
                    : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {tran.filters[key as keyof typeof tran.filters]}
                {count > 0 && (
                  <span
                    className="text-xs rounded-full px-2 py-0.5 font-extrabold"
                    style={{
                      background: active
                        ? "rgba(26,10,61,0.15)"
                        : "rgba(201,168,76,0.15)",
                      color: active ? "#1a0a3d" : "#92650a",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 rounded-3xl animate-pulse"
                style={{ background: "rgba(201,168,76,0.07)" }}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5"
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1.5px solid rgba(201,168,76,0.2)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="text-gray-500 text-base font-medium">
              {tran.emptyState}
            </p>
          </motion.div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((order, i) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  index={i}
                  isArabic={isArabic}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
