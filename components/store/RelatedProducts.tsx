"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  product_images?: {
    id: string;
    image_url: string;
    display_order: number;
  }[];
};

export function RelatedProducts({
  products,
}: {
  products: RelatedProduct[];
}) {
  if (!products.length) return null;

  return (
    <section className="luxury-container py-16 md:py-20 lg:py-24">
      <div className="mb-9 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-accent">Keep exploring</p>

          <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
            You may also like
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
            More pairs from our current collection.
          </p>
        </div>

        <Link
          href="/"
          className="group hidden shrink-0 items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent sm:flex"
        >
          View collection
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {products.map((product) => {
          const image = [...(product.product_images || [])].sort(
            (a, b) => a.display_order - b.display_order
          )[0];

          return (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.07)] transition-all duration-500 hover:-translate-y-1 hover:border-accent/20 hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)] sm:rounded-[1.75rem]"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                {image ? (
                  <img
                    src={image.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-widest text-muted">
                    No image
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent opacity-70" />

                <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/65 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                  {product.category}
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <p className="line-clamp-1 text-sm font-bold tracking-tight">
                  {product.name}
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-black text-accent sm:text-base">
                    {formatCurrency(product.price)}
                  </p>

                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-accent">
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent sm:hidden"
      >
        View full collection
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
