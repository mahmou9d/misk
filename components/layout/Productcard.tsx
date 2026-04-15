"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";

interface Props {
  index: number;
  p: Product;
  fill?: boolean;
}

export default function ProductCard({ index, p, fill = false }: Props) {
  const { t, isArabic, locale } = useTranslation();
  const price = parseFloat(String(p.lowest_price));

  const currency = "EGP";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group flex flex-col cursor-pointer ${fill ? "flex-1" : ""}`}
    >
      <Link
        href={`/${locale.toLowerCase()}/products/${p.id}`}
        className="flex flex-col no-underline h-full"
      >
        <div className="relative w-full rounded-2xl aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#f8f5f0] to-[#ede8e0] border border-[#c9a84c1f]">
          {p?.thumbnail ? (
            <Image
              src={String(p.thumbnail)}
              alt={p.name}
              fill
              className="object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={90}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f3f0e9] p-4 text-center">
              <span className="text-[#c9a84c] font-medium text-sm">
                {isArabic ? "لا يوجد صورة للمنتج" : "No image available"}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0a3d8c] flex items-end p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className=" text-[16px] -[2.5px] uppercase text-[#f0d080eb] flex items-center gap-[5px]">
              {t.productCard.viewDetails}
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="rtl:rotate-180"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
        <div className="pt-3 flex flex-col items-center md:items-start">
          <p className=" text-[16px] -[3px] uppercase text-[#c9a84cbf] mb-1">
            {p.category_name}
          </p>
          <h3 className=" text-[20px] font-medium text-[#1a1a1a] leading-[1.3] mb-1.5">
            {p.name}
          </h3>
          <div className="h-[1px] mb-[7px] bg-gradient-to-r from-[#c9a84c40] to-transparent rtl:bg-gradient-to-l" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[20px] font-semibold animate-gold-shimmer bg-[linear-gradient(90deg,#c9a84c_0%,#f0d080_40%,#c9a84c_70%,#e8c860_100%)] bg-[length:200%_auto] bg-clip-text text-transparent">
              {currency}{" "}
              {isNaN(price)
                ? "—"
                : price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
