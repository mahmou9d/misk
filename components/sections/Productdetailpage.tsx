/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/layout/Productcard";
import AnnouncementBar from "../layout/AnnouncementBar";
import Navbar from "../layout/Navbar";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import { useGetSingleProduct, useGetProducts } from "@/hooks/useProducts";
import {
  Product,
  NotificationState,
  ErrorResponse,
  Variant,
} from "@/type/type";
import { useAddToCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "../layout/Notification";
import { AxiosError } from "axios";
import { useCats } from "@/lib/CatsContext";
import { useTranslation } from "@/lib/Usetranslation";
import { useGetReviews, useAddReview } from "@/hooks/useReviews";

/* ── Icons ── */
const ShareIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

/* ── Skeleton ── */
function Skeleton() {
  return (
    <div
      className="animate-pulse flex flex-col md:flex-row gap-10 lg:gap-16"
      style={{ paddingTop: 48 }}
    >
      <div
        className="w-full md:w-1/2"
        style={{
          background: "linear-gradient(135deg,#f5f0ff,#ede8f7)",
          aspectRatio: "3/4",
        }}
      />
      <div className="w-full md:w-1/2 flex flex-col gap-5 pt-4">
        {(
          [
            ["30%", 12],
            ["65%", 40],
            ["20%", 28],
            ["100%", 52],
            ["100%", 52],
          ] as [string, number][]
        ).map(([w, h], i) => (
          <div
            key={i}
            style={{
              background: "#ede8f7",
              height: h,
              width: w,
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Gallery ── */
function ProductGallery({
  images,
  name,
}: {
  images: { url: string }[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = images[activeIndex].url || images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-3/4 aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#f8f5f0] to-[#ede8e0] border border-[#c9a84c]/[0.14]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            {currentImage ? (
              <Image
                src={currentImage as string}
                alt={name}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width:768px) 100vw, 52vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69]">
                <span className=" text-[11px] text-[#c9a84c]/40 tracking-[3px] mb-5">
                  {name}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {["tl", "tr", "bl", "br"].map((pos) => (
          <div
            key={pos}
            className={`absolute w-4 h-4 border-[#c9a84c]/50
              ${pos.startsWith("t") ? "top-3 border-t" : "bottom-3 border-b"}
              ${pos.endsWith("l") ? "left-3 border-l" : "right-3 border-r"}
            `}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative overflow-hidden shrink-0 w-[68px] h-[68px] cursor-pointer transition-all duration-200 bg-[#f5f0eb]
                hover:border-[#c9a84c]/50
                ${
                  activeIndex === i
                    ? "border-[1.5px] border-[#c9a84c]/80 shadow-[0_0_0_2px_rgba(201,168,76,0.15)]"
                    : "border border-black/10"
                }
              `}
            >
              <Image
                src={src.url || String(src)}
                loading="lazy"
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="68px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   ── Reviews Section Components ──
══════════════════════════════════════════ */

const StarIcon = ({
  filled,
  half,
  size = 16,
  onClick,
  onHover,
}: {
  filled: boolean;
  half?: boolean;
  size?: number;
  onClick?: () => void;
  onHover?: () => void;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "url(#goldGrad)" : half ? "url(#halfGrad)" : "none"}
    stroke={filled || half ? "none" : "#d1c49a"}
    strokeWidth="1.5"
    onClick={onClick}
    onMouseEnter={onHover}
    style={{ cursor: onClick ? "pointer" : "default", flexShrink: 0 }}
  >
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c9a84c" />
        <stop offset="100%" stopColor="#f0d080" />
      </linearGradient>
      <linearGradient id="halfGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="50%" stopColor="#c9a84c" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function StarRow({
  rating,
  size = 16,
  interactive,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const display = interactive ? hover || rating : rating;

  return (
    <div
      className="flex gap-0.5"
      onMouseLeave={() => interactive && setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          filled={i <= Math.floor(display)}
          half={!interactive && i === Math.ceil(display) && display % 1 >= 0.4}
          size={size}
          onClick={interactive ? () => onRate?.(i) : undefined}
          onHover={interactive ? () => setHover(i) : undefined}
        />
      ))}
    </div>
  );
}

function RatingBar({
  count,
  total,
  label,
}: {
  count: number;
  total: number;
  label: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-[12px] text-gray-400">
      <span className="w-3 text-right font-medium text-[#111]">{label}</span>
      <StarIcon filled size={11} />
      <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0d080] rounded-full"
        />
      </div>
      <span className="w-5 text-right">{count}</span>
    </div>
  );
}

function ReviewCard({
  review,
  index,
  isArabic,
}: {
  review: {
    id: number;
    user_name?: string;
    user?: string;
    rating: number;
    comment: string;
    created_at?: string;
  };
  index: number;
  isArabic: boolean;
}) {
  const displayName = review.user_name || review.user || "Anonymous";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const date = review.created_at
    ? new Date(review.created_at).toLocaleDateString(
        isArabic ? "ar-EG" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="border border-black/[0.07] bg-white p-5 hover:border-[#c9a84c]/30 transition-colors duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 shrink-0 bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] flex items-center justify-center">
          <span className="text-[11px] font-semibold text-[#f0d080] tracking-wide">
            {initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-[13px] font-medium text-[#111] truncate ${
                isArabic ? "tracking-normal" : "tracking-[0.5px]"
              }`}
            >
              {displayName}
            </span>
            {date && (
              <span className="text-[15px] text-gray-800 shrink-0">{date}</span>
            )}
          </div>
          <StarRow rating={review.rating} size={13} />
        </div>
      </div>
      {review.comment && (
        <p
          className={`text-[14px] text-gray-500 ${
            isArabic
              ? "leading-[1.9] tracking-normal"
              : "leading-[1.75] tracking-[0.2px]"
          }`}
        >
          {review.comment}
        </p>
      )}
    </motion.div>
  );
}

function AddReviewForm({
  productId,
  isArabic,
  t,
  onSuccess,
}: {
  productId: number;
  isArabic: boolean;
  t: Record<string, any>;
  onSuccess?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formNotification, setFormNotification] =
    useState<NotificationState | null>(null);
  const showFormNotification = useShowNotification(setFormNotification);
  const { mutate: addReview, isPending } = useAddReview();

  const handleSubmit = () => {
    
    addReview(
      { product: productId, rating, comment },
      {
        onSuccess: () => {
          setSubmitted(true);
          setRating(0);
          setComment("");
          onSuccess?.();
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          console.log(error.response?.data.detail)
          showFormNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              t?.reviews?.submitError ||
              "Failed to submit review",
            "error",
          );
        },
      },
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 p-5 text-center"
      >
        <div className="text-[#c9a84c] text-2xl mb-2">✓</div>
        <p
          className={`text-[14px] text-gray-500 ${
            isArabic ? "tracking-normal" : "tracking-[0.5px]"
          }`}
        >
          {t?.reviews?.thankYou || "Thank you for your review!"}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="border border-black/[0.07] bg-[#faf9f7] p-5">
      <p
        className={`text-[13px] text-[#111] mb-4 ${
          isArabic ? "tracking-normal" : "tracking-[2px] uppercase"
        }`}
      >
        {t?.reviews?.writeReview || "Write a Review"}
      </p>

      {/* Star Rating Picker */}
      <div className="mb-4">
        <p
          className={`text-[12px] text-gray-400 mb-2 ${
            isArabic ? "tracking-normal" : "tracking-[1px]"
          }`}
        >
          {t?.reviews?.yourRating || "Your Rating"}
          {!rating && <span className="text-red-300 ml-1">*</span>}
        </p>
        <StarRow rating={rating} size={24} interactive onRate={setRating} />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <p
          className={`text-[12px] text-gray-400 mb-2 ${
            isArabic ? "tracking-normal" : "tracking-[1px]"
          }`}
        >
          {t?.reviews?.yourComment || "Your Comment"}{" "}
          <span className="text-gray-300">
            ({t?.reviews?.optional || "optional"})
          </span>
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          dir={isArabic ? "rtl" : "ltr"}
          placeholder={
            t?.reviews?.commentPlaceholder || "Share your experience..."
          }
          className={`w-full text-[13px] text-[#333] bg-white border border-black/10 px-3.5 py-3 resize-none outline-none transition-colors duration-200 focus:border-[#c9a84c]/60 placeholder:text-gray-300 ${
            isArabic
              ? "tracking-normal leading-[1.9]"
              : "tracking-[0.3px] leading-relaxed"
          }`}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!rating || isPending}
        className={`h-[44px] px-8 text-[12px] font-semibold border transition-all duration-300 relative overflow-hidden group
          ${
            rating && !isPending
              ? "bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] text-[#f0d080]/95 border-[#c9a84c]/25 cursor-pointer hover:shadow-[0_4px_20px_rgba(45,27,105,0.25)]"
              : "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
          }
          ${isArabic ? "tracking-normal" : "tracking-[2px] uppercase"}
        `}
      >
        <span className="relative z-10">
          {isPending
            ? t?.reviews?.submitting || "Submitting..."
            : t?.reviews?.submit || "Submit Review"}
        </span>
        {rating && !isPending && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.button>
    </div>
  );
}

function ReviewsSection({
  productId,
  isArabic,
  t,
}: {
  productId: number;
  isArabic: boolean;
  t: Record<string, any>;
}) {
  const { data: reviews = [], isLoading, refetch } = useGetReviews(productId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => Math.round(r.rating) === star).length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20"
    >
      {/* Header */}
      <div className="mb-8">
        <span
          className={`text-[16px] text-[#c9a84c]/80 block mb-2 ${
            isArabic ? "tracking-normal" : "tracking-[5px] uppercase"
          }`}
        >
          {t?.reviews?.label || "Customer Reviews"}
        </span>
        <h2
          className={`text-[clamp(22px,3vw,32px)] font-normal text-[#111] ${
            isArabic ? "leading-[1.4]" : "leading-[1.2]"
          }`}
        >
          {t?.reviews?.title || "What Our Customers Say"}
        </h2>
        <div className="mt-2.5 h-[2px] w-16 bg-gradient-to-r from-[#c9a84c]/60 to-transparent" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Summary + Form */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="border border-black/[0.07] bg-[#faf9f7] p-5"
            >
              <div className="flex items-end gap-3 mb-4">
                <span className="text-[52px] font-light text-[#111] leading-none">
                  {avgRating.toFixed(1)}
                </span>
                <div className="pb-1.5">
                  <StarRow rating={avgRating} size={18} />
                  <p
                    className={`text-[12px] text-gray-400 mt-1.5 ${
                      isArabic ? "tracking-normal" : "tracking-[0.5px]"
                    }`}
                  >
                    {reviews.length}{" "}
                    {reviews.length === 1
                      ? t?.reviews?.review || "review"
                      : t?.reviews?.reviews || "reviews"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {starCounts.map(({ star, count }) => (
                  <RatingBar
                    key={star}
                    label={String(star)}
                    count={count}
                    total={reviews.length}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <AddReviewForm
            productId={productId}
            isArabic={isArabic}
            t={t}
            onSuccess={() => refetch()}
          />
        </div>

        {/* Right: Reviews List */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse border border-black/[0.05] p-5 h-[100px] bg-[#faf9f7]"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 border border-dashed border-black/10"
            >
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} filled={false} size={20} />
                ))}
              </div>
              <p
                className={`text-[14px] text-gray-400 ${
                  isArabic ? "tracking-normal" : "tracking-[1px]"
                }`}
              >
                {t?.reviews?.noReviews || "No reviews yet. Be the first!"}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {reviews.map((review: any, i: number) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    index={i}
                    isArabic={isArabic}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   ── Main Page ──
══════════════════════════════════════════ */
export default function ProductDetailPage({ id }: { id: number }) {
  const { t, isArabic, dir, locale } = useTranslation();
  const router = useRouter();
  const { data: product, isLoading, isError } = useGetSingleProduct(id, true);
  const { data: allData } = useGetProducts();

  const relatedProducts =
    product && allData?.products
      ? allData.products
          .filter(
            (p: Product) =>
              p.id !== product.id && p.category_name === product.category,
          )
          .slice(0, 4)
      : [];

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [addingVariantId, setAddingVariantId] = useState<number | null>(null);
  const [addedVariantId, setAddedVariantId] = useState<number | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const { setCartOpen } = useCats();
  const showNotification = useShowNotification(setNotification);
  const { mutate: addToCart } = useAddToCart();

  if (product && !selectedVariant && product.variants?.length) {
    setSelectedVariant(product?.variants[0]);
  }

  const selectedPrice = selectedVariant?.price ?? null;
  const comparePrice = selectedVariant?.compare_at_price ?? null;
  const inStock = selectedVariant ? selectedVariant.stock > 0 : true;
  const variantImages = selectedVariant?.images as { url: string }[];
  const isAddingThisVariant = addingVariantId === selectedVariant?.id;
  const wasAddedThisVariant = addedVariantId === selectedVariant?.id;

  const discountPct =
    comparePrice && selectedPrice
      ? Math.round(
          ((parseFloat(comparePrice) - parseFloat(selectedPrice)) /
            parseFloat(comparePrice)) *
            100,
        )
      : null;

  const currency = isArabic ? "ج.م" : "LE";

  const handleAdd = () => {
    if (!product || !selectedVariant || isAddingThisVariant) return;
    const vid = selectedVariant.id;
    setAddingVariantId(vid);
    setAddedVariantId(null);
    addToCart(
      { variant_id: vid, quantity: qty },
      {
        onSuccess: () => {
          setAddedVariantId(vid);
          showNotification(t.productDetail.addedToCart, "success");
          setCartOpen((prev) => !prev);
          setTimeout(() => setAddedVariantId(null), 2500);
        },
        onError: (error: AxiosError<ErrorResponse>) =>
          showNotification(
            error?.response?.data?.message ||
              error?.response?.data?.detail ||
              error?.response?.data?.error ||
              error?.response?.data?.status ||
              error?.response?.data?.non_field_errors ||
              error?.response?.data?.name ||
              error?.message ||
              t.productDetail.addToCartError,
            "error",
          ),
        onSettled: () => setAddingVariantId(null),
      },
    );
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    addToCart(
      { variant_id: selectedVariant.id, quantity: qty },
      {
        onSuccess: () => router.push(`/${locale.toLowerCase()}/checkout`),
        onError: (e: AxiosError<ErrorResponse>) => {
          showNotification(
            e?.response?.data?.detail || t.productDetail.buyNowError,
            "error",
          );
        },
      },
    );
  };

  if (isLoading)
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <section className="w-full bg-white pb-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <Skeleton />
          </div>
        </section>
        <Footer />
      </>
    );

  if (isError || !product)
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <p
              className={` text-[#bbb] text-base mb-4 ${
                isArabic ? "tracking-normal" : "tracking-[1px]"
              }`}
            >
              {t.productDetail.notFound}
            </p>
            <Link
              href={`/${locale.toLowerCase()}`}
              className={` text-[#888] text-[13px] border-b border-black/10 pb-0.5 transition-colors hover:text-[#111] hover:border-black/30 ${
                isArabic ? "tracking-normal" : "tracking-[2px] uppercase"
              }`}
            >
              {t.productDetail.backHome}
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </AnimatePresence>

      <section className="w-full bg-white pb-24" dir={dir}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-12">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-20 items-start">
            {/* Gallery */}
            <motion.div
              className="w-full md:w-1/2 lg:w-[52%] flex-shrink-0"
              initial={{ opacity: 0, x: isArabic ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductGallery images={variantImages} name={product.name} />
            </motion.div>

            {/* Info */}
            <motion.div
              className="w-full md:w-1/2 lg:w-[48%] flex flex-col pt-1.5"
              initial={{ opacity: 0, x: isArabic ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.08,
              }}
            >
              {/* Brand label */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className={` text-[20px] text-[#c9a84c]/80 mb-2 ${isArabic ? "tracking-normal" : "tracking-[5px] uppercase"}`}
              >
                Misk
              </motion.p>

              {(product.fragrance_family || product.concentration) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className={` text-[13px] text-gray-400 mb-2.5 ${isArabic ? "tracking-normal" : "tracking-[0.5px]"}`}
                >
                  {[product.fragrance_family, product.concentration]
                    .filter(Boolean)
                    .join(" · ")}
                </motion.p>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className={` text-[clamp(28px,3.5vw,46px)] font-normal text-[#111] mb-2.5 ${isArabic ? "leading-[1.4]" : "leading-[1.15]"}`}
              >
                {product.name}
              </motion.h1>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.28, duration: 0.55, ease: "easeOut" }}
                className={`h-[1px] mb-[22px] bg-gradient-to-r from-[#c9a84c]/50 to-transparent ${isArabic ? "origin-right" : "origin-left"}`}
              />

              {/* Price Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex items-baseline gap-3 mb-[26px]"
              >
                {selectedPrice && (
                  <span className=" text-[26px] font-semibold bg-gradient-to-r from-[#c9a84c] via-[#f0d080] to-[#e8c860] bg-[length:200%_auto] animate-shimmer-gold bg-clip-text text-transparent">
                    {currency}{" "}
                    {parseFloat(selectedPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}{" "}
                    EGP
                  </span>
                )}
                {comparePrice && (
                  <span className=" text-[20px] text-gray-300 line-through">
                    {currency}{" "}
                    {parseFloat(comparePrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
                {discountPct && (
                  <span className=" text-[16px] font-bold px-2 py-[3px] bg-gradient-to-br from-[#1a0a3d] to-[#2a1060] text-[#f0d080] border border-[#c9a84c]/30">
                    -{discountPct}%
                  </span>
                )}
              </motion.div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.33, duration: 0.4 }}
                  className="mb-6"
                >
                  <p
                    className={` text-[16px] text-[#000] mb-3 ${isArabic ? "tracking-normal" : "tracking-[3px] uppercase"}`}
                  >
                    {t.productDetail.volume}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const outOfStock = v.stock === 0;
                      return (
                        <motion.button
                          key={v.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => !outOfStock && setSelectedVariant(v)}
                          disabled={outOfStock}
                          className={` text-[13px] px-[18px] py-2 border transition-all duration-200 
                            ${isSelected ? "border-[#c9a84c]/80 bg-[#c9a84c]/10 text-[#c9a84c]/90 shadow-[inset_0_0_0_1px_rgba(201,168,76,0.3)]" : "border-black/10 bg-white text-[#444]"}
                            ${outOfStock ? "text-gray-300 cursor-not-allowed line-through" : "hover:border-[#c9a84c]/50 cursor-pointer"}
                            ${isArabic ? "tracking-normal" : "tracking-[1px]"}
                          `}
                        >
                          {v.volume}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <div className="h-[1px] bg-gradient-to-r from-[#c9a84c]/10 to-transparent mb-6" />

              {/* Quantity */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.4 }}
                className="mb-5"
              >
                <p
                  className={` text-[16px] text-[#000] mb-3 ${isArabic ? "tracking-normal" : "tracking-[3px] uppercase"}`}
                >
                  {t.productDetail.quantity}
                </p>
                <div className="inline-flex items-center border border-black/10">
                  <button
                    className="w-11 h-11 text-[18px] text-gray-500  hover:bg-[#c9a84c]/5 hover:text-[#2d1b69] transition-colors"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className=" text-[15px] min-w-[36px] text-center text-[#111] border-x border-black/10 h-11 flex items-center justify-center">
                    {qty}
                  </span>
                  <button
                    className="w-11 h-11 text-[18px] text-gray-500  hover:bg-[#c9a84c]/5 hover:text-[#2d1b69] transition-colors"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
                className="flex flex-col gap-3 mb-[22px]"
              >
                <motion.button
                  whileTap={{ scale: 0.988 }}
                  onClick={handleAdd}
                  disabled={!inStock || isAddingThisVariant}
                  className={`h-[52px]  text-[13px] font-medium border transition-all duration-300
                    ${wasAddedThisVariant ? "border-[#c9a84c]/50 bg-[#c9a84c]/5 text-[#c9a84c]/90" : "border-black/20 bg-white text-[#222]"}
                    ${!inStock || isAddingThisVariant ? "text-gray-300 cursor-not-allowed border-gray-100" : "hover:border-[#c9a84c]/55 hover:text-[#c9a84c]/90 cursor-pointer"}
                    ${isArabic ? "tracking-normal" : "tracking-[3px] uppercase"}
                  `}
                >
                  {!inStock
                    ? t.productDetail.soldOut
                    : isAddingThisVariant
                      ? t.productDetail.adding
                      : wasAddedThisVariant
                        ? `✓ ${t.productDetail.added}`
                        : t.productDetail.addToCart}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.988 }}
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className={`h-[52px]  text-[13px] font-semibold border border-[#c9a84c]/25 shadow-lg transition-all duration-300 relative overflow-hidden group
                    ${inStock ? "bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] text-[#f0d080]/95 shadow-[#2d1b69]/20 hover:shadow-[#2d1b69]/35 cursor-pointer" : "bg-gray-300 text-white cursor-not-allowed"}
                    ${isArabic ? "tracking-normal" : "tracking-[3px] uppercase"}
                  `}
                >
                  <span className="relative z-10">
                    {t.productDetail.buyNow}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Description */}
              {product.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.48, duration: 0.4 }}
                  className="mb-[22px]"
                >
                  <div className="h-[1px] bg-gradient-to-r from-[#c9a84c]/10 to-transparent mb-4.5" />
                  {product.description.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className={` text-[15px] text-gray-500 mb-3.5 last:mb-0 ${isArabic ? "leading-[2] tracking-normal" : "leading-[1.85] tracking-[0.2px]"}`}
                    >
                      {para}
                    </p>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* ── Reviews Section ── */}
          <ReviewsSection productId={product.id} isArabic={isArabic} t={t} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-24"
            >
              <div className="mb-9">
                <span
                  className={` text-[16px] text-[#c9a84c]/80 block mb-2 ${isArabic ? "tracking-normal" : "tracking-[5px] uppercase"}`}
                >
                  {t.productDetail.collectionLabel}
                </span>
                <h2
                  className={` text-[clamp(22px,3vw,32px)] font-normal text-[#111] ${isArabic ? "leading-[1.4]" : "leading-[1.2]"}`}
                >
                  {t.productDetail.youMayAlsoLike}
                </h2>
                <div className="mt-2.5 h-[2px] w-16 bg-gradient-to-r from-[#c9a84c]/60 to-transparent" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
