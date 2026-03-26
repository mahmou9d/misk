"use client";

import { Suspense } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import Productpage from "@/components/sections/Productpage";
import Productgrid from "@/components/sections/Productgrid";
import Collections from "@/components/sections/Collections";
// import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import DeviceIDProvider, { RedirectResetPassword } from "@/utils/DeviceIDProvider";
import { PaymentPopup } from "@/components/layout/Paymentresult";
import IsLoading from "@/components/layout/IsLoading";
// import { BusinessHoursLocation } from "@/components/sections/BusinessHoursLocation";

export default function PaymentResultPage() {
  return (
    <main>
      <Suspense fallback={<IsLoading />}>
        <DeviceIDProvider />
        <RedirectResetPassword/>
        <AnnouncementBar />
        <Navbar />
        <HeroSection />
        <Productpage />
        <Productgrid />
        <Collections />
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
