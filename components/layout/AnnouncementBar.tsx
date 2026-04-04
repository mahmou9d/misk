"use client";

import { motion } from "framer-motion";
import { useGetPublicSettings } from "@/hooks/useDashboard";

export default function AnnouncementBar() {
  const { data } = useGetPublicSettings();

  if (!data?.is_announcement_active) return null;

  const text = data.announcement_text;
  const link = data.announcement_link;

  // We repeat the single announcement as multiple items in the marquee
  // so it fills the bar and loops smoothly — same pattern as before
  const REPEATS = 6;

  const content = (
    <>
      {Array.from({ length: REPEATS }).map((_, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span
            className="flex items-center gap-2.5 px-8 font-inter text-white uppercase"
            style={{
              fontSize: 15,
              letterSpacing: "1.5px",
              whiteSpace: "nowrap",
            }}
          >
            <div className="w-5" />
            {/* Gold sparkle icon */}
            <span
              style={{
                filter: "drop-shadow(0 0 5px rgba(201,168,76,0.9))",
              }}
            >
              ✦
            </span>
            <span>{text}</span>
          </span>

          {/* Separator between items */}
          <span
            style={{
              color: "var(--gold)",
              opacity: 0.45,
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ✦
          </span>
        </span>
      ))}
    </>
  );

  const bar = (
    <div
      className="relative w-full overflow-hidden flex items-center"
      style={{
        height: 40,
        background:
          "linear-gradient(90deg, var(--purple-deep) 0%, var(--purple-mid) 50%, #3d2070 100%)",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--purple-deep), transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, var(--purple-deep), transparent)",
        }}
      />

      {/* Marquee — two identical copies so the loop is seamless */}
      <motion.div
        className="flex items-center"
        animate={{ x: "-50%" }}
        transition={{
          duration: 70,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {/* Copy 1 */}
        {content}
        {/* Copy 2 — needed for seamless loop (motion animates to -50%) */}
        {content}
      </motion.div>
    </div>
  );

  // If there's a link, wrap the whole bar in an anchor
  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
        aria-label={text}
      >
        {bar}
      </a>
    );
  }

  return bar;
}
