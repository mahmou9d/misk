"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCartItems,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/useCart";
import { CartItem } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";

/* ── Icons ── */
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const BagIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const Spinner = ({
  size = 13,
  color = "#888",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ animation: "musk-spin 0.7s linear infinite", flexShrink: 0 }}
  >
    <style>{`@keyframes musk-spin { to { transform: rotate(360deg) } }`}</style>
    <path d="M12 2a10 10 0 0 1 10 10" opacity=".25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);

/* ── Qty Button ── */
function QtyButton({
  label,
  onClick,
  disabled,
  loading,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick(e);
      }}
      disabled={disabled || loading}
      aria-label={label === "+" ? "Increase quantity" : "Decrease quantity"}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontSize: 18,
        color: disabled ? "#ccc" : "#888",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading)
          e.currentTarget.style.color = "rgba(201,168,76,0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = disabled ? "#ccc" : "#888";
      }}
    >
      {loading ? <Spinner size={11} color="#bbb" /> : label}
    </button>
  );
}

/* ── Cart Item Row ── */
function CartItemRow({
  item,
  locale,
  onClose,
}: {
  item: CartItem;
  locale: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartQuantity();
  const [updatingDirection, setUpdatingDirection] = useState<
    "inc" | "dec" | null
  >(null);

  const itemTotal = parseFloat(String(item.price)) * Number(item.quantity);
  const productName = item?.variant?.product_name ?? item.name;
  const productImage =
    (typeof item?.variant?.images?.[0] === "string"
      ? item.variant.images[0]
      : item?.variant?.images?.[0]?.url) || "/heros.jpg";
  const currentQty = Number(item.quantity);

  const handleDecrement = useCallback(
    (e: React.MouseEvent) => {
      setUpdatingDirection("dec");
      updateQty(
        { item_id: item.id, quantity: Math.max(1, currentQty - 1) },
        { onSettled: () => setUpdatingDirection(null) },
      );
    },
    [item.id, currentQty, updateQty],
  );

  const handleIncrement = useCallback(
    (e: React.MouseEvent) => {
      setUpdatingDirection("inc");
      updateQty(
        { item_id: item.id, quantity: currentQty + 1 },
        { onSettled: () => setUpdatingDirection(null) },
      );
    },
    [item.id, currentQty, updateQty],
  );

  const handleRowClick = useCallback(() => {
    onClose();
    router.push(`/${locale.toLowerCase()}/products/${item.product_id}`);
  }, [onClose, router, locale, item.product_id]);

  return (
    <div
      onClick={handleRowClick}
      className={`flex gap-3.5 mb-[22px] pb-[22px] border-b border-[#c9a84c]/10 transition-opacity duration-200 cursor-pointer ${
        isRemoving ? "opacity-45" : "opacity-100"
      }`}
    >
      {/* Image Container */}
      <div className="w-[76px] h-[96px] shrink-0 bg-gradient-to-br from-[#f5f0eb] to-[#ede8e0] border border-[#c9a84c]/15 overflow-hidden">
        <Image
          src={String(productImage)}
          alt={String(productName)}
          width={76}
          height={96}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Container */}
      <div className="flex-1 flex flex-col gap-[3px]">
        {/* Name + Price Row */}
        <div className="flex items-start justify-between gap-2">
          <p className=" text-[16px] font-normal text-[#111] leading-[1.3]">
            {productName}
          </p>
          <span className="text-[18px] font-semibold text-[#111] whitespace-nowrap bg-gradient-to-r from-[#c9a84c] via-[#f0d080] via-[40%] to-[#c9a84c] to-[70%] bg-[length:200%_auto] bg-clip-text text-transparent animate-[musk-shimmer_4s_linear_infinite]">
            EGP {itemTotal.toLocaleString()}
          </span>
        </div>

        {/* Volume Info */}
        {item?.variant?.volume && (
          <span className=" text-[15px]  uppercase text-[#c9a84c]/70">
            {item.variant.volume}
          </span>
        )}

        {/* Qty + Delete Row */}
        <div
          className="flex items-center justify-between mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quantity Controls */}
          <div className="inline-flex items-center border border-black/10">
            <QtyButton
              label="−"
              onClick={handleDecrement}
              disabled={currentQty <= 1 || isUpdating}
              loading={isUpdating && updatingDirection === "dec"}
            />
            <span className=" text-[13px] min-w-[28px] text-center text-[#333] border-x border-black/[0.08] h-[30px] leading-[30px]">
              {currentQty}
            </span>
            <QtyButton
              label="+"
              onClick={handleIncrement}
              disabled={isUpdating}
              loading={isUpdating && updatingDirection === "inc"}
            />
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              removeItem(item.id);
            }}
            disabled={isRemoving}
            aria-label="Remove item from cart"
            className={`bg-none border-none p-1 flex transition-colors duration-200 text-[#ccc] ${
              isRemoving
                ? "cursor-not-allowed"
                : "cursor-pointer hover:text-red-700/70"
            }`}
          >
            {isRemoving ? (
              <Spinner size={15} color="rgba(180,60,60,0.6)" />
            ) : (
              <TrashIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Cart Drawer ── */
export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: cartItems, isLoading: isCartLoading } = useGetCartItems();
  const { t, isArabic, locale, dir } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const totalQuantity = useMemo(
    () => cartItems?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0,
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems?.reduce(
        (sum, item) =>
          sum + parseFloat(String(item.price)) * Number(item.quantity),
        0,
      ) ?? 0,
    [cartItems],
  );

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Drawer slides in from the inline-end side
  const drawerX = isArabic ? "100%" : "-100%";

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-[#0a0518]/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 inset-y-0 z-50 h-full flex flex-col bg-[#faf8f4] shadow-[-4px_0_60px_rgba(45,27,105,0.18)] border-s border-[#c9a84c]/15"
              role="dialog"
              aria-modal="true"
              aria-label={t.cart.title}
              dir={dir}
              style={{
                width: "min(460px, 100vw)",
                [isArabic ? "right" : "left"]: 0,
              }}
              initial={{ x: drawerX }}
              animate={{ x: 0 }}
              exit={{ x: drawerX }}
              transition={{ duration: 0.34, ease: [0.32, 0.132, 0, 1] }}
            >
              {/* Gold top accent */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 h-[62px] border-b border-[#c9a84c]/12 shrink-0">
                <div className="flex items-baseline gap-[10px]">
                  <span className=" text-[18px] font-normal text-[#111]">
                    {t.cart.title}
                  </span>
                  {totalQuantity > 0 && (
                    <span className=" text-[18px]  text-[#c9a84c]/80">
                      {totalQuantity}{" "}
                      {totalQuantity === 1 ? t.cart.item : t.cart.items}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close cart drawer"
                  className="bg-none border-none cursor-pointer text-[#aaa] flex p-1.5 transition-colors duration-200 hover:text-[#555]"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Items Container */}
              <div className="flex-1 overflow-y-auto p-5 md:px-6">
                {isCartLoading ? (
                  <div className="flex flex-col gap-5">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-3.5 animate-pulse">
                        <div className="w-[76px] h-[96px] bg-gradient-to-br from-[#f0ecf8] to-[#e8e3f4] shrink-0" />
                        <div className="flex-1 flex flex-col gap-2.5 pt-1">
                          <div className="h-3.5 w-[60%] bg-[#ede8f4] rounded-sm" />
                          <div className="h-[11px] w-[35%] bg-[#f0ecf8] rounded-sm" />
                          <div className="h-[11px] w-[25%] bg-[#f0ecf8] rounded-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (cartItems ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3.5">
                    <span className="text-[#c9a84c]/30">
                      <BagIcon />
                    </span>
                    <p className=" text-[15px]  text-[#ccc]">{t.cart.empty}</p>
                    <button
                      onClick={onClose}
                      className=" text-[20px]  uppercase bg-none border border-black/10 px-[22px] py-[9px] cursor-pointer mt-1 transition-all duration-200 hover:border-[#c9a84c] hover:text-[#c9a84c]"
                    >
                      {t.cart.continueShopping}
                    </button>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cartItems!.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        locale={locale}
                        onClose={onClose}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {(cartItems ?? []).length > 0 && (
                <div className="shrink-0 p-4 md:px-6 md:pt-[18px] md:pb-7 border-t border-[#c9a84c]/12 bg-[#faf8f4]">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between mb-[18px]">
                    <span className=" text-[12px]  uppercase text-black">
                      {t.cart.subtotal}
                    </span>
                    <span className=" text-[18px] font-semibold text-[#111]">
                      EGP {subtotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Checkout CTA */}

                  <Link
                    href={`/${locale.toLowerCase()}/checkout`}
                    className="flex rounded-2xl items-center justify-center w-full h-[52px] no-underline  text-[13px]  uppercase font-bold bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] text-[#f0d080]/95 border border-[#c9a84c]/25 shadow-[0_2px_18px_rgba(45,27,105,0.2)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(45,27,105,0.35)] relative overflow-hidden mb-3"
                  >
                    {t.cart.checkout} — EGP {subtotal.toLocaleString()}
                  </Link>

                  {/* Continue shopping */}
                  <button
                    onClick={onClose}
                    className="w-full bg-none border-none cursor-pointer  text-[15px] font-semibold  uppercase text-black text-center py-1.5 transition-colors duration-200 hover:text-[#c9a84c]/80"
                  >
                    {t.cart.continueShopping}
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
