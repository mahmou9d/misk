"use client";

import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "@/lib/Usetranslation";
import { useGetBannersPublic } from "@/hooks/useDashboard";

// ─── Animation Helpers ────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = (delay = 0, y = 30) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease: EASE },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, delay, ease: EASE },
});

export default function HeroSection() {
  const { t, isArabic, locale } = useTranslation();
  const { data: banners } = useGetBannersPublic();

  // ── Subtle Zoom Loop ──
  const zoomControls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled) {
        await zoomControls.start({
          scale: 1.05, // Reduced from 1.08 for a slower, more elegant breathe
          transition: { duration: 12, ease: "easeInOut" }, // Slowed down for luxury feel
        });
        if (cancelled) break;
        await zoomControls.start({
          scale: 1,
          transition: { duration: 12, ease: "easeInOut" },
        });
      }
    };

    runLoop();
    return () => {
      cancelled = true;
    };
  }, [zoomControls]);

  const imgSrc = banners?.[0]?.img_url || "/heros.jpg";

  return (
    <section className="relative w-full overflow-hidden bg-[#04020e] min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[850px]">
      {/* ── Background Image ── */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <motion.div
          animate={zoomControls}
          initial={{ scale: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={imgSrc}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.65] opacity-90 transition-all"
            priority
            unoptimized={imgSrc.startsWith("http")}
          />
        </motion.div>
      </div>
      {/* ── Main Content ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center mt-12 px-4"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-3xl text-center flex flex-col items-center">
          {/* Headline Line 1 */}
          <div className="overflow-hidden pb-2">
            <motion.h1
              {...fadeUp(0.1, 40)}
              className="m-0 text-white tracking-tight"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: 300,
                fontSize: "clamp(38px, 6vw, 76px)", // Scaled down for sleekness
                lineHeight: 1,
              }}
            >
              {t.hero.title}
            </motion.h1>
          </div>

          {/* Headline Line 2 (Gold Gradient) */}
          <div className="overflow-hidden pb-4">
            <motion.div {...fadeUp(0.2, 40)}>
              <span
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontStyle: isArabic ? "normal" : "italic",
                  fontWeight: 400,
                  fontSize: "clamp(42px, 6.5vw, 84px)", // Slightly larger than line 1 for emphasis
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg, #dfc27d 0%, #f9f0b5 50%, #b8912e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.hero.titleEm}
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.5, 20)}
            className="text-white/80 font-light max-w-md mx-auto mb-10"
            style={{
              fontSize: "clamp(12px, 1.5vw, 15px)", // Reduced text size
              lineHeight: 1.8,
              letterSpacing: isArabic ? "0" : "0.03em",
            }}
          >
            {isArabic
              ? "حيث تلتقي المكوّنات النادرة بفنّ العطور الراقية"
              : "Where rare ingredients meet the art of fine perfumery."}
          </motion.p>

          {/* ── CTA Row (Side-by-Side on Mobile) ── */}
          <motion.div
            {...fadeUp(0.6, 20)}
            className="flex flex-row items-center justify-center gap-3 sm:gap-5 w-full max-w-[480px] mx-auto"
          >
            {/* Primary Button */}
            <Link
              href={`/${locale.toLowerCase()}/shop`}
              className="group rounded-sm flex-1 relative overflow-hidden flex items-center justify-center gap-2 py-3.5 sm:py-4 px-2 sm:px-6 sm:rounded-sm"
              style={{
                background:
                  "linear-gradient(135deg, #c9a84c 0%, #e8c847 50%, #b8912e 100%)",
                boxShadow: "0 8px 25px -5px rgba(201,168,76,0.3)",
                transition: "all 0.4s ease-out",
              }}
            >
              <span
                className="relative z-10 text-[#06040c] font-bold whitespace-nowrap"
                style={{
                  fontSize: "clamp(11px, 1.2vw, 13px)", // Much sleeker text
                  letterSpacing: isArabic ? "0" : "0.15em",
                  textTransform: isArabic ? "none" : "uppercase",
                }}
              >
                {t.hero.cta}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                className={`text-[#06040c] transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? "rotate-180" : ""}`}
              >
                <path
                  d="M2 7h10M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Secondary Button */}
            <Link
              href={`/${locale.toLowerCase()}/collections`}
              className="flex-1 rounded-sm flex items-center justify-center py-3.5 sm:py-4 px-2 sm:px-6 rounded-none sm:rounded-sm border border-white/30 text-white transition-all duration-400 hover:border-[#c9a84c] hover:bg-[#c9a84c]/5"
            >
              <span
                className="whitespace-nowrap font-medium"
                style={{
                  fontSize: "clamp(11px, 1.2vw, 13px)", // Matches primary button
                  letterSpacing: isArabic ? "0" : "0.15em",
                  textTransform: isArabic ? "none" : "uppercase",
                }}
              >
                {isArabic ? "مجموعاتنا" : "Our Collections"}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
