"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePasswordReset } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/utils/validation";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import Notification from "@/components/layout/Notification";
import { AxiosError } from "axios";
import { useTranslation } from "@/lib/Usetranslation";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

export default function ForgotPasswordPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const resetPasswordMutation = usePasswordReset();
  const showNotification = useShowNotification(setNotification);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    resetPasswordMutation.mutate(data.email, {
      onSuccess: (response) => {
        setEmailSent(true);
        setSubmittedEmail(data.email);
        showNotification(
          response.status || "Reset link sent successfully!",
          "success",
        );
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        showNotification(
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.response?.data?.error ||
            error?.response?.data?.status ||
            error?.response?.data?.non_field_errors ||
            error?.response?.data?.name ||
            error?.message ||
            `${locale.toLowerCase() === "en" ? "Failed to send reset link." : "فشل ارسال رابط التعيين."}`,
          "error",
        );
      },
    });
  };

  /*
    inputClassName:
    - عربي  → text-right | pr-0 pl-10 (مكان أيقونة الميل على اليسار)
    - إنجليزي → text-left  | pl-0 pr-10 (مكان أيقونة الميل على اليمين)
  */
  const inputClassName = `
    w-full h-[50px] bg-transparent border-b outline-none text-[15px] text-[#1a1a1a] transition-colors duration-250 rounded-xl
    ${isArabic ? "text-right pr-3 pl-10 -normal" : "text-left pl-3 pr-10 -[0.3px]"}
    ${errors.email ? "border-red-400/60" : "border-black/15 focus:border-[#c9a84c]/70"}
  `;

  return (
    <>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      <div
        dir={dir}
        className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 overflow-hidden bg-[linear-gradient(160deg,#faf8f4_0%,#f0ece4_50%,#e8e2d8_100%)]"
      >
        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.07)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(45,27,105,0.05)_0%,transparent_50%)]" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[440px] bg-white/92 border border-[#c9a84c]/20 shadow-[0_8px_48px_rgba(45,27,105,0.1),0_2px_8px_rgba(201,168,76,0.08)] p-11 pb-10"
        >
          {/* Gold top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

          {/* Brand — دايماً في المنتصف */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center mb-8"
          >
            <span className="text-[28px] font-bold -[6px] bg-gradient-to-br from-[#c9a84c] via-[#f0d080] to-[#b8912e] bg-clip-text text-transparent block drop-shadow-[0_1px_6px_rgba(201,168,76,0.2)]">
              Misk
            </span>
            <div className="mx-auto mt-[6px] h-[1px] w-8 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
          </motion.div>

          {/* Title — عربي: يمين | إنجليزي: يسار */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4 }}
            className={`mb-7 ${isArabic ? "text-right" : "text-left"}`}
          >
            <h1
              className={`text-[22px] font-normal text-[#111] mb-1 ${
                isArabic ? "leading-relaxed" : "leading-tight"
              }`}
            >
              {t?.forgotPassword?.title ?? "Reset your password"}
            </h1>
            <p
              className={`text-sm text-[#aaa] ${
                isArabic ? "-normal" : "-[0.3px]"
              }`}
            >
              {t?.forgotPassword?.subtitle ??
                "Enter your email and we'll send you a reset link"}
            </p>
          </motion.div>

          {/* Success state */}
          <AnimatePresence>
            {emailSent && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-7 border border-[#c9a84c]/25 bg-[#c9a84c]/5 p-4"
              >
                {/*
                  عربي  → أيقونة على اليسار، نص على اليمين (flex-row-reverse)
                  إنجليزي → أيقونة على اليسار، نص على اليمين (flex-row)
                */}
                <div
                  className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/20 to-[#b8912e]/10 flex items-center justify-center text-[#c9a84c]">
                    <CheckIcon />
                  </div>
                  <div className={isArabic ? "text-right" : "text-left"}>
                    <p
                      className={`text-[13px] font-medium text-[#808080] mb-[2px] ${
                        isArabic ? "-normal" : "-[0.3px]"
                      }`}
                    >
                      {t?.forgotPassword?.checkEmail ?? "Check your inbox"}
                    </p>
                    <p
                      className={`text-[12px] text-[#808080] ${
                        isArabic ? "-normal" : "-[0.2px]"
                      }`}
                    >
                      {t?.forgotPassword?.sentTo ?? "We sent a link to"}{" "}
                      <span className="text-[#c9a84c]/90 font-medium">
                        {submittedEmail}
                      </span>
                    </p>
                    <p
                      className={`text-[12px] text-[#808080] mt-1 ${
                        isArabic ? "-normal" : "-[0.2px]"
                      }`}
                    >
                      {t?.forgotPassword?.checkSpam ??
                        "Didn't receive it? Check your spam folder."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="mb-7">
              <div className="relative">
                <input
                  type="email"
                  placeholder={
                    t?.forgotPassword?.emailPlaceholder ?? "Your email address"
                  }
                  {...register("email")}
                  className={`${inputClassName} placeholder:text-[#bbb] ${
                    isArabic ? "placeholder:not-italic" : "placeholder:italic"
                  }`}
                />
                {/*
                  أيقونة الميل:
                  عربي  → على اليسار  (نهاية السطر RTL)
                  إنجليزي → على اليمين (نهاية السطر LTR)
                */}
                <span
                  className={`absolute top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none ${
                    isArabic ? "left-3" : "right-3"
                  }`}
                >
                  <MailIcon />
                </span>
              </div>
              {errors.email && (
                <p
                  className={`text-[12px] text-red-500/80 mt-1 ${
                    isArabic ? "-normal text-right" : "-[0.3px] text-left"
                  }`}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.988 }}
              type="submit"
              disabled={resetPasswordMutation.isPending || emailSent}
              className={`
                relative overflow-hidden h-[52px] w-full text-[13px] font-semibold transition-all duration-300 rounded-xl
                border border-[#c9a84c]/25 shadow-[0_2px_18px_rgba(45,27,105,0.22)]
                hover:not-disabled:shadow-[0_6px_28px_rgba(45,27,105,0.35)]
                ${
                  resetPasswordMutation.isPending || emailSent
                    ? "bg-[#2d1b69]/50 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] cursor-pointer"
                }
                text-[#f0d080]/95
                ${isArabic ? "-normal normal-case" : "-[3px] uppercase"}
                after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-[#c9a84c]/12 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity
              `}
            >
              {resetPasswordMutation.isPending ? (
                <span className="flex items-center justify-center gap-[10px]">
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeOpacity=".25"
                    />
                    <path d="M21 12a9 9 0 00-9-9" />
                  </svg>
                  {t?.forgotPassword?.sending ?? "Sending..."}
                </span>
              ) : emailSent ? (
                <span className="flex items-center justify-center gap-[10px]">
                  <CheckIcon />
                  {t?.forgotPassword?.sent ?? "Link sent"}
                </span>
              ) : (
                (t?.forgotPassword?.sendLink ?? "Send reset link")
              )}
            </motion.button>
          </motion.form>

          {/* Back to login — دايماً في المنتصف، السهم بيتعكس */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-center mt-[22px]"
          >
            <Link
              href={`/${locale.toLowerCase()}/login`}
              className={`inline-flex items-center gap-2 text-[12px] text-[#bbb] no-underline border-b border-black/10 hover:text-[#c9a84c]/90 transition-colors ${
                isArabic ? "-normal flex-row-reverse" : "-[1px]"
              }`}
            >
              <ArrowLeftIcon />
              {t?.forgotPassword?.backToLogin ?? "Back to sign in"}
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer links — دايماً في المنتصف */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="relative z-10 flex items-center gap-6 mt-7"
        >
          {[
            {
              href: `/${locale.toLowerCase()}/policies/privacy-policy`,
              label: t?.login?.privacyPolicy ?? "Privacy",
            },
            {
              href: `/${locale.toLowerCase()}/policies/terms-of-service`,
              label: t?.login?.terms ?? "Terms",
            },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[12px] text-[#808080] no-underline hover:text-[#c9a84c]/90 transition-colors ${
                isArabic ? "-normal normal-case" : "-[1.5px] uppercase"
              }`}
            >
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </>
  );
}
