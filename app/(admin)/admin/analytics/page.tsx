'use client';

import { AdminHeader } from '@/components/admin/header';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const MONTHLY = [
  { month: 'Jan', revenue: 420000, orders: 98, middlemen: 12 },
  { month: 'Feb', revenue: 380000, orders: 87, middlemen: 14 },
  { month: 'Mar', revenue: 510000, orders: 124, middlemen: 16 },
  { month: 'Apr', revenue: 460000, orders: 108, middlemen: 15 },
  { month: 'May', revenue: 620000, orders: 145, middlemen: 19 },
  { month: 'Jun', revenue: 590000, orders: 139, middlemen: 21 },
  { month: 'Jul', revenue: 740000, orders: 176, middlemen: 24 },
];

const TOP_PRODUCTS = [
  { name: 'Premium Luggage Bag', sold: 234, revenue: 280800 },
  { name: 'Travel Backpack', sold: 189, revenue: 103950 },
  { name: 'Wireless Earbuds', sold: 312, revenue: 265200 },
  { name: 'Analog Watch', sold: 156, revenue: 163800 },
  { name: 'Fashion Tote', sold: 278, revenue: 111200 },
];

const CATEGORY_PIE = [
  { name: 'Electronics', value: 38, color: '#5B3DF5' },
  { name: 'Fashion', value: 24, color: '#7C4DFF' },
  { name: 'Luggage', value: 20, color: '#22C55E' },
  { name: 'Accessories', value: 12, color: '#F59E0B' },
  { name: 'Home', value: 6, color: '#EF4444' },
];

const TOP_MIDDLEMEN = [
  { name: 'Rahul Boutique', orders: 45, revenue: 380000, growth: 18 },
  { name: 'Priya Exports', orders: 38, revenue: 290000, growth: 12 },
  { name: 'Raj Traders', orders: 52, revenue: 480000, growth: -3 },
  { name: 'Star Wholesale', orders: 29, revenue: 220000, growth: 25 },
  { name: 'City Depot', orders: 41, revenue: 350000, growth: 8 },
];

export default function AnalyticsPage() {
  return (
    <div className="page-enter">
      <AdminHeader title="Analytics" subtitle="Comprehensive performance insights for your platform." />
      <div className="p-6 space-y-5">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(3720000), change: '+18.4%', positive: true },
            { label: 'Total Orders', value: '877', change: '+22.1%', positive: true },
            { label: 'Avg Order Value', value: formatCurrency(4242), change: '+5.3%', positive: true },
            { label: 'Active Middlemen', value: '24', change: '+4', positive: true },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-5 card-base">
              <p className="text-sm text-slate-500">{k.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}</p>
              <p className={`text-xs font-semibold mt-1 ${k.positive ? 'text-green-600' : 'text-red-500'}`}>{k.change} vs last period</p>
            </div>
          ))}
        </div>

        {/* Revenue + Orders Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 card-base">
            <h3 className="font-bold text-slate-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B3DF5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#5B3DF5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#5B3DF5" strokeWidth={2.5} fill="url(#revG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 card-base">
            <h3 className="font-bold text-slate-900 mb-4">Orders Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="orders" fill="#7C4DFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Top Products */}
          <div className="xl:col-span-2 bg-white rounded-2xl card-base overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Top Selling Products</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Units Sold</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-300 text-lg">{i + 1}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3.5 text-slate-700">{p.sold}</td>
                    <td className="px-4 py-3.5 font-semibold text-green-700">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category Pie */}
          <div className="bg-white rounded-2xl p-5 card-base">
            <h3 className="font-bold text-slate-900 mb-4">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={CATEGORY_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {CATEGORY_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {CATEGORY_PIE.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-slate-600 flex-1">{c.name}</span>
                  <span className="text-xs font-semibold text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middleman Performance */}
        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Middleman Performance</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Middleman', 'Total Orders', 'Revenue', 'Growth'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_MIDDLEMEN.map((m) => (
                <tr key={m.name} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{m.name}</td>
                  <td className="px-5 py-3.5 text-slate-700">{m.orders}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{formatCurrency(m.revenue)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.growth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {m.growth >= 0 ? '+' : ''}{m.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
