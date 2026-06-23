'use client';

import { useState } from 'react';
import { Search, Eye, Store } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

const DEMO_RETAILERS = [
  { id: 'r1', name: 'Fashion World', owner: 'Kavya Nair', phone: '+91 99887 76655', email: 'kavya@fashionworld.in', middleman: 'Rahul Boutique', creditBalance: 5000, totalOrders: 28, status: 'active', joined: new Date().toISOString() },
  { id: 'r2', name: 'Tech Corner', owner: 'Arun Mehta', phone: '+91 88776 65544', email: 'arun@techcorner.in', middleman: 'Priya Exports', creditBalance: 0, totalOrders: 15, status: 'active', joined: new Date().toISOString() },
  { id: 'r3', name: 'Home Essentials', owner: 'Deepa Verma', phone: '+91 77665 54433', email: 'deepa@homeess.in', middleman: 'Raj Traders', creditBalance: -2500, totalOrders: 42, status: 'pending', joined: new Date().toISOString() },
  { id: 'r4', name: 'Style Hub', owner: 'Sanjay Gupta', phone: '+91 66554 43322', email: 'sanjay@stylehub.in', middleman: 'Star Wholesale', creditBalance: 1200, totalOrders: 8, status: 'suspended', joined: new Date().toISOString() },
];

export default function RetailersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = DEMO_RETAILERS.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="page-enter">
      <AdminHeader title="Retailer Management" subtitle="View and manage all retailers across your network." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Retailers', value: DEMO_RETAILERS.length },
            { label: 'Active Retailers', value: DEMO_RETAILERS.filter((r) => r.status === 'active').length },
            { label: 'Pending Approval', value: DEMO_RETAILERS.filter((r) => r.status === 'pending').length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">All Retailers</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search retailers..."
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Retailer', 'Contact', 'Assigned Middleman', 'Credit Balance', 'Total Orders', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(r.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{r.name}</p>
                          <p className="text-xs text-slate-400">{r.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{r.phone}</p>
                      <p className="text-xs text-slate-400">{r.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{r.middleman}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold ${r.creditBalance < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        {formatCurrency(r.creditBalance)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{r.totalOrders}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(r.joined)}</td>
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
