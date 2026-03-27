"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/Usetranslation";
import { ArrowRight } from "@/public/svg/Svgs";

export default function Collections() {
  const { t, isArabic, locale, dir } = useTranslation();

  const collections = [
    {
      label: t.collections.men,
      href: `/${locale.toLowerCase()}/collections/mens`,
      image: "/perfume-bottle-nature.jpg",
      sub: t.collections.explore,
    },
    {
      label: t.collections.women,
      href: `/${locale.toLowerCase()}/collections/womens`,
      image: "/photo-1594035910387-fea47794261f.jpeg",
      sub: t.collections.explore,
    },
  ];

  return (
    <section className="w-full bg-white py-24 pb-32" dir={dir}>
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header: Clean & Bold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-4"
        >
          <span className="text-[14px] font-black -[0.3em] uppercase text-[#c9a84c] block">
            {t.collections.shopBy}
          </span>
          <h2 className="text-[#111] text-[clamp(40px,5vw,56px)] font-bold -tight leading-[0.9]">
            {t.collections.title}
          </h2>
        </motion.div>

        {/* Grid: High-End Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {collections.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={c.href}
                className="group relative block aspect-[16/11] overflow-hidden rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-all duration-700"
              >
                {/* Image Component */}
                <Image
                  src={c.image || "/heros.jpg"}
                  alt={c.label}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-110"
                />

                {/* Sophisticated Overlay: من غامق لشفاف بانسيابية */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700" />

                {/* Content: الترتيب هنا هو السر */}
                <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
                  <h3 className="text-white text-[clamp(36px,4.5vw,52px)] font-bold leading-none mb-6 -tight">
                    {c.label}
                  </h3>

                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="text-white text-[16px] md:text-[18px] font-bold uppercase -[3px]">
                      {c.sub}
                    </span>
                    {/* سهم بحجم أكبر وحركة واضحة */}
                    <div
                      className={`transition-transform duration-500 ease-out ${isArabic ? "group-hover:-translate-x-3" : "group-hover:translate-x-3"}`}
                    >
                      <ArrowRight
                        className={`w-7 h-7 text-[#c9a84c] ${isArabic ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Glassy Inner Border: لمسة تقنية للموبايلات الحديثة */}
                <div className="absolute inset-0 border border-white/10 rounded-[40px] pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
