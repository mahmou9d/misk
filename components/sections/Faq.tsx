// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTranslation } from "@/lib/Usetranslation";
// import { IconEqual } from "@/public/svg/Svgs";

// function FAQItem({
//   q,
//   a,
//   index,
//   isArabic,
// }: {
//   q: string;
//   a: string;
//   index: number;
//   isArabic: boolean;
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         delay: index * 0.07,
//         duration: 0.4,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className="border-b border-[rgba(201,168,76,0.15)] transition-colors duration-250"
//     >
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className={`w-full flex items-center justify-between py-[22px] px-6 gap-4 text-start transition-colors duration-250
//         ${open ? "bg-[rgba(201,168,76,0.03)]" : "bg-transparent"}`}
//       >
//         <div className="flex items-center gap-4">
//           {/* Gold number */}
//           <span
//             className={` text-[12px] font-medium text-[rgba(201,168,76,0.6)] min-w-[20px] shrink-0
//             ${isArabic ? "-0" : "-[1px]"}`}
//           >
//             {String(index + 1).padStart(2, "0")}
//           </span>

//           <span
//             className={` text-[clamp(15px,2vw,18px)] transition-colors duration-250
//             ${open ? "text-[#1a0a3d] font-medium" : "text-[#1a1a1a] font-normal"}
//             ${isArabic ? "leading-[1.6]" : "leading-[1.4]"}`}
//           >
//             {q}
//           </span>
//         </div>

//         {/* Plus / Minus toggle */}
//         <div
//           className={`shrink-0 flex items-center justify-center w-7 h-7 border rounded-full transition-all duration-250
//           ${open ? "border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.08)]" : "border-[rgba(0,0,0,0.15)] bg-transparent"}`}
//         >
//           <IconEqual open={open} />
//         </div>
//       </button>

//       <AnimatePresence initial={false}>
//         {open && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="overflow-hidden"
//           >
//             <div className="ps-[60px] pe-6 pb-6 mt-5">
//               <div className="border-s-2 border-[rgba(201,168,76,0.35)] ps-4">
//                 <p
//                   className={` text-[15px] text-[#666] font-normal
//                   ${isArabic ? "leading-[2]" : "leading-[1.8]"}`}
//                 >
//                   {a}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// export default function FAQ() {
//   const { t, isArabic, dir } = useTranslation();

//   return (
//     <section className="w-full bg-white py-[60px] pb-20" dir={dir}>
//       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col items-center mb-12"
//         >
//           <span
//             className={` text-[20px] text-[rgba(201,168,76,0.8)] mb-[10px]
//             ${isArabic ? "-0 normal-case" : "-[5px] uppercase"}`}
//           >
//             {t.faq.eyebrow}
//           </span>
//           <h2
//             className={` text-gray-900 text-center text-[clamp(24px,3vw,38px)] font-medium
//             ${isArabic ? "leading-[1.5]" : "leading-[1.15]"}`}
//           >
//             {t.faq.title}
//           </h2>
//           <div className="mt-3 h-[1px] w-12 bg-[linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)]" />
//         </motion.div>

//         {/* FAQ list */}
//         <div className="mx-auto max-w-[760px] border-t border-[rgba(201,168,76,0.15)]">
//           {t.faq.items.map((f: { q: string; a: string }, i: number) => (
//             <FAQItem key={i} q={f.q} a={f.a} index={i} isArabic={isArabic} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
