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

  return {
    title: isArabic ? "نسيت كلمة المرور" : "Forgot Password",
    description: isArabic
      ? "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
      : "Enter your email and we'll send you a link to reset your password.",
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <div>
      <ForgotPasswordPage />
    </div>
  );
};

export default page;
