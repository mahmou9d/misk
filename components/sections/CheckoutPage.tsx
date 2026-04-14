"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosError } from "axios";
import Image from "next/image";
import { useGetCartItems } from "@/hooks/useCart";
import { usePlaceOrder, usePaymentPaymob } from "@/hooks/usePayment";
import {
  ErrorResponse,
  NotificationState,
  CheckoutFormValues,
} from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "@/components/layout/Notification";
import { PaymentMethodModal } from "@/components/layout/Paymentmethodmodal";
import { CheckoutForm } from "@/components/layout/Checkoutform";
import { useTranslation } from "@/lib/Usetranslation";



export default function CheckoutPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [discountApplied] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const { data: cartData } = useGetCartItems();
  const cartItems = cartData || [];
  const { mutateAsync: placeOrder } = usePlaceOrder();
  const { mutateAsync: payWithPaymob } = usePaymentPaymob();
  const showNotification = useShowNotification(setNotification);


  const subtotal = useMemo(
    () =>
      cartItems.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0),
    [cartItems],
  );

  const discountAmt = discountApplied ? Math.round(subtotal * 0.1) : 0;

  const total = useMemo(
    () => subtotal + shippingFee - discountAmt,
    [subtotal, shippingFee, discountAmt],
  );

  const handleSubmit = useCallback(async (values: CheckoutFormValues) => {
    setLoading(true);
    try {
      const result = await placeOrder({
        full_name: `${values.firstName} ${values.lastName}`,
        full_address: values.apt
          ? `${values.address}, ${values.apt}`
          : values.address,
        guest_email: values.guest_email,
        phone_number: values.phone,
        country: `Egypt`,
        order_notes: "",
        payment_method: values.payment_method,
        governorate_id: values.governorate_id,
      });
      localStorage.setItem("next_step", String(result.next_step));
      localStorage.setItem("order_id", String(result.order_id));
      const orderId = String(result.order_id);

      if (values.payment_method === "cod") {
        showNotification(t.checkout.orderSuccess, "success");
        setLoading(false);
        window.location.href = "/?success=true&order=" + orderId;
        return;
      }

      setPendingOrderId(orderId);
      setPendingPhone(values.phone);
      setLoading(false);
      setShowPayModal(true);
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showNotification(
        error?.response?.data?.message || t.checkout.orderError,
        "error",
      );
      setLoading(false);
    }
  }, [placeOrder, showNotification, t.checkout, locale]);

  const handlePayWithWallet = useCallback(async (walletNumber: string) => {
    if (!pendingOrderId) return;
    setLoading(true);
    try {
      await payWithPaymob({
        order_id: pendingOrderId,
        payment_method: "wallet",
        wallet_number: walletNumber,
      });
      setShowPayModal(false);
      showNotification(t.checkout.paymentSuccess, "success");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showNotification(
        error?.response?.data?.message || t.checkout.paymentError,
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [pendingOrderId, payWithPaymob, showNotification, t.checkout]);

  const handlePayWithCard = useCallback(async () => {
    if (!pendingOrderId) return;
    setLoading(true);
    try {
      await payWithPaymob({ order_id: pendingOrderId });
      setShowPayModal(false);
      showNotification(t.checkout.redirecting, "success");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showNotification(
        error?.response?.data?.message || t.checkout.paymentError,
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [pendingOrderId, payWithPaymob, showNotification, t.checkout]);

  return (
    <div className="min-h-screen bg-[#F8F6F2]" dir={dir}>
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPayModal && (
          <PaymentMethodModal
            phone={pendingPhone}
            onWallet={handlePayWithWallet}
            onCard={handlePayWithCard}
            onClose={() => setShowPayModal(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <header className="px-10 md:px-40 top-0 z-20 bg-white border-b-2 border-[#E8E2D6] py-8 shadow-sm">
        {/* Brand + Total pill */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/${locale.toLowerCase()}`}
            aria-label={isArabic ? "الرئيسية" : "Misk Home"}
            className="flex flex-col items-center select-none leading-none group"
          >
            <span
              className="font-bold transition-all duration-300 text-3xl md:text-4xl
                [background:linear-gradient(135deg,#c9a84c_0%,#f0d080_45%,#b8912e_100%)]
                [background-clip:text] [letter-spacing:6px]
                [filter:drop-shadow(0_1px_6px_rgba(201,168,76,0.25))]"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Misk
            </span>
            <span className="block h-px w-full mt-0.5 [background:linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)]" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale.toLowerCase()}`}
              aria-label={isArabic ? "رجوع للرئيسية" : "Back to home"}
              className="text-[15px] uppercase text-[#aaa] hover:text-[#C9A84C] transition-colors hidden sm:block"
            >
              {isArabic ? "→ رجوع" : "← Back"}
            </Link>
            <div className="bg-[#1a1a1a] text-[#F0D080] text-[14px] font-semibold px-4 py-2 rounded-full">
              {t.checkout.currency}
              {subtotal.toLocaleString()}.00
            </div>
          </div>
        </div>

        {/* Cart items */}
        {cartItems.length > 0 && (
          <div
            className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {cartItems.map((item) => {
              const rawImage =
                (typeof item?.variant?.images?.[0] === "string"
                  ? item.variant.images[0]
                  : item?.variant?.images?.[0]?.url) || "/heros.jpg";
              const safeImage = rawImage.replace("http://", "https://");

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-[#E8E2D6] rounded-xl p-2 flex-shrink-0 w-[140px] sm:w-auto shadow-sm"
                >
                  <div className="relative w-full sm:w-[80px] h-[100px] sm:h-[80px] flex-shrink-0">
                    <div className="w-full h-full bg-[#EDE8DE] rounded-lg overflow-hidden border border-[#f0ece5]">
                      <Image
                        width={200}
                        height={200}
                        loading="lazy"
                        src={safeImage}
                        alt={item.name as string}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className={`absolute -top-1.5 inline-flex items-center justify-center rounded-full
                        text-white font-bold min-w-[20px] h-[20px] px-1 text-[11px] bg-[#C9A84C] border-2 border-white shadow-sm
                        ${isArabic ? "-left-1.5" : "-right-1.5"}`}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col text-center sm:text-start overflow-hidden w-full px-1">
                    <span className="text-[12px] sm:text-[14px] font-bold text-[#1a1a1a] truncate leading-tight">
                      {item.name}
                    </span>
                    <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                      <span className="text-[11px] text-[#C9A84C] font-medium">
                        {(
                          parseFloat(item.price) * item.quantity
                        ).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#999] font-light">
                        {t.checkout.currency}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Totals row ── */}
        <div className="flex gap-5 mt-3.5 pt-3.5 border-t border-[#E8E2D6]">
          {/* Subtotal */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-[#aaa] uppercase tracking-[1.5px]">
              {t.checkout.subtotal || "Subtotal"}
            </span>
            <span className="text-[15px] font-bold text-[#C9A84C]">
              {t.checkout.currency}
              {subtotal.toLocaleString()}.00
            </span>
          </div>

          {/* Shipping */}
          {shippingFee > 0 && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-[#aaa] uppercase tracking-[1.5px]">
                {isArabic ? "الشحن" : "Shipping"}
              </span>
              <span className="text-[15px] font-bold text-[#888]">
                {t.checkout.currency}
                {shippingFee.toLocaleString()}.00
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex flex-col gap-0.5 ml-auto">
            <span className="text-[11px] text-[#aaa] uppercase tracking-[1.5px]">
              {isArabic ? "الإجمالي" : "Total"}
            </span>
            <span className="text-[17px] font-bold text-[#1a1a1a]">
              {t.checkout.currency}
              {total.toLocaleString()}.00
            </span>
          </div>
        </div>
      </header>

      {/* ══ FORM AREA ══ */}
      <motion.div
        className="max-w-[680px] mx-auto px-5 sm:px-8 py-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8">
          <p className="text-[11px] tracking-[4px] text-[#C9A84C] uppercase mb-2 font-semibold">
            {isArabic ? "إتمام الطلب" : "Secure Checkout"}
          </p>
          <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-2">
            {isArabic ? "تفاصيل الشحن" : "Shipping Details"}
          </h1>
          <p className="text-[16px] text-[#888] leading-relaxed">
            {isArabic
              ? "أدخل بياناتك لإتمام طلبك بأمان"
              : "Enter your details to complete your order securely"}
          </p>
        </div>

        <CheckoutForm
          onSubmit={handleSubmit}
          loading={loading}
          onGovernorateChange={setShippingFee} // ── جديد ──
        />
      </motion.div>
    </div>
  );
}
