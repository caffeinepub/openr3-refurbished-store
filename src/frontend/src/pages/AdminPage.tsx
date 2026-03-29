import { Edit2, LogIn, LogOut, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Coupon, Feedback, Product, ProductSpecs } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const formatPrice = (paise: number) =>
  `\u20B9${(paise / 100).toLocaleString("en-IN")}`;

const EMPTY_SPECS: ProductSpecs = {
  ram: "",
  storage: "",
  batteryCapacity: "",
  chargingSpeed: "",
  batteryHealth: BigInt(0),
  screenReplaced: false,
  batteryReplaced: false,
  backPanelReplaced: false,
  wifiWorking: true,
  bluetoothWorking: true,
  touchWorking: true,
  camerasWorking: true,
  speakerWorking: true,
  micWorking: true,
  fingerPrintWorking: true,
};

const EMPTY_PRODUCT: Omit<Product, "id" | "createdAt"> = {
  name: "",
  description: "",
  category: "Mobile",
  condition: "Excellent",
  price: BigInt(0),
  imageUrl: "",
  specs: EMPTY_SPECS,
  isActive: true,
};

export function AdminPage() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;

  const [tab, setTab] = useState<"products" | "coupons" | "feedback">(
    "products",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [pForm, setPForm] =
    useState<Omit<Product, "id" | "createdAt">>(EMPTY_PRODUCT);
  const [cForm, setCForm] = useState<Coupon>({
    code: "",
    discountPercent: BigInt(0),
    isActive: true,
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!actor) return;
    try {
      const [p, c, f] = await Promise.all([
        actor.getAllProducts(),
        actor.getAllCoupons(),
        actor.getAllFeedback(),
      ]);
      setProducts(p);
      setCoupons(c);
      setFeedback(f);
    } catch {
      /* ignore */
    }
  }, [actor]);

  useEffect(() => {
    if (isLoggedIn && actor) loadData();
  }, [isLoggedIn, actor, loadData]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-2">
            Admin Panel
          </h2>
          <p className="text-[#6B5F52] mb-6">
            Login with Internet Identity to access the admin panel.
          </p>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-xl hover:from-[#3B0764] hover:to-[#6D28D9] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
          </button>
        </div>
      </div>
    );
  }

  const saveProduct = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const productData: Product = {
        ...pForm,
        id: editProduct ? editProduct.id : BigInt(0),
        createdAt: editProduct ? editProduct.createdAt : BigInt(Date.now()),
        price: BigInt(Math.round(Number(pForm.price))),
        specs: {
          ...pForm.specs,
          batteryHealth: BigInt(Number(pForm.specs.batteryHealth)),
        },
      };
      if (editProduct) {
        await actor.updateProduct(editProduct.id, productData);
        toast.success("Product updated!");
      } else {
        await actor.addProduct(productData);
        toast.success("Product added!");
      }
      setShowProductForm(false);
      setEditProduct(null);
      setPForm(EMPTY_PRODUCT);
      await loadData();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: bigint) => {
    if (!actor || !confirm("Delete this product?")) return;
    await actor.deleteProduct(id);
    toast.success("Product deleted");
    await loadData();
  };

  const saveCoupon = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      await actor.addCoupon({
        ...cForm,
        discountPercent: BigInt(Number(cForm.discountPercent)),
      });
      toast.success("Coupon added!");
      setShowCouponForm(false);
      setCForm({
        code: "",
        discountPercent: BigInt(0),
        isActive: true,
        description: "",
      });
      await loadData();
    } catch {
      toast.error("Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (code: string) => {
    if (!actor || !confirm("Delete this coupon?")) return;
    await actor.deleteCoupon(code);
    toast.success("Coupon deleted");
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E1B4B]">Admin Panel</h1>
            <p className="text-[#6B5F52] text-sm">
              Manage products, coupons & feedback
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="flex items-center gap-2 text-sm text-[#6B5F52] border border-[#D9D0C2] rounded-xl px-4 py-2 hover:bg-[#EFE7D8]"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["products", "coupons", "feedback"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm capitalize transition-all ${
                tab === t
                  ? "bg-[#1E1B4B] text-white"
                  : "bg-white text-[#1E1B4B] border border-[#D9D0C2] hover:bg-[#EFE7D8]"
              }`}
            >
              {t}{" "}
              {t === "products"
                ? `(${products.length})`
                : t === "coupons"
                  ? `(${coupons.length})`
                  : `(${feedback.length})`}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  setEditProduct(null);
                  setPForm(EMPTY_PRODUCT);
                  setShowProductForm(true);
                }}
                className="bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#F5F0E6]">
                  <tr>
                    {[
                      "Image",
                      "Name",
                      "Category",
                      "Condition",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left p-4 text-xs text-[#6B5F52] font-semibold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id.toString()}
                      className="border-t border-[#F0EBE3] hover:bg-[#FAF7F2]"
                    >
                      <td className="p-4">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100";
                          }}
                        />
                      </td>
                      <td className="p-4 font-medium text-sm text-[#1E1B4B] max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="p-4 text-sm text-[#6B5F52]">
                        {p.category}
                      </td>
                      <td className="p-4">
                        <span className="text-xs bg-[#EFE7D8] text-[#1E1B4B] px-2 py-0.5 rounded-full">
                          {p.condition}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-sm">
                        {formatPrice(Number(p.price))}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditProduct(p);
                              setPForm({
                                name: p.name,
                                description: p.description,
                                category: p.category,
                                condition: p.condition,
                                price: p.price,
                                imageUrl: p.imageUrl,
                                specs: p.specs,
                                isActive: p.isActive,
                              });
                              setShowProductForm(true);
                            }}
                            className="p-2 rounded-lg bg-[#EFE7D8] hover:bg-[#E0D5C5] text-[#1E1B4B]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {tab === "coupons" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setShowCouponForm(true)}
                className="bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Coupon
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F5F0E6]">
                  <tr>
                    {[
                      "Code",
                      "Description",
                      "Discount",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left p-4 text-xs text-[#6B5F52] font-semibold uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code} className="border-t border-[#F0EBE3]">
                      <td className="p-4 font-mono font-bold text-[#7C3AED]">
                        {c.code}
                      </td>
                      <td className="p-4 text-sm text-[#6B5F52]">
                        {c.description}
                      </td>
                      <td className="p-4 font-semibold text-green-600">
                        {c.discountPercent.toString()}%
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => deleteCoupon(c.code)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {tab === "feedback" && (
          <div className="space-y-4">
            {feedback.map((f) => (
              <div
                key={f.id.toString()}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="font-semibold text-[#1E1B4B]">
                      {f.name}
                    </span>
                    <span className="text-xs text-[#6B5F52] ml-2">
                      {f.email}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B5F52]">
                    {new Date(
                      Number(f.createdAt) / 1000000,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#6B5F52]">{f.message}</p>
              </div>
            ))}
            {feedback.length === 0 && (
              <div className="text-center py-10 text-[#6B5F52]">
                No feedback yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-bold text-[#1E1B4B] mb-6">
              {editProduct ? "Edit" : "Add"} Product
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Image URL", key: "imageUrl", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key} className="col-span-2">
                  <label
                    htmlFor="field-1"
                    className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                  >
                    {label}
                  </label>
                  <input
                    id="field-1"
                    type={type}
                    value={String(
                      (pForm as Record<string, unknown>)[key] ?? "",
                    )}
                    onChange={(e) =>
                      setPForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label
                  htmlFor="field-2"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Description
                </label>
                <textarea
                  id="field-2"
                  value={pForm.description}
                  onChange={(e) =>
                    setPForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label
                  htmlFor="field-3"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Category
                </label>
                <select
                  id="field-3"
                  value={pForm.category}
                  onChange={(e) =>
                    setPForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  {["Mobile", "Tablet", "Laptop"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="field-4"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Condition
                </label>
                <select
                  id="field-4"
                  value={pForm.condition}
                  onChange={(e) =>
                    setPForm((f) => ({ ...f, condition: e.target.value }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                >
                  {[
                    "Excellent",
                    "Mint",
                    "Open Box",
                    "Good",
                    "Average",
                    "Fair",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="field-5"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Price (&#x20B9;)
                </label>
                <input
                  id="field-5"
                  type="number"
                  value={Number(pForm.price) / 100}
                  onChange={(e) =>
                    setPForm((f) => ({
                      ...f,
                      price: BigInt(
                        Math.round(
                          Number.parseFloat(e.target.value || "0") * 100,
                        ),
                      ),
                    }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label
                  htmlFor="field-6"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Battery Health (%)
                </label>
                <input
                  id="field-6"
                  type="number"
                  min={0}
                  max={100}
                  value={Number(pForm.specs.batteryHealth)}
                  onChange={(e) =>
                    setPForm((f) => ({
                      ...f,
                      specs: {
                        ...f.specs,
                        batteryHealth: BigInt(e.target.value || "0"),
                      },
                    }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              {(
                ["ram", "storage", "batteryCapacity", "chargingSpeed"] as const
              ).map((key) => (
                <div key={key}>
                  <label
                    htmlFor="field-7"
                    className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                  >
                    {key}
                  </label>
                  <input
                    id="field-7"
                    type="text"
                    value={pForm.specs[key]}
                    onChange={(e) =>
                      setPForm((f) => ({
                        ...f,
                        specs: { ...f.specs, [key]: e.target.value },
                      }))
                    }
                    className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-[#6B5F52] uppercase mb-2">
                  Replaced Parts &amp; Hardware
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ["screenReplaced", "Screen Replaced"],
                      ["batteryReplaced", "Battery Replaced"],
                      ["backPanelReplaced", "Back Panel Replaced"],
                      ["wifiWorking", "WiFi"],
                      ["bluetoothWorking", "Bluetooth"],
                      ["touchWorking", "Touch"],
                      ["camerasWorking", "Camera"],
                      ["speakerWorking", "Speaker"],
                      ["micWorking", "Mic"],
                      ["fingerPrintWorking", "Fingerprint"],
                    ] as [keyof ProductSpecs, string][]
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(pForm.specs[key])}
                        onChange={(e) =>
                          setPForm((f) => ({
                            ...f,
                            specs: { ...f.specs, [key]: e.target.checked },
                          }))
                        }
                        className="rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
                  setEditProduct(null);
                }}
                className="flex-1 border border-[#D9D0C2] py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProduct}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-xl disabled:opacity-60"
              >
                {loading ? "Saving..." : editProduct ? "Update" : "Add"} Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#1E1B4B] mb-4">
              Add Coupon
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="field-8"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Code
                </label>
                <input
                  id="field-8"
                  value={cForm.code}
                  onChange={(e) =>
                    setCForm((f) => ({
                      ...f,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label
                  htmlFor="field-9"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Description
                </label>
                <input
                  id="field-9"
                  value={cForm.description}
                  onChange={(e) =>
                    setCForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
              <div>
                <label
                  htmlFor="field-10"
                  className="text-xs font-semibold text-[#6B5F52] uppercase mb-1 block"
                >
                  Discount %
                </label>
                <input
                  id="field-10"
                  type="number"
                  min={1}
                  max={100}
                  value={Number(cForm.discountPercent)}
                  onChange={(e) =>
                    setCForm((f) => ({
                      ...f,
                      discountPercent: BigInt(e.target.value || "0"),
                    }))
                  }
                  className="w-full border border-[#D9D0C2] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCouponForm(false)}
                className="flex-1 border border-[#D9D0C2] py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCoupon}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white font-bold py-3 rounded-xl disabled:opacity-60"
              >
                {loading ? "Saving..." : "Add Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
