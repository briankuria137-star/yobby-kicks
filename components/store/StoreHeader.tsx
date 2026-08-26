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
    settings.get("business_name") || "Your Business";

  const businessCategory =
    settings.get("business_category") || "Online Store";

  const location =
    settings.get("location") || "Kenya";

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090B]/85 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-all duration-500">
      <div className="luxury-container">
        <div className="flex h-[78px] items-center justify-between gap-6">

          {/* BRAND */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="group shrink-0 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="text-[18px] font-black tracking-[-0.055em] text-white transition-colors duration-300 group-hover:text-accent">
              {businessName}
            </div>

            <div className="eyebrow mt-0.5 text-white/45 transition-colors duration-300 group-hover:text-white/65">
              {businessCategory} / {location}
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-10 md:flex">
            {categories.map(([label, category]) => (
              <Link
                key={category}
                href={`/?category=${category}`}
                className="group relative py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2.5">

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${businessName} on WhatsApp`}
                className="hidden items-center gap-1.5 rounded-full border border-accent/30 bg-accent px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.17em] text-white shadow-[0_12px_35px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400 hover:shadow-[0_20px_50px_rgba(139,92,246,0.32)] active:translate-y-0 md:flex"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
            )}

            <Link
              href="/?category=all"
              className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.055] px-4.5 py-2.5 text-[9px] font-black uppercase tracking-[0.17em] text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)] active:translate-y-0 md:flex"
            >
              Shop
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white active:translate-y-0 md:hidden"
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
        <div className="border-t border-white/10 bg-[#09090B]/95 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:hidden">
          <div className="luxury-container py-6">

            <div className="mb-5 flex items-center justify-between">
              <p className="eyebrow text-accent">
                Browse collection
              </p>

              <Link
                href="/?category=all"
                onClick={() => setMenuOpen(false)}
                className="text-[9px] font-black uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white"
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
                  className="group flex items-center justify-between rounded-2xl border border-transparent px-3 py-4 text-sm font-black transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <span>{label}</span>

                  <ArrowUpRight className="h-4 w-4 text-white/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
              ))}
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-accent/25 bg-accent px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_14px_35px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-400"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}

            <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
              {settings.get("shop_tagline") || "Quality products · Ready for you"}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
