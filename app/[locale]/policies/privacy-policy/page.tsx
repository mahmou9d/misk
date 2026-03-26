// app/[locale]/privacy-policy/page.tsx
import type { Metadata } from "next";
import PrivacyPolicy from "@/components/sections/PrivacyPolicy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    description: isArabic
      ? "اقرأ سياسة الخصوصية الخاصة بمسك للعطور — كيف نجمع بياناتك ونحميها ونستخدمها."
      : "Read Misk Fragrances' privacy policy — how we collect, protect, and use your personal information.",
    alternates: {
      canonical: `https://miskfragrances.com/${locale}/privacy-policy`,
      languages: {
        "en-US": "https://miskfragrances.com/en/privacy-policy",
        "ar-EG": "https://miskfragrances.com/ar/privacy-policy",
      },
    },
  };
}

const page = () => {
  return (
    <div>
      <PrivacyPolicy />
    </div>
  );
};

export default page;
