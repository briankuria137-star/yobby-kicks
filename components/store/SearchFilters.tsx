"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (category !== "all") params.set("category", category);

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
    <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-surface/90 p-3 shadow-[0_18px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-500 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/70 transition-colors duration-300" />

          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
            placeholder="Search shoes..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm font-medium text-ink outline-none transition-all duration-300 placeholder:text-zinc-400 hover:border-white/20 focus:border-accent/60 focus:bg-black/30 focus:ring-2 focus:ring-accent/10"
          />
        </div>

        {/* CATEGORY */}
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-accent/70" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-black/20 pl-9 pr-8 text-xs font-black uppercase tracking-[0.12em] text-ink outline-none transition-all duration-300 hover:border-white/20 focus:border-accent/60 focus:ring-2 focus:ring-accent/10 sm:w-[180px]"
          >
            <option value="all">All footwear</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* SEARCH BUTTON */}
        <button
          type="button"
          onClick={applyFilters}
          className="h-12 rounded-2xl bg-accent px-6 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_35px_rgba(139,92,246,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-400 hover:shadow-[0_18px_45px_rgba(139,92,246,0.32)] active:translate-y-0"
        >
          Search
        </button>

        {/* CLEAR */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            aria-label="Clear filters"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-400/30 hover:bg-pink-500/10 hover:text-pink-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ACTIVE FILTERS */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Browse
        </span>

        <span className="rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-accent transition-colors duration-300">
          {category === "all" ? "All footwear" : category}
        </span>

        {q.trim() && (
          <span className="max-w-[180px] truncate rounded-full border border-pink-400/20 bg-pink-500/10 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-pink-200">
            “{q.trim()}”
          </span>
        )}
      </div>
    </div>
  );
}
