'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminSidebar } from '@/components/admin/sidebar';
import { OsraLogo } from '@/components/osra-logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.replace('/login');
    } else if (profile.role !== 'admin') {
      router.replace('/middleman');
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen aurora-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <OsraLogo size="lg" />
          <div className="w-10 h-10 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin mt-4" />
          <p className="text-sm text-slate-500">Loading OSRA...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen aurora-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen aurora-bg">
      <AdminSidebar />
      <main className="ml-60 min-h-screen">
        {children}
      </main>
    </div>
  );
}
