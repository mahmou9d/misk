"use client";

import { useTranslation } from "@/lib/Usetranslation";
import { IconFailed, IconSuccess } from "@/public/svg/Svgs";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaymentData {
  amount_cents: number;
  order: string;
  merchant_order_id: string;
  created_at: string;
  source_data_pan: string;
  source_data_sub_type: string;
  currency: string;
  error_message?: string;
}

interface OrderData {
  message?: string;
  order_id?: string;
  next_step?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(cents: number, currency = "EGP"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── COD Success Modal ────────────────────────────────────────────────────────

function CodSuccessModal({ onClose }: { onClose: () => void }) {
  const { locale, t, isArabic: isRTL } = useTranslation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("next_step");
      if (raw) setOrderData(JSON.parse(raw));
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("next_step");
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full max-w-[420px] bg-white rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 pb-6 flex flex-col items-center gap-3 relative">
          <button
            onClick={onClose}
            className={`absolute top-3.5 ${isRTL ? "left-3.5" : "right-3.5"} bg-black/5 hover:bg-black/10 border-none rounded-full w-7 h-7 cursor-pointer text-slate-500 flex items-center justify-center transition-colors`}
          >
            ✕
          </button>

          <div className="w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_8px_#bbf7d0]">
            <IconSuccess />
          </div>

          <div className="text-center">
            <h3 className="text-[1.2rem] font-bold text-green-900 m-0 mb-1">
              {isRTL?"تم حجز الطلب":"Order Booked"}
            </h3>
            <p className="text-[0.8rem] text-green-600 m-0 font-medium">
              {isRTL?"تم حجز الطلب بنجاح":"Order Booked Successfully"}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 px-7 pb-7">
          {orderData?.message && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 px-4 mb-4">
              <span className="text-green-500 mt-0.5 text-base">🎉</span>
              <div>
                <p className="m-0 text-[0.82rem] font-semibold text-green-800">
                  {orderData.message}
                </p>
                {orderData.order_id && (
                  <p className="m-0 text-[0.76rem] text-green-600 mt-0.5">
                    Order ID: {orderData.order_id}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* COD notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 px-4 mb-4 text-[0.81rem] text-amber-800 leading-relaxed flex items-start gap-2">
            <span className="mt-0.5">🚚</span>
            <span>
              {isRTL
                ? "سيتم الدفع عند الاستلام"
                : "Payment will be collected upon delivery"}
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Link
              href={`/${locale.toLowerCase()}`}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              {t.paymentPopup.success.continueShopping}
            </Link>
            <Link
              href={`/${locale.toLowerCase()}`}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              {t.paymentPopup.success.viewOrder}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card Success Modal ───────────────────────────────────────────────────────

function CardSuccessModal({
  data,
  onClose,
}: {
  data: PaymentData;
  onClose: () => void;
}) {
  const { locale, t, isArabic: isRTL } = useTranslation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("next_step");
      if (raw) setOrderData(JSON.parse(raw));
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("next_step");
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full max-w-[420px] bg-white rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 pb-6 flex flex-col items-center gap-3 relative">
          <button
            onClick={onClose}
            className={`absolute top-3.5 ${isRTL ? "left-3.5" : "right-3.5"} bg-black/5 hover:bg-black/10 border-none rounded-full w-7 h-7 cursor-pointer text-slate-500 flex items-center justify-center transition-colors`}
          >
            ✕
          </button>

          <div className="w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_8px_#bbf7d0]">
            <IconSuccess />
          </div>

          <div className="text-center">
            <h3 className="text-[1.2rem] font-bold text-green-900 m-0 mb-1">
              {t.paymentPopup.success.title}
            </h3>
            <p className="text-[0.8rem] text-green-600 m-0 font-medium">
              {t.paymentPopup.success.subtitle}
            </p>
          </div>

          <p className="text-[2rem] font-extrabold text-green-700 m-0">
            {formatAmount(data.amount_cents, data.currency)}
          </p>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-green-600 text-[0.72rem] font-bold uppercase ring-1 ring-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
            {t.paymentPopup.success.badge}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 px-7 pb-7">
          {orderData?.message && (
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl p-3 px-4 mb-4">
              <span className="text-green-500 mt-0.5 text-base">🎉</span>
              <div>
                <p className="m-0 text-[0.82rem] font-semibold text-green-800">
                  {orderData.message}
                </p>
                {orderData.order_id && (
                  <p className="m-0 text-[0.76rem] text-green-600 mt-0.5">
                    Order ID: {orderData.order_id}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-0">
            {[
              [t.paymentPopup.labels.orderId, `#${data.order}`],
              [
                t.paymentPopup.labels.reference,
                `${data.merchant_order_id.slice(0, 18)}…`,
              ],
              [
                t.paymentPopup.labels.card,
                `${data.source_data_sub_type} ••••${data.source_data_pan}`,
              ],
              [t.paymentPopup.labels.date, formatDate(data.created_at)],
              [t.paymentPopup.labels.currency, data.currency],
            ].map(([label, value], i, arr) => (
              <div key={i}>
                <div className="flex justify-between py-2.5 text-[0.87rem]">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span
                    className={`text-slate-800 font-semibold max-w-[58%] break-all ${isRTL ? "text-left" : "text-right"}`}
                  >
                    {value}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="h-[1px] bg-slate-100" />}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Link
              href={`/${locale.toLowerCase()}`}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              {t.paymentPopup.success.continueShopping}
            </Link>
            <Link
              href={`/${locale.toLowerCase()}`}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-green-600 text-green-600 hover:bg-green-50 text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              {t.paymentPopup.success.viewOrder}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Failed Modal ─────────────────────────────────────────────────────────────

function FailedModal({
  data,
  onClose,
}: {
  data: PaymentData;
  onClose: () => void;
}) {
  const { locale, t, isArabic: isRTL } = useTranslation();

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[9999] bg-slate-900/60 flex items-center justify-center p-4"
    >
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="w-full max-w-[420px] bg-white rounded-[20px] overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-8 pb-6 flex flex-col items-center gap-3 relative">
          <button
            onClick={onClose}
            className={`absolute top-3.5 ${isRTL ? "left-3.5" : "right-3.5"} bg-black/5 hover:bg-black/10 border-none rounded-full w-7 h-7 cursor-pointer text-slate-500 flex items-center justify-center transition-colors`}
          >
            ✕
          </button>

          <div className="w-[68px] h-[68px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_8px_#fecaca]">
            <IconFailed />
          </div>

          <div className="text-center">
            <h3 className="text-[1.2rem] font-bold text-red-900 m-0 mb-1.5">
              {t.paymentPopup.failed.title}
            </h3>
            {data.error_message && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[0.76rem] font-semibold">
                ⚠ {data.error_message}
              </span>
            )}
          </div>

          <p className="text-[2rem] font-extrabold text-red-800 m-0">
            {formatAmount(data.amount_cents, data.currency)}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 px-7 pb-7">
          <div className="space-y-0">
            {[
              [t.paymentPopup.labels.orderId, `#${data.order}`],
              [
                t.paymentPopup.labels.reference,
                `${data.merchant_order_id.slice(0, 18)}…`,
              ],
              [
                t.paymentPopup.labels.card,
                `${data.source_data_sub_type} ••••${data.source_data_pan}`,
              ],
              [t.paymentPopup.labels.date, formatDate(data.created_at)],
              [t.paymentPopup.labels.currency, data.currency],
            ].map(([label, value], i, arr) => (
              <div key={i}>
                <div className="flex justify-between py-2.5 text-[0.87rem]">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span
                    className={`text-slate-800 font-semibold max-w-[58%] break-all ${isRTL ? "text-left" : "text-right"}`}
                  >
                    {value}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="h-[1px] bg-slate-100" />}
              </div>
            ))}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 px-4 mt-4 text-[0.81rem] text-orange-800 leading-relaxed">
            {t.paymentPopup.failed.hint}
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[0.9rem] font-bold text-center border-none cursor-pointer transition-colors block"
            >
              {t.paymentPopup.failed.tryAgain}
            </button>
            <Link
              href={`/${locale.toLowerCase()}`}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 text-[0.9rem] font-bold text-center no-underline transition-colors block"
            >
              {t.paymentPopup.failed.goHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Popup Controller ─────────────────────────────────────────────────────────

export function PaymentPopup() {
  const [open, setOpen] = useState(false);
  const [nextStep, setNextStep] = useState<string | null>(null);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const successParam = params.get("success");

  // ── COD: مفيش amount_cents في الـ URL ──
  const isCod = successParam === "true" && !params.get("amount_cents");

  useEffect(() => {
    if (successParam) {
      setNextStep(localStorage.getItem("next_step"));
      setOpen(true);
    }
  }, [successParam]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  if (!successParam || !open) return null;

  const success = successParam === "true";
  const data: PaymentData = {
    amount_cents: Number(params.get("amount_cents")) || 0,
    order: params.get("order") ?? "",
    merchant_order_id: params.get("merchant_order_id") ?? "",
    created_at: params.get("created_at") ?? new Date().toISOString(),
    source_data_pan:
      params.get("source_data.pan") ?? params.get("source_data_pan") ?? "****",
    source_data_sub_type:
      params.get("source_data.sub_type") ??
      params.get("source_data_sub_type") ??
      "Card",
    currency: params.get("currency") ?? "EGP",
    error_message:
      params.get("data.message") ?? params.get("error_occured") ?? undefined,
  };

  // ── COD ──
  if (isCod) return <CodSuccessModal onClose={handleClose} />;

  // ── Paymob ──
  return success || nextStep !== null ? (
    <CardSuccessModal data={data} onClose={handleClose} />
  ) : (
    <FailedModal data={data} onClose={handleClose} />
  );
}
