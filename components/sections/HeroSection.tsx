"use client";

import Image from "next/image";
import { useGetBannersPublic } from "@/hooks/useDashboard";

function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[600px] bg-[#f5f0e8] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-[#ede8e0] via-[#e8e0d0] to-[#f5f0e8]" />
    </section>
  );
}

export default function HeroSection() {
  const { data: banners, isLoading } = useGetBannersPublic();

  const desktopSrc = banners?.[0]?.desktop_img_url;
  const mobileSrc = banners?.[0]?.mobile_img_url;

  if (isLoading) return <HeroSkeleton />;
  if (!banners?.[0]) return null;

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] h-[100svh] max-h-[700px] lg:max-h-[600px] bg-[#f5f0e8]">
      {/* ── TABLET : md → lg ── */}
      <div className="absolute inset-0 hidden md:block lg:hidden">
        <Image
          src={mobileSrc as string}
          alt="Hero"
          fill
          sizes="100vw"
          className="object-center"
          priority
          unoptimized={mobileSrc?.startsWith("http")}
        />
      </div>

      {/* ── MOBILE : < md ── */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src={mobileSrc as string}
          alt="Hero"
          fill
          sizes="100vw"
          className="object-center"
          priority
          unoptimized={mobileSrc?.startsWith("http")}
        />
      </div>

      {/* ── DESKTOP : lg+ ── */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={desktopSrc as string}
          alt="Hero"
          fill
          sizes="100vw"
          className="object-center"
          priority
          unoptimized={desktopSrc?.startsWith("http")}
        />
      </div>
    </section>
  );
}
