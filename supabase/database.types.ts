export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          size: string;
          price: number;
          buying_cost: number;
          condition: string;
          condition_description: string | null;
          description: string | null;
          stock_quantity: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          size: string;
          price: number;
          buying_cost?: number;
          condition: string;
          condition_description?: string | null;
          description?: string | null;
          stock_quantity?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          storage_path: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          storage_path: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          customer_location: string | null;
          total_amount: number;
          status: string;
          payment_status: string;
          delivery_status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          customer_location?: string | null;
          total_amount?: number;
          status?: string;
          payment_status?: string;
          delivery_status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          size: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          size: string;
          price: number;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      sales: {
        Row: {
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
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          size: string;
          selling_price: number;
          quantity?: number;
          buying_price?: number;
          profit?: number;
          customer_name?: string | null;
          customer_phone?: string | null;
          order_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      [_ in never]: never;
    };
  };
}
