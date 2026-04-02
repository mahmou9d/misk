"use client";

import { useState } from "react";
import { useAddToCart } from "@/hooks/useCart";
import { useGetBestsellers, useGetProducts, useGetSingleProduct } from "@/hooks/useProducts";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useCats } from "@/lib/CatsContext";
import { useTranslation } from "@/lib/Usetranslation";

export default function ProductPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const { data: productsData } = useGetProducts({ page: 1 });
  const firstProductId = productsData?.products?.[0]?.id;
  const { data: product, isLoading } = useGetSingleProduct(firstProductId ?? 0);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { setCartOpen } = useCats();
  const { data: bestsellers } = useGetBestsellers();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const showNotification = useShowNotification(setNotification);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { variant_id: Number(product.variants?.[0]?.id), quantity: 1 },
      {
        onSuccess: () => {
          setAdded(true);
          showNotification(t.product.addedToCart, "success");
          setCartOpen((prev) => !prev);
          setTimeout(() => setAdded(false), 2500);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              t.product.addToCartError,
            "error",
          );
        },
      },
    );
  };

  /* ─── Loading / Empty ─── */
  if (isLoading || !product) {
    return (
      <section className="w-full flex justify-center bg-[#fafaf8] min-h-screen">
        <div className="w-full max-w-240 mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-20">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-20 items-start animate-pulse">
            <div className="w-full md:w-1/2 shrink-0 rounded-3xl bg-[#f0ede6] aspect-square" />
            <div className="w-full md:w-1/2 flex flex-col gap-4 pt-2">
              <div className="h-3 w-20 rounded-full bg-[#e8e3d8]" />
              <div className="h-9 w-3/4 rounded-xl bg-[#e8e3d8]" />
              <div className="h-px w-full bg-[#e8e3d8] mt-1" />
              <div className="h-7 w-1/3 rounded-lg bg-[#e8e3d8]" />
              <div className="flex flex-col gap-3 mt-3">
                <div className="h-13.5 rounded-2xl bg-[#e8e3d8]" />
                <div className="h-13.5 rounded-2xl bg-[#e8e3d8]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const price = product.variants?.[0]?.price;
  const comparePrice = product.variants?.[0]?.compare_at_price;
  const discountPct = comparePrice
    ? Math.round(
        ((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100,
      )
    : null;
  const savings = comparePrice
    ? (Number(comparePrice) - Number(price)).toLocaleString()
    : null;

  return (
    <>
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </AnimatePresence>

      <section className="w-full flex justify-center bg-[#fafaf8]" dir={dir}>
        <div className="w-full max-w-240 mx-auto px-4 sm:px-6 lg:px-10 pt-13 pb-18">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            {/* ── Image ── */}
            <Link
              href={`/${locale.toLowerCase()}/products/${firstProductId}`}
              className="w-full md:w-1/2 shrink-0 relative group"
            >
              {/* Corner Ribbon */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className={`absolute top-0 ${isArabic ? "left-0" : "right-0"} z-10 w-22.5 h-22.5 overflow-hidden pointer-events-none rounded-3xl`}
              >
                <div
                  className={`absolute flex items-center justify-center w-31.5 h-6.5
                    bg-[linear-gradient(135deg,#c9a84c_0%,#f0d080_50%,#b8912e_100%)]
                    shadow-[0_2px_10px_rgba(201,168,76,0.5)]
                    ${isArabic ? "top-5.5 -left-7 -rotate-45" : "top-5.5 -right-7 rotate-45"}`}
                >
                  <motion.span
                    className="absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.45)_50%,transparent_65%)]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      delay: 1,
                      duration: 0.65,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3.5,
                    }}
                  />
                  <span
                    className={`relative z-10 text-[#1a0a3d] font-bold leading-none
                    ${isArabic ? "text-[16px]" : "text-[10px] -[1.5px] uppercase"}`}
                  >
                    {isArabic ? "الأكثر مبيعاً" : "Best Seller"}
                  </span>
                </div>
              </motion.div>

              {/* Discount badge */}
              {discountPct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.35, ease: "backOut" }}
                  className={`absolute top-3 z-10 flex flex-col items-center justify-center w-14 h-14 rounded-full
                    bg-[linear-gradient(135deg,#1a0a3d,#2d1b69)]
                    border-2 border-[rgba(201,168,76,0.4)]
                    shadow-[0_4px_18px_rgba(26,10,61,0.3)]
                    ${isArabic ? "right-3" : "left-3"}`}
                >
                  <span className="text-[15px] font-black text-[#f0d080] leading-none">
                    -{discountPct}%
                  </span>
                  <span className="text-[9px] text-[#c9a84c]/70 uppercase -wide mt-0.5">
                    {isArabic ? "خصم" : "off"}
                  </span>
                </motion.div>
              )}

              {/* Image container */}
              <div className="relative overflow-hidden rounded-3xl border border-[rgba(201,168,76,0.18)] shadow-[0_8px_48px_rgba(45,27,105,0.1)] bg-white">
                <Image
                  src={
                    (typeof product.variants?.[0]?.images?.[0] === "string"
                      ? product.variants[0].images[0]
                      : product.variants?.[0]?.images?.[0]?.url) || "/heros.jpg"
                  }
                  loading="lazy"
                  alt={product.name}
                  width={520}
                  height={520}
                  className="block w-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(245,240,228,0.35)_0%,transparent_50%)] pointer-events-none" />
              </div>
            </Link>

            {/* ── Details ── */}
            <motion.div
              className="w-full md:w-1/2 flex flex-col pt-2"
              initial={{ opacity: 0, x: isArabic ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08,
              }}
            >
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="mb-3 flex items-center gap-2"
              >
                <span
                  className={`text-[14px] font-semibold text-[#c9a84c]
                  ${isArabic ? "" : "-[5px] uppercase"}`}
                >
                  Misk Fragrance
                </span>
                <span className="flex-1 h-px bg-[linear-gradient(to_right,rgba(201,168,76,0.4),transparent)]" />
              </motion.div>

              {/* Product name */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className={`text-[#1a0a3d] text-[28px] md:text-[34px] font-bold mb-3
                  ${isArabic ? "leading-normal" : "leading-[1.15] -tight"}`}
              >
                {product.name}
              </motion.h1>

              {/* Description */}
              {product.description && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.27, duration: 0.4 }}
                  className={`text-[#4d4c4c] text-[16px] leading-relaxed mb-4 line-clamp-3
                    ${isArabic ? "" : "-[0.2px]"}`}
                >
                  {product.description}
                </motion.p>
              )}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                style={{ originX: isArabic ? 1 : 0 }}
                className="h-px mb-5 bg-[linear-gradient(to_right,rgba(201,168,76,0.45),transparent_75%)]"
              />

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.33, duration: 0.4 }}
                className="mb-1.5"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-[28px] font-bold bg-[linear-gradient(90deg,#c9a84c_0%,#f0d080_45%,#b8912e_100%)] bg-clip-text text-transparent">
                    {t.product.currency} {price?.toLocaleString()}
                  </span>
                  {comparePrice && (
                    <span className="text-[18px] text-[#bbb] line-through">
                      {t.product.currency} {comparePrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                {savings && discountPct && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className={`text-[14px] text-[#c9a84c]/80 mt-1
                      ${isArabic ? "" : "-[0.3px]"}`}
                  >
                    {isArabic
                      ? `توفر ${t.product.currency} ${savings} (${discountPct}%)`
                      : `You save ${t.product.currency} ${savings} (${discountPct}%)`}
                  </motion.p>
                )}
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.3 }}
                className="h-px my-5 bg-[rgba(201,168,76,0.12)]"
              />

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.45 }}
                className="flex flex-col gap-3"
              >
                {/* Add to cart */}
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isPending}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full h-13.5 text-[13px] font-semibold border-2 rounded-2xl transition-all duration-300
                    ${isArabic ? "" : "-[2px] uppercase"}
                    ${
                      added
                        ? "border-[#c9a84c] bg-[rgba(201,168,76,0.08)] text-[#b8912e]"
                        : "border-[rgba(26,10,61,0.15)] bg-white text-[#1a0a3d] hover:border-[#c9a84c] hover:text-[#b8912e] hover:bg-[rgba(201,168,76,0.05)]"
                    }
                    ${isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {isPending
                    ? t.product.adding
                    : added
                      ? `✓  ${t.product.added}`
                      : t.product.addToCart}
                </motion.button>

                {/* Buy now */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    handleAddToCart();
                    router.push(`/${locale.toLowerCase()}/checkout`);
                  }}
                  className={`relative overflow-hidden w-full h-13.5 text-[13px] font-bold rounded-2xl
                    bg-[linear-gradient(135deg,#1a0a3d_0%,#2d1b69_55%,#1a0a3d_100%)]
                    text-[rgba(240,208,128,0.95)]
                    shadow-[0_4px_22px_rgba(45,27,105,0.35)]
                    hover:shadow-[0_6px_30px_rgba(45,27,105,0.5)]
                    transition-all duration-300
                    ${isArabic ? "" : "-[2px] uppercase"}
                    after:content-[''] after:absolute after:inset-0 after:rounded-2xl
                    after:bg-[linear-gradient(135deg,rgba(201,168,76,0.18)_0%,transparent_55%)]
                    after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300`}
                >
                  <motion.span
                    className="absolute inset-0 bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.12)_50%,transparent_70%)]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      delay: 2,
                      duration: 0.8,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 4,
                    }}
                  />
                  <span className="relative z-10">{t.product.buyNow}</span>
                </motion.button>
              </motion.div>

              {/* View details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.58, duration: 0.4 }}
                className="mt-5"
              >
                <Link
                  href={`/${locale.toLowerCase()}/products/${product.id}`}
                  className="group inline-flex items-center gap-2 text-[15px] text-[#000] hover:text-[#1a0a3d] no-underline transition-colors duration-300"
                >
                  <span
                    className={`border-b border-transparent group-hover:border-[#1a0a3d]/30 pb-px
                    ${isArabic ? "" : "-[0.5px] uppercase"}`}
                  >
                    {t.product.viewDetails}
                  </span>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 group-hover:translate-x-1
                      ${isArabic ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
