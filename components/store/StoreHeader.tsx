"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";

export function StoreHeader({
  settings,
}: {
  settings: Map<string, string>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const businessName =
    settings.get("business_name") || "YobbyKicks_KE";

  const whatsapp = settings.get("whatsapp_number");

  const categories = [
    ["Men", "men"],
    ["Women", "women"],
    ["Kids", "kids"],
    ["Unisex", "unisex"],
  ];

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        `Hello ${businessName}! 👋\n\nI'd like to enquire about your footwear collection.`
      )}`
    : null;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur-xl">
      <div className="luxury-container">
        <div className="flex h-[76px] items-center justify-between">

          {/* BRAND */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="group shrink-0"
          >
            <div className="text-[17px] font-black tracking-[-0.045em] transition group-hover:opacity-70">
              {businessName}
            </div>

            <div className="eyebrow mt-0.5 text-muted">
              Footwear / Mwihoko
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 md:flex">
            {categories.map(([label, category]) => (
              <Link
                key={category}
                href={`/?category=${category}`}
                className="relative py-2 text-xs font-semibold uppercase tracking-widest text-muted transition hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with YobbyKicks on WhatsApp"
                className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-sm md:flex"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}

            <Link
              href="/?category=all"
              className="hidden items-center gap-1.5 rounded-full border border-black/10 bg-white/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm md:flex"
            >
              Shop
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="rounded-full border border-black/10 bg-white/50 p-2.5 transition hover:bg-white md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-black/10 bg-cream md:hidden">
          <div className="luxury-container py-5">

            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow text-accent">
                Browse collection
              </p>

              <Link
                href="/?category=all"
                onClick={() => setMenuOpen(false)}
                className="text-[10px] font-bold uppercase tracking-widest text-muted"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-1">
              {categories.map(([label, category]) => (
                <Link
                  key={category}
                  href={`/?category=${category}`}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between border-b border-black/10 py-4 text-sm font-semibold"
                >
                  <span>{label}</span>

                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              ))}
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-5 flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-charcoal"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}

            <p className="mt-5 text-center text-[10px] uppercase tracking-widest text-muted">
              Quality mtumba footwear · Mwihoko
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
