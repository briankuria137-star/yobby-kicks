"use client";

import { useState } from "react";
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

  const [activeImage, setActiveImage] = useState(0);

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

  const currentImage = images[activeImage] || images[0];

  return (
    <div className="luxury-container py-8 md:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* PRODUCT IMAGES */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white">
            {currentImage ? (
              <img
                src={currentImage.image_url}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                No image available
              </div>
            )}

            {product.stock_quantity > 0 && (
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                Available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View ${product.name} image ${index + 1}`}
                  className={`aspect-square overflow-hidden rounded-xl border bg-white transition ${
                    index === activeImage
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="lg:pt-4">
          <p className="eyebrow text-accent">
            {product.category} / {businessName}
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-black">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Size
              </p>
              <p className="mt-2 text-sm font-bold">{product.size}</p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Condition
              </p>
              <p className="mt-2 text-sm font-bold">
                {getConditionLabel(product.condition)}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Availability
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                {product.stock_quantity > 0 ? "Available" : "Sold"}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Stock
              </p>
              <p className="mt-2 text-sm font-bold">
                {product.stock_quantity}{" "}
                {product.stock_quantity === 1 ? "pair" : "pairs"}
              </p>
            </div>
          </div>

          {product.description && (
            <div className="mt-8">
              <p className="eyebrow text-accent">About this pair</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
                {product.description}
              </p>
            </div>
          )}

          {product.condition_description && (
            <div className="mt-5 rounded-2xl bg-sand/40 p-5">
              <p className="text-xs font-bold uppercase tracking-widest">
                Condition notes
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {product.condition_description}
              </p>
            </div>
          )}

          {whatsappUrl && product.stock_quantity > 0 && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:-translate-y-0.5 hover:bg-charcoal hover:shadow-soft"
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white p-3">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Quality checked
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white p-3">
              <Truck className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Delivery available
              </span>
            </div>
          </div>

          {settings.get("delivery_info") && (
            <p className="mt-5 text-center text-xs leading-5 text-muted">
              {settings.get("delivery_info")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
