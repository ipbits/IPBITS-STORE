'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, KeyRound, ArrowRight } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg('ئیمەیل یان پاسوۆردێ تە خەلەتە!');
        setLoading(false);
      } else {
        router.push('/chat');
      }
    } catch (err) {
      setErrorMsg('ئاریشەیەک د پەیوەندیا سێرڤەری دا هەیە!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center p-4 selection:bg-purple-600" dir="rtl">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        
        {/* دوگمەیا زڤڕینێ بۆ سەرەکی */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors"
          >
            <ArrowRight size={14} />
            <span>زڤڕین بۆ لاپەڕێ سەرەکی</span>
          </Link>
        </div>

        {/* لۆگۆ و سەردێڕ */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="IPBITS Logo" 
            className="w-16 h-16 rounded-2xl object-cover shadow-xl border border-purple-400/30 mx-auto mb-3" 
          />
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            چوونەژوور بۆ IPBITS AI
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">ئیمەیل و پاسوۆردێ خۆ یێ ئیشتراکێ بنڤیسە</p>
        </div>

        {/* پەیاما شاشیێ */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs mb-5 text-center font-bold">
            {errorMsg}
          </div>
        )}

        {/* فۆڕم */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">ئیمەیل</label>
            <div className="relative">
              <input
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pr-10 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <Mail className="absolute right-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">پاسوۆرد</label>
            <div className="relative">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pr-10 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <KeyRound className="absolute right-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 mt-2 cursor-pointer active:scale-98"
          >
            {loading ? 'پشکنین...' : (
              <>
                <Lock size={15} />
                <span>چوونەژوور</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}