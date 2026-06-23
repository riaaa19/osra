'use client';

import { useState } from 'react';
import { MiddlemanHeader } from '@/components/middleman/header';
import { Save, User, Lock, Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function MiddlemanSettingsPage() {
  const { profile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ orderUpdates: true, paymentAlerts: true, promotions: false });

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Settings saved');
    setSaving(false);
  }

  return (
    <div className="page-enter">
      <MiddlemanHeader title="Settings" subtitle="Manage your account preferences." />
      <div className="p-6 flex gap-5">
        <div className="w-48 shrink-0">
          <div className="bg-white rounded-2xl p-2 card-base space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', tab === id ? 'btn-primary text-white ' : 'text-slate-600 hover:bg-slate-50')}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {tab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Profile Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: profile?.full_name ?? '' },
                  { label: 'Email', value: profile?.email ?? '' },
                  { label: 'Phone', value: profile?.phone ?? '' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <input defaultValue={value} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                  </div>
                ))}
              </div>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Notification Preferences</h3>
              {Object.entries(notifs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  </div>
                  <button onClick={() => setNotifs((p) => ({ ...p, [key]: !val }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-osra-primary' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${val ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'security' && (
            <div className="bg-white rounded-2xl p-6 card-base space-y-4">
              <h3 className="font-bold text-slate-900">Change Password</h3>
              {['Current Password', 'New Password', 'Confirm Password'].map((l) => (
                <div key={l}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{l}</label>
                  <input type="password" placeholder="••••••••" className="w-full max-w-sm px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-osra-primary" />
                </div>
              ))}
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-all">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
