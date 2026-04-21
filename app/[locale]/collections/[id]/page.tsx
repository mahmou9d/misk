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
  const baseUrl = "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  const title = `${decodedId}`;
  const description = isArabic
    ? `تصفح كولكشن ${decodedId}`
    : `Browse ${decodedId} collection`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/collections/${id}`,
      languages: {
        "en-US": `${baseUrl}/en/collections/${id}`,
        "ar-EG": `${baseUrl}/ar/collections/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lowerLocale}/collections/${id}`,
      images: [
        {
          url: `${baseUrl}/${lowerLocale}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/${lowerLocale}/og-image.png`],
    },
  };
}

export default async function CollectionRoute({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <main>
      <CollectionClient id={resolvedParams.id} />
    </main>
  );
}
