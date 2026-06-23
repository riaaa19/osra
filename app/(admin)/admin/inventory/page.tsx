'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Plus, RefreshCw, AlertTriangle, TrendingDown, Package, Edit2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { supabase } from '@/lib/supabase';
import { formatNumber, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InvRow {
  id: string;
  product_id: string;
  total_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  updated_at: string;
  products: { name: string; sku: string; brand: string | null; categories: { name: string } | null };
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editRow, setEditRow] = useState<InvRow | null>(null);
  const [editStock, setEditStock] = useState({ total_stock: 0, reserved_stock: 0, low_stock_threshold: 10 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('inventory')
      .select('*, products(name, sku, brand, categories(name))')
      .order('updated_at', { ascending: false });
    setRows((data ?? []) as InvRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) =>
    r.products?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.products?.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalStock = rows.reduce((a, r) => a + r.total_stock, 0);
  const reservedStock = rows.reduce((a, r) => a + r.reserved_stock, 0);
  const lowStockCount = rows.filter((r) => r.available_stock <= r.low_stock_threshold).length;

  function openEdit(row: InvRow) {
    setEditRow(row);
    setEditStock({ total_stock: row.total_stock, reserved_stock: row.reserved_stock, low_stock_threshold: row.low_stock_threshold });
  }

  async function saveEdit() {
    if (!editRow) return;
    setSaving(true);
    const { error } = await supabase.from('inventory').update({
      total_stock: editStock.total_stock,
      reserved_stock: editStock.reserved_stock,
      low_stock_threshold: editStock.low_stock_threshold,
      updated_at: new Date().toISOString(),
    }).eq('id', editRow.id);
    if (error) toast.error(error.message);
    else { toast.success('Stock updated'); setEditRow(null); load(); }
    setSaving(false);
  }

  return (
    <div className="page-enter">
      <AdminHeader title="Inventory & Warehouse" subtitle="Monitor and manage all stock levels across your warehouse." />
      <div className="p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Stock Units', value: formatNumber(totalStock), icon: Package, color: 'bg-blue-50 text-blue-600' },
            { label: 'Reserved Stock', value: formatNumber(reservedStock), icon: TrendingDown, color: 'bg-violet-50 text-violet-600' },
            { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color.split(' ')[0]}`}>
                <s.icon className={`w-5 h-5 ${s.color.split(' ')[1]}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Inventory Records</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
              </div>
              <button onClick={load} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              </button>
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
                    {['Product', 'SKU', 'Category', 'Total Stock', 'Reserved', 'Available', 'Status', 'Updated', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-12 text-slate-400">No inventory records found</td></tr>
                  ) : (
                    filtered.map((row) => {
                      const isLow = row.available_stock <= row.low_stock_threshold;
                      return (
                        <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-slate-900">{row.products?.name}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{row.products?.sku}</td>
                          <td className="px-4 py-3.5 text-slate-500">{row.products?.categories?.name ?? '—'}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">{formatNumber(row.total_stock)}</td>
                          <td className="px-4 py-3.5 text-violet-600 font-medium">{formatNumber(row.reserved_stock)}</td>
                          <td className="px-4 py-3.5">
                            <span className={`font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>{formatNumber(row.available_stock)}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={isLow ? 'low' : 'active'} />
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs">{formatDate(row.updated_at)}</td>
                          <td className="px-4 py-3.5">
                            <button onClick={() => openEdit(row)} className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center transition-colors">
                              <Edit2 className="w-3.5 h-3.5 text-osra-primary" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>Update Stock — {editRow?.products?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Total Stock', key: 'total_stock' },
              { label: 'Reserved Stock', key: 'reserved_stock' },
              { label: 'Low Stock Threshold', key: 'low_stock_threshold' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input type="number" min={0}
                  value={(editStock as any)[key]}
                  onChange={(e) => setEditStock((p) => ({ ...p, [key]: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
              </div>
            ))}
            <button onClick={saveEdit} disabled={saving}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
