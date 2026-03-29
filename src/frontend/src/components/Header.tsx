import { Menu, ShoppingCart, X } from "lucide-react";
import React, { useState } from "react";
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

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page, id?: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const items = useCart((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Mobiles", page: "mobiles" },
    { label: "Tablets", page: "tablets" },
    { label: "Laptops", page: "laptops" },
    { label: "Compare", page: "compare" },
    { label: "Admin", page: "admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white text-center text-xs py-1.5 font-medium">
        🚚 Free Delivery on Orders Above ₹999 &nbsp;|&nbsp; ✅ Certified
        Refurbished Electronics &nbsp;|&nbsp; 🔒 Secure Payments
      </div>
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src="/assets/uploads/openr3_logo-019d3980-c9b5-76dc-ab8f-78ec4c9fe7e9-1.png"
            alt="OPEN R3"
            className="h-10 w-auto"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, page }) => (
            <button
              type="button"
              key={page}
              onClick={() => onNavigate(page)}
              className={`text-sm font-medium transition-colors ${
                currentPage === page
                  ? "text-[#7C3AED] font-semibold"
                  : "text-[#1E1B4B] hover:text-[#7C3AED]"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("cart")}
            className="relative p-2 rounded-full hover:bg-[#EFE7D8] transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-[#1E1B4B]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-[#EFE7D8]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#D9D0C2] px-4 py-3 flex flex-col gap-3">
          {navLinks.map(({ label, page }) => (
            <button
              type="button"
              key={page}
              onClick={() => {
                onNavigate(page);
                setMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-[#EFE7D8] text-[#7C3AED]"
                  : "text-[#1E1B4B] hover:bg-[#F5F0E6]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
