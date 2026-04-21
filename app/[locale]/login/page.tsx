// app/[locale]/login/page.tsx
import type { Metadata } from "next";
import LoginPage from "@/components/sections/LoginPage";

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
    title: isArabic ? "تسجيل الدخول" : "Sign In",
    description: isArabic
      ? "سجّل دخولك إلى مسك وتابع رحلتك العطرية — تتبع طلباتك وإدارة حسابك بسهولة."
      : "Sign in to your Misk account — track your orders and manage your profile.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/login`,
      languages: {
        "en-US": `${baseUrl}/en/login`,
        "ar-EG": `${baseUrl}/ar/login`,
      },
    },
    openGraph: {
      title: isArabic ? "تسجيل الدخول" : "Sign In",
      description: isArabic
        ? "سجّل دخولك إلى مسك وتابع رحلتك العطرية — تتبع طلباتك وإدارة حسابك بسهولة."
        : "Sign in to your Misk account — track your orders and manage your profile.",
      url: `${baseUrl}/${lowerLocale}/login`,
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <main>
      <LoginPage />
    </main>
  );
};

export default page;
