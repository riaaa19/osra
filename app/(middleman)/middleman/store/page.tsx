'use client';

import { useState } from 'react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { OsraLogo } from '@/components/osra-logo';
import { Save, Eye, Palette } from 'lucide-react';
import { toast } from 'sonner';

const THEMES = ['violet', 'blue', 'green', 'rose', 'amber'];
const THEME_COLORS: Record<string, string> = { violet: '#5B3DF5', blue: '#3B82F6', green: '#10B981', rose: '#F43F5E', amber: '#F59E0B' };

export default function StoreCustomizationPage() {
  const [store, setStore] = useState({ name: 'Rahul Boutique', tagline: 'Premium Fashion at Best Prices', theme: 'violet', logo: '', banner: '' });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Store customization saved!');
    setSaving(false);
  }

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Store Customization" subtitle="Customize your public storefront appearance." />
      <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Settings */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 card-base space-y-4">
            <h3 className="font-bold text-slate-900">Store Details</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Name</label>
              <input value={store.name} onChange={(e) => setStore((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tagline</label>
              <input value={store.tagline} onChange={(e) => setStore((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 card-base space-y-4">
            <h3 className="font-bold text-slate-900">Theme Color</h3>
            <div className="flex gap-3">
              {THEMES.map((t) => (
                <button key={t} onClick={() => setStore((p) => ({ ...p, theme: t }))}
                  className={`w-10 h-10 rounded-xl transition-all ${store.theme === t ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''}`}
                  style={{ background: THEME_COLORS[t] }} />
              ))}
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-900">Store Preview</h3>
          </div>
          <div className="p-4">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="p-4 flex items-center justify-between" style={{ background: THEME_COLORS[store.theme] }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white">{store.name || 'Your Store'}</span>
                </div>
                <div className="flex gap-2 text-white/80 text-xs">
                  <span>Home</span><span>Products</span><span>About</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50">
                <p className="text-xs font-semibold text-slate-700">{store.tagline}</p>
                <p className="text-xs text-slate-400 mt-1">osra.com/store/rahul-boutique</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['https://images.pexels.com/photos/1170476/pexels-photo-1170476.jpeg?w=120&h=120&fit=crop',
                    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=120&h=120&fit=crop',
                    'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=120&h=120&fit=crop'].map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-white border border-slate-200">
                      <img src={img} alt="" className="w-full aspect-square object-cover" />
                      <div className="p-1.5">
                        <p className="text-[10px] font-semibold text-slate-800 leading-tight truncate">Product {i + 1}</p>
                        <p className="text-[9px] text-slate-400">₹1,299</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
