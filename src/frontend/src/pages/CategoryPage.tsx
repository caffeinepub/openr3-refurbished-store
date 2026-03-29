import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

type Page =
  | "home"
  | "mobiles"
  | "tablets"
  | "laptops"
  | "cart"
  | "compare"
  | "admin"
  | "product";

const CONDITIONS = [
  "All",
  "Excellent",
  "Mint",
  "Open Box",
  "Good",
  "Average",
  "Fair",
];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "asc" },
  { label: "Price: High to Low", value: "desc" },
];

const categoryMeta: Record<
  string,
  { emoji: string; from: string; to: string; desc: string }
> = {
  Mobile: {
    emoji: "📱",
    from: "from-[#4C1D95]",
    to: "to-[#7C3AED]",
    desc: "Certified refurbished smartphones",
  },
  Laptop: {
    emoji: "💻",
    from: "from-[#1E3A5F]",
    to: "to-[#2563EB]",
    desc: "Refurbished laptops with warranty",
  },
  Tablet: {
    emoji: "📲",
    from: "from-[#065F46]",
    to: "to-[#059669]",
    desc: "Quality refurbished tablets",
  },
};

interface CategoryPageProps {
  category: string;
  onNavigate: (page: Page, id?: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

export function CategoryPage({
  category,
  onNavigate,
  compareIds,
  onToggleCompare,
}: CategoryPageProps) {
  const { actor } = useActor();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    if (!actor) return;
    actor
      .getProductsByCategory(category)
      .then((p) => {
        setProducts(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, category]);

  const filtered = products
    .filter((p) => p.isActive)
    .filter((p) => condition === "All" || p.condition === condition)
    .sort((a, b) => {
      if (sort === "asc") return Number(a.price - b.price);
      if (sort === "desc") return Number(b.price - a.price);
      return Number(b.createdAt - a.createdAt);
    });

  const meta = categoryMeta[category] ?? {
    emoji: "📦",
    from: "from-[#1E1B4B]",
    to: "to-[#4C1D95]",
    desc: "",
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${meta.from} ${meta.to} py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-white">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <h1 className="text-4xl font-bold">{category}s</h1>
              <p className="text-white/70 mt-1">{meta.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur shadow-sm border-b border-[#D9D0C2]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-[#6B5F52]" />
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCondition(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  condition === c
                    ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                    : "bg-white text-[#1E1B4B] border-[#D9D0C2] hover:border-[#7C3AED]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-[#D9D0C2] rounded-lg px-3 py-1.5 bg-white text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#EFE7D8] rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#6B5F52]">
            <p className="text-5xl mb-4">{meta.emoji}</p>
            <p className="font-semibold text-lg">No products found</p>
            <p className="text-sm">Try changing the condition filter</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#6B5F52] mb-4">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id.toString()}
                  id={p.id.toString()}
                  name={p.name}
                  description={p.description}
                  category={p.category}
                  condition={p.condition}
                  price={Number(p.price)}
                  imageUrl={p.imageUrl}
                  ram={p.specs.ram}
                  storage={p.specs.storage}
                  batteryHealth={Number(p.specs.batteryHealth)}
                  onNavigate={(id) => onNavigate("product", id)}
                  compareIds={compareIds}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
