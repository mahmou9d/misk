/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { usePasswordResetConfirm } from "@/hooks/useAuth";
import Notification from "@/components/layout/Notification";
import { resetPasswordSchema } from "@/utils/validation";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useShowNotification } from "@/utils/showNotification";
import { AxiosError } from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EyeClosed, EyeOpen } from "@/public/svg/Svgs";
import { useTranslation } from "@/lib/Usetranslation";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ArrowRightIcon = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

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

// ── Shared input class builder ─────────────────────────────────────────────
const buildInputClass = (hasError: boolean, isArabic: boolean) => `
  w-full h-[50px] bg-transparent border-b outline-none text-[15px] text-[#1a1a1a] transition-colors duration-250 rounded-xl
  ${isArabic ? "text-right pr-3 pl-10 -normal" : "text-left pl-3 pr-10 -[0.3px]"}
  ${hasError ? "border-red-400/60" : "border-black/15 focus:border-[#c9a84c]/70"}
`;

// ── Password field with show/hide toggle ──────────────────────────────────

const PasswordField = ({
  placeholder,
  register,
  error,
  isArabic,
}: {
  placeholder: string;
  register: ReturnType<typeof useForm>["register"] extends (
    ...args: any
  ) => infer R
    ? R
    : never;
  error?: string;
  isArabic: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-[10px]">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className={`${buildInputClass(!!error, isArabic)} placeholder:text-[#bbb] ${
            isArabic ? "placeholder:not-italic" : "placeholder:italic"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className={`absolute top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#ccc] hover:text-[#c9a84c]/70 transition-colors p-1 flex ${
            isArabic ? "left-2" : "right-2"
          }`}
        >
          {show ? <EyeOpen /> : <EyeClosed />}
        </button>
      </div>
      {error && (
        <p
          className={`text-[12px] text-red-500/80 mt-1 ${
            isArabic ? "-normal text-right" : "-[0.3px] text-left"
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// ── Password requirements ──────────────────────────────────────────────────

const PasswordRequirements = ({ isArabic }: { isArabic: boolean }) => {
  const items = isArabic
    ? ["على الأقل 8 أحرف", "حرف كبير واحد", "حرف صغير واحد", "رقم واحد"]
    : [
        "At least 8 characters",
        "One uppercase letter",
        "One lowercase letter",
        "One number",
      ];
  return (
    <div className="mb-6 border border-[#c9a84c]/15 bg-[#c9a84c]/5 p-4">
      <p
        className={`text-[13px] text-[#808080] mb-2 font-medium ${
          isArabic ? "-normal text-right" : "-[1.5px] uppercase text-left"
        }`}
      >
        {isArabic ? "متطلبات كلمة المرور" : "Password requirements"}
      </p>
      <ul className="space-y-[5px]">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-center gap-2 ${isArabic ? "flex-row" : "flex-row-reverse"}`}
          >
            <div className="w-[3px] h-[3px] rounded-full bg-[#c9a84c]/50 flex-shrink-0" />
            <span
              className={`text-[12px] text-[#808080] ${
                isArabic ? "-normal" : "-[0.2px]"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ── Invalid / expired token state ─────────────────────────────────────────

const InvalidTokenMessage = ({
  locale,
  isArabic,
}: {
  locale: string;
  isArabic: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="mb-7 border border-red-400/25 bg-red-50/60 p-4"
  >
    <div
      className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full border border-red-300/40 bg-red-100/60 flex items-center justify-center text-red-400">
        <AlertIcon />
      </div>
      <div className={isArabic ? "text-right" : "text-left"}>
        <p
          className={`text-[13px] font-medium text-[#808080] mb-[2px] ${
            isArabic ? "-normal" : "-[0.3px]"
          }`}
        >
          {isArabic
            ? "الرابط غير صالح أو انتهت صلاحيته"
            : "Invalid or expired link"}
        </p>
        <p
          className={`text-[12px] text-[#808080] mb-3 ${
            isArabic ? "-normal" : "-[0.2px]"
          }`}
        >
          {isArabic
            ? "هذا الرابط لإعادة تعيين كلمة المرور غير صالح حالياً. الرجاء طلب رابط جديد."
            : "This reset link is no longer valid. Please request a new one."}
        </p>
        <Link
          href={`/${locale}/forgot-password`}
          className={`inline-flex items-center gap-2 text-[12px] text-[#c9a84c]/80 no-underline border-b border-[#c9a84c]/30 hover:text-[#c9a84c] transition-colors ${
            isArabic ? "-normal flex-row-reverse" : "-[0.5px]"
          }`}
        >
          {isArabic ? "طلب رابط جديد" : "Request a new link"}
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  </motion.div>
);

// ── The shared card ────────────────────────────────────────────────────────

const MiskCard = ({
  children,
  isArabic,
  dir,
}: {
  children: React.ReactNode;
  isArabic: boolean;
  dir: string;
}) => (
  <div
    dir={dir}
    className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 overflow-hidden bg-[linear-gradient(160deg,#faf8f4_0%,#f0ece4_50%,#e8e2d8_100%)]"
  >
    <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.07)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(45,27,105,0.05)_0%,transparent_50%)]" />
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-[440px] bg-white/92 border border-[#c9a84c]/20 shadow-[0_8px_48px_rgba(45,27,105,0.1),0_2px_8px_rgba(201,168,76,0.08)] p-11 pb-10"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
      {children}
    </motion.div>
  </div>
);

// ── Loading skeleton ───────────────────────────────────────────────────────

const LoadingFallback = () => {
  const { isArabic, dir } = useTranslation();
  return (
    <MiskCard isArabic={isArabic} dir={dir}>
      <div className="text-center mb-8">
        <span className="text-[28px] font-bold -[6px] bg-gradient-to-br from-[#c9a84c] via-[#f0d080] to-[#b8912e] bg-clip-text text-transparent block drop-shadow-[0_1px_6px_rgba(201,168,76,0.2)]">
          Misk
        </span>
        <div className="mx-auto mt-[6px] h-[1px] w-8 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />
      </div>
      <div className="flex items-center justify-center py-10">
        <svg
          className="animate-spin text-[#c9a84c]/60"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity=".2" />
          <path d="M21 12a9 9 0 00-9-9" />
        </svg>
      </div>
    </MiskCard>
  );
};

// ── Main content ───────────────────────────────────────────────────────────

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isArabic, dir, locale } = useTranslation();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");
  const resetConfirmMutation = usePasswordResetConfirm();
  const showNotification = useShowNotification(setNotification);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    if (!token) {
      showNotification(
        isArabic ? "رابط غير صالح" : "Invalid reset token",
        "error",
      );
      return;
    }
    resetConfirmMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: (response: { message: string }) => {
          setSuccess(true);
          const successMessage =
            response.message ||
            (isArabic
              ? "تم تعيين كلمة المرور بنجاح"
              : "Password reset successfully!");
          showNotification(successMessage, "success");
          setTimeout(() => router.push(`/${locale.toLowerCase()}/login`), 2000);
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
              `${locale.toLowerCase() === "en" ? "Failed to reset password." : "فشل تعيين كلمة المرور"}`,
            "error",
          );
        },
      },
    );
  };

  return (
    <MiskCard isArabic={isArabic} dir={dir}>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}

      {/* Brand*/}
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

      {/* Title*/}
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
          {t?.resetPassword?.title ?? "Set a new password"}
        </h1>
        <p
          className={`text-sm text-[#aaa] ${isArabic ? "-normal" : "-[0.3px]"}`}
        >
          {t?.resetPassword?.subtitle ??
            "Your new password must be different from previous ones"}
        </p>
      </motion.div>

      {/* No token → invalid state */}
      {!token && (
        <InvalidTokenMessage
          locale={locale.toLowerCase()}
          isArabic={isArabic}
        />
      )}

      {/* Success state */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 border border-[#c9a84c]/25 bg-[#c9a84c]/5 p-4"
          >
            <div
              className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/20 to-[#b8912e]/10 flex items-center justify-center text-[#c9a84c]">
                <CheckIcon />
              </div>
              <div className={isArabic ? "text-right" : "text-left"}>
                <p
                  className={`text-[13px] font-medium text-[#1a1a1a] mb-[2px] ${
                    isArabic ? "-normal" : "-[0.3px]"
                  }`}
                >
                  {t?.resetPassword?.successTitle ?? "Password updated"}
                </p>
                <p
                  className={`text-[12px] text-[#aaa] ${
                    isArabic ? "-normal" : "-[0.2px]"
                  }`}
                >
                  {t?.resetPassword?.successSubtitle ??
                    "Redirecting you to sign in…"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form — only when token present and not yet succeeded */}
      {token && !success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
        >
          <PasswordRequirements isArabic={isArabic} />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <PasswordField
              placeholder={
                t?.resetPassword?.newPasswordPlaceholder ?? "New password"
              }
              register={register("password")}
              error={errors.password?.message}
              isArabic={isArabic}
            />

            <div className="mb-7">
              <PasswordField
                placeholder={
                  t?.resetPassword?.confirmPasswordPlaceholder ??
                  "Confirm new password"
                }
                register={register("confirmPassword")}
                error={errors.confirmPassword?.message}
                isArabic={isArabic}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.988 }}
              type="submit"
              disabled={resetConfirmMutation.isPending}
              className={`
                relative overflow-hidden h-[52px] w-full text-[13px] font-semibold transition-all duration-300 rounded-xl
                border border-[#c9a84c]/25 shadow-[0_2px_18px_rgba(45,27,105,0.22)]
                hover:not-disabled:shadow-[0_6px_28px_rgba(45,27,105,0.35)]
                ${
                  resetConfirmMutation.isPending
                    ? "bg-[#2d1b69]/50 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#1a0a3d] to-[#2d1b69] cursor-pointer"
                }
                text-[#f0d080]/95
                ${isArabic ? "-normal normal-case" : "-[3px] uppercase"}
                after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-[#c9a84c]/12 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity
              `}
            >
              {resetConfirmMutation.isPending ? (
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
                  {t?.resetPassword?.resetting ?? "Updating…"}
                </span>
              ) : (
                (t?.resetPassword?.submit ?? "Reset password")
              )}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Back to login*/}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-center mt-[22px]"
      >
        <Link
          href={`/${locale.toLowerCase()}/login`}
          className={`inline-flex items-center gap-2 text-[12px] text-[#808080] no-underline border-b border-black/10 hover:text-[#c9a84c]/90 transition-colors ${
            isArabic ? "-normal flex-row-reverse" : "-[1px]"
          }`}
        >
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
          {t?.resetPassword?.backToLogin ?? "Back to sign in"}
        </Link>
      </motion.div>
    </MiskCard>
  );
};

// ── Suspense wrapper ───────────────────────────────────────────────────────

const ResetPassword = () => (
  <Suspense fallback={<LoadingFallback />}>
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPassword;
