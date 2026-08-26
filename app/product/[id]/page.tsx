import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { RelatedProducts } from "@/components/store/RelatedProducts";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase: any = await createClient();

  const [{ data: product }, { data: settings }] = await Promise.all([
    supabase
      .from("products")
      .select("name, description")
      .eq("id", id)
      .single(),

    supabase.from("settings").select("*"),
  ]);

  const settingsMap = new Map<string, string>(
    settings?.map(
      (s: any) => [s.key, s.value] as [string, string]
    ) || []
  );

  const businessName =
    settingsMap.get("business_name") || "Your Business";

  return {
    title: product
      ? `${product.name} | ${businessName}`
      : `Product | ${businessName}`,
    description:
      product?.description ||
      `View this product at ${businessName}.`,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase: any = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(`*, product_images(*)`)
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const [{ data: settings }, { data: relatedProducts }] =
    await Promise.all([
      supabase.from("settings").select("*"),

      supabase
        .from("products")
        .select(
          `
            id,
            name,
            price,
            category,
            product_images (
              id,
              image_url,
              display_order
            )
          `
        )
        .eq("status", "available")
        .gt("stock_quantity", 0)
        .eq("category", product.category)
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const settingsMap = new Map<string, string>(
    settings?.map(
      (s: any) => [s.key, s.value] as [string, string]
    ) || []
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader settings={settingsMap} />

      <main className="flex-1 bg-cream">
        <ProductDetail
          product={product}
          settings={settingsMap}
        />

        <div className="border-t border-black/10">
          <RelatedProducts products={relatedProducts || []} />
        </div>
      </main>

      <StoreFooter settings={settingsMap} />
    </div>
  );
}
