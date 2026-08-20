"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

export function StoreHeader({
  settings,
}: {
  settings: Map<string, string>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          {settings.get("business_name") || "MWIHO KICKS"}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/?category=men" className="text-gray-600 hover:text-gray-900">Men</Link>
          <Link href="/?category=women" className="text-gray-600 hover:text-gray-900">Women</Link>
          <Link href="/?category=kids" className="text-gray-600 hover:text-gray-900">Kids</Link>
          <Link href="/?category=unisex" className="text-gray-600 hover:text-gray-900">Unisex</Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          <Link href="/?category=men" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2">Men</Link>
          <Link href="/?category=women" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2">Women</Link>
          <Link href="/?category=kids" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2">Kids</Link>
          <Link href="/?category=unisex" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-2">Unisex</Link>
        </div>
      )}
    </header>
  );
}
