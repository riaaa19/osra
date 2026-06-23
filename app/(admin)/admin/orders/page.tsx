'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, ChevronDown, Eye, ArrowRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { supabase, Order } from '@/lib/supabase';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ORDER_STATUSES = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const DEMO_ORDERS = [
  { id: '1', order_number: '#ORD-12345', middlemen: { business_name: 'Rahul Boutique' }, customer_name: 'Amit Kumar', customer_phone: '+91 98765 43210', total_amount: 12500, status: 'pending', created_at: new Date().toISOString(), notes: null },
  { id: '2', order_number: '#ORD-12344', middlemen: { business_name: 'Priya Exports' }, customer_name: 'Neha Singh', customer_phone: '+91 87654 32109', total_amount: 7500, status: 'confirmed', created_at: new Date(Date.now() - 86400000).toISOString(), notes: null },
  { id: '3', order_number: '#ORD-12343', middlemen: { business_name: 'Raj Traders' }, customer_name: 'Ravi Patel', customer_phone: '+91 76543 21098', total_amount: 15000, status: 'packed', created_at: new Date(Date.now() - 172800000).toISOString(), notes: null },
  { id: '4', order_number: '#ORD-12342', middlemen: { business_name: 'Star Wholesale' }, customer_name: 'Priya Sharma', customer_phone: '+91 65432 10987', total_amount: 9800, status: 'shipped', created_at: new Date(Date.now() - 259200000).toISOString(), notes: null },
  { id: '5', order_number: '#ORD-12341', middlemen: { business_name: 'City Depot' }, customer_name: 'Suresh Yadav', customer_phone: '+91 54321 09876', total_amount: 11000, status: 'delivered', created_at: new Date(Date.now() - 345600000).toISOString(), notes: null },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*, middlemen(business_name)')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const display = (orders.length > 0 ? orders : DEMO_ORDERS).filter((o) => {
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.middlemen?.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = ORDER_STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = (orders.length > 0 ? orders : DEMO_ORDERS).filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  async function updateStatus(orderId: string, status: string) {
    setUpdatingStatus(true);
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (error) toast.error(error.message);
    else { toast.success('Order status updated'); load(); setSelected(null); }
    setUpdatingStatus(false);
  }

  const NEXT_STATUS: Record<string, string> = {
    pending: 'confirmed', confirmed: 'packed', packed: 'shipped', shipped: 'delivered',
  };

  return (
    <div className="page-enter">
      <AdminHeader title="Order Management" subtitle="Track, manage, and update all wholesale orders." />
      <div className="p-6 space-y-5">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'btn-primary text-white ' : 'bg-white text-slate-600 border border-slate-200 hover:border-osra-primary/50'}`}>
              {s === 'all' ? 'All Orders' : <span className="capitalize">{s}</span>}
              {s !== 'all' && counts[s] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Orders <span className="text-slate-400 font-normal text-sm">({display.length})</span></h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..."
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Order ID', 'Middleman', 'Customer', 'Amount', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}><div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin" /></div></td></tr>
                ) : display.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No orders found</td></tr>
                ) : (
                  display.map((o) => (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-semibold text-osra-primary text-xs">{o.order_number}</td>
                      <td className="px-4 py-3.5 text-slate-700">{o.middlemen?.business_name ?? '—'}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-slate-900">{o.customer_name ?? '—'}</p>
                        <p className="text-xs text-slate-400">{o.customer_phone ?? ''}</p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(o.total_amount)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{formatDateTime(o.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(o)}
                            className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center">
                            <Eye className="w-3.5 h-3.5 text-osra-primary" />
                          </button>
                          {NEXT_STATUS[o.status] && (
                            <button onClick={() => updateStatus(o.id, NEXT_STATUS[o.status])}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium btn-primary text-white hover:opacity-90 transition-all">
                              {NEXT_STATUS[o.status]} <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Order Details — {selected?.order_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Middleman', value: selected.middlemen?.business_name ?? '—' },
                  { label: 'Customer', value: selected.customer_name ?? '—' },
                  { label: 'Phone', value: selected.customer_phone ?? '—' },
                  { label: 'Total', value: formatCurrency(selected.total_amount) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Current Status</p>
                  <StatusBadge status={selected.status} />
                </div>
                {NEXT_STATUS[selected.status] && (
                  <button onClick={() => updateStatus(selected.id, NEXT_STATUS[selected.status])}
                    disabled={updatingStatus}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl btn-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60">
                    Move to {NEXT_STATUS[selected.status]} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {selected.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-amber-700 mb-1">Notes</p>
                  <p className="text-sm text-amber-900">{selected.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
