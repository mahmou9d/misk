import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import { BusinessHoursLocation } from "@/components/sections/BusinessHoursLocation";
import Footer from "@/components/sections/Footer";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const baseUrl = "https://miskstores.com";

  return {
    title: isArabic ? "ساعات العمل و الموقع" : "Business Hours & Location",
    description: isArabic
      ? "اكتشف ساعات عملنا وموقعنا. نحن هنا لخدمتك."
      : "Discover our business hours and location. We're here to serve you.",
    alternates: {
      canonical: `${baseUrl}/${locale.toLowerCase()}/businesshourslocation`,
      languages: {
        "en-US": `${baseUrl}/en/businesshourslocation`,
        "ar-EG": `${baseUrl}/ar/businesshourslocation`,
      },
    },
    openGraph: {
      title: isArabic ? "ساعات العمل و الموقع" : "Business Hours & Location",
      description: isArabic
        ? "اكتشف ساعات عملنا وموقعنا. نحن هنا لخدمتك."
        : "Discover our business hours and location. We're here to serve you.",
      url: `${baseUrl}/${locale.toLowerCase()}/businesshourslocation`,
      images: [
        {
          url: `${baseUrl}/${lowerLocale}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "ساعات العمل و الموقع" : "Business Hours & Location",
      description: isArabic
        ? "اكتشف ساعات عملنا وموقعنا. نحن هنا لخدمتك."
        : "Discover our business hours and location. We're here to serve you.",
      images: [`${baseUrl}/${lowerLocale}/og-image.png`],
    },
  };
}

const BusinessHoursPage = () => {
  return (
    <main className="xl:pb-0 pb-[60px]">
      <AnnouncementBar />
      <Navbar />
      <BusinessHoursLocation />
      <Footer />
    </main>
  );
};

export default BusinessHoursPage;
