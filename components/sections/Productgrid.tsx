"use client";

import { useState } from "react";
import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/layout/Productcard";
import { useGetProducts } from "@/hooks/useProducts";
import { Product } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";

type CategoryMap = Record<string, { ar: string; en: string }>;

export default function ProductGrid({
  CATEGORY_MAP,
}: {
  CATEGORY_MAP: CategoryMap;
}) {
  const { t, isArabic, dir, locale } = useTranslation();
  const id = useId();

  const tabs = Object.keys(CATEGORY_MAP) as string[];
  const [tab, setTab] = useState<string>(tabs[0]);

const category = isArabic ? CATEGORY_MAP[tab].ar : CATEGORY_MAP[tab].en;

const { data, isLoading } = useGetProducts({ category });
  const filtered: Product[] = data?.products ?? [];

  // const filtered = allProducts.filter((p) =>
  //   p.categories?.includes(
  //     isArabic ? CATEGORY_MAP[tab].ar : CATEGORY_MAP[tab].en,
  //   ),
  // );

  return (
    <section
      className="w-full bg-[#fcfcfc] py-28 relative overflow-hidden"
      dir={dir}
    >
      {/* ── Background Decoration ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.03] select-none pointer-events-none">
        <h2 className="text-[45px] md:text-[90px] lg:text-[180px] font-serif font-bold whitespace-nowrap uppercase">
          {CATEGORY_MAP[tab].en === "Men" ||
          CATEGORY_MAP[tab].en === "Women" ||
          CATEGORY_MAP[tab].en === "Unisex"
            ? CATEGORY_MAP[tab].en
            : CATEGORY_MAP[tab].ar}
        </h2>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 relative z-10">
        {/* ── Header & Tabs ── */}
        <div className="flex flex-col items-center mb-24">
          <span className="text-[#c9a84c] text-[20px] font-bold uppercase mb-10 opacity-80">
            Misk Perfume
          </span>

          <div className="inline-flex items-center p-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
            {tabs.map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={`relative px-4 lg:px-12 py-2 md:py-4 rounded-full text-[14px] font-bold uppercase transition-all duration-500
                  ${tab === tabKey ? "text-white" : "text-gray-400 hover:text-gray-900"}
                  ${isArabic ? "" : "-[0.2em]"}`}
              >
                <span className="relative z-10">
                  {" "}
                  {CATEGORY_MAP[tabKey].en === "Men" ||
                  CATEGORY_MAP[tabKey].en === "Women" ||
                  CATEGORY_MAP[tabKey].en === "Unisex"
                    ? CATEGORY_MAP[tabKey].en
                    :CATEGORY_MAP[tabKey].ar}
                </span>
                {tab === tabKey && (
                  <motion.div
                    layoutId={`activeTabGlow-${id}`}
                    className="absolute inset-0 bg-[#0a051a] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
                >
                  {filtered.slice(0, 8).map((p, i) => (
                    <ProductCard key={p.id} p={p} index={i} />
                  ))}
                </motion.div>
              ) : (
                <p className="flex items-center justify-center text-black text-[20px] lg:text-[45px]">
                  {t.productGrid.noProducts}
                </p>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* ── View All Button ── */}
        <div className="flex justify-center mt-24">
          <Link
            href={`/${locale.toLowerCase()}/collections/all`}
            className="group relative bg-[#111] inline-flex items-center gap-1 px-5 lg:px-14 py-4 rounded-full border border-[#c9a84c]/40 transition-all duration-500 hover:border-[#ffbb00] hover:bg-[#ffbb00] no-underline shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(201,168,76,0.2)]"
          >
            <span
              className={`text-white font-medium text-[13px] transition-colors duration-500 group-hover:text-[#111]
                ${isArabic ? "text-[16px] font-bold" : "-[0.1em]"}`}
            >
              {t.productGrid.viewAll}
            </span>

            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              className={`text-[#c9a84c] transition-all duration-500 group-hover:text-[#111] group-hover:translate-x-1 ${isArabic ? "rotate-180 group-hover:-translate-x-1" : ""}`}
            >
              <path
                d="M12 1L17 6L12 11M1 6H16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </Link>
        </div>
      </div>
    </section>
  );
}
