'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { OsraLogo } from '@/components/osra-logo';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-osra-lg border border-white/80">
          <div className="mb-8">
            <OsraLogo size="md" />
          </div>

          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
              <p className="text-slate-500 mt-1 text-sm">Enter your email and we&apos;ll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
              <p className="text-slate-500 text-sm mt-2">We&apos;ve sent a password reset link to <strong className="text-slate-900">{email}</strong></p>
            </div>
          )}

          <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-osra-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
