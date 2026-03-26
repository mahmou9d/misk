"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";
import { ArrowRight } from "@/public/svg/Svgs";

export default function Footer() {
  const { t, isArabic, dir, locale } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const quickLinks = [
    { label: t.footer.links.search, href: `/${locale.toLowerCase()}/search` },
    { label: t.footer.links.shop, href: `/${locale.toLowerCase()}/shop` },
    {
      label: t.footer.links.returnPolicy,
      href: `/${locale.toLowerCase()}/pages/return-policy`,
    },
    {
      label: t.footer.links.privacyPolicy,
      href: `/${locale.toLowerCase()}/policies/privacy-policy`,
    },
    {
      label: t.footer.links.terms,
      href: `/${locale.toLowerCase()}/policies/terms-of-service`,
    },
  ];

  const paymentMethods = [
    {
      name: "Mastercard",
      src: "/Mastercard.svg",
    },
    {
      name: "Visa",
      src: "/Visa.svg",
    },
    {
      name: "Vodafone Cash",
      src: "/Vodafone.svg",
    },
    {
      name: "WE",
      src: "/We.svg",
    },
    {
      name: "Meeza",
      src: "/Meeza.svg",
    },
    {
      name: "Apple Pay",
      src: "/Apple_Pay.svg",
    },
    {
      name: "Orange",
      src: "/Orange.svg",
    },
    {
      name: "Etisalat",
      src: "/Etisalat.svg",
    },
  ];

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <footer
      className="w-full border-t border-[rgba(201,168,76,0.2)] bg-[linear-gradient(180deg,#ffffff_0%,#faf8ff_100%)]"
      dir={dir}
    >
      {/* Main content */}
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center px-10 pt-[60px] pb-[52px]">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-[28px] font-bold tracking-[8px] bg-[linear-gradient(135deg,#c9a84c_0%,#f0d080_50%,#b8912e_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(201,168,76,0.2)]">
            Misk
          </span>
          <div className="mt-[6px] mx-auto h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)]" />
        </motion.div>

        {/* Quick Links Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={`text-[16px] text-[rgba(201,168,76,0.75)] mb-4 
          ${isArabic ? "tracking-0 normal-case" : "tracking-[4px] uppercase"}`}
        >
          {t.footer.quickLinksLabel}
        </motion.p>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 mb-4">
          {quickLinks.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
            >
              <Link
                href={l.href}
                className="group relative inline-block text-[14px] text-[#666] no-underline"
              >
                <span
                  className={`transition-colors duration-200 group-hover:text-[#1a0a3d] ${isArabic ? "tracking-0" : "tracking-[0.3px]"}`}
                >
                  {l.label}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,#1a0a3d,rgba(201,168,76,0.5))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Bar: Copyright + Payment Icons */}
      <div className="border-t border-[rgba(201,168,76,0.12)] max-w-screen-xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Copyright + Developer */}
        <div className="flex flex-row items-center gap-4">
          <p
            className={`text-[13px] text-[#aaa] ${isArabic ? "tracking-0" : "tracking-[0.5px]"}`}
          >
            © 2026, Misk
          </p>
          <p className="text-[13px] text-[#aaa]">
            {t.footer.developedBy}{" "}
            <Link
              href="https://webvitas.com"
              className="text-inherit no-underline border-b border-[rgba(0,0,0,0.1)] hover:text-[#1a0a3d] hover:border-[#1a0a3d] transition-all duration-200"
            >
              webvitas
            </Link>
          </p>
        </div>

        {/* Payment Icons */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
          {paymentMethods.map((method, i) => (
            <motion.img
              key={method.name}
              src={method.src}
              alt={method.name}
              title={method.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.3 }}
              className="h-5 w-auto object-contain max-w-[44px]"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
