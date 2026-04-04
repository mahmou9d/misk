"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";


const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

const icons = [
  {
    Icon: FacebookIcon,
    href: "https://www.facebook.com/people/Misk-Perfume/100064094529573/",
    label: "Facebook",
  },
  {
    Icon: InstagramIcon,
    href: "https://www.instagram.com/misk_perfum2",
    label: "Instagram",
  },
  {
    Icon: TikTokIcon,
    href: "https://www.tiktok.com/@misk5579",
    label: "TikTok",
  },
  {
    Icon: WhatsAppIcon,
    href: "https://api.whatsapp.com/send?phone=201123022028&token=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyNSJ9.eyJleHAiOjE3NzUwNzgzNTEsInBob25lIjoiMjAxMTIzMDIyMDI4IiwidGV4dCI6IiIsImNvbnRleHQiOiJBZmdDdEw4ZVV5RlIwWEk1QmlwTHdFelcyMnh0ZzZmYXVvSEtoUmtpZTFKR2xGN1JZd29oLVZTRm1KdU9Da2ZOS01KNTVPN1AyNnBGSk42ckV2NmJVYjcteUFsZmVWMGQyYjVFN2wyd0NRVHhsSWstWWd1eGFfQXdSYzFSRjJWeHBPVlB1cl94ZDlKeTBwaTl0QSIsInNvdXJjZSI6IiIsImFwcCI6ImZhY2Vib29rIn0.p0oAwshfcv5TTfTVZWT77NyhhBvlAzSDB5Cj1p6cJVWoH3C9mHzfd5fUGXPj1nDrKk4qwcymgojeXTlwy3Xhbw",
    label: "WhatsApp",
  },
];

export default function Footer() {
  const { t, isArabic, dir, locale } = useTranslation();
const [hovered, setHovered] = useState(null);
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


  return (
    <footer
      className="w-full border-t border-[rgba(201,168,76,0.2)] bg-[linear-gradient(180deg,#ffffff_0%,#faf8ff_100%)]"
      dir={dir}
    >
      {/* Main content */}
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center px-10 pt-[60px] ">
        {/* Logo Section */}
        <div
          className="mb-4"
        >
          <span className="text-[28px] font-bold -[8px] bg-[linear-gradient(135deg,#c9a84c_0%,#f0d080_50%,#b8912e_100%)] bg-clip-text text-transparent drop-shadow-[0_1px_6px_rgba(201,168,76,0.2)]">
            Misk
          </span>
          <div className="mt-[6px] mx-auto h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)]" />
        </div>

        {/* Quick Links Label */}
        <p
          className={`text-[16px] text-[rgba(201,168,76,0.75)] mb-4 
          ${isArabic ? "-0 normal-case" : "-[4px] uppercase"}`}
        >
          {t.footer.quickLinksLabel}
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 mb-4">
          {quickLinks.map((l, i) => (
            <div
              key={l.label}
            >
              <Link
                href={l.href}
                className="group relative inline-block text-[14px] text-[#666] no-underline"
              >
                <span
                  className={`transition-colors duration-200 group-hover:text-[#1a0a3d] ${isArabic ? "-0" : "-[0.3px]"}`}
                >
                  {l.label}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,#1a0a3d,rgba(201,168,76,0.5))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </div>
          ))}
        </nav>
      </div>
<div className="flex justify-center items-center gap-5 py-4">
      {icons.map(({ Icon, href, label }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: hovered === label ? "#6b7280" : "#000",
            transition: "color 0.2s",
          }}
        >
          <Icon />
        </Link>
      ))}
    </div>
      {/* Bottom Bar: Copyright + Payment Icons */}
      <div className="border-t border-[rgba(201,168,76,0.12)] max-w-screen-xl mx-auto px-6 py-3 flex flex-col items-center justify-between gap-3">
        {/* Payment Icons */}
        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 py-2">
          {paymentMethods.map((method, i) => (
            <Image
              key={method.name}
              src={method.src}
              alt={method.name}
              width={20}
              height={20}
              title={method.name}
              className="h-5 w-auto object-contain max-w-[44px]"
            />
          ))}
        </div>
        {/* Copyright + Developer */}
        <div className="flex flex-row items-center gap-4">
          <p
            className={`text-[13px] text-[#aaa] ${isArabic ? "-0" : "-[0.5px]"}`}
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
      </div>
    </footer>
  );
}
