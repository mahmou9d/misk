"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/Usetranslation";
import { useGetBannersPublic } from "@/hooks/useDashboard";

// ─── animation helpers (محسنة للسلاسة) ───────────────────────────────────────
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

  const stats = [
    { value: "500+", label: isArabic ? "منتج" : "Products" },
    { value: "50+", label: isArabic ? "علامة" : "Brands" },
    { value: "10K+", label: isArabic ? "عميل" : "Clients" },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#04020e]"
      style={{ height: "clamp(560px, 94vh, 900px)" }}
    >
      {/* ── Background (إضافة تأثير زووم هادئ جداً) ── */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear" }}
          className="relative w-full h-full"
        >
          <Image
            src={banners?.[0]?.img_url || "/heros.jpg"}
            alt="Hero"
            fill
            className="object-cover object-center brightness-[0.85]"
            priority
          />
        </motion.div>
      </div>


      {/* ── Ambient Gold Glow (خليته أخف عشان ميبقاش "نور" مزعج) ── */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          [isArabic ? "right" : "left"]: "clamp(0px, 4vw, 60px)",
          top: "15%",
          width: 500,
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
        className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ padding: "0 clamp(28px, 9vw, 140px)", paddingBottom: 58 }}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div style={{ maxWidth: 700 }}>
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
            className="flex items-center gap-3 mb-8"
            style={{ transformOrigin: isArabic ? "right" : "left" }}
          >
            <span className="w-1 h-1 bg-[#c9a84c]/60 rotate-45" />
            <span className="w-16 h-px bg-gradient-to-r from-[#c9a84c]/60 to-transparent" />
          </motion.div>

          {/* subtitle */}
          <motion.p
            {...fadeIn(0.58)}
            style={{
              fontSize: "clamp(14px, 1.4vw, 16px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.8,
              maxWidth: 420,
              marginBottom: "clamp(40px, 6vw, 75px)",
              letterSpacing: "0.01em",
            }}
          >
            {
              (isArabic
                ? "عطور مختارة بعناية لمن يفهمون لغة الرقي والأناقة"
                : "Curated fragrances for those who understand the language of refinement")}
          </motion.p>

          {/* CTA row (بنافس الـ Styling الأصلي بتاعك) */}
          <motion.div
            {...fadeUp(0.7, 14)}
            className="flex items-center gap-5 flex-wrap"
          >
            <Link
              href={`/${locale.toLowerCase()}/shop`}
              className="group relative overflow-hidden inline-flex items-center gap-4 rounded-2xl no-underline"
              style={{
                padding: "16px 45px",
                background:
                  "linear-gradient(135deg, #c9a84c 0%, #e8c847 50%, #b8912e 100%)",
                color: "#06040c",
                fontSize: 11,
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
              className="inline-flex items-center rounded-2xl border border-white px-8 py-4 text-white transition-all duration-300 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] hover:bg-white/[0.02]"
              style={{
                fontSize: 11,
                fontWeight: 400,
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
