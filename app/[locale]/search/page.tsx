// app/[locale]/search/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPage from "@/components/sections/Searchpage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const baseUrl = "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? "البحث عن عطر" : "Search Fragrances",
    description: isArabic
      ? "ابحث عن عطرك المفضل في كولكشن مسك — عطور رجالية ونسائية Extrait De Parfum."
      : "Search Misk's fragrance collection — men's and women's Extrait De Parfum.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/search`,
      languages: {
        "en-US": `${baseUrl}/en/search`,
        "ar-EG": `${baseUrl}/ar/search`,
      },
    },
    robots: { index: false, follow: true },
  };
}

export default function Page() {
  return (
    <main>
      <Suspense>
        <SearchPage />
      </Suspense>
    </main>
  );
}
