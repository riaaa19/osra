'use client';

import { MiddlemanHeader } from '@/components/middleman/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Download } from 'lucide-react';

const INVOICES = [
  { id: 'INV-001', orderId: '#ORD-2345', customer: 'Amit Kumar', amount: 1250, total: 1475, status: 'paid', date: new Date().toISOString() },
  { id: 'INV-002', orderId: '#ORD-2344', customer: 'Neha Singh', amount: 750, total: 885, status: 'pending', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'INV-003', orderId: '#ORD-2343', customer: 'Ravi Patel', amount: 1500, total: 1770, status: 'paid', date: new Date(Date.now() - 172800000).toISOString() },
];

export default function MiddlemanInvoicesPage() {
  return (
    <div className="page-enter">
      <MiddlemanHeader title="Invoices" subtitle="View and download your sales invoices." />
      <div className="p-6">
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">My Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Invoice', 'Order', 'Customer', 'Amount', 'Total (incl. GST)', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">{inv.id}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{inv.orderId}</td>
                    <td className="px-4 py-3.5 text-slate-700">{inv.customer}</td>
                    <td className="px-4 py-3.5 text-slate-700">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3.5">
                      <button className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center">
                        <Download className="w-3.5 h-3.5 text-osra-primary" />
                      </button>
                    </td>
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
