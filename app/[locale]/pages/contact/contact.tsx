// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import AnnouncementBar from "@/components/layout/AnnouncementBar";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/sections/Footer";

// /* ── Design Tokens (matches brand) ── */
// const T = {
//   gold: "rgba(201,168,76,1)",
//   goldMid: "rgba(201,168,76,0.45)",
//   goldFaint: "rgba(201,168,76,0.07)",
//   goldSoft: "rgba(201,168,76,0.18)",
//   purple: "#2d1b69",
//   purpleLight: "#4a2d9e",
//   ink: "#1a1522",
//   inkMid: "#4a4255",
//   inkLight: "#8a7f99",
//   inkFaint: "#c8c0d4",
//   border: "rgba(201,168,76,0.18)",
//   borderFocus: "rgba(201,168,76,0.55)",
//   bg: "#fefefe",
//   bgWarm: "#faf9fc",
//   serifDisplay: "'Playfair Display', Georgia, serif",
//   serif: "'Cormorant Garamond', Georgia, serif",
//   radius: "3px",
// };

// /* ── Fancy Input ── */
// function Field({
//   label,
//   type = "text",
//   value,
//   onChange,
//   required,
//   multiline,
//   rows = 5,
// }: {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => void;
//   required?: boolean;
//   multiline?: boolean;
//   rows?: number;
// }) {
//   const [focused, setFocused] = useState(false);
//   const filled = value.length > 0;

//   const base: React.CSSProperties = {
//     width: "100%",
//     fontFamily: T.serif,
//     fontSize: 15,
//     padding: multiline ? "22px 16px 10px" : "0 16px",
//     height: multiline ? "auto" : 52,
//     background: focused ? "#fff" : T.bgWarm,
//     border: `1.5px solid ${focused ? T.borderFocus : T.border}`,
//     borderRadius: T.radius,
//     outline: "none",
//     color: T.ink,
//     resize: multiline ? "vertical" : undefined,
//     transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
//     boxShadow: focused ? `0 4px 20px rgba(201,168,76,0.1)` : "none",
//     letterSpacing: "0.2px",
//     display: "block",
//   };

//   const Tag = multiline ? "textarea" : "input";

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Floating label */}
//       <motion.label
//         animate={{
//           top: focused || filled ? (multiline ? 8 : 8) : multiline ? 18 : "50%",
//           y: focused || filled ? 0 : multiline ? 0 : "-50%",
//           fontSize: focused || filled ? 9 : 14,
//           color: focused ? T.gold : filled ? T.inkLight : T.inkFaint,
//           letterSpacing: focused || filled ? "2.5px" : "0.3px",
//         }}
//         transition={{ duration: 0.18 }}
//         style={{
//           position: "absolute",
//           left: 17,
//           pointerEvents: "none",
//           fontFamily: T.serif,
//           textTransform: focused || filled ? "uppercase" : "none",
//           zIndex: 1,
//           transformOrigin: "left center",
//         }}
//       >
//         {label}
//         {required && <span style={{ color: T.gold, marginLeft: 2 }}>*</span>}
//       </motion.label>

//       <Tag
//         type={type as any}
//         value={value}
//         onChange={onChange}
//         rows={multiline ? rows : undefined}
//         onFocus={() => setFocused(true)}
//         onBlur={() => setFocused(false)}
//         style={base}
//       />
//     </div>
//   );
// }

// /* ── Contact Info Item ── */
// function InfoItem({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
//       <div
//         style={{
//           width: 36,
//           height: 36,
//           borderRadius: "50%",
//           flexShrink: 0,
//           background: T.goldFaint,
//           border: `1px solid ${T.goldSoft}`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: T.gold,
//           marginTop: 1,
//         }}
//       >
//         {icon}
//       </div>
//       <div>
//         <p
//           style={{
//             fontFamily: T.serif,
//             fontSize: 9,
//             letterSpacing: "3px",
//             textTransform: "uppercase",
//             color: T.inkFaint,
//             marginBottom: 3,
//           }}
//         >
//           {label}
//         </p>
//         <p
//           style={{
//             fontFamily: T.serif,
//             fontSize: 14.5,
//             color: T.inkMid,
//             lineHeight: 1.5,
//           }}
//         >
//           {value}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ════════════════════════════════════════ */
// export default function ContactForm() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     comment: "",
//   });
//   const [sent, setSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const set =
//     (k: string) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//       setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSend = async () => {
//     if (!form.email) return;
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 800));
//     setLoading(false);
//     setSent(true);
//     setForm({ name: "", email: "", phone: "", comment: "" });
//     setTimeout(() => setSent(false), 4000);
//   };

//   return (
//     <>
//       <AnnouncementBar />
//       <Navbar />

//       <section
//         style={{ background: T.bg, minHeight: "80vh", padding: "0 0 100px" }}
//       >
//         <div className="max-w-screen-lg mx-auto" style={{ padding: "0 24px" }}>
//           {/* ── Page Header ── */}
//           <motion.div
//             initial={{ opacity: 0, y: 14 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             style={{
//               padding: "52px 0 44px",
//               borderBottom: `1px solid ${T.border}`,
//               marginBottom: 52,
//             }}
//           >
//             <span
//               style={{
//                 fontFamily: T.serif,
//                 fontSize: 10,
//                 letterSpacing: "4px",
//                 textTransform: "uppercase",
//                 color: T.gold,
//                 display: "block",
//                 marginBottom: 10,
//               }}
//             >
//               Get in touch
//             </span>
//             <h1
//               style={{
//                 fontFamily: T.serifDisplay,
//                 fontSize: "clamp(32px,4vw,52px)",
//                 fontWeight: 400,
//                 color: T.ink,
//                 margin: 0,
//                 lineHeight: 1.1,
//               }}
//             >
//               Contact Us
//             </h1>
//           </motion.div>

//           {/* ── Two-column layout ── */}
//           <div
//             className="grid grid-cols-1 lg:grid-cols-5"
//             style={{ gap: "48px 72px", alignItems: "start" }}
//           >
//             {/* ── Left: Info panel (2 cols) ── */}
//             <motion.div
//               initial={{ opacity: 0, x: -16 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{
//                 duration: 0.45,
//                 delay: 0.1,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="lg:col-span-2 block md:sticky"
//               style={{  top: 36 }}
//             >
//               <p
//                 style={{
//                   fontFamily: T.serif,
//                   fontSize: 15,
//                   color: T.inkMid,
//                   lineHeight: 1.8,
//                   marginBottom: 36,
//                 }}
//               >
//                 We&apos;d love to hear from you. Reach out for enquiries about our
//                 fragrances, custom orders, or anything else.
//               </p>

//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 24 }}
//               >
//                 <InfoItem
//                   icon={
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.8"
//                       strokeLinecap="round"
//                     >
//                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                       <polyline points="22,6 12,13 2,6" />
//                     </svg>
//                   }
//                   label="Email"
//                   value="Misk@gmail.com"
//                 />
//                 <InfoItem
//                   icon={
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.8"
//                       strokeLinecap="round"
//                     >
//                       <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
//                     </svg>
//                   }
//                   label="Phone"
//                   value="01000000000"
//                 />
//                 <InfoItem
//                   icon={
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.8"
//                       strokeLinecap="round"
//                     >
//                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
//                       <circle cx="12" cy="10" r="3" />
//                     </svg>
//                   }
//                   label="Location"
//                   value="Cairo, Egypt"
//                 />
//               </div>

//               {/* Decorative divider */}
//               <div
//                 style={{
//                   marginTop: 40,
//                   height: 1,
//                   background: `linear-gradient(90deg, ${T.gold}, transparent)`,
//                   opacity: 0.3,
//                 }}
//               />
//             </motion.div>

//             {/* ── Right: Form (3 cols) ── */}
//             <motion.div
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.5,
//                 delay: 0.18,
//                 ease: [0.22, 1, 0.36, 1],
//               }}
//               className="lg:col-span-3"
//             >
//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 14 }}
//               >
//                 {/* Name + Email row */}
//                 <div
//                   className="grid grid-cols-1 sm:grid-cols-2"
//                   style={{ gap: 14 }}
//                 >
//                   <Field
//                     label="Name"
//                     value={form.name}
//                     onChange={set("name")}
//                   />
//                   <Field
//                     label="Email"
//                     type="email"
//                     value={form.email}
//                     onChange={set("email")}
//                     required
//                   />
//                 </div>

//                 <Field
//                   label="Phone number"
//                   type="tel"
//                   value={form.phone}
//                   onChange={set("phone")}
//                 />

//                 <Field
//                   label="Comment"
//                   value={form.comment}
//                   onChange={set("comment")}
//                   multiline
//                   rows={6}
//                 />

//                 {/* Submit */}
//                 <div
//                   style={{
//                     marginTop: 6,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 16,
//                   }}
//                 >
//                   <motion.button
//                     onClick={handleSend}
//                     disabled={loading || !form.email}
//                     whileTap={{ scale: 0.97 }}
//                     style={{
//                       padding: "13px 36px",
//                       background: form.email
//                         ? `linear-gradient(135deg, ${T.purple}, ${T.purpleLight})`
//                         : "rgba(0,0,0,0.06)",
//                       border: "none",
//                       borderRadius: T.radius,
//                       cursor: form.email ? "pointer" : "not-allowed",
//                       fontFamily: T.serif,
//                       fontSize: 12,
//                       letterSpacing: "3px",
//                       textTransform: "uppercase",
//                       color: form.email ? "#fff" : T.inkFaint,
//                       boxShadow: form.email
//                         ? `0 4px 20px rgba(45,27,105,0.22)`
//                         : "none",
//                       transition: "all 0.25s",
//                     }}
//                     onMouseEnter={(e) => {
//                       if (form.email)
//                         (e.currentTarget as any).style.opacity = "0.88";
//                     }}
//                     onMouseLeave={(e) => {
//                       (e.currentTarget as any).style.opacity = "1";
//                     }}
//                   >
//                     {loading ? (
//                       <span
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 8,
//                         }}
//                       >
//                         <motion.span
//                           animate={{ rotate: 360 }}
//                           transition={{
//                             repeat: Infinity,
//                             duration: 0.8,
//                             ease: "linear",
//                           }}
//                           style={{
//                             display: "inline-block",
//                             width: 12,
//                             height: 12,
//                             border: "1.5px solid rgba(255,255,255,0.4)",
//                             borderTopColor: "#fff",
//                             borderRadius: "50%",
//                           }}
//                         />
//                         Sending
//                       </span>
//                     ) : (
//                       "Send Message"
//                     )}
//                   </motion.button>

//                   {/* Success message */}
//                   <AnimatePresence>
//                     {sent && (
//                       <motion.span
//                         initial={{ opacity: 0, x: -8 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0 }}
//                         style={{
//                           fontFamily: T.serif,
//                           fontSize: 13,
//                           color: T.gold,
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 6,
//                         }}
//                       >
//                         <svg
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                         >
//                           <polyline points="20 6 9 17 4 12" />
//                         </svg>
//                         Message sent
//                       </motion.span>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <p
//                   style={{
//                     fontFamily: T.serif,
//                     fontSize: 11,
//                     color: T.inkFaint,
                    // letterSpacing: "0.3px",
//                     marginTop: 2,
//                   }}
//                 >
//                   Fields marked with <span style={{ color: T.gold }}>*</span>{" "}
//                   are required.
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </>
//   );
// }
