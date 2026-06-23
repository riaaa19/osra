'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Plus, CheckCircle, XCircle, Eye, Users } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { StatusBadge } from '@/components/status-badge';
import { supabase, Middleman } from '@/lib/supabase';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DEMO: Partial<Middleman & { profiles: any }>[] = [
  { id: 'd1', business_name: 'Rahul Boutique', store_slug: 'rahul-boutique', phone: '+91 98765 43210', credit_limit: 50000, credit_used: 12500, commission_percent: 8, status: 'active', created_at: new Date().toISOString(), profiles: { full_name: 'Rahul Sharma', email: 'rahul@example.com' } },
  { id: 'd2', business_name: 'Priya Exports', store_slug: 'priya-exports', phone: '+91 87654 32109', credit_limit: 75000, credit_used: 0, commission_percent: 10, status: 'pending', created_at: new Date().toISOString(), profiles: { full_name: 'Priya Patel', email: 'priya@example.com' } },
  { id: 'd3', business_name: 'Raj Traders', store_slug: 'raj-traders', phone: '+91 76543 21098', credit_limit: 100000, credit_used: 85000, commission_percent: 7, status: 'active', created_at: new Date().toISOString(), profiles: { full_name: 'Raj Kumar', email: 'raj@example.com' } },
  { id: 'd4', business_name: 'Star Wholesale', store_slug: 'star-wholesale', phone: '+91 65432 10987', credit_limit: 30000, credit_used: 30000, commission_percent: 6, status: 'suspended', created_at: new Date().toISOString(), profiles: { full_name: 'Meena Singh', email: 'meena@example.com' } },
];

export default function MiddlemenPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('middlemen')
      .select('*, profiles(full_name, email, avatar_url)')
      .order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const display = (rows.length > 0 ? rows : DEMO).filter((r) => {
    const matchSearch = r.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('middlemen').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(`Middleman ${status}`); load(); setSelected(null); }
  }

  const stats = { active: (display).filter((r) => r.status === 'active').length, pending: (display).filter((r) => r.status === 'pending').length };

  return (
    <div className="page-enter">
      <AdminHeader title="Middleman Management" subtitle="Manage your reseller network and distributor accounts." />
      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Middlemen', value: display.length, color: 'text-slate-900' },
            { label: 'Active', value: stats.active, color: 'text-green-600' },
            { label: 'Pending Approval', value: stats.pending, color: 'text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 card-base text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl card-base overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">All Middlemen</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search middlemen..."
                  className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-osra-primary bg-slate-50 w-52" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-slate-50">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Middleman', 'Contact', 'Store Link', 'Credit Limit', 'Credit Used', 'Commission', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9}><div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin" /></div></td></tr>
                ) : display.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-osra-primary to-osra-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(r.profiles?.full_name ?? r.business_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{r.business_name}</p>
                          <p className="text-xs text-slate-400">{r.profiles?.full_name ?? ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{r.phone ?? '—'}</p>
                      <p className="text-xs text-slate-400">{r.profiles?.email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-osra-primary">/store/{r.store_slug}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{formatCurrency(r.credit_limit)}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className={`font-medium ${r.credit_used >= r.credit_limit ? 'text-red-600' : 'text-slate-900'}`}>{formatCurrency(r.credit_used)}</p>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (r.credit_used / r.credit_limit) * 100)}%`, background: r.credit_used >= r.credit_limit ? '#EF4444' : '#5B3DF5' }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{r.commission_percent}%</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(r)} className="w-7 h-7 rounded-lg hover:bg-osra-primary/10 flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-osra-primary" />
                        </button>
                        {r.status === 'pending' && (
                          <button onClick={() => updateStatus(r.id, 'active')} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          </button>
                        )}
                        {r.status === 'active' && (
                          <button onClick={() => updateStatus(r.id, 'suspended')} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        )}
                        {r.status === 'suspended' && (
                          <button onClick={() => updateStatus(r.id, 'active')} className="w-7 h-7 rounded-lg hover:bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.business_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Owner', value: selected.profiles?.full_name ?? '—' },
                  { label: 'Email', value: selected.profiles?.email ?? '—' },
                  { label: 'Phone', value: selected.phone ?? '—' },
                  { label: 'Store', value: `/store/${selected.store_slug}` },
                  { label: 'Credit Limit', value: formatCurrency(selected.credit_limit) },
                  { label: 'Credit Used', value: formatCurrency(selected.credit_used) },
                  { label: 'Commission', value: `${selected.commission_percent}%` },
                  { label: 'Status', value: <StatusBadge status={selected.status} /> },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <div className="text-sm font-semibold text-slate-900">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {selected.status !== 'active' && (
                  <button onClick={() => updateStatus(selected.id, 'active')}
                    className="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                )}
                {selected.status !== 'suspended' && (
                  <button onClick={() => updateStatus(selected.id, 'suspended')}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                    Suspend
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
