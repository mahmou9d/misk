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
import DeviceIDProvider, { RedirectResetPassword } from "@/utils/DeviceIDProvider";
import { PaymentPopup } from "@/components/layout/Paymentresult";
import IsLoading from "@/components/layout/IsLoading";
import { TabKey1, TabKey2 } from "@/type/type";
// import { BusinessHoursLocation } from "@/components/sections/BusinessHoursLocation";



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const CATEGORY_MAP1: Record<TabKey1, { en: string; ar: string }> = {
    Men: { en: "Men", ar: "رجالي" },
    Unisex: { en: "Unisex", ar: "رجالى و نسائي" },
    Women: { en: "Women", ar: "نسائي" },
  };
    const CATEGORY_MAP2: Record<TabKey2, { en: string; ar: string }> = {
      BodySplash: { en: "Body Splash", ar: "بادي سبلاش" },
      Niche: { en: "Niche", ar: "النيش" },
    };
  return (
    <main>
      <Suspense fallback={<IsLoading />}>
        <DeviceIDProvider />
        <RedirectResetPassword />
        <AnnouncementBar />
        <Navbar />
        <HeroSection />
        <Productpage />
        <Productgrid CATEGORY_MAP={CATEGORY_MAP1} />
        <Productgrid CATEGORY_MAP={CATEGORY_MAP2} />
        {/* <Collections /> */}
        {/* <Faq /> */}
        {/* <BusinessHoursLocation /> */}
        <Footer />
        <Suspense fallback={null}>
          <PaymentPopup />
        </Suspense>
      </Suspense>
    </main>
  );
}
