"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";

type Section = {
  title: string;
  short: string;
  content: string;
  bullets: string[];
  note?: string;
};

function PolicySection({
  section,
  index,
  isArabic,
}: {
  section: Section;
  index: number;
  isArabic: boolean;
}) {
  const [open, setOpen] = useState(index < 2);

  return (
    <motion.div className="border-b border-[#c9a84c1f]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 bg-transparent border-none cursor-pointer text-start"
      >
        <span
          className={` text-[10px] text-[#c8c0d4] text-end ${isArabic ? "-[0px]" : "-[2px]"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`text-[17px] font-normal transition-colors duration-200 ${open ? "text-[#1a1522]" : "text-[#4a4255]"} ${isArabic ? "leading-[1.5]" : "leading-[1.2]"}`}
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
            <div className="ps-12 pe-6 pb-7">
              {section.content && (
                <p
                  className={` text-[15px] text-[#4a4255] whitespace-pre-line ${isArabic ? "leading-[2]" : "leading-[1.85]"} ${section.bullets.length ? "mb-4" : "mb-0"}`}
                >
                  {section.content}
                </p>
              )}

              {section.bullets.length > 0 && (
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {section.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-3">
                      <span className="w-1.25 h-1.25 rounded-full bg-[#c9a84c] opacity-70 flex-shrink-0 mt-2" />
                      <span
                        className={` text-[15px] text-[#4a4255] ${isArabic ? "leading-[2]" : "leading-[1.8]"}`}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {section.note && (
                <div className="mt-4 px-4 py-[13px] bg-[#c9a84c0f] border border-[#c9a84c2e] border-s-[3px] border-s-[#c9a84c] rounded-[3px]">
                  <p
                    className={` text-sm text-[#4a4255] m-0 ${isArabic ? "leading-[2]" : "leading-[1.75]"}`}
                  >
                    {section.note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  const { t, isArabic, dir } = useTranslation();
  const sections: Section[] = t.privacyPolicy.sections;

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
            className="py-11 md:py-[52px] mb-2 border-b border-[#c9a84c1f]"
          >
            <span className=" text-[10px] -[4px] uppercase text-[#c9a84c] block mb-2.5">
              Misk Fragrances
            </span>
            <h1
              className={`-display text-3xl md:text-5xl font-normal text-[#1a1522] mb-3 ${isArabic ? "leading-[1.4]" : "leading-[1.1]"}`}
            >
              {t.privacyPolicy.title}
            </h1>
            <p
              className={` text-[13px] text-[#c8c0d4] mb-6 ${isArabic ? "-[0px]" : "-[0.3px]"}`}
            >
              {t.privacyPolicy.lastUpdated}
            </p>
            <p
              className={` text-[15.5px] text-[#4a4255] max-w-[600px] ${isArabic ? "leading-[2]" : "leading-[1.85]"}`}
            >
              {t.privacyPolicy.intro}
            </p>
            <p
              className={` text-[15px] text-[#8a7f99] mt-3 ${isArabic ? "leading-[2]" : "leading-[1.8]"}`}
            >
              {t.privacyPolicy.acknowledge}
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
          >
            {sections.map((s, i) => (
              <PolicySection
                key={i}
                section={s}
                index={i}
                isArabic={isArabic}
              />
            ))}
          </motion.div>

          {/* Footer callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-12 px-7 py-6 bg-[#faf9fc] border border-[#c9a84c1f] rounded-[3px] flex items-start gap-3.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p
              className={` text-sm text-[#8a7f99] m-0 ${isArabic ? "leading-[2]" : "leading-[1.8]"}`}
            >
              {t.privacyPolicy.contactNote}
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
