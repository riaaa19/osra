'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { supabase, Notification } from '@/lib/supabase';
import { getInitials, formatDateTime } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AdminHeaderProps { title: string; subtitle?: string; }

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    supabase.from('notifications').select('*').eq('user_id', profile.id)
      .order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setNotifications(data ?? []));
  }, [profile]);

  const unread = notifications.filter((n) => !n.is_read).length;

  async function markAllRead() {
    if (!profile) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id);
    setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-6 gap-4"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 truncate leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-52"
        style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input placeholder="Search..." className="bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400 w-full" />
      </div>

      {/* Notifications */}
      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-slate-100">
            <Bell className="w-5 h-5 text-slate-600" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-lg border-0">
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span className="font-bold text-slate-900 text-sm">Notifications</span>
            {unread > 0 && <button onClick={markAllRead} className="text-xs font-medium" style={{ color: '#5B3DF5' }}>Mark all read</button>}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No notifications yet</p>
            ) : notifications.map((n) => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #F8FAFC' }}>
                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{formatDateTime(n.created_at)}</p>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,#5B3DF5,#7C4DFF)' }}>
              {profile?.full_name ? getInitials(profile.full_name) : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{profile?.full_name ?? 'Admin'}</p>
              <p className="text-xs text-slate-400 capitalize">{profile?.role ?? 'admin'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-xl">
          <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
