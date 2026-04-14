// app/[locale]/register/page.tsx
import type { Metadata } from "next";
import RegisterPage from "@/components/sections/RegisterPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? "إنشاء حساب" : "Create Account",
    description: isArabic
      ? "أنشئ حسابك في مسك وابدأ رحلتك العطرية — تتبع طلباتك واحصل على عروض حصرية."
      : "Create your Misk account — track orders and get exclusive offers.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/signup`,
      languages: {
        "en-US": `${baseUrl}/en/signup`,
        "ar-EG": `${baseUrl}/ar/signup`,
      },
    },
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <main>
      <RegisterPage />
    </main>
  );
};

export default page;
