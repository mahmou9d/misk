"use client";

import { useTranslation } from "@/lib/Usetranslation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function DeviceIDProvider() {
  useEffect(() => {
    const existing = localStorage.getItem("X-Device-ID");
    if (!existing) {
      const newID = crypto.randomUUID();
      localStorage.setItem("X-Device-ID", newID);
    }
  }, []);

  return null;
}
export  function RedirectResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
const { locale } = useTranslation();

useEffect(() => {
  const token = searchParams.get("token");
  const savedLang = localStorage.getItem("lang");
  const locale = savedLang === "AR" ? "ar" : "en";

  console.log("token:", token); // هل فيه token؟
  console.log("locale:", locale); // en أو ar؟
  console.log("full URL:", window.location.href); // الـ URL الكامل

  const dest = token
    ? `/${locale}/reset-password?token=${token}`
    : ``;

  console.log("redirecting to:", dest); // الـ destination
  router.replace(dest);
}, [router, searchParams]);
  return null;
}