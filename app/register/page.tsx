'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, Store, ArrowRight, ChevronDown, Info, BarChart2, Package, ShieldCheck } from 'lucide-react';
import { OsraLogo } from '@/components/osra-logo';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';

const benefits = [
  { icon: Store, title: 'Your Own Storefront', desc: 'Get a unique store link and build your brand.' },
  { icon: Package, title: 'Wide Product Catalog', desc: 'Choose from thousands of wholesale products to sell.' },
  { icon: ShieldCheck, title: 'Secure & Verified', desc: 'Dual OTP verification keeps your account safe.' },
  { icon: BarChart2, title: 'Scale Your Network', desc: 'Connect with more customers and grow your business.' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', businessName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.businessName || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { toast.error(error.message); setLoading(false); return; }
    if (data.user) {
      const slug = slugify(form.businessName) + '-' + data.user.id.slice(0, 4);
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: form.email,
        full_name: form.fullName,
        phone: form.phone,
        role: 'middleman',
      });
      await supabase.from('middlemen').insert({
        user_id: data.user.id,
        business_name: form.businessName,
        store_slug: slug,
        phone: form.phone,
        status: 'pending',
      });
      toast.success('Account created! Please verify your OTP.');
      router.push(`/verify-otp?phone=${encodeURIComponent(form.phone)}`);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-osra-lg border border-white/80 overflow-hidden flex">
        {/* Left */}
        <div className="hidden lg:flex lg:flex-col lg:w-[52%] p-12 relative overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-osra-primary/12 to-osra-secondary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-5 w-56 h-56 bg-gradient-to-br from-pink-400/8 to-osra-accent/10 rounded-full blur-3xl" />

          <OsraLogo size="md" />
          <div className="mt-12">
            <h2 className="text-4xl font-bold text-osra-navy leading-tight">
              Join OSRA and<br />Grow Your <span className="text-osra-primary">Business</span>
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Create your reseller account and start building your own branded store in minutes.
            </p>
          </div>
          <div className="mt-10 space-y-5">
            {benefits.map(({ icon: Icon, title, desc }) => (
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
        </div>

        {/* Right */}
        <div className="flex-1 p-8 md:p-10 bg-white flex flex-col justify-center">
          <div className="lg:hidden mb-6">
            <OsraLogo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Create Your Middleman Account</h2>
          <p className="text-slate-500 mt-1 text-sm">Fill in your details to get started with OSRA</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="Enter your email address"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 cursor-pointer select-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>+91</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="Enter your WhatsApp number"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                <Info className="w-3 h-3" /> We will send OTP to this number via SMS.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business / Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={form.businessName} onChange={(e) => setField('businessName', e.target.value)} placeholder="Enter your business or store name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
              </div>
              {form.businessName && (
                <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Info className="w-3 h-3" /> osra.com/store/{slugify(form.businessName)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Use at least 8 characters with letters and numbers.</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-osra-primary font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
