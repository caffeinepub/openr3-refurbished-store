import React, { useState } from "react";
import { Toaster } from "sonner";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CategoryPage } from "./pages/CategoryPage";
import { ComparePage } from "./pages/ComparePage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export type Page =
  | "home"
  | "mobiles"
  | "tablets"
  | "laptops"
  | "smartwatches"
  | "cart"
  | "compare"
  | "admin"
  | "product";

export type Currency = "INR" | "USD";

export function formatPrice(paise: number, currency: Currency = "INR"): string {
  if (currency === "USD") return `$${(paise / 100 / 83).toFixed(2)}`;
  return `\u20B9${(paise / 100).toLocaleString("en-IN")}`;
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>("INR");

  const navigate = (p: Page, id?: string) => {
    setPage(p);
    if (id) setProductId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCurrency = () =>
    setCurrency((c) => (c === "INR" ? "USD" : "INR"));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <HomePage
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
      case "mobiles":
        return (
          <CategoryPage
            category="Mobile"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
      case "tablets":
        return (
          <CategoryPage
            category="Tablet"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
      case "laptops":
        return (
          <CategoryPage
            category="Laptop"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
      case "smartwatches":
        return (
          <CategoryPage
            category="SmartWatch"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
      case "product":
        return productId ? (
          <ProductDetailPage
            productId={productId}
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        ) : null;
      case "cart":
        return <CartPage onNavigate={navigate} currency={currency} />;
      case "compare":
        return <ComparePage initialIds={compareIds} currency={currency} />;
      case "admin":
        return <AdminPage />;
      default:
        return (
          <HomePage
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            currency={currency}
          />
        );
    }
  };

  const noFooterPages: Page[] = ["admin"];

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <Header
        currentPage={page}
        onNavigate={navigate}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />
      <main className="flex-1">{renderPage()}</main>
      {!noFooterPages.includes(page) && (
        <Footer onNavigate={(p) => navigate(p as Page)} />
      )}
    </div>
  );
}
