// app/[locale]/checkout/page.tsx
import type { Metadata } from "next";
import CheckoutPage from "@/components/sections/CheckoutPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "إتمام الطلب" : "Checkout",
    description: isArabic
      ? "أكمل طلبك بأمان — دفع عند الاستلام أو بطاقة ائتمان. شحن سريع لجميع أنحاء مصر."
      : "Complete your order securely — pay with cash on delivery or credit card. Fast shipping across Egypt.",
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <div>
      <CheckoutPage />
    </div>
  );
};

export default page;
