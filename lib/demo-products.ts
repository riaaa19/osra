'use client';

import { Product } from './supabase';

export const DEMO_PRODUCTS_STORAGE_KEY = 'osra-demo-products';

export type DemoProduct = Omit<Product, 'categories' | 'inventory'> & {
  categories?: { name: string } | null;
  inventory?: {
    total_stock: number;
    available_stock: number;
    reserved_stock?: number;
    low_stock_threshold?: number;
  } | null;
};

export const DEMO_CATEGORIES = [
  { id: 'demo-electronics', name: 'Electronics', slug: 'electronics', description: null },
  { id: 'demo-fashion', name: 'Fashion', slug: 'fashion', description: null },
  { id: 'demo-home-living', name: 'Home & Living', slug: 'home-living', description: null },
  { id: 'demo-luggage-travel', name: 'Luggage & Travel', slug: 'luggage-travel', description: null },
  { id: 'demo-accessories', name: 'Accessories', slug: 'accessories', description: null },
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function createDemoProductId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `demo-${crypto.randomUUID()}`;
  }

  return `demo-${Date.now()}`;
}

export function getStoredDemoProducts(): DemoProduct[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(DEMO_PRODUCTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredDemoProduct(product: DemoProduct) {
  if (!canUseStorage()) return;

  const products = [product, ...getStoredDemoProducts().filter((p) => p.id !== product.id)];
  window.localStorage.setItem(DEMO_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function deleteStoredDemoProduct(productId: string) {
  if (!canUseStorage()) return;

  const products = getStoredDemoProducts().filter((p) => p.id !== productId);
  window.localStorage.setItem(DEMO_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}
