"use client";

import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import Productpage from "@/components/sections/Productpage";
import Productgrid from "@/components/sections/Productgrid";
// import Collections from "@/components/sections/Collections";
// import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import DeviceIDProvider from "@/utils/DeviceIDProvider";
import { PaymentPopup } from "@/components/layout/Paymentresult";
import IsLoading from "@/components/layout/IsLoading";
import { TabKey1, TabKey2, TabKey3 } from "@/type/type";
// import { BusinessHoursLocation } from "@/components/sections/BusinessHoursLocation";

export default function PaymentResultPage() {
  const CATEGORY_MAP1: Record<TabKey1, { en: string; ar: string }> = {
    Men: { en: "Men", ar: "رجالى" },
    Unisex: { en: "Unisex", ar: "رجالى و نسائي" },
    Women: { en: "Women", ar: "نسائي" },
  };
    const CATEGORY_MAP2: Record<TabKey2, { en: string; ar: string }> = {
      Niche: { en: "Niche perfumes", ar: "عطور النيش" },
    };   
     const CATEGORY_MAP3: Record<TabKey3, { en: string; ar: string }> = {
      BodySplash: { en: "Body Splash", ar: "بادي سبلاش" },
      Makhmaryat: { en: "Makhmaryat", ar: "مخمريات" },
      incense: { en: "incense", ar: "بخور" },
    };
  return (
    <main>
      <Suspense fallback={<IsLoading />}>
        <DeviceIDProvider />
        {/* <RedirectResetPassword /> */}
        <AnnouncementBar />
        <Navbar />
        <HeroSection />
        <Productpage />
        <Productgrid CATEGORY_MAP={CATEGORY_MAP1} />
        <Productgrid CATEGORY_MAP={CATEGORY_MAP2} />
        <Productgrid CATEGORY_MAP={CATEGORY_MAP3} />
        {/* <Faq /> */}
        {/* <BusinessHoursLocation /> */}
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <PaymentPopup />
      </Suspense>
    </main>
  );
}
