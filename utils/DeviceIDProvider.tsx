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

    if (token) {
      localStorage.setItem("resetToken", token);
      router.replace(`/${locale.toLowerCase()}/reset-password/?token=${token}`);
    }
  }, [searchParams, router, locale]);

  return null;
}