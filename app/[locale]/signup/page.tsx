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

  return {
    title: isArabic ? "إنشاء حساب" : "Create Account",
    description: isArabic
      ? "أنشئ حسابك في مسك وابدأ رحلتك العطرية — تتبع طلباتك واحصل على عروض حصرية."
      : "Create your Misk account — track orders and get exclusive offers.",
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <div>
      <RegisterPage />
    </div>
  );
};

export default page;
