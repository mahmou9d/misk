"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/lib/Usetranslation";
import { useGetBannersPublic } from "@/hooks/useDashboard";

const IMG_DESKTOP = "/banner1.jpg";
const IMG_DESKTOP_AR = "/banner2.jpg";
const IMG_MOBILE = "/banner3.jpg";

export default function HeroSection() {
  const { isArabic } = useTranslation();
  const { data: banners } = useGetBannersPublic();

  const desktopSrc = banners?.[0]?.desktop_img_url || (isArabic ? IMG_DESKTOP_AR : IMG_DESKTOP);
  const mobileSrc = banners?.[0]?.mobile_img_url || IMG_MOBILE;

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[600px]">
      
      {/* ── DESKTOP ── */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <motion.div className="absolute inset-0">
          <Image
            src={desktopSrc}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            unoptimized={desktopSrc.startsWith("http")}
          />
        </motion.div>
      </div>

      {/* ── MOBILE ── */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <motion.div className="absolute inset-0">
          <Image
            src={mobileSrc}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            unoptimized={mobileSrc.startsWith("http")}
          />
        </motion.div>
      </div>

    </section>
  );
}