'use client';

import { useState } from 'react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const CLAIMS = [
  { id: 'CLM-001', orderId: '#ORD-2340', product: 'Wireless Earbuds', amount: 850, reason: 'Product defective on arrival', status: 'pending', date: new Date().toISOString() },
  { id: 'CLM-002', orderId: '#ORD-2335', product: 'Travel Backpack', amount: 550, reason: 'Wrong color delivered', status: 'approved', date: new Date(Date.now() - 172800000).toISOString() },
];

export default function ClaimsPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ orderId: '', product: '', reason: '', amount: '' });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success('Claim submitted successfully');
    setOpen(false);
    setForm({ orderId: '', product: '', reason: '', amount: '' });
  }

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Claims & Replacements" subtitle="Submit and track return/replacement requests." />
      <div className="p-6 space-y-5">
        <div className="flex justify-end">
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" /> New Claim
          </button>
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">My Claims</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Claim ID', 'Order', 'Product', 'Amount', 'Reason', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLAIMS.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">{c.id}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{c.orderId}</td>
                    <td className="px-4 py-3.5 text-slate-700">{c.product}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(c.amount)}</td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-[180px] truncate">{c.reason}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(c.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Claim</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4 pt-1">
            {[
              { label: 'Order ID', key: 'orderId', placeholder: '#ORD-XXXX' },
              { label: 'Product Name', key: 'product', placeholder: 'Product name' },
              { label: 'Claim Amount (₹)', key: 'amount', placeholder: '0.00' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input value={(form as any)[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} rows={3}
                placeholder="Describe the issue..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary resize-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 transition-all">
              Submit Claim
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
