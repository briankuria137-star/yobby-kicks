import Link from "next/link";
import { Product, ProductImage } from "@/types";
import { formatCurrency, getConditionLabel } from "@/lib/utils";

type ProductCard = Product & { product_images?: ProductImage[] };

export function ProductGrid({ products }: { products: ProductCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const image = [...(product.product_images || [])].sort((a, b) => a.display_order - b.display_order)[0];
        return (
          <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              {image ? (
                <img src={image.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">Size {product.size} · {getConditionLabel(product.condition)}</p>
              <p className="font-bold mt-2">{formatCurrency(product.price)}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
