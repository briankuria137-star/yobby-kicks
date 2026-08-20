import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Product, ProductImage } from "@/types";
import { formatCurrency, getConditionLabel } from "@/lib/utils";

type ProductCard = Product & { product_images?: ProductImage[] };

export function ProductGrid({
  products,
}: {
  products: ProductCard[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const image = [...(product.product_images || [])].sort(
          (a, b) => a.display_order - b.display_order
        )[0];

        const condition = getConditionLabel(product.condition);
        const isLowStock =
          product.stock_quantity > 0 && product.stock_quantity <= 2;

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-[#EEECE7]">
              {image ? (
                <img
                  src={image.image_url}
                  alt={`${product.name} - YobbyKicks_KE`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted">
                  No image
                </div>
              )}

              {/* Condition badge */}
              <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-ink shadow-sm">
                {condition}
              </div>

              {/* Stock badge */}
              {isLowStock && (
                <div className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                  {product.stock_quantity === 1
                    ? "1 left"
                    : `${product.stock_quantity} left`}
                </div>
              )}

              {/* View overlay */}
              <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-full bg-ink/95 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span>View pair</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Details */}
            <div className="p-4">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
                {product.category}
              </p>

              <h3 className="truncate text-sm font-bold tracking-tight text-ink">
                {product.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                <span>Size {product.size}</span>
                <span className="h-1 w-1 rounded-full bg-black/20" />
                <span>{condition}</span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-2">
                <p className="text-base font-black text-ink">
                  {formatCurrency(product.price)}
                </p>

                {product.stock_quantity > 0 && (
                  <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                    Available
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
