import OrderHistory from "@/components/sections/Orderhistory";
import React from "react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "الطلبات السابقة" : "Order History",
    description: isArabic
      ? "عرض طلباتك السابقة وتتبع حالة الطلبات."
      : "View your previous order history and track order status.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/orderhistory`,
      languages: {
        "en-US": `https://miskstores.com/en/orderhistory`,
        "ar-EG": `https://miskstores.com/ar/orderhistory`,
      },
    },
    openGraph: {
      title: isArabic ? "الطلبات السابقة" : "Order History",
      description: isArabic
        ? "عرض طلباتك السابقة وتتبع حالة الطلبات."
        : "View your previous order history and track order status.",
      url: `https://miskstores.com/${locale}/orderhistory`,
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
    <section className="xl:pb-0 pb-[60px]">
      <OrderHistory />
    </section>
  );
};

export default page;
