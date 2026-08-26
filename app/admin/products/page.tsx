"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";

const supabase: any = createClient();
import { Product, ProductImage } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  Search,
  X,
  Upload,
  ImageIcon,
} from "lucide-react";

type ProductWithImages = Product & { product_images: ProductImage[] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "sold" | "archived">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "men" as "men" | "women" | "kids" | "unisex",
    size: "",
    price: "",
    buying_cost: "",
    condition: "good" as "new" | "excellent" | "good" | "fair",
    condition_description: "",
    description: "",
    stock_quantity: "1",
    status: "available" as "available" | "sold" | "archived",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select(`*, product_images(*)`)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setProducts(data as ProductWithImages[]);
    }
    setLoading(false);
  }, [filter, search, supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "men",
      size: "",
      price: "",
      buying_cost: "",
      condition: "good",
      condition_description: "",
      description: "",
      stock_quantity: "1",
      status: "available",
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingProduct(null);
  };

  const handleEdit = (product: ProductWithImages) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      size: product.size,
      price: String(product.price),
      buying_cost: String(product.buying_cost),
      condition: product.condition,
      condition_description: product.condition_description || "",
      description: product.description || "",
      stock_quantity: String(product.stock_quantity),
      status: product.status,
    });
    setPreviewUrls(product.product_images?.map((img) => img.image_url) || []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteImage = async (imageId: string, storagePath: string) => {
    if (!confirm("Delete this image?")) return;
    await supabase.from("product_images").delete().eq("id", imageId);
    await supabase.storage.from("product-images").remove([storagePath]);
    fetchProducts();
    if (editingProduct) {
      handleEdit({
        ...editingProduct,
        product_images: editingProduct.product_images.filter((i) => i.id !== imageId),
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length + previewUrls.length > 5) {
      alert("Maximum 5 images per product");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const compressImage = async (file: File): Promise<File> => {
    const maxSize = 1600;
    const quality = 0.78;
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error("Could not compress image."));
            return;
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        }, "image/jpeg", quality);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read image."));
      };
      img.src = url;
    });
  };
  const uploadImages = async (productId: string) => {
    const uploaded: { url: string; path: string }[] = [];
    for (const originalFile of selectedFiles) {
      const file = await compressImage(originalFile);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${productId}/${Date.now()}-${safeName}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });
      if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
      }
      if (!data) {
        throw new Error("Image upload returned no data.");
      }
      const { data: publicData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      uploaded.push({ url: publicData.publicUrl, path });
    }
    for (const [index, img] of uploaded.entries()) {
      const { error } = await supabase.from("product_images").insert({
        product_id: productId,
        image_url: img.url,
        storage_path: img.path,
        display_order: index,
      });
      if (error) throw new Error(`Image record failed: ${error.message}`);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      size: formData.size,
      price: Number(formData.price),
      buying_cost: Number(formData.buying_cost) || 0,
      condition: formData.condition,
      condition_description: formData.condition_description || null,
      description: formData.description || null,
      stock_quantity: Number(formData.stock_quantity),
      status: formData.status,
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);
        if (error) throw error;
        if (selectedFiles.length > 0) {
          await uploadImages(editingProduct.id);
        }
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data && selectedFiles.length > 0) {
          await uploadImages(data.id);
        }
      }

      resetForm();
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Error saving product");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the product and all its images."))
      return;
    const { data: images } = await supabase
      .from("product_images")
      .select("storage_path")
      .eq("product_id", id);
    if (images) {
      for (const img of images) {
        await supabase.storage.from("product-images").remove([img.storage_path]);
      }
    }
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleArchive = async (id: string) => {
    await supabase.from("products").update({ status: "archived" }).eq("id", id);
    fetchProducts();
  };

  const handleRestore = async (id: string) => {
    await supabase.from("products").update({ status: "available" }).eq("id", id);
    fetchProducts();
  };

  const handleMarkSold = async (product: ProductWithImages) => {
    await supabase
      .from("products")
      .update({ status: "sold", stock_quantity: 0 })
      .eq("id", product.id);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-[#15151b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a1a22]"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-[#111116] rounded-lg shadow-sm border border-white/[0.08] p-4 mb-6">
          <h2 className="font-semibold text-white mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Name *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Size *
                </label>
                <input
                  required
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  placeholder="e.g. 38, 42, 10"
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Selling Price (KSh) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Buying Cost (KSh)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.buying_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, buying_cost: e.target.value })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Condition *
                </label>
                <select
                  required
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value as any })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="new">New / Unused</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Condition Description
              </label>
              <input
                value={formData.condition_description}
                onChange={(e) =>
                  setFormData({ ...formData, condition_description: e.target.value })
                }
                placeholder="e.g. Light signs of wear on sole"
                className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Photos (max 5)
              </label>
              <div className="flex flex-wrap gap-3">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md border border-white/[0.08]"
                    />
                    {editingProduct &&
                      editingProduct.product_images?.find(
                        (i) => i.image_url === url
                      ) && (
                        <button
                          type="button"
                          onClick={() => {
                            const img = editingProduct.product_images.find(
                              (i) => i.image_url === url
                            );
                            if (img) handleDeleteImage(img.id, img.storage_path);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                  </div>
                ))}
                {previewUrls.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-white/[0.08] rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-white/30">
                    <Upload className="w-5 h-5 text-white/40" />
                    <span className="text-xs text-white/40 mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-[#15151b] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#1a1a22] disabled:opacity-50"
              >
                {uploading
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-6 py-2 border border-white/[0.08] rounded-md text-sm font-medium hover:bg-[#0f0f14]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-white/[0.08] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-md border border-white/[0.08] bg-[#111116] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#111116] rounded-lg shadow-sm border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-white/60">
            <p>No products found.</p>
            <p className="text-sm text-white/40 mt-1">
              Add your first product to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0f0f14] border-b border-white/[0.08]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Size
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-white/80">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-white/80">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#0f0f14]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.product_images?.[0] ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt=""
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#0f0f14] rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-white/40" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-white/60">
                            {product.condition}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{product.category}</td>
                    <td className="px-4 py-3">{product.size}</td>
                    <td className="px-4 py-3">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3">{product.stock_quantity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "available"
                            ? "bg-green-100 text-green-800"
                            : product.status === "sold"
                            ? "bg-[#1a1a22] text-white/80"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 hover:bg-[#15151b] rounded-md"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-white/70" />
                        </button>
                        {product.status === "available" && (
                          <button
                            onClick={() => handleMarkSold(product)}
                            className="p-1.5 hover:bg-[#15151b] rounded-md"
                            title="Mark as Sold"
                          >
                            <Trash2 className="w-4 h-4 text-orange-500" />
                          </button>
                        )}
                        {product.status !== "archived" ? (
                          <button
                            onClick={() => handleArchive(product.id)}
                            className="p-1.5 hover:bg-[#15151b] rounded-md"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4 text-white/60" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(product.id)}
                            className="p-1.5 hover:bg-[#15151b] rounded-md"
                            title="Restore"
                          >
                            <RotateCcw className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 hover:bg-[#15151b] rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
