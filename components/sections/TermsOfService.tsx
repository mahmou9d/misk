"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";

type Section = {
  short: string;
  title: string;
  content: string;
  bullets: string[];
};

function TermSection({
  section,
  index,
  defaultOpen,
  isArabic,
}: {
  section: Section;
  index: number;
  defaultOpen: boolean;
  isArabic: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div className="border-b border-[#c9a84c1f]">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full grid items-center gap-4 py-[22px] bg-transparent border-none cursor-pointer ${
          isArabic
            ? "grid-cols-[auto_1fr_36px] text-right"
            : "grid-cols-[36px_1fr_auto] text-left"
        }`}
      >
        {!isArabic && (
          <span className=" text-[10px] -[1.5px] text-[#c8c0d4] text-right">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <span
          className={` text-[16.5px] font-normal transition-colors duration-200 ${
            open ? "text-[#1a1522]" : "text-[#4a4255]"
          }`}
        >
          {section.title}
        </span>

        <motion.svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c8c0d4"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>

        {isArabic && (
          <span className=" text-[10px] -[1.5px] text-[#c8c0d4] text-left">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden"
          >
            <div className="ps-[52px] pe-6 pb-[26px]">
              {section.content && (
                <p
                  className={` text-[15px] text-[#4a4255] whitespace-pre-line leading-[1.85] ${
                    section.bullets.length ? "mb-3.5" : "mb-0"
                  }`}
                >
                  {section.content}
                </p>
              )}
              {section.bullets.length > 0 && (
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {section.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3">
                      <span className="w-1.25 h-1.25 rounded-full bg-[#c9a84c] opacity-70 flex-shrink-0 mt-2" />
                      <span className=" text-[15px] text-[#4a4255] leading-[1.8]">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TermsOfService() {
  const { t, isArabic, dir } = useTranslation();
  const [allOpen, setAllOpen] = useState(false);
  const [key, setKey] = useState(0);

  const sections: Section[] = t.termsOfService.sections;

  const handleToggleAll = () => {
    setAllOpen((v) => !v);
    setKey((k) => k + 1);
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <section dir={dir} className="bg-[#fefefe] min-h-[80vh] pb-[100px]">
        <div className="max-w-screen-md mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-11 md:py-[52px] border-b border-[#c9a84c1f] mb-2"
          >
            <span className=" text-[10px] -[4px] uppercase text-[#c9a84c] block mb-2.5">
              Misk Fragrances
            </span>
            <h1 className="-display text-[clamp(28px,4vw,48px)] font-normal text-[#1a1522] mb-3 leading-[1.1]">
              {t.termsOfService.title}
            </h1>
            <p className=" text-[13px] text-[#c8c0d4] -[0.3px] mb-6">
              {t.termsOfService.effectiveDate}
            </p>
            <p className=" text-[15.5px] text-[#4a4255] leading-[1.85] max-w-[600px]">
              {t.termsOfService.intro}
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            key={key}
            variants={{ show: { transition: { staggerChildren: 0.03 } } }}
            initial="hidden"
            animate="show"
          >
            {sections.map((s, i) => (
              <TermSection
                key={`${key}-${i}`}
                section={s}
                index={i}
                defaultOpen={allOpen || i < 1}
                isArabic={isArabic}
              />
            ))}
          </motion.div>

        </div>
      </section>
      <Footer />
    </>
  );
}
