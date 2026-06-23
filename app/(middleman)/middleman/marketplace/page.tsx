'use client';

import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, X, ChevronDown, ImageOff } from 'lucide-react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const DEMO_PRODUCTS = [
  { id: 'd1', name: 'Premium Hard Case Luggage Bag', sku: 'LUG-001', wholesale_price: 1200, retail_price: 1650, brand: 'TravelPro', images: ['https://images.pexels.com/photos/1170476/pexels-photo-1170476.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Luggage & Travel' }, inventory: { available_stock: 48 } },
  { id: 'd2', name: 'Travel Backpack', sku: 'BPK-002', wholesale_price: 550, retail_price: 850, brand: 'Wildcraft', images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Luggage & Travel' }, inventory: { available_stock: 120 } },
  { id: 'd3', name: 'Wireless Earbuds', sku: 'EAR-003', wholesale_price: 850, retail_price: 1299, brand: 'SoundMax', images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Electronics' }, inventory: { available_stock: 196 } },
  { id: 'd4', name: 'Analog Watch', sku: 'WAT-004', wholesale_price: 1050, retail_price: 1650, brand: 'Fastrack', images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Accessories' }, inventory: { available_stock: 60 } },
  { id: 'd5', name: 'Fashion Sunglasses', sku: 'SNG-005', wholesale_price: 320, retail_price: 599, brand: 'StylePro', images: ['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Accessories' }, inventory: { available_stock: 85 } },
  { id: 'd6', name: 'Running Shoes', sku: 'SHO-006', wholesale_price: 1800, retail_price: 2800, brand: 'SprintFit', images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Fashion' }, inventory: { available_stock: 42 } },
  { id: 'd7', name: 'Leather Wallet', sku: 'WAL-007', wholesale_price: 450, retail_price: 899, brand: 'LeatherCo', images: ['https://images.pexels.com/photos/2338110/pexels-photo-2338110.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Accessories' }, inventory: { available_stock: 110 } },
  { id: 'd8', name: 'Smart Water Bottle', sku: 'BTL-008', wholesale_price: 380, retail_price: 699, brand: 'HydroMax', images: ['https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'], categories: { name: 'Home & Living' }, inventory: { available_stock: 200 } },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('Newest');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [addPanel, setAddPanel] = useState<any | null>(null);
  const [retailPrice, setRetailPrice] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set([0]));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('products').select('*, categories(name), inventory(available_stock)').eq('status', 'active')
      .then(({ data }) => setProducts(data?.length ? (data as any[]) : DEMO_PRODUCTS));
  }, []);

  function openPanel(p: any) {
    setAddPanel(p);
    setRetailPrice(p.retail_price);
    setSelectedImages(new Set([0]));
  }

  function toggleWishlist(id: string) {
    setWishlist((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function saveToStore() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(`${addPanel.name} added to your store!`);
    setAddPanel(null);
    setSaving(false);
  }

  const minRetail = Math.round(addPanel?.wholesale_price * 1.1) ?? 0;
  const maxRetail = Math.round(addPanel?.wholesale_price * 2.5) ?? 0;
  const profit = retailPrice - (addPanel?.wholesale_price ?? 0);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All Categories' || p.categories?.name === category;
    return matchSearch && matchCat;
  });

  const categories = ['All Categories', ...Array.from(new Set(products.map((p) => p.categories?.name).filter(Boolean)))];

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Marketplace" subtitle="Browse warehouse products and add them to your store." />
      <div className="p-6 flex gap-5">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories, SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
            </div>
            <div className="flex gap-2">
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-osra-primary">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-osra-primary">
                {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden card-base hover:card-base transition-all duration-200 group">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-8 h-8 text-slate-200" />
                    </div>
                  )}
                  <button onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
                    <Heart className={`w-4 h-4 ${wishlist.has(p.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">{p.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">SKU: {p.sku}</p>
                  <p className="text-xs text-osra-primary mt-0.5">Wholesale Base: {formatCurrency(p.wholesale_price)}</p>
                  <p className="text-xs text-slate-500">Stock: {p.inventory?.available_stock ?? p.inventory?.[0]?.available_stock ?? '—'}</p>
                  <button onClick={() => openPanel(p)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl btn-primary text-white text-xs font-semibold hover:opacity-90 transition-all">
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to My Store
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Promo banner */}
          <div className="bg-gradient-to-r from-osra-primary/5 to-osra-secondary/5 border border-osra-primary/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-osra-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-osra-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Showcase your style, set your profit</p>
              <p className="text-sm text-slate-500 mt-0.5">Add products to your store, set your retail price, and start selling to your customers.</p>
            </div>
          </div>
        </div>

        {/* Add to Store panel */}
        {addPanel && (
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-2xl card-base border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Add to My Store</h3>
                <button onClick={() => setAddPanel(null)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-600 font-medium">Product: {addPanel.name}</p>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-900">Set Your Retail Price</p>
                    <p className="text-sm text-slate-500">Your Retail Price: {formatCurrency(retailPrice)}</p>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">(Your Profit) — Your Profit: {formatCurrency(profit)}</p>
                  <input type="range" min={minRetail} max={maxRetail} step={50} value={retailPrice}
                    onChange={(e) => setRetailPrice(parseInt(e.target.value))}
                    className="w-full accent-osra-primary" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{formatCurrency(minRetail)} Min Retail</span>
                    <span>{formatCurrency(maxRetail)} Max Retail</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">Product Media Settings</p>
                  <p className="text-xs text-slate-400 mb-2">Reorder images (Select Main Image)</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[addPanel.images?.[0], addPanel.images?.[0], addPanel.images?.[0]].filter(Boolean).map((img: string, i: number) => (
                      <div key={i} onClick={() => { const n = new Set(selectedImages); n.has(i) ? n.delete(i) : n.add(i); setSelectedImages(n); }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${selectedImages.has(i) ? 'border-osra-primary' : 'border-slate-200'}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {i === 0 && selectedImages.has(0) && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-osra-primary rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-slate-300 transition-colors">
                      <span className="text-xs text-slate-400 text-center px-1">Hide Image</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg">
                    The first selected image will be shown as the main product image in your store.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => setAddPanel(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveToStore} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
                    <ShoppingBag className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save to My Store'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
