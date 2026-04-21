
import CollectionPage from "@/components/sections/CollectionPage";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "جميع مجموعات" : "All Collections",
    description: isArabic
      ? "تصفح جميع مجموعات عطورنا الفاخرة."
      : "Browse all our luxury fragrance collections.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/shop`,
      languages: {
        "en-US": `https://miskstores.com/en/shop`,
        "ar-EG": `https://miskstores.com/ar/shop`,
      },
    },
    openGraph: {
      title: isArabic ? "جميع مجموعات" : "All Collections",
      description: isArabic
        ? "تصفح جميع كولكشنات عطورنا الفاخرة."
        : "Browse all our luxury fragrance collections.",
      url: `https://miskstores.com/${locale}/shop`,
      images: [
        {
          url: `https://miskstores.com/${locale}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function AllCollectionsPage() {
  return <CollectionPage category="all" />;
}
