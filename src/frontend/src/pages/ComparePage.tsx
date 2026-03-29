import { CheckCircle, X, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Currency } from "../App";
import { formatPrice } from "../App";
import type { Product } from "../backend.d";
import { ConditionBadge } from "../components/ConditionBadge";
import { useActor } from "../hooks/useActor";

interface Props {
  initialIds?: string[];
  currency?: Currency;
}

export function ComparePage({ initialIds = [], currency = "INR" }: Props) {
  const { actor } = useActor();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>(initialIds.slice(0, 3));
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!actor) return;
    actor.getAllProducts().then(setAllProducts);
  }, [actor]);

  const compared = allProducts.filter((p) =>
    selected.includes(p.id.toString()),
  );
  const filtered = allProducts
    .filter(
      (p) =>
        !selected.includes(p.id.toString()) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())),
    )
    .slice(0, 8);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );

  const specRows: {
    label: string;
    key: string;
    isPrice?: boolean;
    isBool?: boolean;
  }[] = [
    { label: "Price", key: "price", isPrice: true },
    { label: "Category", key: "category" },
    { label: "Condition", key: "condition" },
    { label: "RAM", key: "ram" },
    { label: "Storage", key: "storage" },
    { label: "Battery", key: "batteryCapacity" },
    { label: "Charging", key: "chargingSpeed" },
    { label: "Battery Health", key: "batteryHealth" },
    { label: "Screen Replaced", key: "screenReplaced", isBool: true },
    { label: "Battery Replaced", key: "batteryReplaced", isBool: true },
    { label: "Back Panel Replaced", key: "backPanelReplaced", isBool: true },
    { label: "WiFi", key: "wifiWorking", isBool: true },
    { label: "Bluetooth", key: "bluetoothWorking", isBool: true },
    { label: "Touch", key: "touchWorking", isBool: true },
    { label: "Camera", key: "camerasWorking", isBool: true },
    { label: "Speaker", key: "speakerWorking", isBool: true },
    { label: "Mic", key: "micWorking", isBool: true },
    { label: "Fingerprint", key: "fingerPrintWorking", isBool: true },
  ];

  const getValue = (p: Product, key: string) => {
    if (key === "price") return Number(p.price);
    if (key === "condition") return p.condition;
    if (key === "category") return p.category;
    return (p.specs as unknown as Record<string, unknown>)[key];
  };

  const minPrice =
    compared.length > 1
      ? Math.min(...compared.map((p) => Number(p.price)))
      : null;

  return (
    <div className="min-h-screen bg-[#F5F0E6] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E1B4B] mb-2">
          Compare Devices
        </h1>
        <p className="text-[#6B5F52] mb-8">
          Select up to 3 devices to compare side-by-side
        </p>

        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices to compare..."
            className="w-full border border-[#D9D0C2] rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {filtered.map((p) => (
              <button
                type="button"
                key={p.id.toString()}
                onClick={() => toggle(p.id.toString())}
                disabled={selected.length >= 3}
                className="text-left p-3 border border-[#D9D0C2] rounded-xl hover:border-[#7C3AED] hover:scale-105 transition-all text-sm disabled:opacity-50"
              >
                <p className="font-medium text-[#1E1B4B] truncate">{p.name}</p>
                <p className="text-xs text-[#6B5F52]">
                  {p.category} &bull; {p.condition}
                </p>
              </button>
            ))}
          </div>
          {selected.length >= 3 && (
            <p className="text-xs text-orange-500 mt-2">
              Maximum 3 devices selected
            </p>
          )}
        </div>

        {compared.length === 0 ? (
          <div className="text-center py-20 text-[#6B5F52]">
            <p className="text-5xl mb-4">⇄</p>
            <p className="font-semibold text-lg">
              Select devices above to compare
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#D9D0C2]">
                  <th className="text-left p-4 text-sm text-[#6B5F52] w-36">
                    Spec
                  </th>
                  {compared.map((p) => (
                    <th key={p.id.toString()} className="p-4 text-center">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggle(p.id.toString())}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-xl mx-auto mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200";
                          }}
                        />
                        <p className="font-semibold text-[#1E1B4B] text-sm text-center">
                          {p.name}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map(({ label, key, isPrice, isBool }) => (
                  <tr
                    key={label}
                    className="border-b border-[#F0EBE3] hover:bg-[#FAF7F2]"
                  >
                    <td className="p-4 text-sm text-[#6B5F52] font-medium">
                      {label}
                    </td>
                    {compared.map((p) => {
                      const val = getValue(p, key);
                      const isLowest =
                        isPrice && val === minPrice && compared.length > 1;
                      return (
                        <td
                          key={p.id.toString()}
                          className={`p-4 text-center text-sm ${isLowest ? "text-green-700 font-bold" : "text-[#1E1B4B]"}`}
                        >
                          {isBool ? (
                            val ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : isPrice ? (
                            <span
                              className={
                                isLowest
                                  ? "bg-green-50 px-2 py-0.5 rounded-full"
                                  : ""
                              }
                            >
                              {formatPrice(val as number, currency)}
                              {isLowest && " ⭐"}
                            </span>
                          ) : key === "condition" ? (
                            <ConditionBadge condition={val as string} />
                          ) : key === "batteryHealth" ? (
                            `${val}%`
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
