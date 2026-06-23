import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'admin' | 'middleman' | 'retailer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Middleman {
  id: string;
  user_id: string;
  business_name: string;
  store_slug: string;
  phone: string | null;
  credit_limit: number;
  credit_used: number;
  commission_percent: number;
  status: 'pending' | 'active' | 'suspended';
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  category_id: string | null;
  brand: string | null;
  wholesale_price: number;
  retail_price: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  categories?: Category;
  inventory?: Inventory;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Inventory {
  id: string;
  product_id: string;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  middleman_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  middlemen?: Middleman;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products?: Product;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'inventory' | 'payment';
  is_read: boolean;
  created_at: string;
}
