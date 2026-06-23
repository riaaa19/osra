'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin/header';
import { Building2, Shield, Bell, Palette, Users, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'users', label: 'User Management', icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ orderUpdates: true, inventoryAlerts: true, paymentAlerts: true, systemAlerts: false });
  const [company, setCompany] = useState({ name: 'OSRA Wholesale', email: 'admin@osra.in', phone: '+91 98765 43210', address: 'Mumbai, Maharashtra, India', website: 'https://osra.in', gst: 'GSTIN1234567890' });

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Settings saved successfully');
    setSaving(false);
  }

  return (
    <div className="page-enter">
      <AdminHeader title="Settings" subtitle="Configure your platform preferences and company information." />
      <div className="p-6 flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0">
          <div className="bg-white rounded-2xl p-2 card-base space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', activeTab === id ? 'btn-primary text-white ' : 'text-slate-600 hover:bg-slate-50')}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {activeTab === 'company' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Company Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(company).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input value={val} onChange={(e) => setCompany((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-xs text-slate-400">Receive alerts for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                    </div>
                    <button onClick={() => setNotifs((p) => ({ ...p, [key]: !val }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-osra-primary' : 'bg-slate-200'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${val ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-5">
              <h3 className="font-bold text-slate-900">Security Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-sm px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-sm px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-sm px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {(activeTab === 'branding' || activeTab === 'users') && (
            <div className="bg-white rounded-2xl p-12 card-base flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-osra-primary/10 rounded-2xl flex items-center justify-center mb-4">
                {activeTab === 'branding' ? <Palette className="w-8 h-8 text-osra-primary" /> : <Users className="w-8 h-8 text-osra-primary" />}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{activeTab === 'branding' ? 'Branding Settings' : 'User Management'}</h3>
              <p className="text-slate-400 text-sm mt-2">This section is coming soon. Configure your {activeTab} preferences here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
