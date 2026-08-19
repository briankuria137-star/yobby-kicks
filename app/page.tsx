import { createClient } from "@/supabase/server";
import { ProductGrid } from "@/components/store/ProductGrid";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { SearchFilters } from "@/components/store/SearchFilters";

export const metadata = {
  title: "MWIHO KICKS | Browse Available Shoes",
  description: "Browse our current selection of quality mtumba shoes for men, women, and kids in Mwihoko, Kenya.",
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(`*, product_images(*)`)
    .eq("status", "available")
    .gt("stock_quantity", 0)
    .order("created_at", { ascending: false });

  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
  }

  const { data: settings } = await supabase.from("settings").select("*");
  const settingsMap = new Map(settings?.map((s) => [s.key, s.value]));

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader settings={settingsMap} />
      <main className="flex-1">
        <div className="bg-primary text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">
              {settingsMap.get("business_name") || "MWIHO KICKS"}
            </h1>
            <p className="text-gray-300 text-sm">
              {settingsMap.get("shop_description") ||
                "Quality mtumba footwear for men, women, and kids."}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {settingsMap.get("location") || "Mwihoko, Kenya"}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <SearchFilters />

          {products && products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                No shoes available yet.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon for new arrivals.
              </p>
            </div>
          )}
        </div>
      </main>
      <StoreFooter settings={settingsMap} />
    </div>
  );
}
