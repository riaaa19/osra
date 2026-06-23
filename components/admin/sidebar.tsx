'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Store, BarChart3,
  FileText, Settings, LogOut, Boxes, AlertCircle, CreditCard, ChevronRight,
} from 'lucide-react';
import { OsraLogo } from '@/components/osra-logo';
import { useAuth } from '@/lib/auth-context';
import { cn, getInitials } from '@/lib/utils';

const navItems = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/inventory',  icon: Boxes,           label: 'Inventory' },
  { href: '/admin/products',   icon: Package,         label: 'Products' },
  { href: '/admin/orders',     icon: ShoppingCart,    label: 'Orders' },
  { href: '/admin/middlemen',  icon: Users,           label: 'Middlemen' },
  { href: '/admin/retailers',  icon: Store,           label: 'Retailers' },
  { href: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
  { href: '/admin/invoices',   icon: FileText,        label: 'Invoices' },
  { href: '/admin/returns',    icon: AlertCircle,     label: 'Returns' },
  { href: '/admin/ledger',     icon: CreditCard,      label: 'Ledger' },
  { href: '/admin/settings',   icon: Settings,        label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg,#0B1026 0%,#111827 100%)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <OsraLogo light size="md" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full"
              style={active ? {
                background: 'linear-gradient(135deg,#5B3DF5,#7C4DFF)',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(91,61,245,0.4)',
              } : {
                color: '#94A3B8',
              }}
              onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}}
              onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg,#5B3DF5,#7C4DFF)' }}>
            {profile?.full_name ? getInitials(profile.full_name) : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{profile?.full_name ?? 'Admin'}</p>
            <p className="text-xs truncate" style={{ color: '#64748B' }}>Administrator</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        </div>
        <button
          onClick={signOut}
          className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors"
          style={{ color: '#94A3B8' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#F87171'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
