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

  return {
    title: isArabic ? "ساعات العمل و الموقع" : "Business Hours & Location",
    description: isArabic
      ? "اكتشف ساعات عملنا وموقعنا. نحن هنا لخدمتك."
      : "Discover our business hours and location. We're here to serve you.",
    alternates: {
      canonical: `https://miskstores.com/${locale}/businesshourslocation`,
      languages: {
        "en-US": `https://miskstores.com/en/businesshourslocation`,
        "ar-EG": `https://miskstores.com/ar/businesshourslocation`,
      },
    },
    openGraph: {
      title: isArabic ? "ساعات العمل و الموقع" : "Business Hours & Location",
      description: isArabic
        ? "اكتشف ساعات عملنا وموقعنا. نحن هنا لخدمتك."
        : "Discover our business hours and location. We're here to serve you.",
      url: `https://miskstores.com/${locale}/businesshourslocation`,
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

const BusinessHoursPage = () => {
  return (
    <section className="xl:pb-0 pb-[60px]">
      <AnnouncementBar />
      <Navbar />
      <BusinessHoursLocation />
      <Footer />
    </section>
  );
};

export default BusinessHoursPage;
