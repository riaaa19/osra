'use client';

import { Bell, ShoppingCart, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Props { title: string; subtitle?: string; }

export function MiddlemanHeader({ title, subtitle }: Props) {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-6 gap-3"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #F1F5F9' }}>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-slate-900 truncate leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
      </div>

      <Link href="/middleman/orders"
        className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
        <ShoppingCart className="w-5 h-5 text-slate-600" />
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
      </Link>

      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors">
        <Bell className="w-5 h-5 text-slate-600" />
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">6</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#5B3DF5,#7C4DFF)' }}>
              {profile?.full_name ? getInitials(profile.full_name) : 'M'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{profile?.full_name ?? 'Middleman'}</p>
              <p className="text-xs text-slate-400">Middleman</p>
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
