// app/[locale]/collections/[id]/page.tsx
import type { Metadata } from "next";
import CollectionClient from "@/components/sections/CollectionClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  const decodedId = decodeURIComponent(id);

  const isArabic = locale === "ar";

  // const fragrances = isArabic ? "عطور" : "Fragrances";
  const title = `${decodedId}`;
  const description = isArabic
    ? `تصفح كولكشن ${decodedId}`
    : `Browse ${decodedId} collection`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://miskstores.com/${locale}/collections/${id}`,
      languages: {
        "en-US": `https://miskstores.com/en/collections/${id}`,
        "ar-EG": `https://miskstores.com/ar/collections/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://miskstores.com/${locale}/collections/${id}`,
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

export default async function CollectionRoute({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const resolvedParams = await params;
  return <CollectionClient id={resolvedParams.id} />;
}
