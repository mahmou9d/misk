"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";
import { X } from "lucide-react";

export function PaymentMethodModal({
  phone,
  onWallet,
  onCard,
  onClose,
  loading,
}: {
  phone: string;
  onWallet: (walletNumber: string) => void;
  onCard: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const { t, dir } = useTranslation();
  const p = t.paymentModal;

  const [method, setMethod] = useState<"card" | "wallet" | null>(null);
  const [walletNumber, setWalletNumber] = useState(phone);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        className="bg-white rounded-xl flex flex-col w-[min(440px,95vw)] p-[28px_28px_24px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        dir={dir}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3
            id="payment-modal-title"
            className=" font-semibold text-gray-900 text-[17px]"
          >
            {p.title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="bg-none border-none cursor-pointer text-[20px] text-[#aaa] leading-none hover:text-gray-600 transition-colors"
          >
            <X />
          </button>
        </div>

        <div
          className="flex flex-col gap-3 mb-5"
          role="radiogroup"
          aria-labelledby="payment-modal-title"
        >
          {/* Card Option */}
          <label
            htmlFor="method-card"
            className={`flex items-center justify-between gap-3 cursor-pointer rounded-lg p-[14px_16px] border-2 transition-all duration-200
              ${method === "card" ? "border-[#1a4fe0] bg-[#f0f4ff]" : "border-[#d0d0d0] bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <input
                id="method-card"
                type="radio"
                name="pm"
                value="card"
                checked={method === "card"}
                onChange={() => setMethod("card")}
                className="accent-[#1a4fe0]"
              />
              <span className=" text-gray-800 text-[14px]">{p.creditCard}</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { name: "/Visa.svg" },
                { name: "/Mastercard.svg" },
                { name: "/Meeza.svg" },
              ].map((c) => (
                <Image
                  key={c.name}
                  className=" font-bold text-white"
                  width={30}
                  height={20}
                  src={c.name}
                  loading="lazy"
                  alt="Cards"
                />
              ))}
            </div>
          </label>

          {/* Wallet Option */}
          <label
            htmlFor="method-wallet"
            className={`flex flex-col gap-0 cursor-pointer rounded-lg p-[14px_16px] border-2 transition-all duration-200
              ${method === "wallet" ? "border-[#1a4fe0] bg-[#f0f4ff]" : "border-[#d0d0d0] bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <input
                id="method-wallet"
                type="radio"
                name="pm"
                value="wallet"
                checked={method === "wallet"}
                onChange={() => setMethod("wallet")}
                className="accent-[#1a4fe0]"
              />
              <span className=" text-gray-800 text-[14px]">
                {p.mobileWallet}
              </span>
              <span className="text-[11px] text-[#888]">
                {p.walletProviders}
              </span>
            </div>
            <AnimatePresence>
              {method === "wallet" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <input
                    aria-label={p.walletPlaceholder}
                    type="tel"
                    placeholder={p.walletPlaceholder}
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    className=" text-gray-800 bg-white outline-none w-full h-10 border border-[#d0d0d0] rounded-md px-3 text-[13px] mt-3 focus:border-[#1a4fe0] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={
            !method || loading || (method === "wallet" && !walletNumber.trim())
          }
          onClick={() => {
            if (method === "card") onCard();
            else if (method === "wallet") onWallet(walletNumber);
          }}
          className={`w-full h-12 rounded-[24px]  font-semibold text-white text-[14px] transition-colors duration-200
            ${
              !method || loading
                ? "bg-[#aaa] cursor-not-allowed"
                : "bg-[#1a4fe0] cursor-pointer hover:bg-[#1644c1]"
            }`}
        >
          {loading ? p.processing : p.confirmPay}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
