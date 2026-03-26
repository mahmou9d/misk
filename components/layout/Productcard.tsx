"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";

export default function ProductCard({
  index,
  p,
  fill = false,
}: {
  index: number;
  p: Product;
  fill?: boolean;
}) {
  const { isArabic, locale } = useTranslation();
  const price = parseFloat(String(p.lowest_price));
  const currency = isArabic ? "ج.م" : "EGP";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.04,
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={`group flex flex-col ${fill ? "h-full" : ""}`}
    >
      <Link
        href={`/${locale.toLowerCase()}/products/${p.id}`}
        className="block"
      >
        {/* الصورة: انحناء احترافي (32px) مع ظل ناعم عند الهوفر */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-[#f8f8f8] mb-6 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5">
          <Image
            src={p?.thumbnail ? String(p.thumbnail) : "/heros.jpg"}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index < 4}
          />

          {/* لمسة إضاءة علوية (Gradient) خفيفة جداً تعطي عمق للصورة */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none" />
        </div>

        {/* النصوص: واضحة، كبيرة، ومنظمة */}
        <div className="px-2 space-y-3">
          <div>
            <p className="text-[14px] tracking-[2px] uppercase text-[#c9a84c] font-bold mb-2">
              {p.category_name}
            </p>
            <h3 className="text-[22px] md:text-[24px] font-medium text-[#111] leading-[1.1] tracking-tight group-hover:text-[#c9a84c] transition-colors duration-300">
              {p.name}
            </h3>
          </div>

          {/* السعر: عريض وواضح جداً */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[26px] font-black text-[#111] tracking-tighter">
              {isNaN(price) ? "—" : price.toLocaleString()}
            </span>
            <span className="text-[16px] font-semibold text-gray-400 uppercase">
              {currency}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
