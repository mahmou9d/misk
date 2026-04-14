// app/[locale]/return-policy/page.tsx
import type { Metadata } from "next";
import ReturnPolicy from "@/components/sections/ReturnPolicy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://miskstores.com";

  return {
    title: isArabic ? "سياسة الإرجاع والاستبدال" : "Return & Exchange Policy",
    description: isArabic
      ? "تعرّف على سياسة الإرجاع والاستبدال في مسك — ضمان استرداد قائم على الأداء خلال ٧ أيام من الاستلام."
      : "Learn about Misk's return policy — performance-based refund guarantee within 7 days of receiving your order.",
    alternates: {
      canonical: `${baseUrl}/${locale.toLowerCase()}/return-policy`,
      languages: {
        "en-US": `${baseUrl}/en/return-policy`,
        "ar-EG": `${baseUrl}/ar/return-policy`,
      },
    },
    openGraph: {
      title: isArabic ? "سياسة الإرجاع والاستبدال" : "Return & Exchange Policy",
      url: `${baseUrl}/${locale.toLowerCase()}/return-policy`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: isArabic ? "سياسة الإرجاع والاستبدال" : "Return & Exchange Policy",
    },
  };
}

const page = () => {
  return (
    <main className="xl:pb-0 pb-[60px]">
      <ReturnPolicy />
    </main>
  );
};

export default page;
