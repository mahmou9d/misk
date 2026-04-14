"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Notification from "@/components/layout/Notification";
import { GoogleLogin } from "@react-oauth/google";
import { useShowNotification } from "@/utils/showNotification";
import { AxiosError } from "axios";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useHandleGoogleSuccess } from "@/utils/handleGoogleSuccess";
import { useCartMerge } from "@/hooks/useCart";
import { EyeClosed, EyeOpen } from "@/public/svg/Svgs";
import { getLoginSchema } from "@/utils/validation";
import { useTranslation } from "@/lib/Usetranslation";

export default function LoginPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const params = useParams();
  const currentLocale = (params.locale as string) || "en";
  const { login, isLoginPending } = useAuth();
  const mergeCart = useCartMerge();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getLoginSchema(locale.toLowerCase())),
    defaultValues: { email: "", password: "" },
  });

  const showNotification = useShowNotification(setNotification);
  const handleGoogleSuccess = useHandleGoogleSuccess(showNotification);

  const onSubmit = async (data: { email: string; password: string }): Promise<void> => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
            const token = localStorage.getItem("access");
            const deviceId = localStorage.getItem("X-Device-ID");

            if (deviceId && token) {
              mergeCart.mutate(deviceId, {
              });
            }
          showNotification(t.login.success, "success");
          setTimeout(() => router.push(`/${currentLocale}`), 1000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message || t.login.error,
            "error",
          );
        },
      },
    );
  };

  return (
    <div
      dir={dir}
      className="relative min-h-screen bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden font-sans"
    >
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </AnimatePresence>

      {/* خلفية فنية: كلمة MISK ضخمة جداً */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[25vw] font-black text-black/[0.08] uppercase -[-0.05em]">
          Misk
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px] px-8 py-12"
      >
        {/* برواز ذهبي جانبي صغير جداً */}
        <div
          className={`absolute top-0 bottom-0 w-[2px] bg-[#c9a84c] ${isArabic ? "right-0" : "left-0"}`}
        />

        <header className="mb-12">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase -[4px] text-[#c9a84c] block mb-2">
              Exclusive Access
            </span>
            <h2 className="text-[32px] font-bold text-black leading-none uppercase -tighter">
              {t.login.title}
            </h2>
          </div>
          <p className="text-[13px] text-black font-medium max-w-[280px]">
            {t.login.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              {...register("email")}
              placeholder={t.login.emailPlaceholder}
              className={`w-full bg-white border-b-2 border-black focus:border-black px-5  py-2 rounded-xl text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
            />
            {errors.email && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder={t.login.passwordPlaceholder}
                className={`w-full bg-white border-b-2 border-black focus:border-black px-5  py-2 rounded-xl text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-black/placeholder:text-black/50 hover:text-black transition-colors ${isArabic ? "left-3" : "right-3"}`}
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.password && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.password.message as string}
              </p>
            )}
          </div>

          <div className={`pt-2 ${isArabic ? "text-right" : "text-left"}`}>
            <Link
              href={`/${locale.toLowerCase()}/forgot-password`}
              className="text-[11px] font-bold uppercase -widest text-black hover:text-[#c9a84c] transition-colors"
            >
              {t.login.forgotPassword}
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoginPending}
              className="group relative w-full rounded-xl h-[54px] bg-black text-white text-[16px] font-bold uppercase -[3px] transition-all overflow-hidden"
            >
              <span className="relative z-10">
                {isLoginPending ? t.login.signingIn : t.login.signIn}
              </span>
              <div className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <div className="flex justify-center pt-2 mx-auto">
              <GoogleLogin
                onSuccess={(res) =>
                  res.credential && handleGoogleSuccess(res.credential)
                }
                onError={() => showNotification(t.login.googleError, "error")}
                theme="outline"
                shape="square"
                width="300"
              />
            </div>
          </div>
        </form>

        <footer className="mt-4 pt-8 border-t border-black/5">
          <p className="text-[12px] text-black font-medium">
            {t.login.noAccount}{" "}
            <Link
              href={`/${locale.toLowerCase()}/signup`}
              className="text-black font-bold hover:text-[#c9a84c] transition-colors ml-1 uppercase -tighter"
            >
              {t.login.createOne}
            </Link>
          </p>

          <div className="mt-3 flex gap-8 opacity-40">
            <Link
              href={`/${locale.toLowerCase()}/policies/privacy-policy`}
              className="text-[13px] font-black uppercase -[2px] text-black"
            >
              {t.login.privacyPolicy}
            </Link>
            <Link
              href={`/${locale.toLowerCase()}/policies/terms-of-service`}
              className="text-[13px] font-black uppercase -[2px] text-black"
            >
              {t.login.terms}
            </Link>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
