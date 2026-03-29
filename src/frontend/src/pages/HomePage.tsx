import {
  ChevronRight,
  Laptop,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Truck,
  Watch,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Currency, Page } from "../App";
import { formatPrice } from "../App";
import type { Product } from "../backend.d";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";

interface HomePageProps {
  onNavigate: (page: Page, id?: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  currency: Currency;
}

export function HomePage({
  onNavigate,
  compareIds,
  onToggleCompare,
  currency,
}: HomePageProps) {
  const { actor } = useActor();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllProducts()
      .then((p) => {
        setProducts(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const mobiles = products.filter((p) => p.category === "Mobile").slice(0, 4);
  const tablets = products.filter((p) => p.category === "Tablet").slice(0, 4);
  const laptops = products.filter((p) => p.category === "Laptop").slice(0, 4);
  const watches = products
    .filter((p) => p.category === "SmartWatch")
    .slice(0, 4);

  const categoryConfig = [
    {
      key: "Mobile",
      label: "Mobiles",
      page: "mobiles" as Page,
      from: "from-[#4C1D95]",
      to: "to-[#7C3AED]",
      items: mobiles,
      emoji: "\uD83D\uDCF1",
    },
    {
      key: "Laptop",
      label: "Laptops",
      page: "laptops" as Page,
      from: "from-[#1E3A5F]",
      to: "to-[#2563EB]",
      items: laptops,
      emoji: "\uD83D\uDCBB",
    },
    {
      key: "Tablet",
      label: "Tablets",
      page: "tablets" as Page,
      from: "from-[#065F46]",
      to: "to-[#059669]",
      items: tablets,
      emoji: "\uD83D\uDCF2",
    },
    {
      key: "SmartWatch",
      label: "Smart Watches",
      page: "smartwatches" as Page,
      from: "from-[#B45309]",
      to: "to-[#D97706]",
      items: watches,
      emoji: "\u231A",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#7C3AED] py-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white animate-fade-up">
              <p className="text-[#C4B5FD] text-sm font-semibold uppercase tracking-widest mb-3">
                Certified Refurbished Electronics
              </p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                Revive,
                <br />
                Restore,
                <br />
                <span className="text-[#C4B5FD]">Reboot.</span>
              </h1>
              <p className="text-[#DDD6FE] text-lg mb-8 leading-relaxed">
                Premium quality refurbished smartphones, tablets &amp; laptops
                at unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("mobiles")}
                  className="bg-white text-[#4C1D95] font-bold px-8 py-3 rounded-2xl hover:bg-[#F5F0E6] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("compare")}
                  className="border-2 border-white text-white font-semibold px-8 py-3 rounded-2xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Compare Devices
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    emoji: "\uD83D\uDCF1",
                    label: "Mobiles",
                    sub: "From \u20B99,999",
                  },
                  {
                    emoji: "\uD83D\uDCBB",
                    label: "Laptops",
                    sub: "From \u20B929,999",
                  },
                  {
                    emoji: "\uD83D\uDCF2",
                    label: "Tablets",
                    sub: "From \u20B914,999",
                  },
                  {
                    emoji: "\u231A",
                    label: "Watches",
                    sub: "From \u20B92,999",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-[#C4B5FD]">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-8">
          <svg
            viewBox="0 0 1440 32"
            className="w-full h-8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <title>decorative wave</title>
            <path fill="#F5F0E6" d="M0,32L1440,0L1440,32L0,32Z" />
          </svg>
        </div>
      </section>

      {/* Category Sections */}
      {categoryConfig.map(({ key, label, page, from, to, items, emoji }) => (
        <section key={key} className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div
              className={`bg-gradient-to-r ${from} ${to} rounded-2xl px-8 py-6 mb-8 flex justify-between items-center shadow-lg`}
            >
              <div className="text-white">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{emoji}</span>
                  <h2 className="text-3xl font-bold">{label}</h2>
                </div>
                <p className="text-white/80 text-sm">
                  Premium certified refurbished {label.toLowerCase()} at best
                  prices
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(page)}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#EFE7D8] rounded-2xl h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-10 text-[#6B5F52]">
                No {label.toLowerCase()} listed yet. Add products from the Admin
                panel.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((p) => (
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
                    currency={currency}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Why Choose OPENR3 */}
      <section className="py-16 px-4 bg-[#EFE7D8]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E1B4B] mb-10">
            Why Choose OPEN R3?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                label: "Quality Certified",
                desc: "Every device tested & inspected",
                color: "text-[#7C3AED]",
              },
              {
                icon: RefreshCw,
                label: "12-Month Warranty",
                desc: "Peace of mind guaranteed",
                color: "text-blue-600",
              },
              {
                icon: Leaf,
                label: "Eco-Friendly",
                desc: "Reduce e-waste together",
                color: "text-green-600",
              },
              {
                icon: Truck,
                label: "Free Delivery",
                desc: "On orders above \u20b9999",
                color: "text-orange-500",
              },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className={`w-10 h-10 mx-auto mb-3 ${color}`} />
                <h3 className="font-semibold text-[#1E1B4B] mb-1">{label}</h3>
                <p className="text-xs text-[#6B5F52]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
