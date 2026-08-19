import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", params.id)
    .single();

  return {
    title: product
      ? `${product.name} | MWIHO KICKS`
      : "Product | MWIHO KICKS",
    description:
      product?.description || "View this quality mtumba shoe at MWIHO KICKS.",
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select(`*, product_images(*)`)
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: settings } = await supabase.from("settings").select("*");
  const settingsMap = new Map(settings?.map((s) => [s.key, s.value]));

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader settings={settingsMap} />
      <main className="flex-1 bg-gray-50">
        <ProductDetail product={product} settings={settingsMap} />
      </main>
      <StoreFooter settings={settingsMap} />
    </div>
  );
}
