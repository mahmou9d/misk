/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AxiosError } from "axios";

import { useGetCartItems } from "@/hooks/useCart";
import { usePlaceOrder, usePaymentPaymob } from "@/hooks/usePayment";
import {
  CheckoutFormValues,
  ErrorResponse,
  NotificationState,
} from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "@/components/layout/Notification";
import { PaymentMethodModal } from "@/components/layout/Paymentmethodmodal";
import { CheckoutForm } from "@/components/layout/Checkoutform";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";

const SHIPPING = 85;

export default function CheckoutPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState("");
  const [discountApplied] = useState(false); // Can be linked to a state if you add discount logic
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );

  const { data: cartData } = useGetCartItems();
  const cartItems = cartData || [];
  const { mutateAsync: placeOrder } = usePlaceOrder();
  const { mutateAsync: payWithPaymob } = usePaymentPaymob();
  const showNotification = useShowNotification(setNotification);

  const subtotal = cartItems.reduce(
    (s, i) => s + parseFloat(i.price) * i.quantity,
    0,
  );
  const discountAmt = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discountAmt + SHIPPING;

  const handleSubmit = async (values: CheckoutFormValues) => {
    setLoading(true);
    try {
      const result = await placeOrder({
        full_name: `${values.firstName} ${values.lastName}`,
        full_address: values.apt
          ? `${values.address}, ${values.apt}`
          : values.address,
        phone_number: values.phone,
        country: `Egypt - ${values.gov}`,
        order_notes: "",
      });
      const orderId = String(result.order_id);
      if (values.payment === "cod") {
        showNotification(t.checkout.orderSuccess, "success");
        setLoading(false);
        return;
      }
      setPendingOrderId(orderId);
      setPendingPhone(values.phone);
      setLoading(false);
      setShowPayModal(true);
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              error?.response?.data?.status ||
              error?.response?.data?.non_field_errors ||
              error?.response?.data?.name ||
              error?.message ||
          t.checkout.orderError,
        "error",
      );
      setLoading(false);
    }
  };

  const handlePayWithWallet = async (walletNumber: string) => {
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
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error?.response?.data?.status ||
          error?.response?.data?.non_field_errors ||
          error?.response?.data?.name ||
          error?.message ||
        t.checkout.paymentError,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithCard = async () => {
    if (!pendingOrderId) return;
    setLoading(true);
    try {
      await payWithPaymob({ order_id: pendingOrderId });
      setShowPayModal(false);
      showNotification(t.checkout.redirecting, "success");
    } catch (err: unknown) {
      const error = err as AxiosError<ErrorResponse>;
      showNotification(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          error?.response?.data?.status ||
          error?.response?.data?.non_field_errors ||
          error?.response?.data?.name ||
          error?.message ||
        t.checkout.paymentError,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir={dir}>
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

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-[56px]">
          <Link
            href={`/${locale.toLowerCase()}`}
            className="font-bold text-yellow-500 text-[35px]"
          >
            Misk
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT: form */}
        <CheckoutForm onSubmit={handleSubmit} loading={loading} />

        {/* RIGHT: order summary */}
        <motion.div
          className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-white rounded-lg p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            {/* Cart items */}
            {cartItems.length === 0 ? (
              <p className=" text-gray-400 text-center text-[13px] py-3">
                {t.checkout.emptyCart}
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 mb-4 last:mb-0"
                >
                  <div className="relative flex-shrink-0">
                    <div className="rounded overflow-hidden bg-gray-100 w-[52px] h-[52px] relative">
                      {item.variant?.images?.[0] ? (
                        <Image
                          width={52}
                          height={52}
                          loading="lazy"
                          src={
                            (typeof item?.variant?.images?.[0] === "string"
                              ? item.variant.images[0]
                              : item?.variant?.images?.[0]?.url) || "/heros.jpg"
                          }
                          alt={item.name as string}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0808] to-[#4a1a1a]" />
                      )}
                    </div>
                    {/* Badge Position Logic */}
                    <span
                      className={`absolute -top-1.5 flex items-center justify-center rounded-full text-white font-bold  w-[18px] h-[18px] text-[10px] bg-gray-400 
                        ${isArabic ? "-left-1.5" : "-right-1.5"}`}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className=" text-gray-900 font-medium text-[13px] truncate">
                      {item.name}
                    </p>
                    <p className=" text-gray-400 text-[12px] truncate">
                      {item.variant?.product_name}
                    </p>
                  </div>
                  <span className=" text-gray-900 flex-shrink-0 text-[13px]">
                    {t.checkout.currency}
                    {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    .00
                  </span>
                </div>
              ))
            )}

            {/* Totals */}
            <div className="flex flex-col gap-2 border-t border-gray-100 mt-4 pt-3.5">
              <div className="flex justify-between  text-gray-600 text-[14px]">
                <span>{t.checkout.subtotal}</span>
                <span>
                  {t.checkout.currency}
                  {subtotal.toLocaleString()}.00
                </span>
              </div>

              {discountApplied && (
                <div className="flex justify-between  text-green-600 text-[14px]">
                  <span>{t.checkout.discount}</span>
                  <span>
                    −{t.checkout.currency}
                    {discountAmt.toLocaleString()}.00
                  </span>
                </div>
              )}

              <div className="flex justify-between  text-gray-600 text-[14px]">
                <span>{t.checkout.shipping}</span>
                <span>
                  {t.checkout.currency}
                  {SHIPPING}.00
                </span>
              </div>

              <div className="flex justify-between  font-semibold text-gray-900 text-[16px] mt-1">
                <span>{t.checkout.total}</span>
                <span>
                  <span className="text-gray-400 font-normal text-[11px]">
                    EGP{" "}
                  </span>
                  {t.checkout.currency}
                  {total.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
