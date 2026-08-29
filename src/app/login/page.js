'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, KeyRound, ArrowRight, ArrowLeft, Globe } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOGIN_TRANSLATIONS = {
  ku: {
    dir: 'rtl',
    backToHome: 'زڤڕین بۆ لاپەڕێ سەرەکی',
    title: 'چوونەژوور بۆ IPBITS AI',
    subtitle: 'ئیمەیل و پاسوۆردێ خۆ یێ ئیشتراکێ بنڤیسە',
    emailLabel: 'ئیمەیل',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'پاسوۆرد',
    passwordPlaceholder: '••••••••',
    loginBtn: 'چوونەژوور',
    loadingBtn: 'پشکنین...',
    authError: 'ئیمەیل یان پاسوۆردێ تە خەلەتە!',
    serverError: 'ئاریشەیەک د پەیوەندیا سێرڤەری دا هەیە!'
  },
  ar: {
    dir: 'rtl',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    title: 'تسجيل الدخول إلى IPBITS AI',
    subtitle: 'أدخل بريدك الإلكتروني وكلمة المرور الخاصة باشتراكك',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    loginBtn: 'تسجيل الدخول',
    loadingBtn: 'جاري التحقق...',
    authError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!',
    serverError: 'حدث خطأ في الاتصال بالخادم!'
  },
  en: {
    dir: 'ltr',
    backToHome: 'Back to Home',
    title: 'Sign In to IPBITS AI',
    subtitle: 'Enter your subscribed email and password',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    loginBtn: 'Sign In',
    loadingBtn: 'Verifying...',
    authError: 'Invalid email or password!',
    serverError: 'A server connection error occurred!'
  }
};

export default function LoginPage() {
  const [lang, setLang] = useState('ku');
  const t = LOGIN_TRANSLATIONS[lang];

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
        setErrorMsg(t.authError);
        setLoading(false);
      } else {
        router.push('/chat');
      }
    } catch (err) {
      setErrorMsg(t.serverError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center p-4 selection:bg-purple-600" dir={t.dir}>
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        
        {/* بەشێ سەرێ فۆڕمێ: زڤڕین و هەلبژارتنا زمانی */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors"
          >
            {t.dir === 'rtl' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{t.backToHome}</span>
          </Link>

          {/* دوگمەیێن زمانی */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shadow-inner">
            <button
              type="button"
              onClick={() => setLang('ku')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                lang === 'ku' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              کوردى
            </button>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                lang === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                lang === 'en' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* لۆگۆ و سەردێڕ */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="IPBITS Logo" 
            className="w-16 h-16 rounded-2xl object-cover shadow-xl border border-purple-400/30 mx-auto mb-3" 
          />
          <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">{t.subtitle}</p>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.emailLabel}</label>
            <div className="relative">
              <input
                required
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors ${
                  t.dir === 'rtl' ? 'pr-10' : 'pl-10'
                }`}
              />
              <Mail className={`absolute top-3.5 text-slate-500 ${t.dir === 'rtl' ? 'right-3' : 'left-3'}`} size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.passwordLabel}</label>
            <div className="relative">
              <input
                required
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors ${
                  t.dir === 'rtl' ? 'pr-10' : 'pl-10'
                }`}
              />
              <KeyRound className={`absolute top-3.5 text-slate-500 ${t.dir === 'rtl' ? 'right-3' : 'left-3'}`} size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 mt-2 cursor-pointer active:scale-98"
          >
            {loading ? t.loadingBtn : (
              <>
                <Lock size={15} />
                <span>{t.loginBtn}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}