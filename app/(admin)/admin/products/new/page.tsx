'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/header';
import { supabase, Category } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { createDemoProductId, DEMO_CATEGORIES, saveStoredDemoProduct } from '@/lib/demo-products';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '', sku: '', description: '', category_id: '', brand: '',
    wholesale_price: '', retail_price: '', status: 'active',
    initial_stock: '', low_stock_threshold: '10',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      setCategories(data?.length ? data : DEMO_CATEGORIES);
    });
  }, []);

  function setField(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function addImage() {
    if (!imageUrl.trim()) return;
    setImages((p) => [...p, imageUrl.trim()]);
    setImageUrl('');
  }

  function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setImages((p) => [...p, result]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  async function uploadImageToStorage(base64: string, filename: string): Promise<string | null> {
    try {
      const base64Data = base64.split(',')[1];
      const bytes = base64ToUint8Array(base64Data);
      const { data, error } = await supabase.storage.from('product-images').upload(`${Date.now()}-${filename}`, bytes, {
        contentType: 'image/jpeg',
      });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      return publicUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      return null;
    }
  }

  async function hasAdminWriteSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return Boolean(session);
  }

  function createLocalPreviewProduct(uploadedImages: string[]) {
    const now = new Date().toISOString();
    const stock = parseInt(form.initial_stock) || 0;
    const category = categories.find((c) => c.id === form.category_id);

    saveStoredDemoProduct({
      id: createDemoProductId(),
      name: form.name,
      sku: form.sku,
      description: form.description || null,
      category_id: form.category_id || null,
      brand: form.brand || null,
      wholesale_price: parseFloat(form.wholesale_price),
      retail_price: parseFloat(form.retail_price),
      images: uploadedImages,
      status: form.status as 'active' | 'inactive' | 'draft',
      created_at: now,
      updated_at: now,
      categories: category ? { name: category.name } : null,
      inventory: {
        total_stock: stock,
        available_stock: stock,
        reserved_stock: 0,
        low_stock_threshold: parseInt(form.low_stock_threshold) || 10,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.sku || !form.wholesale_price || !form.retail_price) {
      toast.error('Please fill in all required fields'); return;
    }
    setLoading(true);

    try {
      const hasSession = await hasAdminWriteSession();

      const uploadedImages: string[] = [];
      for (const img of images) {
        if (img.startsWith('data:')) {
          if (hasSession) {
            const url = await uploadImageToStorage(img, `${form.sku}-${Date.now()}.jpg`);
            uploadedImages.push(url ?? img);
          } else {
            uploadedImages.push(img);
          }
        } else {
          uploadedImages.push(img);
        }
      }

      if (!hasSession) {
        if (profile?.role !== 'admin') {
          throw new Error('Your admin session is not authenticated. Please log out and sign in again before creating products.');
        }

        createLocalPreviewProduct(uploadedImages);
        toast.success('Product created in admin preview');
        router.push('/admin/products');
        return;
      }

      const { data: product, error } = await supabase.from('products').insert({
        name: form.name, sku: form.sku, description: form.description || null,
        category_id: form.category_id || null, brand: form.brand || null,
        wholesale_price: parseFloat(form.wholesale_price),
        retail_price: parseFloat(form.retail_price),
        status: form.status, images: uploadedImages,
      }).select().single();

      if (error) throw new Error(error.message);

      if (form.initial_stock) {
        const { error: inventoryError } = await supabase.from('inventory').insert({
          product_id: product.id,
          total_stock: parseInt(form.initial_stock),
          reserved_stock: 0,
          low_stock_threshold: parseInt(form.low_stock_threshold) || 10,
        });

        if (inventoryError) throw new Error(inventoryError.message);
      }
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create product');
      setLoading(false);
    }
  }

  return (
    <div className="page-enter">
      <AdminHeader title="Add New Product" subtitle="Create a new product for your wholesale catalog." />
      <div className="p-6">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-osra-primary mb-5">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Main details */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Product Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                  <input value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Premium Luggage Bag"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
                  <input value={form.sku} onChange={(e) => setField('sku', e.target.value)} placeholder="e.g. LUG-001"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
                  <input value={form.brand} onChange={(e) => setField('brand', e.target.value)} placeholder="e.g. TravelPro"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select value={form.category_id} onChange={(e) => setField('category_id', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary bg-white">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)}
                  rows={3} placeholder="Product description..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary resize-none" />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Wholesale Price (₹) <span className="text-red-500">*</span></label>
                  <input type="number" min="0" step="0.01" value={form.wholesale_price} onChange={(e) => setField('wholesale_price', e.target.value)} placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Retail Price (₹) <span className="text-red-500">*</span></label>
                  <input type="number" min="0" step="0.01" value={form.retail_price} onChange={(e) => setField('retail_price', e.target.value)} placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
              </div>
              {form.wholesale_price && form.retail_price && (
                <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  Middleman margin: {formatMargin(parseFloat(form.wholesale_price), parseFloat(form.retail_price))}
                </p>
              )}
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Initial Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Stock</label>
                  <input type="number" min="0" value={form.initial_stock} onChange={(e) => setField('initial_stock', e.target.value)} placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Low Stock Threshold</label>
                  <input type="number" min="0" value={form.low_stock_threshold} onChange={(e) => setField('low_stock_threshold', e.target.value)} placeholder="10"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: images + status */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Product Images</h3>
              <div className="flex gap-2 items-center">
                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  placeholder="Paste image URL and press Enter..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                <button type="button" onClick={openFileDialog} className="w-9 h-9 rounded-xl bg-osra-primary/10 hover:bg-osra-primary/20 flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-osra-primary" />
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden bg-slate-100 aspect-square">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                      className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <div className="col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center gap-2 text-slate-400">
                    <Upload className="w-8 h-8" />
                    <p className="text-xs text-center">Add image URLs above</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 card-base space-y-3">
              <h3 className="font-bold text-slate-900">Status</h3>
              {['active', 'inactive', 'draft'].map((s) => (
                <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => setField('status', s)}
                    className="accent-osra-primary" />
                  <span className="text-sm text-slate-700 capitalize">{s}</span>
                </label>
              ))}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatMargin(wholesale: number, retail: number) {
  if (!wholesale || !retail) return '';
  const margin = retail - wholesale;
  const pct = ((margin / wholesale) * 100).toFixed(1);
  return `₹${margin.toFixed(0)} (${pct}%)`;
}
