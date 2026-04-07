// app/reset-password/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function Redirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const savedLang = localStorage.getItem("lang");
    const locale = savedLang === "AR" ? "ar" : "en";

    const dest = token
      ? `/${locale}/reset-password?token=${token}`
      : ``;

    window.location.replace(dest);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
      <svg
        className="animate-spin text-[#c9a84c]/60"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".2" />
        <path d="M21 12a9 9 0 00-9-9" />
      </svg>
    </div>
  );
}

export default function ResetPasswordRedirect() {
  return (
    <Suspense fallback={null}>
      <Redirect />
    </Suspense>
  );
}
