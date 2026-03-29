import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { Currency, Page } from "../App";
import { formatPrice } from "../App";
import { useActor } from "../hooks/useActor";
import { useCart } from "../store/cart";

export function CartPage({
  onNavigate,
  currency = "INR",
}: { onNavigate: (page: Page) => void; currency?: Currency }) {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const { actor } = useActor();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [applying, setApplying] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);

  const subtotal = total();
  const discountAmt = Math.round((subtotal * discount) / 100);
  const finalTotal = subtotal - discountAmt;

  const applyCoupon = async () => {
    if (!actor || !coupon.trim()) return;
    setApplying(true);
    try {
      const result = await actor.validateCoupon(coupon.trim().toUpperCase());
      if (result !== null && result !== undefined) {
        setDiscount(Number(result));
        setCouponApplied(coupon.trim().toUpperCase());
        toast.success(`Coupon applied! ${result}% off`);
      } else {
        toast.error("Invalid or expired coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="w-16 h-16 text-[#D9D0C2]" />
        <h2 className="text-2xl font-bold text-[#1E1B4B]">
          Your cart is empty
        </h2>
        <p className="text-[#6B5F52]">Add some amazing refurbished devices!</p>
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-semibold px-6 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E1B4B] mb-8">
          Your Cart ({items.length} item{items.length !== 1 ? "s" : ""})
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1E1B4B] text-sm truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#6B5F52]">
                    {item.category} &bull; {item.condition}
                  </p>
                  <p className="font-bold text-[#1E1B4B] mt-1">
                    {formatPrice(item.price, currency)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-red-400 hover:text-red-600 transition-colors hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-[#F5F0E6] rounded-xl px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(item.productId, item.quantity - 1)
                      }
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#EFE7D8] rounded-lg"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(item.productId, item.quantity + 1)
                      }
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#EFE7D8] rounded-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#1E1B4B] mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B5F52]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({couponApplied}, {discount}%)
                    </span>
                    <span>-{formatPrice(discountAmt, currency)}</span>
                  </div>
                )}
                <div className="border-t border-[#D9D0C2] pt-2 flex justify-between font-bold text-[#1E1B4B] text-base">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-[#1E1B4B] mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Coupon Code
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={applying}
                  className="bg-[#1E1B4B] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#2D2A6B] disabled:opacity-60 hover:scale-105 transition-all"
                >
                  {applying ? "..." : "Apply"}
                </button>
              </div>
              {couponApplied && (
                <p className="text-green-600 text-xs mt-2">
                  ✓ {couponApplied} applied ({discount}% off)
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCheckoutModal(true)}
              className="w-full bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-4 rounded-2xl text-lg hover:from-[#3B0764] hover:to-[#6D28D9] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-purple-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {checkoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-[#6B5F52]">
                    {i.name} x{i.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(i.price * i.quantity, currency)}
                  </span>
                </div>
              ))}
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmt, currency)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-[#1E1B4B]">
                <span>Total Payable</span>
                <span>{formatPrice(finalTotal, currency)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutModal(false)}
                className="flex-1 border border-[#D9D0C2] text-[#6B5F52] py-3 rounded-xl hover:bg-[#F5F0E6]"
              >
                Cancel
              </button>
              <a
                href="https://rzp.io/l/openr3"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  clearCart();
                  setCheckoutModal(false);
                  toast.success("Redirecting to payment...");
                }}
                className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-xl text-center hover:from-[#3B0764] hover:to-[#6D28D9]"
              >
                Pay {formatPrice(finalTotal, currency)}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
