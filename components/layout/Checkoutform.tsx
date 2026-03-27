"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/Usetranslation";
import { CheckoutFormValues } from "@/type/type";
import { checkoutSchema } from "@/utils/validation";
import Image from "next/image";

const SHIPPING = 85;

const governorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbiya",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];

const governoratesAr = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

/* ── Card Icons ── */
function VisaIcon() {
  return (
    <div className="flex items-center bg-white border border-[#DDD] rounded px-2 h-[26px]">
<Image src="/visa.svg" width={36} height={26} alt="Visa" />
    </div>
  );
}

function MastercardIcon() {
  return <Image src="/mastercard.svg" width={36} height={26} alt="Visa" />;
}

function MeezaIcon() {
  return <Image src="/meeza.svg" width={36} height={26} alt="Visa" />;
}

/* ── Field ── */
function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[12px] font-semibold text-[#555] tracking-[0.3px]">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full h-[52px] px-4 text-[16px] text-[#1a1a1a] bg-white rounded-[10px] border-2 outline-none transition-all duration-150 placeholder-[#C8C4BC]
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]"
              : "border-[#DDD8CC] focus:border-[#C9A84C] focus:shadow-[0_0_0_4px_rgba(201,168,76,0.12)]"
          }`}
      />
      {error && <span className="text-[13px] text-red-400">{error}</span>}
    </div>
  );
}

/* ── Section Label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[18px]">
      <p className="text-[10px] tracking-[4px] text-[#C9A84C] uppercase mb-1.5">
        {children}
      </p>
      <div className="h-[1.5px] bg-[#E8E2D6]" />
    </div>
  );
}

/* ── Radio Card ── */
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
      className={`flex items-center justify-between cursor-pointer px-[18px] py-4 rounded-[10px] border-2 mb-2.5 transition-all duration-150
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
        <span className="text-[16px] font-medium text-[#1a1a1a]">{label}</span>
      </div>
      {children}
      <input type="radio" className="sr-only" {...props} />
    </label>
  );
}

/* ══ CheckoutForm ══ */
export function CheckoutForm({
  onSubmit,
  loading,
}: {
  onSubmit: (values: CheckoutFormValues) => void;
  loading: boolean;
}) {
  const { t, isArabic, locale, dir } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { gov: "Cairo", payment: "cod", billing: "same" },
  });

  const payment = watch("payment");
  const billing = watch("billing");

  const translatedErrors = {
    email: errors.email ? t.checkoutForm.errors.email : undefined,
    firstName: errors.firstName ? t.checkoutForm.errors.firstName : undefined,
    lastName: errors.lastName ? t.checkoutForm.errors.lastName : undefined,
    address: errors.address ? t.checkoutForm.errors.address : undefined,
    city: errors.city ? t.checkoutForm.errors.city : undefined,
    gov: errors.gov ? t.checkoutForm.errors.gov : undefined,
    phone: errors.phone ? t.checkoutForm.errors.phone : undefined,
  };

  const govList = isArabic ? governoratesAr : governorates;

  return (
    <motion.div
      className="flex flex-col gap-7"
      dir={dir}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Contact ── */}
      <div>
        <SectionLabel>{t.checkoutForm.contact}</SectionLabel>
        <div className="flex flex-col gap-4">
          <Field
            label={t.checkoutForm.emailPlaceholder}
            placeholder="you@example.com"
            type="email"
            error={translatedErrors.email}
            {...register("email")}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register("newsEmail")}
                className="w-[18px] h-[18px] accent-[#C9A84C]"
              />
              <span className="text-[15px] text-[#888]">
                {t.checkoutForm.newsEmail}
              </span>
            </label>
            <Link
              href={`/${locale.toLowerCase()}/login`}
              className="text-[14px] font-semibold text-[#C9A84C] underline underline-offset-[3px] hover:opacity-70 transition-opacity"
            >
              {t.checkoutForm.signIn}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Delivery ── */}
      <div>
        <SectionLabel>{t.checkoutForm.delivery}</SectionLabel>
        <div className="flex flex-col gap-4">
          {/* Country */}
          <div className="flex items-center justify-between h-[52px] px-4 bg-[#F4F1EB] border-2 border-[#DDD8CC] rounded-[10px]">
            <span className="text-[16px] font-medium text-[#666]">
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
              label={t.checkoutForm.firstName}
              placeholder="Ahmed"
              error={translatedErrors.firstName}
              {...register("firstName")}
            />
            <Field
              label={t.checkoutForm.lastName}
              placeholder="Hassan"
              error={translatedErrors.lastName}
              {...register("lastName")}
            />
          </div>

          <Field
            label={t.checkoutForm.address}
            placeholder="12 El Tahrir St."
            error={translatedErrors.address}
            {...register("address")}
          />

          <Field
            label={t.checkoutForm.apt}
            placeholder="Apartment, floor (optional)"
            {...register("apt")}
          />

          <div className="grid grid-cols-3 gap-3.5">
            <Field
              label={t.checkoutForm.city}
              placeholder="Cairo"
              error={translatedErrors.city}
              {...register("city")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#555] tracking-[0.3px]">
                {isArabic ? "المحافظة" : "Governorate"}
              </label>
              <select
                {...register("gov")}
                className="h-[52px] px-4 text-[16px] text-[#1a1a1a] bg-white rounded-[10px] border-2 border-[#DDD8CC] outline-none appearance-none cursor-pointer focus:border-[#C9A84C] transition-colors duration-150"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                }}
              >
                {governorates.map((g, i) => (
                  <option key={g} value={g}>
                    {govList[i]}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label={t.checkoutForm.postalCode}
              placeholder="11511"
              {...register("postal")}
            />
          </div>

          <Field
            label={t.checkoutForm.phone}
            placeholder="+20 100 000 0000"
            type="tel"
            error={translatedErrors.phone}
            {...register("phone")}
          />

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("saveInfo")}
              className="w-[18px] h-[18px] accent-[#C9A84C]"
            />
            <span className="text-[15px] text-[#888]">
              {t.checkoutForm.saveInfo}
            </span>
          </label>
        </div>
      </div>

      {/* ── Shipping ── */}
      <div>
        <SectionLabel>{t.checkoutForm.shippingMethod}</SectionLabel>
        <div className="flex items-center justify-between bg-white border-2 border-[#DDD8CC] rounded-[10px] px-[18px] py-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[16px] font-semibold text-[#1a1a1a]">
              {t.checkoutForm.shippingDays}
            </span>
            <span className="text-[13px] text-[#aaa]">
              {isArabic ? "٣–٥ أيام عمل" : "3–5 business days"}
            </span>
          </div>
          <span className="text-[18px] font-bold text-[#C9A84C]">
            EGP {SHIPPING}.00
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
          {...register("payment")}
        />
        <RadioCard
          label={t.checkoutForm.card}
          value="paymob"
          checked={payment === "paymob"}
          {...register("payment")}
        >
          <div className="flex items-center gap-1.5">
            <VisaIcon />
            <MastercardIcon />
            <MeezaIcon />
          </div>
        </RadioCard>
      </div>

      {/* ── Billing ── */}
      <div>
        <SectionLabel>{t.checkoutForm.billingAddress}</SectionLabel>
        <RadioCard
          label={t.checkoutForm.billingSame}
          value="same"
          checked={billing === "same"}
          {...register("billing")}
        />
        <RadioCard
          label={t.checkoutForm.billingDifferent}
          value="different"
          checked={billing === "different"}
          {...register("billing")}
        />
      </div>

      {/* ── Submit ── */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className={`w-full h-[58px] rounded-[12px] text-[14px] font-semibold tracking-[2.5px] uppercase transition-all duration-150
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
          href={`/${locale.toLowerCase()}/privacy-policy`}
          className="text-[13px] text-[#bbb] underline underline-offset-[3px] hover:text-[#C9A84C] transition-colors"
        >
          {t.checkoutForm.privacyPolicy}
        </Link>
        <Link
          href={`/${locale.toLowerCase()}/terms`}
          className="text-[13px] text-[#bbb] underline underline-offset-[3px] hover:text-[#C9A84C] transition-colors"
        >
          {t.checkoutForm.terms}
        </Link>
      </div>
    </motion.div>
  );
}
