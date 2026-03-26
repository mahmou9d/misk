import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import { BusinessHoursLocation } from "@/components/sections/BusinessHoursLocation";
import Footer from "@/components/sections/Footer";

const BusinessHoursPage = () => {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <BusinessHoursLocation />
      <Footer />
    </main>
  );
};

export default BusinessHoursPage;
