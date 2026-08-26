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
  businessName,
}: {
  products: ProductCard[];
  whatsapp?: string;
  businessName?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => {
        const image = [...(product.product_images || [])].sort(
          (a, b) => a.display_order - b.display_order
        )[0];

        const whatsappUrl = whatsapp
          ? generateWhatsAppMessage(
              whatsapp,
              businessName || "Your Business",
              product.name,
              product.id,
              product.size,
              product.price
            )
          : null;

        const isNew =
          Date.now() - new Date(product.created_at).getTime() <
          7 * 24 * 60 * 60 * 1000;

        return (
          <article
            key={product.id}
            className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-surface/90 backdrop-blur-xl transition-all duration-700 ease-out ${product.stock_quantity === 0 ? "border-white/10 opacity-75 grayscale-[0.35]" : product.stock_quantity <= 2 ? "border-amber-300/20 shadow-[0_22px_75px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-amber-300/35 hover:shadow-[0_30px_85px_rgba(0,0,0,0.28)]" : "border-white/10 shadow-[0_22px_75px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_35px_100px_rgba(0,0,0,0.34)]"}`}
            style={{
              animationDelay: `${Math.min(index * 60, 420)}ms`,
            }}
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative aspect-square overflow-hidden bg-black/30">
                {image ? (
                  <img
                    src={image.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
                    No image
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
                {product.stock_quantity === 0 && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-full border border-white/20 bg-black/75 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                      Sold out
                    </span>
                  </div>
                )}

                {isNew && (
                  <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-pink-500 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-pink-500/20">
                    New arrival
                  </div>
                )}

                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                  {product.stock_quantity === 0 ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      Sold out
                    </>
                  ) : product.stock_quantity <= 2 ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-300" />
                      Low stock
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 text-lime-300" />
                      Available
                    </>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div className="relative flex min-w-0 flex-col p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-accent">
                    {product.category}
                  </p>

                  <span className="yk-number">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-ink transition-colors group-hover:text-accent">
                  {product.name}
                </h3>

                {product.stock_quantity <= 2 && product.stock_quantity > 0 && (
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-amber-500">
                    Only {product.stock_quantity} {product.stock_quantity === 1 ? "pair" : "pairs"} left
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted">
                      Size
                    </p>
                    <p className="mt-1 break-words text-[10px] font-black leading-4 text-ink">
                      {product.size}
                    </p>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted">
                      Condition
                    </p>
                    <p className="mt-1 break-words text-[10px] font-black leading-4 text-ink">
                      {getConditionLabel(product.condition)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted">
                      Price
                    </p>
                    <p className="mt-0.5 text-lg font-black tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-accent">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.18em] text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                    Details
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>

            {whatsappUrl && product.stock_quantity > 0 && (
              <div className="px-4 pb-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/30 bg-accent px-4 py-3.5 text-[8px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_35px_rgba(139,92,246,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400 hover:shadow-[0_20px_50px_rgba(139,92,246,0.28)] active:translate-y-0"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Order on WhatsApp
                </a>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
