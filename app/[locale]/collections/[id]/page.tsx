// app/[locale]/collections/[id]/page.tsx
import type { Metadata } from "next";
import CollectionClient from "@/components/sections/CollectionClient";

const translations = {
  mens: {
    en: {
      title: "Men's Fragrances",
      description:
        "Explore Misk's men's Extrait De Parfum collection. Bold, long-lasting scents with 8–14 hours longevity. Shop now with free shipping over 2,000 EGP.",
    },
    ar: {
      title: "عطور الرجال",
      description:
        "تصفح كولكشن مسك من العطور الرجالية Extrait De Parfum. روائح قوية تدوم ٨–١٤ ساعة. شحن مجاني للطلبات فوق ٢٠٠٠ جنيه.",
    },
  },
  womens: {
    en: {
      title: "Women's Fragrances",
      description:
        "Discover Misk's women's Extrait De Parfum collection. Elegant, long-lasting scents with 8–14 hours longevity. Free shipping over 2,000 EGP.",
    },
    ar: {
      title: "عطور النساء",
      description:
        "اكتشفي كولكشن مسك من العطور النسائية Extrait De Parfum. روائح أنيقة تدوم ٨–١٤ ساعة. شحن مجاني للطلبات فوق ٢٠٠٠ جنيه.",
    },
  },
  all: {
    en: {
      title: "All Fragrances",
      description:
        "Browse Misk's full Extrait De Parfum collection — men's and women's luxury fragrances. Free shipping on orders over 2,000 EGP across Egypt.",
    },
    ar: {
      title: "كل العطور",
      description:
        "تصفح الكولكشن الكامل من مسك — عطور رجالية ونسائية Extrait De Parfum. شحن مجاني للطلبات فوق ٢٠٠٠ جنيه في جميع أنحاء مصر.",
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isArabic = locale === "ar";
  const key = id as keyof typeof translations;
  const t = translations[key]?.[isArabic ? "ar" : "en"] ?? {
    title: isArabic ? "الكولكشن" : "Collection",
    description: "",
  };

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://miskfragrances.com/${locale}/collections/${id}`,
      languages: {
        "en-US": `https://miskfragrances.com/en/collections/${id}`,
        "ar-EG": `https://miskfragrances.com/ar/collections/${id}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `https://miskfragrances.com/${locale}/collections/${id}`,
      images: [
        {
          url: "https://miskfragrances.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function CollectionRoute({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const resolvedParams = await params;
  return <CollectionClient id={resolvedParams.id} />;
}
