// app/[locale]/terms/page.tsx
import type { Metadata } from "next";
import TermsOfService from "@/components/sections/TermsOfService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "شروط الخدمة" : "Terms of Service",
    description: isArabic
      ? "اقرأ شروط الخدمة الخاصة بمسك للعطور — حقوقك والتزاماتك عند استخدام متجرنا."
      : "Read Misk Fragrances' terms of service — your rights and obligations when using our store.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/terms`,
      languages: {
        "en-US": "https://miskstores.com/en/terms",
        "ar-EG": "https://miskstores.com/ar/terms",
      },
    },
  };
}

const page = () => {
  return (
    <section className="xl:pb-0 pb-[60px]">
      <TermsOfService />
    </section>
  );
};

export default page;
