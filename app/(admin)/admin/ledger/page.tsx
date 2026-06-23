'use client';

import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TXN-001', middleman: 'Rahul Boutique', type: 'credit', description: 'Order #ORD-12345 Payment', amount: 12500, balance: 45200, date: new Date().toISOString() },
  { id: 'TXN-002', middleman: 'Priya Exports', type: 'debit', description: 'Order #ORD-12344 Refund', amount: 1500, balance: 38700, date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'TXN-003', middleman: 'Raj Traders', type: 'credit', description: 'Order #ORD-12343 Payment', amount: 22100, balance: 82400, date: new Date(Date.now() - 172800000).toISOString() },
  { id: 'TXN-004', middleman: 'Star Wholesale', type: 'credit', description: 'Advance Deposit', amount: 50000, balance: 50000, date: new Date(Date.now() - 259200000).toISOString() },
  { id: 'TXN-005', middleman: 'City Depot', type: 'debit', description: 'Commission Settlement', amount: 8750, balance: 24500, date: new Date(Date.now() - 345600000).toISOString() },
];

export default function LedgerPage() {
  const totalCredit = TRANSACTIONS.filter((t) => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
  const totalDebit = TRANSACTIONS.filter((t) => t.type === 'debit').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="page-enter">
      <AdminHeader title="Ledger & Financials" subtitle="Track all financial transactions and account balances." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Credits', value: formatCurrency(totalCredit), icon: TrendingUp, bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'Total Debits', value: formatCurrency(totalDebit), icon: TrendingDown, bg: 'bg-red-50', color: 'text-red-600' },
            { label: 'Net Balance', value: formatCurrency(totalCredit - totalDebit), icon: DollarSign, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Transactions', value: TRANSACTIONS.length, icon: CreditCard, bg: 'bg-violet-50', color: 'text-violet-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Transaction History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Transaction ID', 'Middleman', 'Type', 'Description', 'Amount', 'Running Balance', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">{t.id}</td>
                    <td className="px-4 py-3.5 text-slate-700">{t.middleman}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.type === 'credit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{t.description}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold ${t.type === 'credit' ? 'text-green-700' : 'text-red-600'}`}>
                        {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(t.balance)}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(t.date)}</td>
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
