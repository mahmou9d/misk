// app/[locale]/products/[id]/ProductDetailClient.tsx
"use client";

import ProductDetailPage from "@/components/sections/Productdetailpage";

export default function ProductDetailClient({ id }: { id: string }) {
  return <ProductDetailPage id={Number(id)} />;
}
