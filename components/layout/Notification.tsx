"use client";

import { motion, AnimatePresence } from "framer-motion";

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Notification = ({
  message,
  type,
  visible = true,
}: {
  message: string;
  type: "success" | "error";
  visible?: boolean;
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-5 left-1/2 z-[100]"
          role={type === "error" ? "alert" : "status"}
          aria-live={type === "error" ? "assertive" : "polite"}
          style={{ translateX: "-50%" }}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="flex items-center gap-2.5  font-medium text-white"
            style={{
              fontSize: 13.5,
              letterSpacing: "0.1px",
              padding: "11px 20px",
              borderRadius: 40,
              boxShadow:
                type === "success"
                  ? "0 4px 24px rgba(45,27,105,0.22), 0 1px 6px rgba(0,0,0,0.08)"
                  : "0 4px 24px rgba(220,38,38,0.25), 0 1px 6px rgba(0,0,0,0.08)",
              background:
                type === "success" ? "var(--purple-deep, #2d1b69)" : "#dc2626",
            }}
          >
            {type === "success" ? <CheckIcon /> : <ErrorIcon />}
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
