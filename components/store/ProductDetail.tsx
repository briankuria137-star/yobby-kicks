"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [activeImage]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || images.length <= 1) return;

    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX.current;

    if (Math.abs(distance) > 50) {
      setActiveImage((current) =>
        distance < 0
          ? (current + 1) % images.length
          : (current - 1 + images.length) % images.length
      );
    }

    touchStartX.current = null;
  };

  const whatsapp = settings.get("whatsapp_number");

  const businessName =
    settings.get("business_name") || "Your Business";

  const whatsappUrl = whatsapp
    ? generateWhatsAppMessage(
        whatsapp,
        businessName,
        product.name,
        product.id,
        product.size,
        product.price
      )
    : null;

  const currentImage = images[activeImage] || images[0];

  return (
    <div className="luxury-container relative py-10 md:py-16 lg:py-20">
      {/* BACK */}
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.025] px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-muted shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-accent/20 hover:bg-accent/[0.05] hover:text-accent md:mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        {/* IMAGE GALLERY */}
        <div>
          <div className="group relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-surface/90 shadow-[0_40px_120px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-700 hover:border-white/20 hover:shadow-[0_52px_145px_rgba(0,0,0,0.52)]">
            <div className="relative aspect-square touch-pan-y cursor-zoom-in bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08),transparent_60%)]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={() => currentImage && setIsFullscreen(true)}>
              {currentImage && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/65 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/90 opacity-90 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:bottom-5">
                  Tap to view
                </div>
              )}
              {currentImage ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
                    </div>
                  )}
                  <img
                    src={currentImage.image_url}
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`h-full w-full object-contain p-2 transition duration-700 md:p-6 ${imageLoaded ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                  No image available
                </div>
              )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-accent/40 hover:bg-accent/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveImage((activeImage + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:translate-x-1 hover:border-accent/40 hover:bg-accent/20"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/70 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                  {activeImage + 1} / {images.length}
                </div>
              </>
            )}
            </div>

            {product.stock_quantity === 0 && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                <span className="rounded-full border border-white/20 bg-black/80 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl backdrop-blur-xl">
                  Sold out
                </span>
              </div>
            )}

            {product.stock_quantity > 0 && (
              <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full border border-accent/25 bg-black/75 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                Available
              </div>
            )}
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View ${product.name} image ${index + 1}`}
                  className={`aspect-square w-[76px] shrink-0 overflow-hidden rounded-[1.25rem] border bg-surface shadow-sm transition-all duration-300 sm:w-auto ${
                    index === activeImage
                      ? "border-accent ring-2 ring-accent/20 shadow-[0_8px_25px_rgba(139,92,246,0.16)]"
                      : "border-white/10 hover:border-accent/50"
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
        <div className="animate-cinematic lg:sticky lg:top-28 lg:pt-5">
          <p className="eyebrow text-accent">
            {product.category} / {businessName}
          </p>

          <h1 className="mt-4 text-4xl font-black leading-[0.88] tracking-[-0.065em] sm:text-5xl md:text-[4.25rem]">
            {product.name}
          </h1>

          <div className="mt-7 flex items-end justify-between gap-4 border-b border-white/10 pb-8">
            <p className="text-4xl font-black tracking-[-0.065em] text-accent sm:text-5xl">
              {formatCurrency(product.price)}
            </p>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur">
              {getConditionLabel(product.condition)}
            </span>
          </div>

          {/* PRODUCT FACTS */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface/90 p-4 sm:p-4.5 shadow-[0_14px_40px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:bg-surface">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Size
              </p>
              <p className="mt-2 min-w-0 break-words text-sm font-bold leading-5">
                {product.size}
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface p-4 sm:p-4.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/15">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Condition
              </p>
              <p className="mt-2 min-w-0 break-words text-sm font-bold leading-5">
                {getConditionLabel(product.condition)}
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface p-4 sm:p-4.5 shadow-sm">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Availability
              </p>
              <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-bold leading-5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                <span className="min-w-0 break-words">
                  {product.stock_quantity > 0 ? "Available" : "Sold"}
                </span>
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface p-4 shadow-sm">
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted">
                Stock
              </p>
              <p className="mt-2 min-w-0 break-words text-sm font-bold leading-5">
                {product.stock_quantity}{" "}
                {product.stock_quantity === 1 ? "pair" : "pairs"}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-10">
              <p className="eyebrow text-accent">About this pair</p>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
                {product.description}
              </p>
            </div>
          )}

          {/* CONDITION NOTES */}
          {product.condition_description && (
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-black/[0.035] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Condition notes
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {product.condition_description}
              </p>
            </div>
          )}

          {/* WHATSAPP ORDER */}
          {whatsappUrl && product.stock_quantity > 0 && (
            <div className="mt-10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_50px_rgba(139,92,246,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400 hover:shadow-[0_28px_70px_rgba(139,92,246,0.38)] active:translate-y-0"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                <span>Order via WhatsApp</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Message us about this exact pair
              </p>
            </div>
          )}

          {/* TRUST */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-[1.25rem] border border-white/10 bg-surface/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/15">
              <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">
                Quality checked
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-[1.25rem] border border-white/10 bg-surface p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/15">
              <Truck className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">
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
      {isFullscreen && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 touch-pan-y" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={() => setIsFullscreen(false)}>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen image"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-accent/30"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={currentImage.image_url}
            alt={product.name}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImage((activeImage - 1 + images.length) % images.length);
                }}
                aria-label="Previous fullscreen image"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-accent/30"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImage((activeImage + 1) % images.length);
                }}
                aria-label="Next fullscreen image"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-accent/30"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                {activeImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
