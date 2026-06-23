'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Package, Star } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { supabase, Product } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteStoredDemoProduct, getStoredDemoProducts } from '@/lib/demo-products';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PEXELS_PRODUCTS = [
  'https://images.pexels.com/photos/18105/pexels-photo.jpg?w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=200&h=200&fit=crop',
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=200&h=200&fit=crop',
];

const DEMO_PRODUCTS = [
  { id: 'd1', name: 'Premium Hard Case Luggage Bag', sku: 'LUG-001', wholesale_price: 1200, retail_price: 1650, status: 'active', brand: 'TravelPro', images: [PEXELS_PRODUCTS[0]], categories: { name: 'Luggage & Travel' }, inventory: { total_stock: 48, available_stock: 45 } },
  { id: 'd2', name: 'Travel Backpack', sku: 'BPK-002', wholesale_price: 550, retail_price: 850, status: 'active', brand: 'Wildcraft', images: [PEXELS_PRODUCTS[1]], categories: { name: 'Luggage & Travel' }, inventory: { total_stock: 120, available_stock: 118 } },
  { id: 'd3', name: 'Wireless Earbuds', sku: 'EAR-003', wholesale_price: 850, retail_price: 1299, status: 'active', brand: 'SoundMax', images: [PEXELS_PRODUCTS[2]], categories: { name: 'Electronics' }, inventory: { total_stock: 25, available_stock: 12 } },
  { id: 'd4', name: 'Analog Watch', sku: 'WAT-004', wholesale_price: 1050, retail_price: 1650, status: 'active', brand: 'Fastrack', images: [PEXELS_PRODUCTS[3]], categories: { name: 'Accessories' }, inventory: { total_stock: 60, available_stock: 55 } },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, categories(name), inventory(total_stock, available_stock)')
      .order('created_at', { ascending: false });

    const storedProducts = getStoredDemoProducts();
    const databaseProducts = (data ?? []) as Product[];
    setProducts(databaseProducts.length ? [...storedProducts, ...databaseProducts] as Product[] : [...storedProducts, ...DEMO_PRODUCTS] as Product[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function deleteProduct() {
    if (!deleteId) return;
    if (deleteId.startsWith('demo-')) {
      deleteStoredDemoProduct(deleteId);
      toast.success('Product deleted');
      load();
      setDeleteId(null);
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', deleteId);
    if (error) toast.error(error.message);
    else { toast.success('Product deleted'); load(); }
    setDeleteId(null);
  }
  const displayProducts = filtered;

  return (
    <div className="page-enter">
      <AdminHeader title="Product Catalog" subtitle="Manage your wholesale product listings." />
      <div className="p-6 space-y-5">
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">All Products <span className="text-slate-400 text-sm font-normal">({displayProducts.length})</span></h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or SKU..."
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 text-slate-700">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <Link href="/admin/products/new"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg btn-primary text-white text-sm font-semibold hover:opacity-90 transition-all">
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Product', 'SKU', 'Category', 'Wholesale', 'Retail', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayProducts.map((p: any, i: number) => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.brand ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{p.sku}</td>
                      <td className="px-4 py-3.5 text-slate-500">{p.categories?.name ?? '—'}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(p.wholesale_price)}</td>
                      <td className="px-4 py-3.5 font-semibold text-green-700">{formatCurrency(p.retail_price)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${(p.inventory?.available_stock ?? p.inventory?.[0]?.available_stock ?? 0) < 20 ? 'text-red-600' : 'text-slate-900'}`}>
                          {p.inventory?.available_stock ?? p.inventory?.[0]?.available_stock ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/products/${p.id}/edit`}
                            className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center transition-colors">
                            <Edit2 className="w-3.5 h-3.5 text-osra-primary" />
                          </Link>
                          <button onClick={() => setDeleteId(p.id)}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
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

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The product and all inventory data will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} className="rounded-xl bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
