/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "../layout/AnnouncementBar";
import Navbar from "../layout/Navbar";
import Footer from "./Footer";
import ProductCard from "@/components/layout/Productcard";
import { useGetProducts } from "@/hooks/useProducts";
import { applySort, getSortOptions } from "@/lib/Products";
import { Product } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";
import { ArrowDown } from "@/public/svg/Svgs";
import { useGetCategory } from "@/hooks/useDashboard";

function Dropdown({ trigger, children, open, setOpen, isArabic }: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  setOpen: (v: boolean) => void;
  isArabic: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 260 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);

useEffect(() => {
  if (!open) return;

  const updateCoords = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 260;
    const screenWidth = window.innerWidth;
    const padding = 8;

    let left = isArabic ? rect.right - dropdownWidth : rect.left;
    if (left + dropdownWidth > screenWidth - padding)
      left = screenWidth - dropdownWidth - padding;
    if (left < padding) left = padding;

    setCoords({
      top: rect.bottom + 8,
      left,
      width: Math.min(dropdownWidth, screenWidth - padding * 2),
    });
  };

  updateCoords();
  window.addEventListener("scroll", updateCoords, true);
  window.addEventListener("resize", updateCoords);

  return () => {
    window.removeEventListener("scroll", updateCoords, true);
    window.removeEventListener("resize", updateCoords);
  };
}, [open, isArabic]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 transition-all duration-300 text-[15px] font-medium bg-none border-none cursor-pointer py-2 px-1
          ${isArabic ? "-normal" : "-tight"}
          ${open ? "text-[#c9a84c]" : "text-[#444] hover:text-[#c9a84c]"}`}
      >
        {trigger}
        <div
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <ArrowDown open={open} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[9999] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#c9a84c15] overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-gray-100 aspect-[3/4] rounded-[24px]" />
      <div className="space-y-2 px-2">
        <div className="bg-gray-100 h-4 rounded-full w-2/3" />
        <div className="bg-gray-50 h-4 rounded-full w-1/3" />
      </div>
    </div>
  );
}

export default function CollectionPage({ category }: { category: string }) {
  const { t, isArabic, dir } = useTranslation();
  const [sort, setSort] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [availFilter, setAvailFilter] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
const decodedOnce = decodeURIComponent(category);
const decodedTwice = decodeURIComponent(decodedOnce);
  const { data: categories } = useGetCategory();
  const { data, isLoading, isError } = useGetProducts({
    page,
    category:  decodedTwice==="all"?undefined:decodedTwice,
  });
  const nextPage = data?.next ?? null;
  const categoryName = categories?.find(
    (c) => c.name.toUpperCase() === decodedTwice.toUpperCase(),
  );
console.log(data)
  useEffect(() => {
    const products: Product[] = data?.products ?? [];
    if (page === 1) setAllProducts(products);
    else setAllProducts((prev) => [...prev, ...products]);
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [
    availFilter,
    minPrice,
    maxPrice,
    categoryName,
    isArabic,
    selectedCategories,
  ]);

  const sortOptions = getSortOptions(t.collectionPage.sortData);

  let products =
    category === "all"
      ? [...allProducts]
      : allProducts.filter((p) =>
          p.categories.includes(categoryName?.name as string),
        );

  if (selectedCategories.length > 0)
    products = products.filter((p) =>
      selectedCategories.some((c) => p.categories.includes(c)),
    );

  if (availFilter.includes("in-stock") && !availFilter.includes("out-of-stock"))
    products = products.filter((p) => p.is_active);
  if (availFilter.includes("out-of-stock") && !availFilter.includes("in-stock"))
    products = products.filter((p) => !p.is_active);
  if (minPrice)
    products = products.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice)
    products = products.filter((p) => Number(p.price) <= Number(maxPrice));

  const sorted = applySort(products, sort);
  const inStockCount = allProducts.filter(
    (p) =>
      (category === "all" ||
        p.categories.includes(categoryName?.name as string)) &&
      p.is_active,
  ).length;
  const outStockCount = allProducts.filter(
    (p) =>
      (category === "all" ||
        p.categories.includes(categoryName?.name as string)) &&
      !p.is_active,
  ).length;
  const toggleAvail = (v: string) =>
    setAvailFilter((f) =>
      f.includes(v) ? f.filter((x) => x !== v) : [...f, v],
    );
  const currentSortLabel =
    sortOptions.find((o) => o.value === sort)?.label ??
    t.collectionPage.sortData.featured;
  const activeFilters =
    availFilter.length +
    (minPrice || maxPrice ? 1 : 0) +
    selectedCategories.length;

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <div dir={dir} className="bg-white">
        <section className="w-full pt-16 pb-24">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="text-[14px] font-bold text-[#c9a84c] block mb-3 uppercase">
                {t.collectionPage.collectionLabel}
              </span>
              <h1 className="text-[#111] font-bold text-[clamp(36px,5vw,52px)] leading-none">
                {decodedTwice === "all"
                  ? t.collectionPage.all
                  : categoryName?.name}
              </h1>
              <div className="mt-6 h-[2px] w-16 bg-[#c9a84c]" />
            </div>

            {/* Filter / Sort bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 py-6 border-y border-gray-100">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <div className="w-full sm:w-auto flex items-center gap-2 uppercase text-[13px] font-bold text-gray-400">
                  {t.collectionPage.filter}
                  {activeFilters > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#c9a84c] text-white text-[10px] font-bold">
                      {activeFilters}
                    </span>
                  )}
                </div>

                <Dropdown
                  open={availOpen}
                  setOpen={setAvailOpen}
                  isArabic={isArabic}
                  trigger={t.collectionPage.availability}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[13px] font-bold text-gray-400 uppercase">
                        {availFilter.length} {t.collectionPage.selected}
                      </span>
                      <button
                        onClick={() => setAvailFilter([])}
                        className="text-[13px] font-bold text-[#c9a84c] underline bg-transparent border-none cursor-pointer"
                      >
                        {t.collectionPage.reset}
                      </button>
                    </div>
                    {[
                      {
                        value: "in-stock",
                        label: t.collectionPage.inStock,
                        count: inStockCount,
                      },
                      {
                        value: "out-of-stock",
                        label: t.collectionPage.outOfStock,
                        count: outStockCount,
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center justify-between cursor-pointer py-2 hover:translate-x-1 transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={availFilter.includes(opt.value)}
                            onChange={() => toggleAvail(opt.value)}
                            className="w-5 h-5 accent-[#c9a84c]"
                          />
                          <span className="text-[15px] font-medium text-gray-700">
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-[13px] text-gray-400">
                          ({opt.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </Dropdown>

                <Dropdown
                  open={priceOpen}
                  setOpen={setPriceOpen}
                  isArabic={isArabic}
                  trigger={t.collectionPage.price}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-[13px] font-bold text-gray-400 uppercase">
                        {t.collectionPage.priceRange}
                      </span>
                      <button
                        onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                        className="text-[13px] font-bold text-[#c9a84c] underline bg-transparent border-none cursor-pointer"
                      >
                        {t.collectionPage.reset}
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder={t.collectionPage.min}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full text-[15px] p-3 rounded-xl border border-gray-100 focus:border-[#c9a84c] outline-none transition-colors"
                      />
                      <input
                        type="number"
                        placeholder={t.collectionPage.max}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full text-[15px] p-3 rounded-xl border border-gray-100 focus:border-[#c9a84c] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </Dropdown>

                <Dropdown
                  open={categoryOpen}
                  setOpen={setCategoryOpen}
                  isArabic={isArabic}
                  trigger={t.collectionPage.category}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">
                        {selectedCategories.length} {t.collectionPage.selected}
                      </span>
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="text-[13px] font-bold text-[#c9a84c] underline bg-transparent border-none cursor-pointer"
                      >
                        {t.collectionPage.reset}
                      </button>
                    </div>
                    {categories?.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer py-2 hover:translate-x-1 transition-transform"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(cat.name)
                                ? prev.filter((x) => x !== cat.name)
                                : [...prev, cat.name],
                            )
                          }
                          className="w-5 h-5 accent-[#c9a84c]"
                        />
                        <span className="text-[15px] font-medium text-gray-700">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </Dropdown>
              </div>

              {/* Sort + Count */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                <Dropdown
                  open={sortOpen}
                  setOpen={setSortOpen}
                  isArabic={isArabic}
                  trigger={
                    <>
                      <span className="text-gray-400 font-normal">
                        {t.collectionPage.sort}:
                      </span>{" "}
                      {currentSortLabel}
                    </>
                  }
                >
                  <div className="py-2">
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => {
                          setSort(o.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-start px-6 py-3 text-[15px] transition-colors ${
                          sort === o.value
                            ? "text-[#c9a84c] bg-gray-50 font-bold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </Dropdown>
                <span className="text-[14px] font-bold text-gray-300 uppercase">
                  {products.length} {t.collectionPage.products}
                </span>
              </div>
            </div>

            {/* Content Area */}
            {isError && (
              <div className="text-center py-32 text-red-400 font-medium">
                {t.collectionPage.loadError}
              </div>
            )}

            {isLoading && page === 1 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {!isError && allProducts.length > 0 && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {sorted.map((p, i) => (
                    <ProductCard key={p.id} p={p} index={i} fill={true} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-40 text-gray-400 text-[18px] font-medium">
                    {t.collectionPage.noMatch}
                  </div>
                )}

                {!isLoading && nextPage && (
                  <div className="flex justify-center mt-24">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-12 py-4 rounded-full border-2 border-gray-100 text-[#111] font-bold text-[15px] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300"
                    >
                      {t.collectionPage.loadMore}
                    </button>
                  </div>
                )}

                {isLoading && page > 1 && (
                  <div className="flex justify-center mt-20">
                    <div className="w-8 h-8 rounded-full border-[3px] border-[#c9a84c20] border-t-[#c9a84c] animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
