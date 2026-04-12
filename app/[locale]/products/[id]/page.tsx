// app/[locale]/products/[id]/page.tsx
import type { Metadata } from "next";
import ProductDetailClient from "@/components/sections/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isArabic = locale === "ar";
  return {
    title: isArabic ? `عطر #${id} | مسك` : `Fragrance #${id} | Misk`,
    description: isArabic
      ? "اكتشف تفاصيل العطر — نوتات العطر والتركيز والحجم المتاح. أضفه لسلتك الآن."
      : "Discover fragrance details — scent notes, concentration, and available sizes. Add to cart now.",
    robots: { index: true, follow: true },
    openGraph: {
      title: isArabic ? `عطر #${id} | مسك` : `Fragrance #${id} | Misk`,
      images: [
        {
          url: "https://miskstores.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <ProductDetailClient id={resolvedParams.id} />;
}
