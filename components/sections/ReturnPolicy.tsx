/* eslint-disable @next/next/no-img-element */
"use client";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/Usetranslation";

const icons = [
  <svg
    key="0"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  <svg
    key="1"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>,
  <svg
    key="2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 014-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 01-4 4H3" />
  </svg>,
  <svg
    key="3"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>,
  <svg
    key="4"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>,
];

type Section = {
  title: string;
  content: string;
  bullets: string[];
  note?: string;
  noteType?: string;
};

export default function ReturnPolicy() {
  const { t, isArabic, dir } = useTranslation();
  const sections = t.returnPolicy.sections;

  const IconColumn = ({ i }: { i: number }) => (
    <div className="flex flex-col items-center gap-4 pt-1">
      {/* Container دائري ناعم جداً للأيقونات */}
      <div className="w-12 h-12 rounded-[18px] flex-shrink-0 bg-[#c9a84c0a] border border-[#c9a84c1a] flex items-center justify-center text-[#c9a84c] transition-colors group-hover:bg-[#c9a84c12]">
        {icons[i]}
      </div>
      {i < sections.length - 1 && (
        <div className="w-[1.5px] flex-1 min-h-[40px] bg-gradient-to-b from-[#c9a84c20] via-[#c9a84c10] to-transparent" />
      )}
    </div>
  );

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <section dir={dir} className="bg-white min-h-screen pb-32">
        <div className="max-w-screen-md mx-auto px-6 lg:px-4">
          {/* Header - كبرنا العناوين لتعطي هيبة للصفحة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-24 pb-16 md:pt-32 md:pb-20 border-b border-gray-100 mb-16"
          >
            <span className="text-[12px] font-black tracking-[0.4em] uppercase text-[#c9a84c] block mb-4">
              Misk Fragrances
            </span>
            <h1
              className={`text-[#111] text-[clamp(40px,6vw,64px)] font-bold tracking-tight mb-8 ${isArabic ? "leading-[1.2]" : "leading-[0.95]"}`}
            >
              {t.returnPolicy.title}
            </h1>
            <p
              className={`text-[18px] md:text-[20px] text-gray-500 max-w-[620px] font-medium ${isArabic ? "leading-[1.8]" : "leading-[1.6]"}`}
            >
              {t.returnPolicy.intro}
            </p>
          </motion.div>

          {/* Sections */}
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {sections.map((s: Section, i: number) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0 },
                }}
                className="group relative grid grid-cols-[auto_1fr] gap-x-8 py-10"
              >
                <IconColumn i={i} />

                <div className="pt-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[12px] font-bold text-gray-300 tracking-widest uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className={`text-2xl md:text-3xl font-bold text-[#111] tracking-tight ${isArabic ? "leading-[1.4]" : "leading-none"}`}
                    >
                      {s.title}
                    </h2>
                  </div>

                  {s.content && (
                    <p
                      className={`text-[16px] md:text-[17px] text-gray-600 whitespace-pre-line mb-6 ${isArabic ? "leading-[2]" : "leading-[1.7] font-medium"}`}
                    >
                      {s.content}
                    </p>
                  )}

                  {s.bullets.length > 0 && (
                    <ul className="grid gap-4 mb-6">
                      {s.bullets.map((b: string, bi: number) => (
                        <li key={bi} className="flex items-start gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mt-[10px] shrink-0" />
                          <span
                            className={`text-[16px] text-gray-600 ${isArabic ? "leading-[1.8]" : "leading-[1.6] font-medium"}`}
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.note && (
                    <div
                      className={`p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm ${
                        s.noteType === "warning"
                          ? "bg-[#c9a84c08] border-[#c9a84c15]"
                          : "bg-gray-50/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        {s.noteType === "warning" && (
                          <span className="text-[#c9a84c] font-bold text-lg">
                            !
                          </span>
                        )}
                        <p
                          className={`text-[15px] md:text-[16px] text-gray-700 m-0 ${isArabic ? "leading-[1.9]" : "leading-[1.6] font-semibold italic"}`}
                        >
                          {s.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Note - شكل "Glassmorphism" خفيف */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 md:p-10 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-start"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p
              className={`text-[15px] md:text-[16px] text-gray-500 font-medium m-0 ${isArabic ? "leading-[2]" : "leading-[1.7]"}`}
            >
              {t.returnPolicy.footerNote}{" "}
              <span className="text-[#c9a84c] font-bold uppercase tracking-wider">
                {t.returnPolicy.footerSuffix}
              </span>
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
