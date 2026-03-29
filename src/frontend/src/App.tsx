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
  | "cart"
  | "compare"
  | "admin"
  | "product";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const navigate = (p: Page, id?: string) => {
    setPage(p);
    if (id) setProductId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          />
        );
      case "mobiles":
        return (
          <CategoryPage
            category="Mobile"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        );
      case "tablets":
        return (
          <CategoryPage
            category="Tablet"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        );
      case "laptops":
        return (
          <CategoryPage
            category="Laptop"
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        );
      case "product":
        return productId ? (
          <ProductDetailPage
            productId={productId}
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        ) : null;
      case "cart":
        return <CartPage onNavigate={navigate} />;
      case "compare":
        return <ComparePage initialIds={compareIds} />;
      case "admin":
        return <AdminPage />;
      default:
        return (
          <HomePage
            onNavigate={navigate}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
          />
        );
    }
  };

  const noFooterPages: Page[] = ["admin"];

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <Header currentPage={page} onNavigate={navigate} />
      <main className="flex-1">{renderPage()}</main>
      {!noFooterPages.includes(page) && (
        <Footer onNavigate={(p) => navigate(p as Page)} />
      )}
    </div>
  );
}
