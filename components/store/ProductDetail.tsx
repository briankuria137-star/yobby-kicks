import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Product, ProductImage } from "@/types";
import {
  formatCurrency,
  generateWhatsAppMessage,
  getConditionLabel,
} from "@/lib/utils";

type ProductDetailData = Product & {
  product_images?: ProductImage[];
};

export function ProductDetail({
  product,
  settings,
}: {
  product: ProductDetailData;
  settings: Map<string, string>;
}) {
  const images = [...(product.product_images || [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  const whatsapp = settings.get("whatsapp_number");

  const whatsappUrl = whatsapp
    ? generateWhatsAppMessage(
        whatsapp,
        product.name,
        product.id,
        product.size,
        product.price
      )
    : null;

  const businessName =
    settings.get("business_name") || "YobbyKicks_KE";

  const deliveryInfo =
    settings.get("delivery_info") ||
    "Delivery options are available. Contact us to confirm availability and delivery arrangements.";

  const condition = getConditionLabel(product.condition);

  const available = product.stock_quantity > 0;

  return (
    <div className="luxury-container py-8 md:py-12">
      {/* Back navigation */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* IMAGE GALLERY */}
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-2xl border border-black/10 bg-white">
            {images[0] ? (
              <img
                src={images[0].image_url}
                alt={`${product.name} - ${businessName}`}
                className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted">
                No image available
              </div>
            )}

            <div className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-white">
              {condition}
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} alternate view`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="lg:pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            {product.category} footwear
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-black text-ink">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-black/10 bg-white p-4">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-muted">
                Size
              </span>
              <strong className="mt-1 block text-sm text-ink">
                {product.size}
              </strong>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-muted">
                Condition
              </span>
              <strong className="mt-1 block text-sm text-ink">
                {condition}
              </strong>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-muted">
                Availability
              </span>

              <strong className="mt-1 flex items-center gap-1.5 text-sm text-ink">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {available ? "Available" : "Sold"}
              </strong>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-4">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-muted">
                Stock
              </span>

              <strong className="mt-1 block text-sm text-ink">
                {available
                  ? `${product.stock_quantity} ${
                      product.stock_quantity === 1 ? "pair" : "pairs"
                    }`
                  : "Sold out"}
              </strong>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-7 border-t border-black/10 pt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                About this pair
              </p>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
                {product.description}
              </p>
            </div>
          )}

          {/* Condition notes */}
          {product.condition_description && (
            <div className="mt-5 rounded-xl bg-sand/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink">
                Condition notes
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {product.condition_description}
              </p>
            </div>
          )}

          {/* WhatsApp order */}
          {whatsappUrl && available && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-soft"
            >
              <MessageCircle className="h-5 w-5" />
              Order this pair on WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          {/* Customer reassurance */}
          <div className="mt-6 grid gap-3 border-t border-black/10 pt-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

              <div>
                <p className="text-xs font-bold text-ink">
                  Quality-focused selection
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  We aim to provide accurate product information so you can
                  shop with confidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

              <div>
                <p className="text-xs font-bold text-ink">
                  Delivery information
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  {deliveryInfo}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-muted">
            Availability is confirmed when your order is placed.
          </p>
        </div>
      </div>
    </div>
  );
}
