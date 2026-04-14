/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLogin, useSignup } from "@/hooks/useAuth";
import Notification from "@/components/layout/Notification";
import { GoogleLogin } from "@react-oauth/google";
import { useShowNotification } from "@/utils/showNotification";
import { useHandleGoogleSuccess } from "@/utils/handleGoogleSuccess";
import { AxiosError } from "axios";
import { ErrorResponse, NotificationState } from "@/type/type";
import { useCartMerge } from "@/hooks/useCart";
import { useTranslation } from "@/lib/Usetranslation";
import { EyeClosed, EyeOpen } from "@/public/svg/Svgs";
import { getSignupSchema } from "@/utils/validation";

type RegisterFormData = {
  full_name: string;
  email: string;
  password1: string;
  password2: string;
};

export default function RegisterPage() {
  const { t, isArabic, dir, locale } = useTranslation();
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationState | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const mergeCart = useCartMerge();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(getSignupSchema(locale.toLowerCase())),
    defaultValues: { full_name: "", email: "", password1: "", password2: "" },
  });

  const showNotification = useShowNotification(setNotification);
  const handleGoogleSuccess = useHandleGoogleSuccess(showNotification);

  const onSubmit = (data: RegisterFormData) => {
    signupMutation.mutate(
      {
        full_name: data.full_name,
        email: data.email,
        password1: data.password1,
        password2: data.password2,
      },
      {
        onSuccess: () => {
          const deviceId = localStorage.getItem("X-Device-ID");
          if (deviceId) mergeCart.mutate(deviceId);
          loginMutation.mutate({ email: data.email, password: data.password1 });
          showNotification(t.register.success, "success");
          setTimeout(() => router.push(`/${locale.toLowerCase()}`), 1000);
        },
        onError: (error: AxiosError<ErrorResponse>) => {
          showNotification(
            error?.response?.data?.message ||
              error?.message ||
              t.register.error,
            "error",
          );
        },
      },
    );
  };

  const isLoading = signupMutation.isPending;

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

      {/* خلفية فنية: كلمة MISK ضخمة */}
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
        {/* برواز ذهبي جانبي */}
        <div
          className={`absolute top-0 bottom-0 w-[2px] bg-[#c9a84c] ${isArabic ? "right-0" : "left-0"}`}
        />

        <header className="mb-10">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase -[4px] text-[#c9a84c] block mb-2">
              Join Misk World
            </span>
            <h2 className="text-[32px] font-bold text-black leading-none uppercase -tighter">
              {t.register.title}
            </h2>
          </div>
          <p className="text-[13px] text-black font-medium max-w-[280px]">
            {t.register.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              {...register("full_name")}
              placeholder={t.register.fullName}
              className={`w-full bg-white rounded-xl border-b-2 border-black focus:border-black px-5 py-2 text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
            />
            {errors.full_name && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.full_name.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              {...register("email")}
              placeholder={t.register.email}
              className={`w-full bg-white rounded-xl border-b-2 border-black focus:border-black px-5 py-2 text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
            />
            {errors.email && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password1")}
                placeholder={t.register.password}
                className={`w-full bg-white rounded-xl px-5 border-b-2 border-black focus:border-black py-2 text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-black hover:text-[#c9a84c] transition-colors ${isArabic ? "left-3" : "right-3"}`}
              >
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.password1 && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.password1.message as string}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="relative">
              <input
                type={showPassword2 ? "text" : "password"}
                {...register("password2")}
                placeholder={t.register.confirmPassword}
                className={`w-full bg-white rounded-xl px-5 border-b-2 border-black focus:border-black py-2 text-[16px] outline-none transition-all duration-500 placeholder:text-black/50 ${isArabic ? "text-right" : "text-left"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className={`absolute top-1/2 -translate-y-1/2 text-black hover:text-[#c9a84c] transition-colors ${isArabic ? "left-3" : "right-3"}`}
              >
                {showPassword2 ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
            {errors.password2 && (
              <p className="absolute -bottom-5 text-[12px] font-bold text-red-500 uppercase -wider">
                {errors.password2.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full rounded-xl h-[54px] bg-black text-white text-[16px] font-bold uppercase -[3px] transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? t.register.creating : t.register.createAccount}
              </span>
              <div className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <div className="flex justify-center pt-2 mx-auto">
              <GoogleLogin
                onSuccess={(res) =>
                  res.credential && handleGoogleSuccess(res.credential)
                }
                onError={() =>
                  showNotification(t.register.googleError, "error")
                }
                theme="outline"
                shape="square"
                width="300"
              />
            </div>
          </div>
        </form>

        <footer className="mt-4 pt-8 border-t border-black/5">
          <p className="text-[12px] text-black font-medium">
            {t.register.haveAccount}{" "}
            <Link
              href={`/${locale.toLowerCase()}/login`}
              className="text-black font-bold hover:text-[#c9a84c] transition-colors ml-1 uppercase -tighter"
            >
              {t.register.signIn}
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
