import { createClient } from "@/supabase/server";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { SearchFilters } from "@/components/store/SearchFilters";
import {
  ArrowUpRight,
  ShieldCheck,
  MessageCircle,
  Truck,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Online Store | Quality Products",
  description:
    "Browse quality products and order conveniently online.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const supabase: any = await createClient();

  let query = supabase
    .from("products")
    .select(`*, product_images(*)`)
    .eq("status", "available")
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false });

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.q) {
    query = query.ilike("name", `%${params.q}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
  }

  const { data: settings } = await supabase
    .from("settings")
    .select("*");

  const settingsMap = new Map<string, string>(
    settings?.map((s: any) => [s.key, s.value] as [string, string]) || []
  );

  const businessName =
    settingsMap.get("business_name") || "Your Business";

  const businessCategory =
    settingsMap.get("business_category") || "Online Store";

  const description =
    settingsMap.get("shop_description") ||
    "Quality footwear. Carefully selected. Ready for you.";

  const location =
    settingsMap.get("location") || "Kenya";

  const whatsapp = settingsMap.get("whatsapp_number");

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <StoreHeader settings={settingsMap} />

      <main className="flex-1">

        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-[#07070A] text-[#F4F4F5] shadow-[0_35px_120px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-violet-600/[0.11] blur-3xl" />
            <div className="absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/[0.07] blur-3xl" />
            <div className="absolute inset-0 yk-grid opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_12%,rgba(0,0,0,0.62)_100%)]" />
          </div>

          <div className="luxury-container relative">
            <div className="grid min-h-[600px] items-center gap-14 py-20 md:grid-cols-[1.02fr_0.98fr] md:py-24 lg:min-h-[680px]">

              <div className="max-w-2xl animate-cinematic">
                <div className="yk-status mb-6">{location}</div>

                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-accent" />
                  <span className="text-[9px] font-black uppercase tracking-[0.28em] text-white/60">
                    {businessCategory}
                  </span>
                </div>

                <h1 className="text-balance text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-6xl md:text-7xl lg:text-[6rem]">
                  Step into
                  <span className="block bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                    something
                  </span>
                  <span className="block text-accent">better.</span>
                </h1>

                <p className="mt-8 max-w-xl text-sm leading-7 text-white/60 sm:text-base md:text-[1.05rem]">
                  {description}
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a href="#shop" className="luxury-button group shadow-[0_14px_40px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(139,92,246,0.32)] active:translate-y-0">
                    Shop collection
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>

                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)] active:translate-y-0"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp us
                    </a>
                  )}
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
                  <div>
                    <p className="yk-number">01 / Selection</p>
                    <p className="mt-1 text-[10px] text-white/50">Carefully selected pairs</p>
                  </div>

                  <div className="hidden h-7 w-px bg-white/10 sm:block" />

                  <div>
                    <p className="yk-number">02 / Ordering</p>
                    <p className="mt-1 text-[10px] text-white/50">Simple WhatsApp ordering</p>
                  </div>

                  <div className="hidden h-7 w-px bg-white/10 sm:block" />

                  <div>
                    <p className="yk-number">03 / Delivery</p>
                    <p className="mt-1 text-[10px] text-white/50">Ask about available options</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden md:block animate-cinematic-delay">
                {products?.[0]?.product_images?.[0]?.image_url ? (
                  <div className="relative mx-auto w-full max-w-[500px]">
                    <div className="absolute -inset-8 rounded-[3rem] bg-violet-500/[0.07] blur-3xl" />

                    <div className="relative">
                      <div className="absolute -right-4 -top-4 z-10 rounded-full border border-white/10 bg-black/70 px-4 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-accent">
                          Featured / 001
                        </p>
                      </div>

                      <a href={`/product/${products[0].id}`} aria-label={`View ${products[0].name}`} className="group overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.045] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.58)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_50px_145px_rgba(0,0,0,0.68)]">
                        <div className="relative aspect-[0.88] overflow-hidden rounded-[2.25rem] bg-white">
                          <img
                            src={products[0].product_images[0].image_url}
                            alt={products[0].name}
                            className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.045]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />

                          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/60">
                                Available now
                              </p>
                              <p className="mt-1 text-lg font-black text-white">
                                {products[0].name}
                              </p>
                            </div>

                            <p className="shrink-0 text-lg font-black text-accent">
                              KSh {Number(products[0].price).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/5 px-3 pb-2 pt-4">
                          <p className="yk-number">{businessName}</p>
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.18em] text-white/50">
                            Explore
                            <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.04]">
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-4 h-8 w-8 text-accent" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                        {businessName}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
        {/* TRUST BAR */}
        <section className="border-b border-white/10 bg-surface/95 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="luxury-container">
            <div className="grid grid-cols-2 divide-x divide-black/10 md:grid-cols-4">

              <div className="flex items-center gap-3 px-3 py-5 md:px-6">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs font-bold">Quality checked</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Carefully selected
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-5 md:px-6">
                <MessageCircle className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs font-bold">Easy ordering</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Order via WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-5 md:px-6">
                <Truck className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs font-bold">Delivery options</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Ask us about delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-5 md:px-6">
                <Sparkles className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs font-bold">Fresh arrivals</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    New pairs added regularly
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SHOP */}
        <section id="shop" className="luxury-container py-16 md:py-20 lg:py-24">

          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-accent">
                The collection
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Available now
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
                Browse our current selection. Every pair is subject to
                availability.
              </p>
            </div>

            <div className="rounded-full border border-black/10 bg-black/[0.025] px-4 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-muted">
              {products?.length || 0}{" "}
              {(products?.length || 0) === 1 ? "pair" : "pairs"} available
            </div>
          </div>

          <SearchFilters />

          {products && products.length > 0 ? (
            <ProductGrid products={products} whatsapp={whatsapp} businessName={businessName} />
          ) : (
            <div className="rounded-[1.75rem] border border-white/10 bg-surface/90 px-6 py-20 text-center shadow-[0_18px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <Sparkles className="mx-auto h-8 w-8 text-accent" />

              <h3 className="mt-4 text-lg font-bold">
                New arrivals are coming
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                There are currently no available pairs in this category.
                Check back soon for fresh arrivals.
              </p>

              <a
                href="/"
                className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.26)]"
              >
                View all shoes
              </a>
            </div>
          )}

        </section>

        {/* CUSTOMER SERVICE CTA */}
        <section className="relative isolate overflow-hidden border-y border-white/10 bg-[#09090B] text-white shadow-[0_-20px_80px_rgba(0,0,0,0.16)]">
          <div className="luxury-container relative py-16 md:py-20">
            <div className="relative flex flex-col gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">

              <div className="relative z-10 max-w-2xl">
                <p className="eyebrow text-accent">
                  Need help choosing?
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                  We are happy to help.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                  Ask about sizing, condition, availability, pricing or
                  delivery before placing your order.
                </p>
              </div>

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative z-10 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_45px_rgba(139,92,246,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400 hover:shadow-[0_24px_60px_rgba(139,92,246,0.38)] active:translate-y-0"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with us
                </a>
              )}

            </div>
          </div>
        </section>

      </main>

      <StoreFooter settings={settingsMap} />
    </div>
  );
}
