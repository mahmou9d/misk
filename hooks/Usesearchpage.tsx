"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProducts } from "@/hooks/useProducts";
import { applySort } from "@/lib/Products";
import { Product } from "@/type/type";
import { useTranslation } from "@/lib/Usetranslation";

export function useSearchPage({ page, search }: { page: number; search: string }) {
  const { locale } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [inputVal, setInputVal] = useState(urlQuery);
  const [showSuggest, setShowSuggest] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [sort, setSort] = useState("relevance");
  const [availFilter, setAvailFilter] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
 const isSearchMode = urlQuery.trim().length > 0;
const { data, isLoading } = useGetProducts({
  all: isSearchMode ? true : undefined,
  page: isSearchMode || minPrice || maxPrice ? undefined : page,
  search: urlQuery || undefined,
  min_price: minPrice ? Number(minPrice) : undefined,
  max_price: maxPrice ? Number(maxPrice) : undefined,
});
  const nextPage = data?.next;
  const prevPage = data?.previous;
  const allProducts: Product[] = data?.products ?? [];

  /* ── Suggestions ── */
  const suggestions =
    inputVal.trim().length > 0
      ? Array.from(
          new Set(
            allProducts
              .filter((p) =>
                p.name.toLowerCase().includes(inputVal.toLowerCase()),
              )
              .flatMap((p) => [
                p.name.toLowerCase(),
                p.category_name?.toLowerCase() ?? "",
                p.fragrance_family?.toLowerCase() ?? "",
              ])
              .filter(
                (s) =>
                  s &&
                  s.includes(inputVal.toLowerCase()) &&
                  s !== inputVal.toLowerCase(),
              ),
          ),
        ).slice(0, 5)
      : allProducts;

  const previewProducts =
    inputVal.trim().length > 0
      ? allProducts
          .filter((p) => p.name.toLowerCase().includes(inputVal.toLowerCase()))
          .slice(0, 5)
      : allProducts;

  /* ── Filtered + sorted results ── */
 

  let results = isSearchMode
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(urlQuery.toLowerCase()) ||
          (p.fragrance_family ?? "")
            .toLowerCase()
            .includes(urlQuery.toLowerCase()) ||
          (p.category_name ?? "")
            .toLowerCase()
            .includes(urlQuery.toLowerCase()) ||
          (p.description ?? "").toLowerCase().includes(urlQuery.toLowerCase()),
      )
    : allProducts;

  if (availFilter.includes("in-stock") && !availFilter.includes("out-of-stock"))
    results = results.filter((p) => p.is_active);
  if (availFilter.includes("out-of-stock") && !availFilter.includes("in-stock"))
    results = results.filter((p) => !p.is_active);
  if (minPrice)
    results = results.filter((p) => Number(p.price) >= Number(minPrice));
  if (maxPrice)
    results = results.filter((p) => Number(p.price) <= Number(maxPrice));

  const sorted = applySort(results, sort);
  const inCount = results.filter((p) => p.is_active).length;
  const outCount = results.filter((p) => !p.is_active).length;

  const activeFilters =
    availFilter.length +
    (minPrice || maxPrice ? 1 : 0) +
    (sort !== "relevance" ? 1 : 0);

  /* ── Actions ── */
  const clearAllFilters = () => {
    setAvailFilter([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("relevance");
  };

  const doSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      setShowSuggest(false);
      if (!trimmed) {
        router.push(`/${locale.toLowerCase()}/search`);
        return;
      }
      router.push(
        `/${locale.toLowerCase()}/search?q=${encodeURIComponent(trimmed)}`,
      );
      setInputVal(trimmed);
      setSort("relevance");
      setAvailFilter([]);
      setMinPrice("");
      setMaxPrice("");
    },
    [router],
  );

  /* ── Effects ── */
  useEffect(() => {
    setInputVal(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return {
    /* refs */
    inputRef,
    searchContainerRef,
    /* url state */
    urlQuery,
    isSearchMode,
    /* search input */
    inputVal,
    setInputVal,
    showSuggest,
    setShowSuggest,
    doSearch,
    /* suggestions */
    suggestions,
    previewProducts,
    /* mobile */
    mobileFiltersOpen,
    setMobileFiltersOpen,
    /* filters */
    page,
    nextPage,
    prevPage,
    sort,
    setSort,
    availFilter,
    setAvailFilter,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    activeFilters,
    clearAllFilters,
    /* results */
    allProducts,
    isLoading,
    sorted,
    inCount,
    outCount,
    /* router */
    router,
  };
}
