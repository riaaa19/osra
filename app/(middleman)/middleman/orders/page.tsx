'use client';

import { useState } from 'react';
import { ShoppingCart, Clock, CheckCircle2, XCircle, Package, Eye } from 'lucide-react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ORDERS = [
  { id: '#ORD-2345', customer: 'Amit Kumar', phone: '+91 98765 43210', amount: 1250, items: 3, status: 'pending', time: new Date().toISOString(), timeRemaining: '42m 10s', address: '12, MG Road, Bangalore' },
  { id: '#ORD-2344', customer: 'Neha Singh', phone: '+91 87654 32109', amount: 750, items: 1, status: 'confirmed', time: new Date(Date.now() - 3600000).toISOString(), timeRemaining: null, address: '45, Park Street, Mumbai' },
  { id: '#ORD-2343', customer: 'Ravi Patel', phone: '+91 76543 21098', amount: 1500, items: 2, status: 'packed', time: new Date(Date.now() - 7200000).toISOString(), timeRemaining: null, address: '78, Connaught Place, Delhi' },
  { id: '#ORD-2342', customer: 'Priya Sharma', phone: '+91 65432 10987', amount: 980, items: 2, status: 'shipped', time: new Date(Date.now() - 86400000).toISOString(), timeRemaining: null, address: '23, Anna Nagar, Chennai' },
  { id: '#ORD-2341', customer: 'Suresh Yadav', phone: '+91 54321 09876', amount: 1100, items: 4, status: 'delivered', time: new Date(Date.now() - 172800000).toISOString(), timeRemaining: null, address: '56, Banjara Hills, Hyderabad' },
  { id: '#ORD-2340', customer: 'Kavya Nair', phone: '+91 43210 98765', amount: 620, items: 1, status: 'cancelled', time: new Date(Date.now() - 259200000).toISOString(), timeRemaining: null, address: 'MG Road, Kochi' },
];

const TABS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

export default function MiddlemanOrdersPage() {
  const [tab, setTab] = useState('All');
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = ORDERS.filter((o) => tab === 'All' || o.status === tab.toLowerCase());

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Orders Queue" subtitle="Manage and track your customer orders." />
      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: ORDERS.length, icon: ShoppingCart, bg: 'bg-violet-50', color: 'text-violet-600' },
            { label: 'Pending', value: ORDERS.filter((o) => o.status === 'pending').length, icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Completed', value: ORDERS.filter((o) => o.status === 'delivered').length, icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'Cancelled', value: ORDERS.filter((o) => o.status === 'cancelled').length, icon: XCircle, bg: 'bg-red-50', color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'btn-primary text-white ' : 'bg-white text-slate-600 border border-slate-200 hover:border-osra-primary/50'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Time Remaining', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-semibold text-osra-primary text-xs">{o.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-900 font-medium">{o.customer}</p>
                      <p className="text-xs text-slate-400">{o.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{o.items} items</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(o.amount)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDateTime(o.time)}</td>
                    <td className="px-4 py-3.5">
                      {o.timeRemaining ? <span className="text-red-600 font-semibold">{o.timeRemaining}</span> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setSelected(o)} className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-osra-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Order {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Customer', value: selected.customer },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Amount', value: formatCurrency(selected.amount) },
                  { label: 'Items', value: `${selected.items} items` },
                  { label: 'Address', value: selected.address },
                  { label: 'Status', value: <StatusBadge status={selected.status} /> },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <div className="text-sm font-semibold text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
