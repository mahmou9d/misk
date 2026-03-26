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

  return {
    title: isArabic ? "البحث عن عطر" : "Search Fragrances",
    description: isArabic
      ? "ابحث عن عطرك المفضل في كولكشن مسك — عطور رجالية ونسائية Extrait De Parfum."
      : "Search Misk's fragrance collection — men's and women's Extrait De Parfum.",
    robots: { index: false, follow: true }, // ← صفحات search عادةً noindex
  };
}

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
