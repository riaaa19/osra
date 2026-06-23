'use client';

import { useEffect, useState } from 'react';
import {
  Boxes, ShoppingCart, CheckCircle2, Users, Store,
  DollarSign, AlertTriangle, ArrowRight, TrendingUp,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { KpiCard } from '@/components/kpi-card';
import { StatusBadge } from '@/components/status-badge';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 420000 },
  { month: 'Feb', revenue: 380000 },
  { month: 'Mar', revenue: 510000 },
  { month: 'Apr', revenue: 460000 },
  { month: 'May', revenue: 620000 },
  { month: 'Jun', revenue: 590000 },
  { month: 'Jul', revenue: 740000 },
];

const INVENTORY_DATA = [
  { name: 'Electronics', value: 2400 },
  { name: 'Fashion',     value: 3100 },
  { name: 'Home',        value: 1800 },
  { name: 'Travel',      value: 950  },
  { name: 'Accessories', value: 2200 },
];

const DEMO_ORDERS = [
  { id: '1', order_number: '#ORD-001', business: 'Rahul Boutique', total_amount: 12500, status: 'delivered', created_at: new Date().toISOString() },
  { id: '2', order_number: '#ORD-002', business: 'Priya Exports',  total_amount: 8750,  status: 'shipped',   created_at: new Date().toISOString() },
  { id: '3', order_number: '#ORD-003', business: 'Raj Traders',    total_amount: 15200, status: 'confirmed', created_at: new Date().toISOString() },
  { id: '4', order_number: '#ORD-004', business: 'Star Wholesale', total_amount: 5300,  status: 'pending',   created_at: new Date().toISOString() },
  { id: '5', order_number: '#ORD-005', business: 'City Depot',     total_amount: 22100, status: 'packed',    created_at: new Date().toISOString() },
];

const ALERTS = [
  { id: 1, type: 'warning', title: 'Low Stock Alert',    msg: 'Wireless Earbuds (EAR-003) — only 12 units left.' },
  { id: 2, type: 'danger',  title: 'Overdue Payment',    msg: 'Raj Traders has an overdue balance of ₹18,500.' },
  { id: 3, type: 'info',    title: 'New Middleman',      msg: 'Priya Exports has submitted a registration request.' },
];

const ALERT_STYLES: Record<string, { bg: string; border: string; icon: string }> = {
  warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706' },
  danger:  { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB' },
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalInventory: 10450,
    reservedInventory: 1820,
    pendingOrders: 8,
    completedOrders: 116,
    revenue: 2840500,
    activeMiddlemen: 3,
    activeRetailers: 12,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [invRes, pendRes, doneRes, mmRes, ordRes] = await Promise.all([
          supabase.from('inventory').select('total_stock,reserved_stock'),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
          supabase.from('middlemen').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('orders').select('*, middlemen(business_name)').order('created_at', { ascending: false }).limit(5),
        ]);

        const inv = invRes.data ?? [];
        const totalInv = inv.reduce((a: number, r: any) => a + (r.total_stock ?? 0), 0);
        const rsvInv   = inv.reduce((a: number, r: any) => a + (r.reserved_stock ?? 0), 0);

        setStats({
          totalInventory:   totalInv  || 10450,
          reservedInventory: rsvInv   || 1820,
          pendingOrders:    pendRes.count ?? 8,
          completedOrders:  doneRes.count ?? 116,
          revenue:          2840500,
          activeMiddlemen:  mmRes.count ?? 3,
          activeRetailers:  12,
        });

        const fetchedOrders = (ordRes.data ?? []).map((o: any) => ({
          ...o, business: o.middlemen?.business_name ?? '—',
        }));
        setOrders(fetchedOrders);
      } catch (_) {
        // keep default demo stats
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayOrders = orders.length > 0 ? orders : DEMO_ORDERS;

  const kpis = [
    { title: 'Total Inventory',   value: stats.totalInventory.toLocaleString('en-IN'),   icon: Boxes,         iconColor: '#3B82F6', iconBgColor: '#EFF6FF', trend: { value: 8.2,  label: 'vs last month' } },
    { title: 'Reserved Stock',    value: stats.reservedInventory.toLocaleString('en-IN'), icon: Boxes,         iconColor: '#7C3AED', iconBgColor: '#F5F3FF' },
    { title: 'Pending Orders',    value: stats.pendingOrders,                             icon: ShoppingCart,  iconColor: '#D97706', iconBgColor: '#FFFBEB' },
    { title: 'Completed Orders',  value: stats.completedOrders,                           icon: CheckCircle2,  iconColor: '#16A34A', iconBgColor: '#F0FDF4', trend: { value: 12.5, label: 'vs last month' } },
    { title: 'Total Revenue',     value: formatCurrency(stats.revenue),                   icon: DollarSign,    iconColor: '#16A34A', iconBgColor: '#F0FDF4', trend: { value: 18.4, label: 'vs last month' } },
    { title: 'Active Middlemen',  value: stats.activeMiddlemen,                           icon: Users,         iconColor: '#0891B2', iconBgColor: '#ECFEFF' },
    { title: 'Active Retailers',  value: stats.activeRetailers,                           icon: Store,         iconColor: '#DB2777', iconBgColor: '#FDF2F8' },
    { title: 'Avg Order Value',   value: formatCurrency(4820),                            icon: TrendingUp,    iconColor: '#EA580C', iconBgColor: '#FFF7ED', trend: { value: 5.1,  label: 'vs last month' } },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
      <AdminHeader title="Dashboard" subtitle="Here's what's happening with your business today." />

      <div className="p-6 space-y-5">
        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard key={k.title} {...k} />
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Revenue Area Chart */}
          <div className="xl:col-span-2 card-base p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Revenue Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monthly revenue — last 7 months</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: '#F0FDF4', color: '#16A34A' }}>+18.4%</span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5B3DF5" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#5B3DF5" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#5B3DF5" strokeWidth={2.5} fill="url(#revG)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Horizontal Bar */}
          <div className="card-base p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Inventory by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Available stock units</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={INVENTORY_DATA} layout="vertical" margin={{ top: 0, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#5B3DF5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Orders + Alerts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Recent Orders table */}
          <div className="xl:col-span-2 card-base overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid #F1F5F9' }}>
              <h3 className="font-bold text-slate-900 text-sm">Recent Orders</h3>
              <Link href="/admin/orders"
                className="flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: '#5B3DF5' }}>
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    {['Order ID', 'Middleman', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: '#94A3B8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex items-center justify-center py-10">
                          <div className="w-7 h-7 rounded-full border-4 border-t-transparent"
                            style={{ borderColor: '#E0E7FF', borderTopColor: '#5B3DF5', animation: 'spin 0.8s linear infinite' }} />
                        </div>
                      </td>
                    </tr>
                  ) : displayOrders.map((o) => (
                    <tr key={o.id}
                      className="transition-colors hover:bg-slate-50/80"
                      style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td className="px-5 py-3.5 font-mono text-xs font-bold" style={{ color: '#5B3DF5' }}>
                        {o.order_number}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 text-xs">{o.business ?? o.middlemen?.business_name ?? '—'}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 text-xs">{formatCurrency(o.total_amount)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts + Quick Actions */}
          <div className="card-base p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">System Alerts</h3>

            {ALERTS.map((a) => {
              const s = ALERT_STYLES[a.type];
              return (
                <div key={a.id} className="flex gap-3 p-3.5 rounded-xl"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: s.icon }} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{a.msg}</p>
                  </div>
                </div>
              );
            })}

            <div className="pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Add Product',    href: '/admin/products/new' },
                  { label: 'View Orders',    href: '/admin/orders' },
                  { label: 'Add Middleman',  href: '/admin/middlemen' },
                  { label: 'View Ledger',    href: '/admin/ledger' },
                ].map((a) => (
                  <Link key={a.href} href={a.href}
                    className="flex items-center justify-center text-xs font-semibold py-2.5 rounded-lg transition-colors"
                    style={{ background: '#EEF2FF', color: '#5B3DF5', border: '1px solid #C7D2FE' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#E0E7FF'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#EEF2FF'; }}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
