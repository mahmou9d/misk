// app/[locale]/forgot-password/page.tsx
import type { Metadata } from "next";
import ForgotPasswordPage from "@/components/sections/ForgotPasswordPage";

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
    title: isArabic ? "نسيت كلمة المرور" : "Forgot Password",
    description: isArabic
      ? "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
      : "Enter your email and we'll send you a link to reset your password.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/forgot-password`,
      languages: {
        "en-US": `${baseUrl}/en/forgot-password`,
        "ar-EG": `${baseUrl}/ar/forgot-password`,
      },
    },
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <main>
      <ForgotPasswordPage />
    </main>
  );
};

export default page;
