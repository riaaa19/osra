'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RootPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!profile) { router.replace('/login'); return; }
    if (profile.role === 'admin') router.replace('/admin');
    else router.replace('/middleman');
  }, [profile, loading, router]);

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-osra-primary/20 border-t-osra-primary rounded-full animate-spin" />
    </div>
  );
}
