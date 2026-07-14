"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckoutFormValues } from "@/type/type";
import { getCheckoutSchema } from "@/utils/validation";
import Image from "next/image";
import { useGetShippingGovernorates } from "@/hooks/useDashboard";
import { useCats } from "@/lib/context/CatsContext";

type Governorate = {
  id: number;
  name: string;
  shipping_fee: string;
};

function VisaIcon() {
  return (
    <Image
      src="/Visa.svg"
      width={25}
      height={20}
      alt="Visa"
      loading="lazy"
      aria-hidden="true"
    />
  );
}
function MastercardIcon() {
  return (
    <Image
      src="/Mastercard.svg"
      width={25}
      height={20}
      alt="Mastercard"
      loading="lazy"
      aria-hidden="true"
    />
  );
}
function MeezaIcon() {
  return (
    <Image
      src="/Meeza.svg"
      width={25}
      height={20}
      alt="Meeza"
      loading="lazy"
      aria-hidden="true"
    />
  );
}

function Field({
  label,
  error,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12px] font-semibold text-[#555]">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`w-full h-[52px] px-4 text-[14px] text-[#1a1a1a] bg-white rounded-[10px] border-2 outline-none transition-all duration-150 placeholder-[#C8C4BC]
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
              : "border-[#DDD8CC] focus:border-[#C9A84C] focus:shadow-[0_0_0_4px_rgba(201,168,76,0.12)]"
          }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="text-[13px] text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[18px]">
      <p className="text-[10px] text-[#C9A84C] uppercase mb-1.5">{children}</p>
      <div className="h-[1.5px] bg-[#E8E2D6]" />
    </div>
  );
}

function RadioCard({
  checked,
  label,
  children,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-center justify-between cursor-pointer px-[14px] py-4 rounded-[10px] border-2 mb-2.5 transition-all duration-150
        ${
          checked
            ? "border-[#C9A84C] bg-[#FDFAF0]"
            : "border-[#DDD8CC] bg-white hover:border-[#C9A84C]/50"
        }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150
            ${checked ? "border-[#C9A84C]" : "border-[#DDD]"}`}
        >
          {checked && (
            <span className="w-[11px] h-[11px] rounded-full bg-[#C9A84C]" />
          )}
        </span>
        <span className="text-[14px] font-medium text-[#1a1a1a] flex-1">
          {label}
        </span>
      </div>
      {children}
      <input type="radio" className="sr-only" {...props} />
    </label>
  );
}

export function CheckoutForm({
  onSubmit,
  loading,
  onGovernorateChange,
}: {
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
  loading: boolean;
  onGovernorateChange?: (fee: number) => void;
}) {
  const { t, isArabic, locale, dir } = useTranslation();
  const { data: governorates } = useGetShippingGovernorates();
const { setCartOpen } = useCats();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(getCheckoutSchema(locale.toLowerCase())),
    defaultValues: {
      payment_method: "cod",
      billing: "same",
      guest_email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      governorate_id: "",
      phone: "",
      apt: "",
      postal: "",
    },
  });

  // ── اختيار أول محافظة تلقائياً عند تحميل البيانات ──
  useEffect(() => {
    if (governorates?.length && !watch("governorate_id")) {
      setValue("governorate_id", String(governorates[0].id));
    }
  }, [governorates, setValue, watch]);

  const payment = watch("payment_method");
  const selectedGovId = watch("governorate_id");

  const selectedGov = governorates?.find(
    (g: Governorate) => g.id === Number(selectedGovId),
  );
  const shippingFee =
    selectedGov?.shipping_fee ?? governorates?.[0]?.shipping_fee ?? "0";

  // ── إرسال الـ fee للـ parent عند كل تغيير ──
  useEffect(() => {
    const fee = parseFloat(shippingFee) || 0;
    onGovernorateChange?.(fee);
  }, [shippingFee, onGovernorateChange]);

  const translatedErrors = {
    firstName: errors.firstName ? t.checkoutForm.errors.firstName : undefined,
    lastName: errors.lastName ? t.checkoutForm.errors.lastName : undefined,
    guest_email: errors.guest_email
      ? t.checkoutForm.errors.guest_email
      : undefined,
    address: errors.address ? t.checkoutForm.errors.address : undefined,
    city: errors.city ? t.checkoutForm.errors.city : undefined,
    governorate_id: errors.governorate_id
      ? t.checkoutForm.errors.gov
      : undefined,
    phone: errors.phone ? t.checkoutForm.errors.phone : undefined,
  };

  return (
    <motion.form
      className="flex flex-col gap-7"
      dir={dir}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Delivery ── */}
      <div>
        <SectionLabel>{t.checkoutForm.delivery}</SectionLabel>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between h-[52px] px-4 bg-[#F4F1EB] border-2 border-[#DDD8CC] rounded-[10px]">
            <span className="text-[14px] font-medium text-[#666]">
              {t.checkoutForm.country}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#aaa"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Field
              id="firstName"
              label={t.checkoutForm.firstName}
              placeholder="Ahmed"
              error={translatedErrors.firstName}
              {...register("firstName")}
            />
            <Field
              id="lastName"
              label={t.checkoutForm.lastName}
              placeholder="Hassan"
              error={translatedErrors.lastName}
              {...register("lastName")}
            />
          </div>

          <Field
            id="address"
            label={t.checkoutForm.address}
            placeholder="12 El Tahrir St."
            error={translatedErrors.address}
            {...register("address")}
          />
          <Field
            id="guest_email"
            label={t.checkoutForm.emailPlaceholder}
            placeholder="you@example.com"
            error={translatedErrors.guest_email}
            type="email"
            {...register("guest_email")}
          />
          <Field
            id="apt"
            label={t.checkoutForm.apt}
            placeholder="Apartment, floor (optional)"
            {...register("apt")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field
              id="city"
              label={t.checkoutForm.city}
              placeholder="Cairo"
              error={translatedErrors.city}
              {...register("city")}
            />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="governorate_id"
                className="text-[12px] font-semibold text-[#555]"
              >
                {isArabic ? "المحافظة" : "Governorate"}
              </label>
              <select
                id="governorate_id"
                {...register("governorate_id")}
                className="h-[52px] w-full px-4 text-[14px] text-[#1a1a1a] bg-white rounded-[10px] border-2 border-[#DDD8CC] outline-none appearance-none cursor-pointer focus:border-[#C9A84C] transition-colors duration-150"
                aria-invalid={errors.governorate_id ? "true" : "false"}
                aria-describedby={
                  errors.governorate_id ? "governorate-error" : undefined
                }
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: isArabic
                    ? "left 14px center"
                    : "right 14px center",
                  paddingLeft: isArabic ? "36px" : "16px",
                  paddingRight: isArabic ? "16px" : "36px",
                }}
              >
                <option value="" disabled>
                  {isArabic ? "اختر المحافظة" : "Governorate"}
                </option>
                {governorates?.map((g: Governorate) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {translatedErrors.governorate_id && (
                <span
                  id="governorate-error"
                  className="text-[13px] text-red-400"
                >
                  {translatedErrors.governorate_id}
                </span>
              )}
            </div>
          </div>

          <Field
            id="phone"
            label={t.checkoutForm.phone}
            placeholder="+20 100 000 0000"
            type="tel"
            error={translatedErrors.phone}
            {...register("phone")}
          />
        </div>
      </div>

      {/* ── Shipping ── */}
      <div>
        <SectionLabel>{t.checkoutForm.shippingMethod}</SectionLabel>
        <div className="flex items-center justify-between bg-white border-2 border-[#DDD8CC] rounded-[10px] px-[18px] py-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-[#1a1a1a]">
              {t.checkoutForm.shippingDays}
            </span>
            <span className="text-[13px] text-[#aaa]">
              {isArabic ? "٣–٥ أيام عمل" : "3–5 business days"}
            </span>
          </div>
          <span className="text-[18px] font-bold text-[#C9A84C]">
            EGP {parseFloat(shippingFee).toFixed(2)}
          </span>
        </div>
      </div>

      {/* ── Payment ── */}
      <div>
        <SectionLabel>{t.checkoutForm.payment}</SectionLabel>
        <div className="flex items-center gap-2 text-[14px] text-[#aaa] mb-3.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>{t.checkoutForm.paymentSecure}</span>
        </div>
        <RadioCard
          label={t.checkoutForm.cod}
          value="cod"
          checked={payment === "cod"}
          {...register("payment_method")}
        />
        <RadioCard
          label={t.checkoutForm.card}
          value="paymob"
          checked={payment === "paymob"}
          {...register("payment_method")}
        >
          <div className="flex items-center gap-1.5">
            <VisaIcon />
            <MastercardIcon />
            <MeezaIcon />
          </div>
        </RadioCard>
      </div>

      {/* ── Submit ── */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading}
        className={`w-full h-[58px] rounded-[12px] text-[14px] font-semibold uppercase transition-all duration-150
          ${
            loading
              ? "bg-[#e0e0e0] text-[#aaa] cursor-not-allowed"
              : "bg-[#1a1a1a] text-[#F0D080] cursor-pointer hover:bg-[#2a2a2a]"
          }`}
      >
        {loading
          ? t.checkoutForm.processing
          : payment === "paymob"
            ? t.checkoutForm.payWithCard
            : t.checkoutForm.completeOrder}
      </motion.button>

      {/* Links */}
      <div className="flex gap-6 justify-center pb-2">
        <Link
          href={`/${locale.toLowerCase()}/policies/privacy-policy`}
          onClick={() => setCartOpen(false)}
          className="text-[13px] text-gray-600 underline underline-offset-[3px] hover:text-[#C9A84C] transition-colors"
        >
          {t.checkoutForm.privacyPolicy}
        </Link>
        <Link
          href={`/${locale.toLowerCase()}/policies/terms-of-service`}
          onClick={() => setCartOpen(false)}
          className="text-[13px] text-gray-600 underline underline-offset-[3px] hover:text-[#C9A84C] transition-colors"
        >
          {t.checkoutForm.terms}
        </Link>
      </div>
    </motion.form>
  );
}
