'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, UserRole } from './supabase';

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  startDemoSession: (role: 'admin' | 'middleman') => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const DEMO_SESSION_KEY = 'osra-demo-session';

const demoProfiles: Record<'admin' | 'middleman', Profile> = {
  admin: {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'riaoswal403@gmail.com',
    full_name: 'OSRA Admin',
    phone: null,
    role: 'admin',
    avatar_url: null,
    is_active: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  middleman: {
    id: '00000000-0000-4000-8000-000000000002',
    email: 'middleman@osra.in',
    full_name: 'Rahul Boutique',
    phone: '+91 98765 43210',
    role: 'middleman',
    avatar_url: null,
    is_active: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
};

function getStoredDemoProfile(): Profile | null {
  if (typeof window === 'undefined') return null;
  const role = window.localStorage.getItem(DEMO_SESSION_KEY);
  return role === 'admin' || role === 'middleman' ? demoProfiles[role] : null;
}

function createDemoUser(profile: Profile): User {
  return {
    id: profile.id,
    app_metadata: {},
    user_metadata: { full_name: profile.full_name },
    aud: 'authenticated',
    created_at: profile.created_at,
    email: profile.email,
  } as User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && !error) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }

  async function refreshProfile() {
    const currentUser = user ?? (await supabase.auth.getUser()).data.user;
    if (currentUser) {
      await fetchProfile(currentUser.id);
      return;
    }

    const demoProfile = getStoredDemoProfile();
    if (demoProfile) {
      setUser(createDemoUser(demoProfile));
      setProfile(demoProfile);
    }
  }

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        const demoProfile = getStoredDemoProfile();
        if (demoProfile) {
          setUser(createDemoUser(demoProfile));
          setProfile(demoProfile);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        const demoProfile = getStoredDemoProfile();
        setUser(demoProfile ? createDemoUser(demoProfile) : null);
        setProfile(demoProfile);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id);
    }
    return { error: null };
  }

  async function signOut() {
    if (typeof window !== 'undefined') window.localStorage.removeItem(DEMO_SESSION_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function startDemoSession(role: 'admin' | 'middleman') {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') window.localStorage.setItem(DEMO_SESSION_KEY, role);
    const demoProfile = demoProfiles[role];
    setUser(createDemoUser(demoProfile));
    setProfile(demoProfile);
  }

  return (
    <AuthContext.Provider value={{
      user, profile, role: profile?.role ?? null, loading, signIn, signOut, refreshProfile, startDemoSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
