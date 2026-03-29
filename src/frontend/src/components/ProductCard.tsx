import type React from "react";
import { toast } from "sonner";
import type { Currency } from "../App";
import { formatPrice } from "../App";
import { useCart } from "../store/cart";
import { ConditionBadge } from "./ConditionBadge";

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  imageUrl: string;
  ram?: string;
  storage?: string;
  batteryHealth?: number;
  onNavigate?: (id: string) => void;
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
  currency?: Currency;
}

export function ProductCard({
  id,
  name,
  description,
  category,
  condition,
  price,
  imageUrl,
  ram,
  storage,
  batteryHealth,
  onNavigate,
  compareIds,
  onToggleCompare,
  currency = "INR",
}: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const inCompare = compareIds?.includes(id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ productId: id, name, price, imageUrl, condition, category });
    toast.success(`${name} added to cart!`);
  };

  return (
    <article className="bg-[#EFE7D8] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer">
      <div
        className="relative overflow-hidden bg-white"
        onClick={() => onNavigate?.(id)}
        onKeyDown={() => {}}
      >
        <img
          src={
            imageUrl ||
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
          }
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";
          }}
        />
        <div className="absolute top-2 right-2">
          <ConditionBadge condition={condition} />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-[#1E1B4B] text-sm leading-tight">
          <button
            type="button"
            onClick={() => onNavigate?.(id)}
            className="text-left line-clamp-2 hover:text-[#7C3AED] transition-colors"
          >
            {name}
          </button>
        </h3>
        <p className="text-xs text-[#6B5F52] line-clamp-2">{description}</p>
        {(ram || storage) && (
          <div className="flex gap-2 text-xs text-[#6B5F52]">
            {ram && (
              <span className="bg-white rounded px-2 py-0.5 border border-[#D9D0C2]">
                {ram} RAM
              </span>
            )}
            {storage && (
              <span className="bg-white rounded px-2 py-0.5 border border-[#D9D0C2]">
                {storage}
              </span>
            )}
          </div>
        )}
        {batteryHealth !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#6B5F52]">
              <span>Battery</span>
              <span className="font-medium">{batteryHealth}%</span>
            </div>
            <div className="h-1.5 bg-[#D9D0C2] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${batteryHealth >= 85 ? "bg-green-500" : batteryHealth >= 70 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: `${batteryHealth}%` }}
              />
            </div>
          </div>
        )}
        <div className="mt-auto pt-2">
          <p className="text-xl font-bold text-[#1E1B4B] mb-3">
            {formatPrice(price, currency)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white text-sm font-semibold py-2 rounded-xl hover:from-[#3B0764] hover:to-[#6D28D9] hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-purple-300"
            >
              Add to Cart
            </button>
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(id);
                }}
                className={`px-3 py-2 rounded-xl text-sm border transition-all duration-200 hover:scale-105 ${inCompare ? "bg-[#1E1B4B] text-white border-[#1E1B4B]" : "bg-white text-[#1E1B4B] border-[#1E1B4B] hover:bg-[#EEE6D7]"}`}
              >
                {inCompare ? "\u2713" : "\u21c4"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
