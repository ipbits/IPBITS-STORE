'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, KeyRound, Sparkles, Globe } from 'lucide-react';

// دروستکرنا گرێدانا Supabase ب ڕاستەوخۆ
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TRANSLATIONS = {
  ku: {
    title: 'چوونەژوور بۆ IPBITS AI',
    subtitle: 'ئیمەیل و پاسوۆردێ خۆ یێ ئیشتراکێ بنڤیسە',
    emailLabel: 'ئیمەیل',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'پاسوۆرد',
    passwordPlaceholder: '••••••••',
    btnText: 'چوونەژوور',
    loadingText: 'پشکنین...',
    errorAuth: 'ئیمەیل یان پاسوۆردێ تە خەلەتە!',
    errorServer: 'ئاریشەیەک د سێرڤەری دا هەیە!',
  },
  ar: {
    title: 'تسجيل الدخول إلى IPBITS AI',
    subtitle: 'أدخل البريد الإلكتروني وكلمة المرور الخاصة باشتراكك',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    btnText: 'تسجيل الدخول',
    loadingText: 'جاري التحقق...',
    errorAuth: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!',
    errorServer: 'حدث خطأ في الخادم!',
  },
  en: {
    title: 'Sign In to IPBITS AI',
    subtitle: 'Enter your subscription email and password',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    btnText: 'Sign In',
    loadingText: 'Checking...',
    errorAuth: 'Invalid email or password!',
    errorServer: 'A server error occurred!',
  }
};

export default function LoginPage() {
  const [lang, setLang] = useState('ku'); // 'ku' | 'ar' | 'en'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const isRtl = lang !== 'en';

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
        setErrorMsg(t.errorAuth);
        setLoading(false);
      } else {
        // دەمێ دروست بیت ئێکسەر دچیتە سەر چاتێ
        router.push('/chat');
      }
    } catch (err) {
      setErrorMsg(t.errorServer);
      setLoading(false);
    }
  };

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070913] text-white flex items-center justify-center p-4 selection:bg-purple-600 relative"
    >
      {/* دوگمەیێن گۆڕینا زمانی */}
      <div className={`absolute top-6 ${isRtl ? 'left-6' : 'right-6'} flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shadow-lg backdrop-blur-md`}>
        <Globe size={14} className="text-slate-400 mx-1" />
        <button
          type="button"
          onClick={() => { setLang('ku'); setErrorMsg(''); }}
          className={`px-2.5 py-1 text-xs rounded-xl transition-all ${
            lang === 'ku' ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          کوردی
        </button>
        <button
          type="button"
          onClick={() => { setLang('ar'); setErrorMsg(''); }}
          className={`px-2.5 py-1 text-xs rounded-xl transition-all ${
            lang === 'ar' ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          عربي
        </button>
        <button
          type="button"
          onClick={() => { setLang('en'); setErrorMsg(''); }}
          className={`px-2.5 py-1 text-xs rounded-xl transition-all ${
            lang === 'en' ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        
        {/* لۆگۆ و سەردێڕ */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-900/20">
            <Sparkles className="text-purple-400" size={26} />
          </div>
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
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              <Mail 
                className={`absolute top-3.5 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} 
                size={16} 
              />
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
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              <KeyRound 
                className={`absolute top-3.5 text-slate-500 ${isRtl ? 'right-3' : 'left-3'}`} 
                size={16} 
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 mt-2 cursor-pointer active:scale-98"
          >
            {loading ? t.loadingText : (
              <>
                <Lock size={15} />
                <span>{t.btnText}</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}