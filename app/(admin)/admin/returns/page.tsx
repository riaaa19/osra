'use client';

import { useState } from 'react';
import { Search, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

const RETURNS = [
  { id: 'RET-001', orderId: '#ORD-12340', middleman: 'Rahul Boutique', customer: 'Amit Kumar', product: 'Wireless Earbuds', amount: 850, reason: 'Product defective', status: 'pending', date: new Date().toISOString() },
  { id: 'RET-002', orderId: '#ORD-12338', middleman: 'Priya Exports', customer: 'Neha Singh', product: 'Premium Luggage', amount: 1200, reason: 'Wrong item delivered', status: 'approved', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'RET-003', orderId: '#ORD-12335', middleman: 'Raj Traders', customer: 'Ravi Patel', product: 'Analog Watch', amount: 1050, reason: 'Item not as described', status: 'rejected', date: new Date(Date.now() - 172800000).toISOString() },
];

export default function ReturnsPage() {
  const [search, setSearch] = useState('');

  const filtered = RETURNS.filter((r) =>
    r.orderId.toLowerCase().includes(search.toLowerCase()) ||
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="page-enter">
      <AdminHeader title="Returns & Disputes" subtitle="Manage return requests and dispute resolutions." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Returns', value: RETURNS.length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Approved', value: RETURNS.filter((r) => r.status === 'approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rejected', value: RETURNS.filter((r) => r.status === 'rejected').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Return Requests</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search returns..."
                className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Return ID', 'Order', 'Middleman', 'Customer', 'Product', 'Amount', 'Reason', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">{r.id}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{r.orderId}</td>
                    <td className="px-4 py-3.5 text-slate-700">{r.middleman}</td>
                    <td className="px-4 py-3.5 text-slate-700">{r.customer}</td>
                    <td className="px-4 py-3.5 text-slate-700">{r.product}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(r.amount)}</td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-[150px] truncate">{r.reason}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(r.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
