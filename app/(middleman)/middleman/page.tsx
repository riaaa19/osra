'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, Wallet, Copy, Share2, ArrowRight, CheckCircle } from 'lucide-react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const RECENT_ORDERS = [
  { id: '#ORD12345', customer: 'Amit Kumar', amount: 1250, status: 'awaiting admin acceptance', timeRemaining: '42m 10s' },
  { id: '#ORD12344', customer: 'Neha Singh', amount: 750, status: 'token reserved', timeRemaining: null },
  { id: '#ORD12343', customer: 'Ravi Patel', amount: 1500, status: 'ready to dispatch', timeRemaining: null },
  { id: '#ORD12342', customer: 'Priya Sharma', amount: 980, status: 'dispatched', timeRemaining: null },
  { id: '#ORD12341', customer: 'Suresh Yadav', amount: 1100, status: 'delivered', timeRemaining: null },
];

export default function MiddlemanDashboardPage() {
  const storeLink = 'https://osra.in/store/rahul-boutique';
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(storeLink).then(() => {
      setCopied(true);
      toast.success('Store link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Dashboard" subtitle="Here's what's happening with your business today." />
      <div className="p-6 space-y-5">
        {/* Store link + Account status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Store link card */}
          <div className="bg-white rounded-2xl p-5 card-base">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-slate-700">Your Store Link</span>
              <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full border border-green-200">Live</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="text-osra-primary font-semibold text-sm truncate">{storeLink}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={copyLink} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg btn-primary text-white text-sm font-semibold hover:opacity-90 transition-all">
                <Share2 className="w-4 h-4" /> Share to WhatsApp Status
              </button>
            </div>
          </div>

          {/* Account status */}
          <div className="bg-white rounded-2xl p-5 card-base">
            <p className="text-sm font-semibold text-slate-700 mb-4">Account Status</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">Account Clean</p>
                <p className="text-sm font-medium text-green-600">Full Platform Access Active</p>
                <p className="text-xs text-slate-500 mt-0.5">Great! You have no outstanding dues.</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: '128', icon: ShoppingBag, bg: 'bg-violet-50', color: 'text-violet-600' },
            { label: 'Pending Orders', value: '12', icon: Clock, bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Completed Orders', value: '116', icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'Account Ledger', value: '₹0.00', icon: Wallet, bg: 'bg-blue-50', color: 'text-blue-600', sub: 'Balance' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-5 card-base flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${k.bg} flex items-center justify-center shrink-0`}>
                <k.icon className={`w-5 h-5 ${k.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{k.label}</p>
                <p className="text-2xl font-bold text-slate-900">{k.value}</p>
                {k.sub && <p className="text-xs text-slate-400">{k.sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Recent Orders</h3>
            <Link href="/middleman/orders" className="flex items-center gap-1 text-sm text-osra-primary hover:underline font-medium">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Order ID', 'Customer', 'Amount', 'Status', 'Time Remaining'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-osra-primary text-xs">{o.id}</td>
                    <td className="px-5 py-3.5 text-slate-700">{o.customer}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{formatCurrency(o.amount)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3.5">
                      {o.timeRemaining ? (
                        <span className="text-red-600 font-semibold">{o.timeRemaining}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
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
