'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Users, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { OsraLogo } from '@/components/osra-logo';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type RoleOption = 'admin' | 'middleman';

const features = [
  { icon: Users, title: 'Multi-Tenant Network', desc: 'Empower your resellers with their own branded storefronts.' },
  { icon: Package, title: 'Smart Inventory', desc: 'Real-time stock sync and automated reservation system.' },
  { icon: ShieldCheck, title: 'Automated Invoicing', desc: 'Dual invoicing for B2B and B2C with complete transparency.' },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn, refreshProfile, startDemoSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOption>('admin');
  const [loading, setLoading] = useState(false);

  function getDemoRole(inputEmail: string): RoleOption | null {
    const normalizedEmail = inputEmail.trim().toLowerCase();
    if (normalizedEmail === 'admin@osra.in') return 'admin';
    if (normalizedEmail === 'middleman@osra.in') return 'middleman';
    return null;
  }

  function getDemoCredentials(role: RoleOption) {
    return {
      email: role === 'admin' ? 'admin@osra.in' : 'middleman@osra.in',
      password: 'osra1234',
    };
  }

  async function ensureDemoProfile(userId: string, demoEmail: string, role: RoleOption) {
    const fullName = role === 'admin' ? 'OSRA Admin' : 'Rahul Boutique';
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email: demoEmail,
      full_name: fullName,
      role,
      is_active: true,
    });

    if (profileError) throw new Error(profileError.message);

    if (role !== 'middleman') return;

    const middlemanPayload = {
      user_id: userId,
      business_name: 'Rahul Boutique',
      store_slug: 'rahul-boutique',
      phone: '+91 98765 43210',
      status: 'active',
    };

    const { data: existingMiddleman, error: lookupError } = await supabase
      .from('middlemen')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (lookupError) throw new Error(lookupError.message);

    const { error: middlemanError } = existingMiddleman
      ? await supabase.from('middlemen').update(middlemanPayload).eq('id', existingMiddleman.id)
      : await supabase.from('middlemen').insert(middlemanPayload);

    if (middlemanError) throw new Error(middlemanError.message);
  }

  async function redirectAfterLogin(fallbackRole: RoleOption) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace(fallbackRole === 'admin' ? '/admin' : '/middleman');
      return;
    }

    const demoRole = getDemoRole(user.email ?? '');
    if (demoRole) {
      await ensureDemoProfile(user.id, user.email!, demoRole);
      await refreshProfile();
      router.replace(demoRole === 'admin' ? '/admin' : '/middleman');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role ?? fallbackRole;
    router.replace(role === 'admin' ? '/admin' : '/middleman');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);

    try {
      const demoRole = getDemoRole(email);
      if (demoRole && password === 'osra1234') {
        const { error } = await signIn(email.trim(), password);
        if (error) throw new Error(error);
        await redirectAfterLogin(demoRole);
        toast.success(`Logged in as ${demoRole} demo`);
        return;
      }

      const { error } = await signIn(email.trim(), password);
      if (error) {
        toast.error(error);
        return;
      }

      await redirectAfterLogin(selectedRole);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not complete login');
    } finally {
      setLoading(false);
    }
  }

  async function loginAsDemo(role: RoleOption) {
    setLoading(true);

    try {
      const { email, password } = getDemoCredentials(role);
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (!signUpError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await ensureDemoProfile(user.id, email, role);
            await refreshProfile();
            router.replace(role === 'admin' ? '/admin' : '/middleman');
            toast.success(`Logged in as ${role} demo`);
            return;
          }
        }

        await startDemoSession(role);
        toast.warning('Demo auth user was not found. Using read-only preview mode.');
        router.replace(role === 'admin' ? '/admin' : '/middleman');
        return;
      }
      await redirectAfterLogin(role);
      toast.success(`Logged in as ${role} demo`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not complete demo login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-osra-lg border border-white/80 overflow-hidden flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:flex-col lg:w-[55%] p-12 relative overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-osra-primary/15 to-osra-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-0 w-48 h-48 bg-gradient-to-br from-osra-accent/15 to-pink-400/10 rounded-full blur-3xl" />

          <OsraLogo size="md" />

          <div className="mt-12">
            <h2 className="text-4xl font-bold text-osra-navy leading-tight">
              Welcome Back to<br />
              <span className="text-osra-primary">OSRA</span>
            </h2>
            <p className="mt-4 text-slate-500 text-lg leading-relaxed">
              The all-in-one platform for wholesale, dropshipping &amp; reseller networks.
            </p>
          </div>

          <div className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-osra-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-osra-primary" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Demo login shortcuts */}
          <div className="mt-10 p-4 bg-osra-primary/5 border border-osra-primary/15 rounded-2xl">
            <p className="text-xs font-semibold text-osra-primary mb-3 uppercase tracking-wide">Quick Demo Access</p>
            <div className="flex gap-2">
              <button onClick={() => loginAsDemo('admin')} disabled={loading}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-osra-primary text-white hover:opacity-90 disabled:opacity-60 transition-all">
                Admin Demo
              </button>
              <button onClick={() => loginAsDemo('middleman')} disabled={loading}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-osra-secondary/80 text-white hover:opacity-90 disabled:opacity-60 transition-all">
                Middleman Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="lg:hidden mb-8">
            <OsraLogo size="md" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Login to Your Account</h2>
          <p className="text-slate-500 mt-1 text-sm">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="/forgot-password" className="text-xs text-osra-primary hover:underline">Forgot Password?</Link>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Login as</label>
              <div className="grid grid-cols-2 gap-3">
                {(['admin', 'middleman'] as RoleOption[]).map((role) => (
                  <button key={role} type="button" onClick={() => setSelectedRole(role)}
                    className={cn(
                      'relative flex flex-col items-center justify-center gap-2 py-4 px-4 rounded-xl border-2 transition-all duration-150 cursor-pointer',
                      selectedRole === role ? 'border-osra-primary bg-osra-primary/5' : 'border-slate-200 bg-slate-50 hover:border-slate-300',
                    )}>
                    {selectedRole === role && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-osra-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    )}
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', selectedRole === role ? 'bg-osra-primary/15' : 'bg-slate-200')}>
                      <Users className={cn('w-5 h-5', selectedRole === role ? 'text-osra-primary' : 'text-slate-500')} />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm capitalize">{role === 'admin' ? 'Admin' : 'Middleman'}</span>
                    <span className="text-xs text-slate-400">{role === 'admin' ? 'Wholesaler' : 'Reseller'}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
            </button>

            {/* Mobile demo buttons */}
            <div className="lg:hidden grid grid-cols-2 gap-2">
              <button type="button" onClick={() => loginAsDemo('admin')} disabled={loading}
                className="py-2.5 rounded-xl text-xs font-semibold bg-osra-primary text-white hover:opacity-90 disabled:opacity-60 transition-all">
                Admin Demo
              </button>
              <button type="button" onClick={() => loginAsDemo('middleman')} disabled={loading}
                className="py-2.5 rounded-xl text-xs font-semibold bg-osra-secondary/80 text-white hover:opacity-90 disabled:opacity-60 transition-all">
                Middleman Demo
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have a reseller account?{' '}
            <Link href="/register" className="text-osra-primary font-semibold hover:underline">Request Access</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
