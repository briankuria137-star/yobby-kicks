"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function StoreHeader({
  settings,
}: {
  settings: Map<string, string>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const businessName = settings.get("business_name") || "MWIHO KICKS";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur-md">
      <div className="luxury-container">
        <div className="flex h-[72px] items-center justify-between">
          <Link href="/" className="group">
            <div className="text-[17px] font-black tracking-[-0.04em]">
              {businessName}
            </div>
            <div className="eyebrow mt-0.5 text-muted">
              Footwear / Mwihoko
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/?category=men"
              className="text-xs font-medium uppercase tracking-widest text-muted transition hover:text-ink"
            >
              Men
            </Link>
            <Link
              href="/?category=women"
              className="text-xs font-medium uppercase tracking-widest text-muted transition hover:text-ink"
            >
              Women
            </Link>
            <Link
              href="/?category=kids"
              className="text-xs font-medium uppercase tracking-widest text-muted transition hover:text-ink"
            >
              Kids
            </Link>
            <Link
              href="/?category=unisex"
              className="text-xs font-medium uppercase tracking-widest text-muted transition hover:text-ink"
            >
              Unisex
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/?category=all"
              className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-widest md:flex"
            >
              Shop
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              aria-label="Open menu"
              className="rounded-full border border-black/10 p-2.5 transition hover:bg-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/10 bg-cream md:hidden">
          <div className="luxury-container py-5">
            <div className="grid gap-1">
              {[
                ["Men", "men"],
                ["Women", "women"],
                ["Kids", "kids"],
                ["Unisex", "unisex"],
              ].map(([label, category]) => (
                <Link
                  key={category}
                  href={`/?category=${category}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-black/10 py-4 text-sm font-medium"
                >
                  {label}
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
