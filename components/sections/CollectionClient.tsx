"use client";

import CollectionPage from "@/components/sections/CollectionPage";

export default function CollectionClient({ id }: { id: string }) {
  return <CollectionPage category={id} />;
}
