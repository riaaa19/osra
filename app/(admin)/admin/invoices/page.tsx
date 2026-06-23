'use client';

import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FileText, Download } from 'lucide-react';

const INVOICES = [
  { id: 'INV-001', orderId: '#ORD-12345', middleman: 'Rahul Boutique', amount: 12500, tax: 2250, total: 14750, status: 'paid', date: new Date().toISOString() },
  { id: 'INV-002', orderId: '#ORD-12344', middleman: 'Priya Exports', amount: 7500, tax: 1350, total: 8850, status: 'pending', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'INV-003', orderId: '#ORD-12343', middleman: 'Raj Traders', amount: 15000, tax: 2700, total: 17700, status: 'paid', date: new Date(Date.now() - 172800000).toISOString() },
  { id: 'INV-004', orderId: '#ORD-12342', middleman: 'Star Wholesale', amount: 9800, tax: 1764, total: 11564, status: 'overdue', date: new Date(Date.now() - 604800000).toISOString() },
];

export default function InvoicesPage() {
  return (
    <div className="page-enter">
      <AdminHeader title="Invoice Center" subtitle="Manage and track all billing and invoices." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Invoiced', value: formatCurrency(INVOICES.reduce((a, i) => a + i.total, 0)) },
            { label: 'Paid', value: formatCurrency(INVOICES.filter((i) => i.status === 'paid').reduce((a, i) => a + i.total, 0)) },
            { label: 'Outstanding', value: formatCurrency(INVOICES.filter((i) => i.status !== 'paid').reduce((a, i) => a + i.total, 0)) },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">All Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Invoice ID', 'Order', 'Middleman', 'Subtotal', 'Tax (18%)', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">{inv.id}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{inv.orderId}</td>
                    <td className="px-4 py-3.5 text-slate-700">{inv.middleman}</td>
                    <td className="px-4 py-3.5 text-slate-700">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3.5 text-slate-500">{formatCurrency(inv.tax)}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3.5">
                      <button className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center transition-colors">
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
