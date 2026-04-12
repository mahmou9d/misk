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

  return {
    title: isArabic ? "سياسة الإرجاع والاستبدال" : "Return & Exchange Policy",
    description: isArabic
      ? "تعرّف على سياسة الإرجاع والاستبدال في مسك — ضمان استرداد قائم على الأداء خلال ٧ أيام من الاستلام."
      : "Learn about Misk's return policy — performance-based refund guarantee within 7 days of receiving your order.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/return-policy`,
      languages: {
        "en-US": "https://miskstores.com/en/return-policy",
        "ar-EG": "https://miskstores.com/ar/return-policy",
      },
    },
  };
}

const page = () => {
  return (
    <section className="xl:pb-0 pb-[60px]">
      <ReturnPolicy />
    </section>
  );
};

export default page;
