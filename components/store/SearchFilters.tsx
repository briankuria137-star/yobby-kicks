"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (q.trim()) {
      params.set("q", q.trim());
    }

    if (category && category !== "all") {
      params.set("category", category);
    }

    const query = params.toString();
    router.push(query ? `/?${query}#shop` : "/#shop");
  };

  const clearFilters = () => {
    setQ("");
    setCategory("all");
    router.push("/#shop");
  };

  const hasFilters = q.trim() !== "" || category !== "all";

  return (
    <div className="mb-8 rounded-2xl border border-black/10 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 md:flex-row">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

          <input
            type="search"
            placeholder="Search shoes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters();
              }
            }}
            className="h-11 w-full rounded-xl border border-black/10 bg-cream pl-11 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-black/25 focus:bg-white"
          />
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex">
          <div className="relative flex-1 sm:flex-none">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-black/10 bg-cream pl-9 pr-8 text-xs font-semibold uppercase tracking-wide outline-none transition focus:border-black/25 sm:w-[170px]"
            >
              <option value="all">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="h-11 rounded-xl bg-ink px-5 text-xs font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-charcoal"
          >
            Search
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              aria-label="Clear filters"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-muted transition hover:bg-cream hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE FILTER */}
      {hasFilters && (
        <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">
            Filtering
          </span>

          {q.trim() && (
            <span className="rounded-full bg-sand/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide">
              “{q.trim()}”
            </span>
          )}

          {category !== "all" && (
            <span className="rounded-full bg-sand/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wide">
              {category}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
