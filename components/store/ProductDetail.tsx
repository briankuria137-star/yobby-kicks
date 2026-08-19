import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Product, ProductImage } from "@/types";
import { formatCurrency, generateWhatsAppMessage, getConditionLabel } from "@/lib/utils";

type ProductDetailData = Product & { product_images?: ProductImage[] };

export function ProductDetail({ product, settings }: { product: ProductDetailData; settings: Map<string, string> }) {
  const images = [...(product.product_images || [])].sort((a, b) => a.display_order - b.display_order);
  const whatsapp = settings.get("whatsapp_number");
  const whatsappUrl = whatsapp ? generateWhatsAppMessage(whatsapp, product.name, product.id, product.size, product.price) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to shoes
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="aspect-square bg-white rounded-lg border overflow-hidden">
            {images[0] ? <img src={images[0].image_url} alt={product.name} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image) => <img key={image.id} src={image.image_url} alt="" className="aspect-square w-full object-cover rounded border" />)}
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg border p-6 h-fit">
          <p className="text-xs uppercase tracking-wide text-gray-500">{product.category}</p>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-2xl font-bold mt-4">{formatCurrency(product.price)}</p>
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div className="bg-gray-50 rounded p-3"><span className="text-gray-500 block">Size</span><strong>{product.size}</strong></div>
            <div className="bg-gray-50 rounded p-3"><span className="text-gray-500 block">Condition</span><strong>{getConditionLabel(product.condition)}</strong></div>
            <div className="bg-gray-50 rounded p-3"><span className="text-gray-500 block">Availability</span><strong>{product.stock_quantity > 0 ? "Available" : "Sold"}</strong></div>
            <div className="bg-gray-50 rounded p-3"><span className="text-gray-500 block">Stock</span><strong>{product.stock_quantity}</strong></div>
          </div>
          {product.description && <p className="text-gray-600 text-sm leading-6 mt-6 whitespace-pre-line">{product.description}</p>}
          {product.condition_description && <p className="text-gray-600 text-sm mt-3"><strong>Condition notes:</strong> {product.condition_description}</p>}
          {whatsappUrl && product.stock_quantity > 0 && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold">
              <MessageCircle className="w-5 h-5" /> Order via WhatsApp
            </a>
          )}
          <p className="text-xs text-gray-500 mt-3">{settings.get("delivery_info")}</p>
        </div>
      </div>
    </div>
  );
}
