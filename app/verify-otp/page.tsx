'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield, Pencil } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get('phone') ?? '+91 98765 43210';
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast.error('Please enter the 6-digit OTP'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('OTP verified successfully!');
    router.replace('/middleman');
  }

  function resendOtp() {
    setTimer(45);
    setOtp(Array(6).fill(''));
    toast.info('OTP resent to your number');
  }

  const mins = Math.floor(timer / 60).toString().padStart(2, '0');
  const secs = (timer % 60).toString().padStart(2, '0');

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-osra-lg border border-white/80 overflow-hidden flex">
        {/* Left — solid violet panel */}
        <div className="hidden md:flex md:flex-col md:w-72 btn-primary p-10 relative overflow-hidden justify-between">
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute border border-white/20 rounded-full" style={{
                width: `${(i + 1) * 40}px`, height: `${(i + 1) * 40}px`,
                top: `calc(50% - ${(i + 1) * 20}px)`, left: `calc(50% - ${(i + 1) * 20}px)`,
              }} />
            ))}
          </div>
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">OSRA</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Secure Verification</h3>
            <p className="text-violet-200 text-sm mt-3 leading-relaxed">
              For your security, please verify your identity using the One-Time Password (OTP) sent to your mobile number.
            </p>
          </div>
          {/* Shield illustration */}
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 bg-white/10 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white/15 rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 p-8 md:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
          <p className="text-slate-500 text-sm mt-1">Enter the 6-digit code sent to your registered mobile number.</p>

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
            {/* Phone display */}
            <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-osra-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-osra-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Mobile Number</p>
                  <p className="font-semibold text-slate-900 text-sm">{phone}</p>
                </div>
              </div>
              <button type="button" className="flex items-center gap-1 text-osra-primary text-sm hover:underline">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            </div>

            {/* OTP inputs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Enter OTP</label>
              <div className="flex gap-3" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-lg font-bold rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-osra-primary focus:bg-white transition-colors"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Didn&apos;t receive the code?{' '}
                {timer > 0 ? (
                  <span className="text-osra-primary font-semibold">Resend OTP in {mins}:{secs}</span>
                ) : (
                  <button type="button" onClick={resendOtp} className="text-osra-primary font-semibold hover:underline">Resend OTP</button>
                )}
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Continue'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <Link href="/login" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-osra-primary" />
              Your security is our priority. This OTP is valid for <strong className="text-slate-700">5 minutes.</strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
