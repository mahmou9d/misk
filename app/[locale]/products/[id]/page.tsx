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
  const baseUrl = "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? `عطر #${id} | مسك` : `Fragrance #${id} | Misk`,
    description: isArabic
      ? "اكتشف تفاصيل العطر — نوتات العطر والتركيز والحجم المتاح. أضفه لسلتك الآن."
      : "Discover fragrance details — scent notes, concentration, and available sizes. Add to cart now.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/products/${id}`,
      languages: {
        "en-US": `${baseUrl}/en/products/${id}`,
        "ar-EG": `${baseUrl}/ar/products/${id}`,
      },
    },
    openGraph: {
      title: isArabic ? `عطر #${id} | مسك` : `Fragrance #${id} | Misk`,
      description: isArabic
        ? "اكتشف تفاصيل العطر — نوتات العطر والتركيز والحجم المتاح. أضفه لسلتك الآن."
        : "Discover fragrance details — scent notes, concentration, and available sizes. Add to cart now.",
      url: `${baseUrl}/${lowerLocale}/products/${id}`,
      images: [
        {
          url: `${baseUrl}/${lowerLocale}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return (
    <main>
      <ProductDetailClient id={id} />
    </main>
  );
}
