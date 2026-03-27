"use client";

import { useTranslation } from "@/lib/Usetranslation";
import { ClockIcon, CloseIcon, ExternalIcon } from "@/public/svg/Svgs";
import Link from "next/link";
import { motion } from "framer-motion";

export type DayHours = {
  day: string;
  hours: string | null;
};

export type LocationInfo = {
  name: string;
  subtitle?: string;
  mapsEmbedUrl: string;
  mapsLink: string;
};

const hours: DayHours[] = [
  { day: "Monday", hours: "10:00 – 5:00" },
  { day: "Tuesday", hours: "10:00 – 5:00" },
  { day: "Wednesday", hours: "10:00 – 5:00" },
  { day: "Thursday", hours: "10:00 – 5:00" },
  { day: "Friday", hours: null },
  { day: "Saturday", hours: "10:00 – 5:00" },
  { day: "Sunday", hours: "10:00 – 5:00" },
];

const location: LocationInfo = {
  name: "Misk Perfume",
  subtitle: "Luxury Fragrance Boutique",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.837965665883!2d31.334701300000006!3d30.012808700000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f004e95849d%3A0xefa8e55d061e7dbd!2sMisk%20perfume!5e0!3m2!1sen!2seg!4v1773615852668!5m2!1sen!2seg",

  mapsLink: "https://maps.app.goo.gl/vZoFbskpxgDEHgfq6?g_st=iwb",
};

function Dot({ closed }: { closed: boolean }) {
  return (
    <div
      className={`w-11 h-11 rounded-[14px] flex-shrink-0 flex items-center justify-center border transition-all duration-300
        ${
          closed
            ? "bg-red-50 border-red-100 text-red-500"
            : "bg-[#c9a84c0a] border-[#c9a84c1a] text-[#c9a84c]"
        }`}
    >
      {closed ? <CloseIcon /> : <ClockIcon />}
    </div>
  );
}

export function BusinessHoursLocation() {
  const { t, isArabic: isRTL } = useTranslation();

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full bg-white py-24">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* ── Left: Business Hours (Takes 5 columns) ── */}
          <section className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-[#111] text-4xl font-bold -tight">
                {t.businessHours.title}
              </h2>
            </motion.div>

            <div className="space-y-3">
              {hours.map(({ day, hours: h }, i) => {
                const closed = h === null;
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-4 p-4 rounded-[20px] border transition-all duration-300 group hover:shadow-md
                      ${
                        closed
                          ? "bg-gray-50/50 border-transparent opacity-60"
                          : "bg-white border-gray-100 hover:border-[#c9a84c33]"
                      }`}
                  >
                    <Dot closed={closed} />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-[15px] font-bold text-[#111]">
                          {
                            t.businessHours.days[
                              day as keyof typeof t.businessHours.days
                            ]
                          }
                        </p>
                        <p
                          className={`text-[13px] font-medium mt-0.5 ${closed ? "text-red-500" : "text-gray-400"}`}
                        >
                          {closed ? t.businessHours.closed : h}
                        </p>
                      </div>
                      {!closed && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── Right: Location & Map (Takes 7 columns) ── */}
          <section className="lg:col-span-7 h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[32px] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col h-full"
            >
              {/* Map Container */}
              <div className="relative w-full aspect-video lg:aspect-square lg:flex-1 min-h-[400px]">
                <iframe
                  src={location.mapsEmbedUrl}
                  className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Map Info Bar */}
              <div className="p-8 bg-white flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h3 className="text-xl font-bold text-[#111] mb-1">
                    {location.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium -wide italic">
                    {location.subtitle}
                  </p>
                </div>

                <Link
                  href={location.mapsLink}
                  target="_blank"
                  className="flex items-center gap-3 bg-[#111] text-white px-8 py-4 rounded-full text-[14px] font-bold hover:bg-[#c9a84c] transition-all duration-300 shadow-lg shadow-black/10 active:scale-95"
                >
                  <ExternalIcon />
                  {t.businessHours.openInMaps}
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
