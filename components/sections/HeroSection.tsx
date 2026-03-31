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

// ─── Image Sources ─────────────────────────────────────────────────────────────
const IMG_EN = "/banner1.jpg";
const IMG_AR = "/banner2.jpg";
const IMG_MOBILE = "/banner3.jpg";

export default function HeroSection() {
  const { t, isArabic, locale } = useTranslation();
  const { data: banners } = useGetBannersPublic();

  const imgEn =  IMG_EN;
  const imgAr =  IMG_AR;
  const imgMobile =  IMG_MOBILE;

  const desktopImg = isArabic ? imgAr : imgEn;

  // ── Zoom Loop ──
  const zoomControls = useAnimationControls();
  useEffect(() => {
    let cancelled = false;
    const runLoop = async () => {
      while (!cancelled) {
        await zoomControls.start({
          scale: 1.05,
          transition: { duration: 12, ease: "easeInOut" },
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

  return (
    <section className="relative w-full overflow-hidden bg-[#04020e] min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[850px]">
      {/* ── DESKTOP Background (md+) ── */}
      <div className="absolute inset-0 overflow-hidden bg-black hidden md:block">
        <motion.div
          animate={zoomControls}
          initial={{ scale: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={desktopImg}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.65] opacity-90"
            priority
            unoptimized={desktopImg.startsWith("http")}
          />
        </motion.div>
      </div>

      {/* ── MOBILE Background ── */}
      <div className="absolute inset-0 overflow-hidden bg-black md:hidden">
        <motion.div
          animate={zoomControls}
          initial={{ scale: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={imgMobile}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.55] opacity-90"
            priority
            unoptimized={imgMobile.startsWith("http")}
          />
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          DESKTOP Content
      ════════════════════════════════════════ */}
      <div
        className={`absolute inset-0 z-20 hidden md:flex flex-col pt-14 px-[20%]`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div
          className={`max-w-lg flex flex-col`}
        >
          {/* Headline */}
          <div className="overflow-hidden pb-2">
            <motion.h1
              {...fadeUp(0.1, 40)}
              className="m-0 text-white tracking-tight"
              style={{
                fontFamily: isArabic
                  ? "'Noto Serif Arabic', serif"
                  : "'Cormorant Garamond', 'Georgia', serif",
                fontWeight: 300,
                fontStyle: isArabic ? "normal" : "italic",
                fontSize: isArabic
                  ? "clamp(32px, 5vw, 62px)"
                  : "clamp(38px, 6vw, 76px)",
                lineHeight: isArabic ? 1.25 : 1,
              }}
            >
              {t.hero.title}
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.4, 20)}
            className="text-white/75 font-light mt-3"
            style={{
              fontFamily: isArabic
                ? "'Noto Serif Arabic', serif"
                : "'Cormorant Garamond', serif",
              fontStyle: isArabic ? "normal" : "italic",
              fontSize: "clamp(12px, 1.5vw, 15px)",
              lineHeight: 1.8,
              letterSpacing: isArabic ? "0" : "0.02em",
            }}
          >
            {isArabic
              ? "حيث تلتقي المكوّنات النادرة بفنّ العطور الراقية"
              : "Crafted to Define Your Presence"}
          </motion.p>

          {/* Gold line */}
          <motion.div
            {...fadeUp(0.55, 10)}
            className="mt-4 h-px w-12"
            style={{
              background: "linear-gradient(to right, #c9a84c, #e8c847)",
            }}
          />

          {/* CTA */}
          <motion.div {...fadeUp(0.65, 20)} className="mt-7">
            <Link
              href={`/${locale.toLowerCase()}/shop`}
              className="group inline-flex items-center gap-2 py-3.5 px-7 rounded-sm"
              style={{
                background:
                  "linear-gradient(135deg, #c9a84c 0%, #e8c847 50%, #b8912e 100%)",
                boxShadow: "0 8px 25px -5px rgba(201,168,76,0.35)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-1px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 14px 32px -4px rgba(201,168,76,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 25px -5px rgba(201,168,76,0.35)";
              }}
            >
              {isArabic && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-[#06040c] rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
                >
                  <path
                    d="M2 7h10M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <span
                className="text-[#06040c] font-bold whitespace-nowrap"
                style={{
                  fontFamily: isArabic
                    ? "'Noto Serif Arabic', sans-serif"
                    : "'Montserrat', sans-serif",
                  fontSize: isArabic ? "13px" : "clamp(11px, 1.2vw, 13px)",
                  letterSpacing: isArabic ? "0" : "0.15em",
                  textTransform: isArabic ? "none" : "uppercase",
                }}
              >
                {t.hero.cta}
              </span>
              {!isArabic && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-[#06040c] transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M2 7h10M7 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE Content — text at TOP with badge
      ════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-20 flex md:hidden flex-col items-center pt-10 px-6"
        
      >
        {/* ── Headline ── */}
        <div className="overflow-hidden pb-2 text-center">
          <motion.h1
            {...fadeUp(0.2, 40)}
            className="m-0 text-white tracking-tight text-center"
            style={{
              fontFamily: isArabic
                ? "'Noto Serif Arabic', serif"
                : "'Cormorant Garamond', 'Georgia', serif",
              fontWeight: 300,
              fontStyle: isArabic ? "normal" : "italic",
              fontSize: isArabic
                ? "clamp(34px, 9vw, 48px)"
                : "clamp(36px, 10vw, 52px)",
              lineHeight: isArabic ? 1.3 : 1.05,
            }}
          >
            {t.hero.title}
          </motion.h1>
        </div>

        {/* ── Subtitle ── */}
        <motion.p
          {...fadeUp(0.4, 20)}
          className="text-white/70 font-light mt-1 text-center max-w-[280px]"
          style={{
            fontFamily: isArabic
              ? "'Noto Serif Arabic', serif"
              : "'Cormorant Garamond', serif",
            fontStyle: isArabic ? "normal" : "italic",
            fontSize: "14px",
            lineHeight: 1.8,
          }}
        >
          {isArabic
            ? "حيث تلتقي المكوّنات النادرة بفنّ العطور الراقية"
            : "Crafted to Define Your Presence"}
        </motion.p>

        {/* ── Gold line ── */}
        <motion.div
          {...fadeUp(0.5, 10)}
          className="mt-2 h-px w-10"
          style={{ background: "linear-gradient(to right, #c9a84c, #e8c847)" }}
        />

        {/* ── CTA ── */}
        <motion.div {...fadeUp(0.6, 20)} className="mt-6">
          <Link
            href={`/${locale.toLowerCase()}/shop`}
            className="group inline-flex items-center gap-2 py-3.5 px-8 rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, #c9a84c 0%, #e8c847 50%, #b8912e 100%)",
              boxShadow: "0 8px 25px -5px rgba(201,168,76,0.4)",
            }}
          >
            {isArabic && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                className="text-[#06040c] rotate-180"
              >
                <path
                  d="M2 7h10M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span
              className="text-[#06040c] font-bold whitespace-nowrap"
              style={{
                fontFamily: isArabic
                  ? "'Noto Serif Arabic', sans-serif"
                  : "'Montserrat', sans-serif",
                fontSize: isArabic ? "13px" : "11px",
                letterSpacing: isArabic ? "0" : "0.16em",
                textTransform: isArabic ? "none" : "uppercase",
              }}
            >
              {t.hero.cta}
            </span>
            {!isArabic && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                className="text-[#06040c]"
              >
                <path
                  d="M2 7h10M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
