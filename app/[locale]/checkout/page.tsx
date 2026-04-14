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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? "إتمام الطلب" : "Checkout",
    description: isArabic
      ? "أكمل طلبك بأمان — دفع عند الاستلام أو بطاقة ائتمان. شحن سريع لجميع أنحاء مصر."
      : "Complete your order securely — pay with cash on delivery or credit card. Fast shipping across Egypt.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/checkout`,
      languages: {
        "en-US": `${baseUrl}/en/checkout`,
        "ar-EG": `${baseUrl}/ar/checkout`,
      },
    },
    openGraph: {
      title: isArabic ? "إتمام الطلب" : "Checkout",
      description: isArabic
        ? "أكمل طلبك بأمان — دفع عند الاستلام أو بطاقة ائتمان. شحن سريع لجميع أنحاء مصر."
        : "Complete your order securely — pay with cash on delivery or credit card. Fast shipping across Egypt.",
      url: `${baseUrl}/${lowerLocale}/checkout`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: isArabic ? "إتمام الطلب" : "Checkout",
      description: isArabic
        ? "أكمل طلبك بأمان — دفع عند الاستلام أو بطاقة ائتمان. شحن سريع لجميع أنحاء مصر."
        : "Complete your order securely — pay with cash on delivery or credit card. Fast shipping across Egypt.",
    },
    robots: { index: false, follow: false },
  };
}

const page = () => {
  return (
    <main>
      <CheckoutPage />
    </main>
  );
};

export default page;
