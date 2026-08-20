import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Product, ProductImage } from "@/types";
import {
  formatCurrency,
  generateWhatsAppMessage,
  getConditionLabel,
} from "@/lib/utils";

type ProductCard = Product & {
  product_images?: ProductImage[];
};

export function ProductGrid({
  products,
  whatsapp,
}: {
  products: ProductCard[];
  whatsapp?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const image = [...(product.product_images || [])].sort(
          (a, b) => a.display_order - b.display_order
        )[0];

        const whatsappUrl = whatsapp
          ? generateWhatsAppMessage(
              whatsapp,
              product.name,
              product.id,
              product.size,
              product.price
            )
          : null;

        return (
          <div
            key={product.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
          >
            {/* PRODUCT LINK */}
            <Link
              href={`/product/${product.id}`}
              className="block"
            >
              {/* IMAGE */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {image ? (
                  <img
                    src={image.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                    No image
                  </div>
                )}

                {/* AVAILABLE */}
                {product.stock_quantity > 0 && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-ink shadow-sm">
                    <CheckCircle2 className="h-3 w-3 text-accent" />
                    Available
                  </div>
                )}

                {/* VIEW */}
                <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* DETAILS */}
              <div className="flex flex-col p-4">
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-accent">
                  {product.category}
                </p>

                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-ink">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    Size {product.size}
                  </p>

                  <p className="truncate text-[10px] font-medium text-muted">
                    {getConditionLabel(product.condition)}
                  </p>
                </div>

                <div className="mt-4 flex items-end justify-between gap-2">
                  <p className="text-base font-black tracking-tight text-ink">
                    {formatCurrency(product.price)}
                  </p>

                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted transition group-hover:text-ink">
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>

            {/* QUICK ORDER */}
            {whatsappUrl && product.stock_quantity > 0 && (
              <div className="px-4 pb-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-charcoal"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Order on WhatsApp
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
