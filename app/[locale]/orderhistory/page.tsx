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
  const baseUrl = "https://miskstores.com";
  const lowerLocale = locale.toLowerCase();

  return {
    title: isArabic ? "الطلبات السابقة" : "Order History",
    description: isArabic
      ? "عرض طلباتك السابقة وتتبع حالة الطلبات."
      : "View your previous order history and track order status.",
    alternates: {
      canonical: `${baseUrl}/${lowerLocale}/orderhistory`,
      languages: {
        "en-US": `${baseUrl}/en/orderhistory`,
        "ar-EG": `${baseUrl}/ar/orderhistory`,
      },
    },
    openGraph: {
      title: isArabic ? "الطلبات السابقة" : "Order History",
      description: isArabic
        ? "عرض طلباتك السابقة وتتبع حالة الطلبات."
        : "View your previous order history and track order status.",
      url: `${baseUrl}/${lowerLocale}/orderhistory`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const page = () => {
  return (
    <main className="xl:pb-0 pb-[60px]">
      <OrderHistory />
    </main>
  );
};

export default page;
