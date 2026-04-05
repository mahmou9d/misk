"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useGetBannersPublic } from "@/hooks/useDashboard";

export default function HeroSection() {
  const { data: banners } = useGetBannersPublic();

  const desktopSrc = banners?.[0]?.desktop_img_url;
  const mobileSrc = banners?.[0]?.mobile_img_url;

  if (!banners?.[0]) return null;

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[600px]">
      {/* ── DESKTOP ── */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <motion.div className="absolute inset-0">
          <Image
            src={desktopSrc as string}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            unoptimized={desktopSrc?.startsWith("http")}
          />
        </motion.div>
      </div>

      {/* ── MOBILE ── */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <motion.div className="absolute inset-0">
          <Image
            src={mobileSrc as string}
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            unoptimized={mobileSrc?.startsWith("http")}
          />
        </motion.div>
      </div>
    </section>
  );
}
