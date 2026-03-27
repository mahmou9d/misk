/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/type/type";
import { getSortOptions } from "@/lib/Products";
import { useTranslation } from "@/lib/Usetranslation";
import Image from "next/image";

/* ── Tailwind Design Tokens (Mapped) ── 
   Gold: #c9a84c (text-[#c9a84c])
   Purple: #2d1b69 (bg-[#2d1b69])
   Ink: #1a1522 (text-[#1a1522])
*/

/* ── Icons ── */
export const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const CloseIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ArrowIcon = ({
  size = 13,
  flipped = false,
}: {
  size?: number;
  flipped?: boolean;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    className={flipped ? "rotate-180" : ""}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const FilterIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

/* ── Skeleton ── */
export function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] mb-[10px] rounded-[3px] border border-[#c9a84c]/10 bg-gradient-to-br from-[#f7f4fb] to-[#ede8f7]" />
      <div className="h-[11px] rounded-[2px] mb-[7px] w-[60%] bg-[#f7f4fb]" />
      <div className="h-[11px] rounded-[2px] w-[38%] bg-[#f0edfa]" />
    </div>
  );
}

/* ── Sidebar Section ── */
export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const { isArabic } = useTranslation();
  // const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        // onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-transparent border-none p-0 pb-[11px]"
      >
        <span
          className={ `{"text-[9px] text-[#8a7f99] ${isArabic ? "tracking-normal normal-case" : "tracking-[3.5px] uppercase"}`}
        >
          {title}
        </span>
        {/* <span className="text-[#c8c0d4]">
          <ChevronDown open={open} />
        </span> */}
      </button>
      <AnimatePresence initial={false}>
        {/* {open && ( */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        {/* )} */}
      </AnimatePresence>
    </div>
  );
}
/* ── Price Sidebar ── */
export function PriceSidebar({ min, max, setMin, setMax }: any) {
  const { t, isArabic } = useTranslation();
  const currency = isArabic ? "ج.م" : "LE";
  return (
    <SidebarSection title={`${t.searchComponents.price} (${currency})`}>
      <div className="flex gap-2">
        {[
          { ph: t.searchComponents.min, v: min, fn: setMin, sym: "≥" },
          { ph: t.searchComponents.max, v: max, fn: setMax, sym: "≤" },
        ].map(({ ph, v, fn, sym }) => (
          <div key={ph} className="flex-1 relative">
            <input
              type="number"
              placeholder={ph}
              value={v}
              onChange={(e) => fn(e.target.value)}
              className="w-full text-[16px] py-2 ps-[22px] pe-2 bg-white rounded-xl border-2 border-[#c9a84c] outline-none text-[#1a1522] transition-colors"
            />
          </div>
        ))}
      </div>
    </SidebarSection>
  );
}

/* ── Shared Sidebar Content ── */
export function SidebarContent({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: any) {
  const { t, isArabic } = useTranslation();
  return (
    <>
      <PriceSidebar
        min={minPrice}
        max={maxPrice}
        setMin={setMinPrice}
        setMax={setMaxPrice}
      />
    </>
  );
}

/* ── Mobile Filter Drawer ── */
export function MobileFilterDrawer({ open, onClose, ...rest }: any) {
  const { t, isArabic } = useTranslation();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1a1522]/45 z-[400] "
          />
          <motion.div
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className={`fixed top-0 bottom-0 w-[290px] bg-[#fefefe] z-[401] overflow-y-auto shadow-[6px_0_40px_rgba(45,27,105,0.12)] ${isArabic ? "right-0" : "left-0"}`}
          >
            <div className="p-5 pb-4 flex items-center justify-between border-b border-[#c9a84c]/10 sticky top-0 bg-[#fefefe] z-[1]">
              <div className="flex items-center gap-2">
                <span className="text-[#8a7f99] flex">
                  <FilterIcon />
                </span>
                <span
                  className={ `text-[9px] text-[#8a7f99] ${isArabic ? "tracking-normal normal-case" : "tracking-[3.5px] uppercase"}`}
                >
                  {t.searchComponents.filterSort}
                </span>
              </div>
              <button
                onClick={onClose}
                className="bg-none border-none cursor-pointer text-[#c8c0d4] flex p-1"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="p-5">
              <SidebarContent {...rest} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Search Box ── */
export function SearchBox({
  value,
  onChange,
  onSearch,
  onFocus,
  onKeyDown,
  inputRef,
}: any) {
  const { t, isArabic } = useTranslation();
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={`flex flex-1 items-center gap-[10px] rounded-[3px] h-[52px] ps-4 pe-[6px] transition-all duration-[220ms] border-[1.5px] 
      ${focused ? "bg-white border-[#c9a84c]/45 shadow-[0_6px_28px_rgba(201,168,76,0.12)]" : "bg-[#faf9fc] border-[#c9a84c]/12"}`}
    >
      <span
        className={`flex shrink-0 transition-colors duration-200 ${focused ? "text-[#c9a84c]" : "text-[#c8c0d4]"}`}
      >
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={() => setFocused(false)}
        placeholder={t.searchComponents.placeholder}
        className={`flex-1 bg-transparent border-none outline-none text-base text-[#1a1522] text-start ${isArabic ? "tracking-normal" : "tracking-[0.3px]"}`}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.12 }}
            onClick={() => onChange({ target: { value: "" } } as any)}
            className="bg-black/5 border-none rounded-full w-[22px] h-[22px] cursor-pointer flex items-center justify-center shrink-0 text-[#8a7f99]"
          >
            <CloseIcon size={9} />
          </motion.button>
        )}
      </AnimatePresence>
      <button
        onClick={() => onSearch(value)}
        className={`h-[38px] px-[18px] bg-gradient-to-br from-[#2d1b69] to-[#4a2d9e] border-none rounded-[3px] cursor-pointer text-white flex items-center gap-[6px] text-xs shrink-0 transition-all shadow-[0_2px_12px_rgba(45,27,105,0.2)] ${isArabic ? "tracking-normal normal-case" : "tracking-[2px] uppercase"}`}
      >
        <span className="hidden sm:inline leading-[1]">
          {t.searchComponents.searchBtn}
        </span>
        <ArrowIcon flipped={isArabic} />
      </button>
    </div>
  );
}

/* ── Suggestions Panel ── */
export function SuggestPanel({
  suggestions,
  previewProducts,
  inputVal,
  onSuggest,
  onProduct,
  onSearchAll,
}: any) {
  const { t, isArabic } = useTranslation();

  const hl = (text: string, q: string) => {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, i)}
        <strong className="text-[#2d1b69] font-semibold">
          {text.slice(i, i + q.length)}
        </strong>
        {text.slice(i + q.length)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-0 top-[calc(100%+8px)] bg-white z-[200] rounded-[3px] border border-[#c9a84c]/12 shadow-[0_20px_60px_rgba(45,27,105,0.12),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="h-[2px] bg-gradient-to-r from-[#c9a84c] via-[#c9a84c]/15 to-transparent" />
      <div className="grid grid-cols-[40%_60%]">
        {/* Suggestions Column */}
        <div className="py-[14px]">
          <p
            className={`text-[9px] text-[#c8c0d4] px-4 pb-[10px] text-start ${isArabic ? "tracking-normal normal-case" : "tracking-[3.5px] uppercase"}`}
          >
            {t.searchComponents.suggestions}
          </p>
          {suggestions.length === 0 ? (
            <p className="text-xs text-[#c8c0d4] px-4 text-start">
              {t.searchComponents.noSuggestions}
            </p>
          ) : (
            suggestions.map((s: string, i: number) => (
              <button
                key={i}
                onClick={() => onSuggest(s)}
                className="w-full text-start py-[7px] px-4 bg-transparent border-none cursor-pointer text-[13px] text-[#4a4255] flex items-center gap-2 transition-colors hover:bg-[#c9a84c]/5 hover:text-[#2d1b69]"
              >
                <span className="text-[#c8c0d4] text-[9px]">↗</span>
                {hl(s, inputVal)}
              </button>
            ))
          )}
        </div>
        {/* Products Column */}
        <div className="py-[14px] border-s border-[#c9a84c]/12">
          <p
            className={`text-[9px] text-[#c8c0d4] px-4 pb-[10px] text-start ${isArabic ? "tracking-normal normal-case" : "tracking-[3.5px] uppercase"}`}
          >
            {t.searchComponents.products}
          </p>
          {previewProducts.length === 0 ? (
            <p className="text-xs text-[#c8c0d4] px-4">
              {t.searchComponents.noProducts}
            </p>
          ) : (
            previewProducts.map((p: Product) => (
              <button
                key={p.id}
                onClick={() => onProduct(p.id)}
                className="w-full text-start py-[9px] px-4 bg-transparent border-none cursor-pointer flex items-center gap-3 transition-colors hover:bg-[#c9a84c]/5"
              >
                <div className="w-11 h-11 shrink-0 bg-gradient-to-br from-[#f5f0eb] to-[#ede8e0] border border-[#c9a84c]/12 overflow-hidden rounded-[3px]">
                  <Image
                    width={40}
                    height={40}
                    loading="lazy"
                    src={p?.thumbnail || "/heros.jpg"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13.5px] text-[#1a1522] block mb-0.5 leading-[1.35]">
                    {hl(p.name, inputVal)}
                  </span>
                  {p.category_name && (
                    <span
                      className={`text-[9px] text-[#c9a84c] ${isArabic ? "tracking-normal normal-case" : "tracking-[2.5px] uppercase"}`}
                    >
                      {p.category_name}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      {/* Search all footer */}
      <div className="border-t border-[#c9a84c]/12 bg-[#faf9fc]">
        <button
          onClick={() => onSearchAll(inputVal)}
          className="w-full py-[11px] px-4 bg-transparent border-none cursor-pointer flex items-center justify-between transition-colors hover:bg-[#c9a84c]/5"
        >
          <span className="text-[13px] text-[#4a4255]">
            {t.searchComponents.searchFor} &ldquo;
            <span
              className={`text-[#2d1b69] ${isArabic ? "not-italic" : "italic"}`}
            >
              {inputVal}
            </span>
            &rdquo;
          </span>
          <span className="text-[#c9a84c] flex items-center gap-[5px]">
            <span
              className={`text-[10px] ${isArabic ? "tracking-normal normal-case" : "tracking-[1.5px] uppercase"}`}
            >
              {t.searchComponents.allResults}
            </span>
            <ArrowIcon flipped={isArabic} />
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/* ── Active Filter Pills ── */
export function ActiveFilterPills({
  sort,
  availFilter,
  minPrice,
  maxPrice,
  onRemoveAvail,
  onClearPrice,
  onResetSort,
}: any) {
  const { t, isArabic } = useTranslation();
  const pills: { label: string; onRemove: () => void }[] = [];
  if (sort && sort !== "relevance")
    pills.push({ label: sort, onRemove: onResetSort });
  availFilter.forEach((f: string) =>
    pills.push({
      label:
        f === "in-stock"
          ? t.searchComponents.inStock
          : t.searchComponents.outOfStock,
      onRemove: () => onRemoveAvail(f),
    }),
  );
  if (minPrice || maxPrice)
    pills.push({
      label: `${minPrice || "0"} – ${maxPrice || "∞"} ${isArabic ? "ج.م" : "LE"}`,
      onRemove: onClearPrice,
    });
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[6px] pb-4">
      {pills.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-[5px] bg-[#c9a84c]/5 border border-[#c9a84c]/45 rounded-full py-1 ps-3 pe-[10px] text-[12px] text-[#2d1b69]"
        >
          {p.label}
          <button
            onClick={p.onRemove}
            className="bg-transparent border-none cursor-pointer text-[#8a7f99] flex p-0 ms-0.5"
          >
            <CloseIcon size={9} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
