import { ArrowLeft, CheckCircle, Star, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Currency, Page } from "../App";
import { formatPrice } from "../App";
import type { Product, Review } from "../backend.d";
import { ConditionBadge } from "../components/ConditionBadge";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useCart } from "../store/cart";

interface Props {
  productId: string;
  onNavigate: (page: Page, id?: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  currency: Currency;
}

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

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

export function ProductDetailPage({
  productId,
  onNavigate,
  compareIds,
  onToggleCompare,
  currency,
}: Props) {
  const { actor } = useActor();
  const addItem = useCart((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getProduct(BigInt(productId))
      .then((p) => {
        setProduct(p);
        setActiveImg(0);
        return Promise.all([
          actor.getProductsByCategory(p.category),
          actor.getReviewsByProduct(p.id),
        ]);
      })
      .then(([all, revs]) => {
        setRelated(
          all
            .filter((p) => p.id.toString() !== productId && p.isActive)
            .slice(0, 4),
        );
        setReviews(revs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, productId]);

  const submitReview = async () => {
    if (!actor || !product) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in your name and comment");
      return;
    }
    setSubmittingReview(true);
    try {
      await actor.addReview(
        product.id,
        reviewName.trim(),
        BigInt(reviewRating),
        reviewComment.trim(),
      );
      toast.success("Review submitted!");
      const revs = await actor.getReviewsByProduct(product.id);
      setReviews(revs);
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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
  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
        ? [product.imageUrl]
        : [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
          ];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
      : 0;

  const warrantyColor =
    s.warrantyType === "Brand Warranty"
      ? "bg-green-100 text-green-700"
      : s.warrantyType === "Seller Warranty"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-100 text-gray-600";

  return (
    <div className="min-h-screen bg-[#F5F0E6] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[#7C3AED] font-medium mb-6 hover:underline hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div
              className="relative overflow-hidden rounded-xl mb-3"
              style={{ height: "320px" }}
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600";
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      activeImg === i
                        ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/30"
                        : "border-[#D9D0C2]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
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
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm text-[#6B5F52]">
                  {avgRating.toFixed(1)} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            <p className="text-[#6B5F52] mb-4 leading-relaxed">
              {product.description}
            </p>
            <p className="text-4xl font-bold text-[#1E1B4B] mb-6">
              {formatPrice(Number(product.price), currency)}
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
                className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-2xl hover:from-[#3B0764] hover:to-[#6D28D9] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-purple-300"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => onNavigate("cart")}
                className="flex-1 border-2 border-[#1E1B4B] text-[#1E1B4B] font-bold py-3 rounded-2xl hover:bg-[#EFE7D8] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "RAM", v: s.ram },
                { l: "Storage", v: s.storage },
                { l: "Battery", v: s.batteryCapacity },
                { l: "Charging", v: s.chargingSpeed },
              ].map(({ l, v }) => (
                <div
                  key={l}
                  className="bg-white rounded-xl p-3 border border-[#D9D0C2] hover:border-[#7C3AED] transition-colors"
                >
                  <p className="text-xs text-[#6B5F52]">{l}</p>
                  <p className="font-semibold text-[#1E1B4B] text-sm">
                    {v || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Specs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                    {v || "N/A"}
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

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
              ⛙️ Hardware Status
            </h3>
            <div className="grid grid-cols-2 gap-x-8">
              <BoolBadge val={s.wifiWorking} label="WiFi" />
              <BoolBadge val={s.bluetoothWorking} label="Bluetooth" />
              <BoolBadge val={s.touchWorking} label="Touch Sensor" />
              <BoolBadge val={s.camerasWorking} label="Camera" />
              <BoolBadge val={s.speakerWorking} label="Speaker" />
              <BoolBadge val={s.micWorking} label="Microphone" />
              <BoolBadge val={s.fingerPrintWorking} label="Fingerprint" />
            </div>
          </div>

          {/* Warranty */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
              🛡️ Warranty
            </h3>
            {s.warrantyType ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${warrantyColor}`}
                  >
                    {s.warrantyType}
                  </span>
                  {s.warrantyDuration && (
                    <span className="text-sm text-[#6B5F52] font-medium">
                      {s.warrantyDuration}
                    </span>
                  )}
                </div>
                {s.warrantyTerms && (
                  <p className="text-sm text-[#6B5F52] leading-relaxed">
                    {s.warrantyTerms}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#6B5F52]">
                Warranty information not specified.
              </p>
            )}
          </div>
        </div>

        {/* What's in the Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-bold text-[#1E1B4B] text-lg mb-4">
            📦 What's in the Box
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Charger", included: product.chargerIncluded ?? false },
              {
                label: "Original Bill / Invoice",
                included: product.billIncluded ?? false,
              },
              { label: "Original Box", included: product.boxIncluded ?? false },
            ].map(({ label, included }) => (
              <div
                key={label}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  included
                    ? "border-green-200 bg-green-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                {included ? (
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400 mb-2" />
                )}
                <span className="text-sm font-medium text-center text-[#1E1B4B]">
                  {label}
                </span>
                <span
                  className={`text-xs font-semibold mt-1 ${included ? "text-green-600" : "text-red-500"}`}
                >
                  {included ? "Included" : "Not Included"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1E1B4B] text-xl">
              ⭐ Customer Reviews
            </h3>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(avgRating)} />
                <span className="font-bold text-[#1E1B4B]">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-sm text-[#6B5F52]">
                  ({reviews.length})
                </span>
              </div>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="space-y-4 mb-8">
              {reviews.map((r) => (
                <div
                  key={r.id.toString()}
                  className="border border-[#E8E0D5] rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-[#1E1B4B]">
                        {r.reviewerName}
                      </span>
                      <div className="mt-1">
                        <StarRating rating={Number(r.rating)} />
                      </div>
                    </div>
                    <span className="text-xs text-[#6B5F52]">
                      {new Date(
                        Number(r.createdAt) / 1000000,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B5F52] mt-2">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Write Review Form */}
          <div className="bg-[#F5F0E6] rounded-xl p-5">
            <h4 className="font-semibold text-[#1E1B4B] mb-4">
              Write a Review
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white"
              />
              <div>
                <p className="text-xs text-[#6B5F52] mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform duration-150 hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] bg-white resize-none"
              />
              <button
                type="button"
                onClick={submitReview}
                disabled={submittingReview}
                className="bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-purple-300"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
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
                  currency={currency}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
