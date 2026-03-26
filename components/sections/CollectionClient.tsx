"use client";

import CollectionPage from "@/components/sections/CollectionPage";

export default function CollectionClient({ id }: { id: string }) {
  if (id === "mens") return <CollectionPage category="men" />;
  if (id === "womens") return <CollectionPage category="women" />;
  if (id === "all") return <CollectionPage category="all" />;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className=" text-gray-400" style={{ fontSize: 15 }}>
        Collection not found.
      </p>
    </div>
  );
}
