"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import enTranslations from "@/locales/en.json";
import arTranslations from "@/locales/ar.json";

export function useTranslation() {
  const pathname = usePathname();
  const router = useRouter();
  const isArabicFromPath = pathname.startsWith("/ar");
  const locale: "EN" | "AR" = isArabicFromPath ? "AR" : "EN";
  const t = isArabicFromPath ? arTranslations : enTranslations;
  useEffect(() => {
    localStorage.setItem("lang", locale);
  }, [locale]);
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (!pathname.startsWith("/ar") && !pathname.startsWith("/en")) {
      if (savedLang === "AR") {
        router.replace(`/ar${pathname}`);
      } else {
        router.replace(`/en${pathname}`);
      }
    }
  }, [pathname, router]);

  return {
    t,
    locale,
    isArabic: locale === "AR",
    dir: locale === "AR" ? "rtl" : "ltr",
  };
}

export type TranslationType = typeof enTranslations;
