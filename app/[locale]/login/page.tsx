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

  return {
    title: isArabic ? "تسجيل الدخول" : "Sign In",
    description: isArabic
      ? "سجّل دخولك إلى مسك وتابع رحلتك العطرية — تتبع طلباتك وإدارة حسابك بسهولة."
      : "Sign in to your Misk account — track your orders and manage your profile.",
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default page;
