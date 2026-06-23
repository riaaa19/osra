'use client';

import { MiddlemanHeader } from '@/components/middleman/header';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MONTHLY = [
  { month: 'Jan', revenue: 12500, orders: 8 },
  { month: 'Feb', revenue: 9800, orders: 6 },
  { month: 'Mar', revenue: 15200, orders: 11 },
  { month: 'Apr', revenue: 11000, orders: 9 },
  { month: 'May', revenue: 18500, orders: 14 },
  { month: 'Jun', revenue: 16200, orders: 12 },
  { month: 'Jul', revenue: 21000, orders: 16 },
];

export default function MiddlemanAnalyticsPage() {
  return (
    <div className="page-enter">
      <MiddlemanHeader title="Analytics" subtitle="Your store performance and sales insights." />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: formatCurrency(104200), change: '+12.4%' },
            { label: 'Total Orders', value: '76', change: '+8.2%' },
            { label: 'Avg Order', value: formatCurrency(1371), change: '+3.8%' },
            { label: 'Conversion', value: '64%', change: '+2.1%' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-5 card-base">
              <p className="text-sm text-slate-500">{k.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{k.value}</p>
              <p className="text-xs font-semibold text-green-600 mt-1">{k.change} vs last month</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 card-base">
            <h3 className="font-bold text-slate-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="mRevG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B3DF5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#5B3DF5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#5B3DF5" strokeWidth={2.5} fill="url(#mRevG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 card-base">
            <h3 className="font-bold text-slate-900 mb-4">Orders by Month</h3>
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
      </div>
    </div>
  );
}
