// app/[locale]/reset-password/page.tsx
import type { Metadata } from "next";
import ResetPassword from "@/components/sections/ResetPassword";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password",
    description: isArabic
      ? "أنشئ كلمة مرور جديدة لحسابك في مسك."
      : "Create a new password for your Misk account.",
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <div>
      <ResetPassword />
    </div>
  );
};

export default page;
