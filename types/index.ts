export interface Product {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids' | 'unisex';
  size: string;
  price: number;
  buying_cost: number;
  condition: 'new' | 'excellent' | 'good' | 'fair';
  condition_description: string | null;
  description: string | null;
  stock_quantity: number;
  status: 'available' | 'sold' | 'archived';
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_location: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'packed' | 'out_for_delivery' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  delivery_status: 'pending' | 'out_for_delivery' | 'delivered';
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  size: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  product_name: string;
  size: string;
  selling_price: number;
  quantity: number;
  buying_price: number;
  profit: number;
  customer_name: string | null;
  customer_phone: string | null;
  order_id: string | null;
  created_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export type OrderStatus = Order['status'];
export type ProductCategory = Product['category'];
export type ProductCondition = Product['condition'];
