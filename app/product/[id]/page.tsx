import { createClient } from "@/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase: any = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
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

  const { data: settings } = await supabase.from("settings").select("*");
  const settingsMap = new Map<string, string>(settings?.map((s: any) => [s.key, s.value] as [string, string]) || []);

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
