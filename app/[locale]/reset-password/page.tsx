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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password",
    description: isArabic
      ? "أنشئ كلمة مرور جديدة لحسابك في مسك."
      : "Create a new password for your Misk account.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/reset-password`,
      languages: {
        "en-US": `${baseUrl}/en/reset-password`,
        "ar-EG": `${baseUrl}/ar/reset-password`,
      },
    },
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <main>
      <ResetPassword />
    </main>
  );
};

export default page;
