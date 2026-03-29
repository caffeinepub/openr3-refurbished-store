import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { ConditionBadge } from "../components/ConditionBadge";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useCart } from "../store/cart";

type Page =
  | "home"
  | "mobiles"
  | "tablets"
  | "laptops"
  | "cart"
  | "compare"
  | "admin"
  | "product";

interface Props {
  productId: string;
  onNavigate: (page: Page, id?: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}

const formatPrice = (paise: number) =>
  `\u20B9${(paise / 100).toLocaleString("en-IN")}`;

const BoolBadge = ({ val, label }: { val: boolean; label: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#D9D0C2] last:border-0">
    <span className="text-sm text-[#6B5F52]">{label}</span>
    <span
      className={`flex items-center gap-1 text-sm font-medium ${val ? "text-green-600" : "text-red-500"}`}
    >
      {val ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {val ? "Yes" : "No"}
    </span>
  </div>
);

export function ProductDetailPage({
  productId,
  onNavigate,
  compareIds,
  onToggleCompare,
}: Props) {
  const { actor } = useActor();
  const addItem = useCart((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getProduct(BigInt(productId))
      .then((p) => {
        setProduct(p);
        return actor.getProductsByCategory(p.category);
      })
      .then((all) => {
        setRelated(
          all
            .filter((p) => p.id.toString() !== productId && p.isActive)
            .slice(0, 4),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, productId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent" />
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B5F52]">
        Product not found.
      </div>
    );

  const s = product.specs;

  return (
    <div className="min-h-screen bg-[#F5F0E6] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#7C3AED] font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <img
              src={
                product.imageUrl ||
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
              }
              alt={product.name}
              className="w-full h-80 object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600";
              }}
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ConditionBadge condition={product.condition} />
              <span className="text-sm text-[#6B5F52] bg-[#EFE7D8] px-2 py-0.5 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">
              {product.name}
            </h1>
            <p className="text-[#6B5F52] mb-4 leading-relaxed">
              {product.description}
            </p>
            <p className="text-4xl font-bold text-[#1E1B4B] mb-6">
              {formatPrice(Number(product.price))}
            </p>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => {
                  addItem({
                    productId: product.id.toString(),
                    name: product.name,
                    price: Number(product.price),
                    imageUrl: product.imageUrl,
                    condition: product.condition,
                    category: product.category,
                  });
                  toast.success("Added to cart!");
                }}
                className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-2xl hover:from-[#3B0764] hover:to-[#6D28D9] transition-all"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => onNavigate("cart")}
                className="flex-1 border-2 border-[#1E1B4B] text-[#1E1B4B] font-bold py-3 rounded-2xl hover:bg-[#EFE7D8] transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "RAM", v: s.ram },
                { l: "Storage", v: s.storage },
                { l: "Battery", v: s.batteryCapacity },
                { l: "Charging", v: s.chargingSpeed },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  className="bg-white rounded-xl p-3 border border-[#D9D0C2]"
                >
                  <p className="text-xs text-[#6B5F52]">{l}</p>
                  <p className="font-semibold text-[#1E1B4B] text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Specs */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
              🔧 Technical Specs
            </h3>
            <div>
              {[
                { l: "RAM", v: s.ram },
                { l: "Storage", v: s.storage },
                { l: "Battery", v: s.batteryCapacity },
                { l: "Charging Speed", v: s.chargingSpeed },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  className="flex justify-between py-2 border-b border-[#D9D0C2] last:border-0"
                >
                  <span className="text-sm text-[#6B5F52]">{l}</span>
                  <span className="text-sm font-semibold text-[#1E1B4B]">
                    {v}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-b border-[#D9D0C2]">
                <span className="text-sm text-[#6B5F52]">Battery Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-[#D9D0C2] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${Number(s.batteryHealth) >= 85 ? "bg-green-500" : Number(s.batteryHealth) >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${Number(s.batteryHealth)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[#1E1B4B]">
                    {s.batteryHealth.toString()}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
              🔄 Replaced Parts
            </h3>
            <BoolBadge val={s.screenReplaced} label="Screen Replaced" />
            <BoolBadge val={s.batteryReplaced} label="Battery Replaced" />
            <BoolBadge val={s.backPanelReplaced} label="Back Panel Replaced" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
            <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
              ⚙️ Hardware Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8">
              <BoolBadge val={s.wifiWorking} label="WiFi" />
              <BoolBadge val={s.bluetoothWorking} label="Bluetooth" />
              <BoolBadge val={s.touchWorking} label="Touch Sensor" />
              <BoolBadge val={s.camerasWorking} label="Camera" />
              <BoolBadge val={s.speakerWorking} label="Speaker" />
              <BoolBadge val={s.micWorking} label="Microphone" />
              <BoolBadge val={s.fingerPrintWorking} label="Fingerprint" />
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
