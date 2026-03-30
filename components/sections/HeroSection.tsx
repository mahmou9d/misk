"use client";

import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "@/lib/Usetranslation";
import { useGetBannersPublic } from "@/hooks/useDashboard";

// ─── animation helpers ────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = (delay = 0, y = 32) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.05, delay, ease: EASE },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.9, delay },
});

export default function HeroSection() {
  const { t, isArabic, locale } = useTranslation();
  const { data: banners } = useGetBannersPublic();

  // ── Zoom loop: scale 1 → 1.08 → 1 بشكل مستمر ──
  const zoomControls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    const runLoop = async () => {
      while (!cancelled) {
        await zoomControls.start({
          scale: 1.08,
          transition: { duration: 8, ease: "easeInOut" },
        });
        if (cancelled) break;
        await zoomControls.start({
          scale: 1,
          transition: { duration: 8, ease: "easeInOut" },
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
    <section className="relative w-full overflow-hidden bg-[#04020e] min-h-[500px] h-[100svh] max-h-[600px] lg:max-h-[750px]">
      {/* ── Background with looping zoom ── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={zoomControls}
          initial={{ scale: 1 }}
          className="relative w-full h-full"
        >
          <Image
            src={imgSrc}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.85] !w-full !h-full"
            style={{ objectFit: "cover", objectPosition: "center center" }}
            priority
            unoptimized={imgSrc.startsWith("http")}
          />
        </motion.div>
      </div>

      {/* ── Ambient Gold Glow ── */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: "10%",
          width: 600,
          height: 500,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Vertical side text ── */}
      <motion.div
        {...fadeIn(1.2)}
        className="absolute hidden lg:flex z-20 flex-col items-center gap-4 pointer-events-none"
        style={{
          [isArabic ? "left" : "right"]: 32,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <span className="block w-px h-12 bg-gradient-to-b from-transparent to-[#c9a84c]/30" />
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.4em",
            color: "rgba(201,168,76,0.3)",
            writingMode: "vertical-rl",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Misk Fragrance 2025
        </span>
        <span className="block w-px h-12 bg-gradient-to-t from-transparent to-[#c9a84c]/30" />
      </motion.div>

      {/* ── Main Content ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-center items-center"
        style={{ padding: "0 clamp(28px, 9vw, 140px)", paddingBottom: 120 }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          {/* headline line 1 */}
          <div className="overflow-hidden">
            <motion.h1
              {...fadeUp(0.22, 60)}
              className="m-0 text-white"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: 400,
                fontSize: "clamp(52px, 8.5vw, 108px)",
                lineHeight: 0.9,
                letterSpacing: isArabic ? "0" : "-0.04em",
              }}
            >
              {t.hero.title}
            </motion.h1>
          </div>

          {/* headline line 2 — gold gradient */}
          <div className="overflow-hidden mt-2">
            <motion.div
              {...fadeUp(0.32, 60)}
              style={{ marginBottom: "clamp(25px, 3.5vw, 42px)" }}
            >
              <span
                style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontStyle: isArabic ? "normal" : "italic",
                  fontWeight: 400,
                  fontSize: "clamp(52px, 8.5vw, 108px)",
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg, #c9a84c 0%, #f7e882 45%, #b8912e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.hero.titleEm}
              </span>
            </motion.div>
          </div>

          {/* ornament line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.48, ease: EASE }}
            className="flex items-center justify-center gap-3 mb-4"
            style={{ transformOrigin: "center" }}
          >
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <span className="w-1 h-1 bg-[#c9a84c]/60 rotate-45" />
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </motion.div>

          {/* subtitle */}
          <motion.p
            {...fadeIn(0.58)}
            style={{
              fontSize: "clamp(14px, 1.4vw, 16px)",
              fontWeight: 300,
              color: "white",
              lineHeight: 1.8,
              maxWidth: 420,
              margin: "0 auto 20px auto",
              letterSpacing: "0.01em",
            }}
          >
            {isArabic
              ? "عطور مختارة بعناية لمن يفهمون لغة الرقي والأناقة"
              : "Curated fragrances for those who understand the language of refinement"}
          </motion.p>

          {/* CTA row */}
          <motion.div
            {...fadeUp(0.7, 14)}
            className="flex items-center justify-center gap-5 flex-wrap"
          >
            <Link
              href={`/${locale.toLowerCase()}/shop`}
              className="group py-4 px-4 md:px-11 relative text-[15px] md:text-[20px] overflow-hidden inline-flex items-center gap-4 rounded-2xl no-underline"
              style={{
                padding: "16px 45px",
                background:
                  "linear-gradient(135deg, #c9a84c 0%, #e8c847 50%, #b8912e 100%)",
                color: "#06040c",
                fontWeight: 700,
                letterSpacing: isArabic ? "0" : "0.22em",
                textTransform: isArabic ? "none" : "uppercase",
                boxShadow: "0 10px 35px rgba(201,168,76,0.3)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className={`transition-transform duration-300 group-hover:translate-x-1 ${isArabic ? "rotate-180" : ""}`}
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

            <Link
              href={`/${locale.toLowerCase()}/collections`}
              className="inline-flex text-[14px] md:text-[20px] items-center rounded-2xl border border-white px-4 md:px-8 py-4 text-white transition-all duration-300 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] hover:bg-white/[0.02]"
              style={{
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {isArabic ? "تصفح المجموعة" : "Explore Collection"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
