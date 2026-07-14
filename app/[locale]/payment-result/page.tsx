import { PaymentPopup } from "@/components/sections/Paymentresult";
import React, { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "نتيجة الدفع" : "Payment Result",
    description: isArabic
      ? "عرض نتيجة عملية الدفع وتأكيد الطلب."
      : "View payment result and order confirmation.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/payment-result`,
      languages: {
        "en-US": `https://miskstores.com/en/payment-result`,
        "ar-EG": `https://miskstores.com/ar/payment-result`,
      },
    },
    openGraph: {
      title: isArabic ? "نتيجة الدفع" : "Payment Result",
      description: isArabic
        ? "عرض نتيجة عملية الدفع وتأكيد الطلب."
        : "View payment result and order confirmation.",
      url: `https://miskstores.com/${locale}/payment-result`,
      images: [
        {
          url: "https://miskstores.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const page = () => {
  return (
    <Suspense fallback={null}>
      <PaymentPopup />
    </Suspense>
  );
};

export default page;
