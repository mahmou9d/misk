import { Product, SortTranslations } from "@/type/type";



export function getSortOptions(t: SortTranslations) {
  return [
    { value: "featured", label: t.featured },
    { value: "best", label: t.best },
    { value: "az", label: t.az },
    { value: "za", label: t.za },
    { value: "price-asc", label: t.priceAsc },
    { value: "price-desc", label: t.priceDesc },
    { value: "date-old", label: t.dateOld },
    { value: "date-new", label: t.dateNew },
  ];
}

export function applySort(products: Product[], sort: string): Product[] {
  const p = [...products];
  switch (sort) {
    case "az":
      return p.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return p.sort((a, b) => b.name.localeCompare(a.name));
    case "price-asc":
      return p.sort((a, b) => Number(a.price) - Number(b.price));
    case "price-desc":
      return p.sort((a, b) => Number(b.price) - Number(a.price));
    default:
      return p;
  }
}
