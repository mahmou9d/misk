/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import ProductCard from "@/components/layout/Productcard";
import {
  ProductSkeleton,
  SearchBox,
  SidebarContent,
  ActiveFilterPills,
  CategoryDropdown,
} from "@/components/sections/ComponetsSearchPage";
import { useSearchPage } from "@/hooks/Usesearchpage";
import { useTranslation } from "@/lib/Usetranslation";
import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function SearchPage() {
  const { t, dir, locale, isArabic } = useTranslation();
  const isRTL = dir === "rtl";

  // States
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 400); // 400ms is usually the sweet spot for UX
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const searchParams = useSearchPage({ page, search: debouncedSearch });
  const {
    inputRef,
    searchContainerRef,
    urlQuery,
    isSearchMode,
    inputVal,
    setInputVal,
    setShowSuggest,
    doSearch,
    sort,
    setSort,
    availFilter,
    setAvailFilter,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    activeFilters,
    clearAllFilters,
    isLoading,
    router,
    nextPage,
    prevPage,
    allProducts,
    categories,
    selectedCategories,
    setSelectedCategories,
    sorted,
  } = searchParams;

  // Optimized Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const sidebarProps = {
    sort,
    setSort,
    availFilter,
    setAvailFilter,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    activeFilters,
    onClear: clearAllFilters,
  };

  return (
    <div className="bg-white min-h-screen selection:bg-[#c9a84c/30]">
      <AnnouncementBar />
      <Navbar />

      <section dir={dir} className="pb-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          {/* ─── Header: Search Area ─── */}
          <header className="pt-16 mb-12">
            <div
              ref={searchContainerRef}
              className="relative max-w-4xl mx-auto mb-12"
            >
              <div className="flex flex-col md:flex-row gap-3 items-end bg-white px-3 py-2 rounded-2xl border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-yellow-400/60 transition-all duration-300">
                <CategoryDropdown
                  categories={categories ?? []}
                  selectedCategories={selectedCategories}
                  onSelect={setSelectedCategories}
                />

                <div className="hidden lg:block h-7 w-px bg-gray-100" />

                <div className="flex-1 w-full">
                  <SearchBox
                    value={inputVal}
                    onChange={(e: any) => {
                      setInputVal(e.target.value);
                      setShowSuggest(true);
                      setSearchTerm(e.target.value);
                    }}
                    onSearch={doSearch}
                    onFocus={() => setShowSuggest(true)}
                    inputRef={inputRef}
                  />
                </div>

                <div className="hidden lg:block h-7 w-px bg-gray-100" />

                <div className="w-full md:w-auto">
                  <SidebarContent {...sidebarProps} />
                </div>
              </div>
            </div>

            {/* Results Info & Active Filters */}
            <AnimatePresence mode="wait">
              {isSearchMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-gray-100"
                >
                  <div className="space-y-2">
                    <p className="text-[11px] font-black -[0.3em] uppercase text-[#c9a84c]">
                      {t.search.resultsFor}
                    </p>
                    <div className="flex items-center gap-4">
                      <h1 className="text-3xl md:text-4xl font-bold text-[#111] leading-tight">
                        &ldquo;{urlQuery || searchTerm}&rdquo;
                      </h1>
                      {!isLoading && (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                          {sorted.length}{" "}
                          {sorted.length === 1
                            ? t.search.result
                            : t.search.results}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <ActiveFilterPills
                      {...sidebarProps}
                      onRemoveAvail={(f: string) =>
                        setAvailFilter(availFilter.filter((x) => x !== f))
                      }
                      onClearPrice={() => {
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                      onResetSort={() => setSort("relevance")}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* ─── Main Content Grid ─── */}
          <main className="min-h-[500px]">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : sorted.length === 0 ? (
              /* No Results State - Enhanced UI */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#c9a84c]/10 blur-3xl rounded-full" />
                  <div className="relative w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100">
                    <Search className="text-gray-300 w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#111] mb-3">
                  {t.search.noResults}
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-10 leading-relaxed">
                  {t.search.noResultsHint}
                </p>
                <button
                  onClick={() => router.push(`/${locale.toLowerCase()}/search`)}
                  className="px-10 py-4 bg-[#111] text-white rounded-2xl text-sm font-bold hover:bg-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/20 transition-all active:scale-95"
                >
                  {t.search.clearSearch}
                </button>
              </motion.div>
            ) : (
              /* Products Grid with staggered animation */
              <div className="space-y-20">
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12"
                  layout
                >
                  {sorted.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                    >
                      <ProductCard p={p} index={i} fill={true} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination - Premium Design */}
                {(nextPage || prevPage || page > 1) && (
                  <nav className="flex justify-center items-center gap-12 pt-16 border-t border-gray-50">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={!prevPage}
                      className="group flex items-center gap-3 text-sm font-bold uppercase -widest disabled:opacity-20 transition-all hover:text-[#c9a84c]"
                    >
                      {isRTL ? (
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      ) : (
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      )}
                      {isArabic ? "السابق" : "Prev"}
                    </button>

                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#c9a84c]/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                      <span className="relative w-12 h-12 rounded-2xl bg-[#111] text-white flex items-center justify-center text-base font-bold shadow-xl shadow-black/10">
                        {page}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!nextPage}
                      className="group flex items-center gap-3 text-sm font-bold uppercase -widest disabled:opacity-20 transition-all hover:text-[#c9a84c]"
                    >
                      {isArabic ? "التالي" : "Next"}
                      {isRTL ? (
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      ) : (
                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>
                  </nav>
                )}
              </div>
            )}
          </main>
        </div>
      </section>
      <Footer />
    </div>
  );
}
