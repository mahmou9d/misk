"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useLoginGoogle } from "@/hooks/useAuth";
import { ErrorResponse, GoogleLoginData } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";

export const useHandleGoogleSuccess = (
  showNotification: (message: string, type: "success" | "error") => void,
) => {
  const { mutate: loginWithGoogle } = useLoginGoogle();
  const { t, locale } = useTranslation();
  const router = useRouter();

  const handleGoogleSuccess = useCallback(
    (credential: string) => {
      loginWithGoogle(
        { credential },
        {
          onSuccess: (data: GoogleLoginData) => {
            try {
              if (data.access) localStorage.setItem("access", data.access);
              if (data.refresh) localStorage.setItem("refresh", data.refresh);

              const savedToken = localStorage.getItem("access");

              if (savedToken) {
                showNotification(t.login.success, "success");

                setTimeout(() => {
                  router.push(`/${locale.toLowerCase()}`);
                  router.refresh();
                }, 1500);
              } else {
                showNotification(
                  locale.toLowerCase() === "en"
                    ? "Failed to save login session"
                    : "فشل في حفظ جلسة تسجيل الدخول",
                  "error",
                );
              }
            } catch (errorData: unknown) {
              const error = errorData as AxiosError<ErrorResponse>;
              showNotification(
                error?.response?.data?.message ||
                  error?.message ||
                  `${locale.toLowerCase() === "en" ? "Google login failed. Please try again." : "فشل تسجيل الدخول بواسطة جوجل. يرجى المحاولة مرة أخرى."}`,
                "error",
              );
            }
          },
          onError: (error: AxiosError<ErrorResponse>) => {
            showNotification(
              error?.response?.data?.message ||
                error?.message ||
                `${locale.toLowerCase() === "en" ? "Google login failed. Please try again." : "فشل تسجيل الدخول بواسطة جوجل. يرجى المحاولة مرة أخرى."}`,
              "error",
            );
          },
        },
      );
    },
    [locale, loginWithGoogle, router, showNotification],
  );

  return handleGoogleSuccess;
};
