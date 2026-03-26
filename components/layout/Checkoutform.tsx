"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/Usetranslation";
import { CheckoutFormValues } from "@/type/type";
import { checkoutSchema } from "@/utils/validation";

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
]

/* ── Reusable field ── */
function Field({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <input
        {...props}
        className={`w-full h-[44px] px-[14px] text-[14px] text-gray-800 bg-white outline-none rounded-[6px] border transition-colors
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#d0d0d0] focus:border-[#1a4fe0]"
          }`}
      />
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
/* ── CheckoutForm ── */
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
      className="flex-1 flex flex-col gap-6"
      dir={dir}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Contact */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className=" font-semibold text-gray-900 text-[16px]">
            {t.checkoutForm.contact}
          </h2>
          <Link
            href={`/${locale.toLowerCase()}/login`}
            className=" text-blue-600 hover:underline text-[13px]"
          >
            {t.checkoutForm.signIn}
          </Link>
        </div>
        <Field
          placeholder={t.checkoutForm.emailPlaceholder}
          type="email"
          error={translatedErrors.email}
          {...register("email")}
        />
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("newsEmail")}
            className="w-[14px] h-[14px] accent-[#1a4fe0]"
          />
          <span className=" text-gray-600 text-[13px]">
            {t.checkoutForm.newsEmail}
          </span>
        </label>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className=" font-semibold text-gray-900 text-[16px] mb-4">
          {t.checkoutForm.delivery}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="h-[44px] px-[14px] border border-[#d0d0d0] rounded-[6px] flex items-center justify-between">
            <span className=" text-gray-800 text-[14px]">
              {t.checkoutForm.country}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#888"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              placeholder={t.checkoutForm.firstName}
              error={translatedErrors.firstName}
              {...register("firstName")}
            />
            <Field
              placeholder={t.checkoutForm.lastName}
              error={translatedErrors.lastName}
              {...register("lastName")}
            />
          </div>
          <Field
            placeholder={t.checkoutForm.address}
            error={translatedErrors.address}
            {...register("address")}
          />
          <Field placeholder={t.checkoutForm.apt} {...register("apt")} />
          <div className="grid grid-cols-3 gap-3">
            <Field
              placeholder={t.checkoutForm.city}
              error={translatedErrors.city}
              {...register("city")}
            />
            <select
              {...register("gov")}
              className=" text-[14px] text-gray-800 bg-white outline-none h-[44px] px-[14px] border border-[#d0d0d0] rounded-[6px] appearance-none cursor-pointer focus:border-[#1a4fe0] transition-colors"
            >
              {governorates.map((g, i) => (
                <option key={g} value={g}>
                  {govList[i]}
                </option>
              ))}
            </select>
            <Field
              placeholder={t.checkoutForm.postalCode}
              {...register("postal")}
            />
          </div>
          <Field
            placeholder={t.checkoutForm.phone}
            type="tel"
            error={translatedErrors.phone}
            {...register("phone")}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("saveInfo")}
              className="w-[14px] h-[14px] accent-[#1a4fe0]"
            />
            <span className=" text-gray-600 text-[13px]">
              {t.checkoutForm.saveInfo}
            </span>
          </label>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className=" font-semibold text-gray-900 text-[16px] mb-3">
          {t.checkoutForm.shippingMethod}
        </h2>
        <div className="flex items-center justify-between border-2 border-[#1a4fe0] rounded-[6px] p-[12px_16px] bg-[#f0f4ff]">
          <span className=" text-gray-800 text-[14px]">
            {t.checkoutForm.shippingDays}
          </span>
          <span className=" text-gray-800 font-medium text-[14px]">
            EGP £{SHIPPING}.00
          </span>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className=" font-semibold text-gray-900 text-[16px] mb-1">
          {t.checkoutForm.payment}
        </h2>
        <p className=" text-gray-400 text-[12px] mb-3.5">
          {t.checkoutForm.paymentSecure}
        </p>
        <div className="flex flex-col gap-2">
          <label
            className={`flex items-center gap-3 cursor-pointer rounded-lg p-[14px_16px] border-2 transition-all
              ${payment === "cod" ? "border-[#1a4fe0] bg-[#f0f4ff]" : "border-[#d0d0d0] bg-white"}`}
          >
            <input
              type="radio"
              value="cod"
              {...register("payment")}
              className="accent-[#1a4fe0]"
            />
            <span className=" text-gray-800 text-[14px]">
              {t.checkoutForm.cod}
            </span>
          </label>
          <label
            className={`flex items-center justify-between gap-3 cursor-pointer rounded-lg p-[14px_16px] border-2 transition-all
              ${payment === "paymob" ? "border-[#1a4fe0] bg-[#f0f4ff]" : "border-[#d0d0d0] bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                value="paymob"
                {...register("payment")}
                className="accent-[#1a4fe0]"
              />
              <span className=" text-gray-800 text-[14px]">
                {t.checkoutForm.card}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { name: "VISA", image: "/Visa.svg" },
                { name: "MasterCard", image: "/Mastercard.svg" },
                { name: "Meeza", image: "/Meeza.svg" },
              ].map((c) => (
                <img
                  key={c.name}
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-5 object-contain"
                />
              ))}
            </div>
          </label>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-white rounded-lg p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <h2 className=" font-semibold text-gray-900 text-[16px] mb-3">
          {t.checkoutForm.billingAddress}
        </h2>
        <div className="flex flex-col gap-2">
          {(
            [
              { value: "same", label: t.checkoutForm.billingSame },
              { value: "different", label: t.checkoutForm.billingDifferent },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 cursor-pointer rounded-lg p-[14px_16px] border-2 transition-all
                ${billing === opt.value ? "border-[#1a4fe0] bg-[#f0f4ff]" : "border-[#d0d0d0] bg-white"}`}
            >
              <input
                type="radio"
                value={opt.value}
                {...register("billing")}
                className="accent-[#1a4fe0]"
              />
              <span className=" text-gray-800 text-[14px]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
        className={`w-full h-[52px] rounded-[26px]  font-semibold text-white text-[15px] cursor-pointer transition-all
          ${loading ? "bg-[#555] cursor-not-allowed" : "bg-[#1a4fe0] hover:opacity-90"}`}
      >
        {loading
          ? t.checkoutForm.processing
          : payment === "paymob"
            ? t.checkoutForm.payWithCard
            : t.checkoutForm.completeOrder}
      </motion.button>

      <div className="flex gap-4 justify-center pb-4">
        <Link
          href={`/${locale.toLowerCase()}/privacy-policy`}
          className=" text-blue-600 hover:underline text-[12px]"
        >
          {t.checkoutForm.privacyPolicy}
        </Link>
        <Link
          href={`/${locale.toLowerCase()}/terms`}
          className=" text-blue-600 hover:underline text-[12px]"
        >
          {t.checkoutForm.terms}
        </Link>
      </div>
    </motion.div>
  );
}
