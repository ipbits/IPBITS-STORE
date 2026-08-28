'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, CheckCircle2, Trash2, Plus, Sparkles, Send, 
  ShieldCheck, MessageCircle, Copy, Check, Flame, UploadCloud, X, RefreshCw, Lock, Zap
} from 'lucide-react';

// لۆگۆیێ فەرمی یێ IPBITS
const IPBitsLogo = () => (
  <img 
    src="/logo.png" 
    alt="IPBITS Logo" 
    className="w-12 h-12 rounded-2xl object-cover shadow-xl border border-purple-400/30 shrink-0" 
  />
);

// -------------------------------------------------------------
// لیستا بەرهەم و پشکدارییان
const PRODUCTS = [
  // ئۆفەرا سەرەکی و چالاک (بتنێ ئەڤە یا ڤەکرییە)
  { 
    id: 'super_ai_bundle_200', 
    name: 'ئۆفەرا زێڕین: زێدەتر ژ ٢٠٠ ماڵپەڕ و مۆدێلێن ژیرییا دەستکرد (AI)', 
    description: 'ب بهایەکی کو کەس باوەر ناکەت! بێ سنور، وێنە، کۆد، دەنگ، چات و شیکار د ئێک ئەکاونت دا.',
    priceIQD: 15000, 
    category: 'ئۆفەرا سەرەکی 🔥', 
    badge: 'ئۆفەرا تایبەت و چاڤەڕوانکری 👑', 
    isBundle: true,
    isOpen: true 
  },

  // بەرهەمێن دی (هەمی قوفڵکرینە ل سەر نڤیسایە: ل نێزیک)
  { id: 'chatgpt', name: 'ChatGPT Plus (GPT-4o)', priceIQD: 35000, category: 'هاریکارێ AI', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'claude', name: 'Claude Pro (Claude 3.5 Sonnet)', priceIQD: 35000, category: 'هاریکارێ AI', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'google_flow', name: 'گووگڵ فڵۆ (Google Flow AI)', priceIQD: 25000, category: 'هاریکارێ AI', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'elevenlabs', name: 'ElevenLabs AI (دەنگێ زیرەک)', priceIQD: 26250, category: 'دەنگێ AI', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'kling', name: 'Kling AI Video (ڤیدیۆیا AI)', priceIQD: 21000, category: 'ڤیدیۆیا AI', badge: 'ل نێزیک ⏳', isOpen: false },

  // مۆنتاژ، دیزاین و خزمەتگوزاریێن دارایی
  { id: 'canva', name: 'Canva Pro (کانڤا پرۆ)', priceIQD: 8750, category: 'دیزاین', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'capcut', name: 'کاپ کات پرۆ (CapCut Pro)', priceIQD: 15000, category: 'مۆنتاژ و ڤیدیۆ', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'paypal_acc', name: 'چێکرنا ئەکاونتێن پەیپال (PayPal)', priceIQD: 20000, category: 'خزمەتگوزاری دارایی', badge: 'ل نێزیک ⏳', isOpen: false },

  // سینەما، فلم و زنجیرە
  { id: 'netflix', name: 'Netflix Premium (نێتفلێکس)', priceIQD: 7000, category: 'فلم و زنجیرە', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'shahid_vip', name: 'شاهد ڤی ئای پی (Shahid VIP)', priceIQD: 13500, category: 'فلم و زنجیرە', badge: 'ل نێزیک ⏳', isOpen: false },

  // دەنگ و میوزیک
  { id: 'spotify', name: 'سپۆتیفای پریمێیۆم (Spotify Premium)', priceIQD: 13000, category: 'موزیک و دەنگ', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'apple_music', name: 'ئەپڵ میوزیک (Apple Music)', priceIQD: 7000, category: 'موزیک و دەنگ', badge: 'ل نێزیک ⏳', isOpen: false },
  { id: 'youtube_music', name: 'یوتیوب پریمێیۆم (YouTube Premium)', priceIQD: 13000, category: 'موزیک و دەنگ', badge: 'ل نێزیک ⏳', isOpen: false },

  // گەیمینگ
  { id: 'ps_plus', name: 'پلەی ستەیشن پڵەس (PlayStation Plus)', priceIQD: 22000, category: 'گەیمینگ', badge: 'ل نێزیک ⏳', isOpen: false }
];

// زانیاریێن ئەکاونتێن پارەدانێ
const PAYMENT_ACCOUNTS = {
  FIB: { title: 'First Iraqi Bank (FIB)', number: '07504060378', note: 'یان دناڤ ئەپا FIB بنڤیسە: IPBITS' },
  FastPay: { title: 'FastPay Wallet', number: '07504060378', note: 'ژمارا وەسڵێ پشتی پارەدانێ بنڤیسە' },
  ZainCash: { title: 'Zain Cash', number: '07504060378', note: 'ژمارا وەسڵێ د فۆرمێ دا بنڤیسە' },
  PayPal: { title: 'PayPal', number: 'https://www.paypal.com/ncp/payment/VDDES8YRYJG46', note: 'پارەی ب شێوەیێ Friends & Family بنێرە و ناڤێ خۆ بنڤیسە' },
  USDT: { title: 'USDT (TRC20)', number: 'TUeqkjzFdD7b1EtnAJL9tbzB1uN8wDbU6T', note: 'تەنێ ل سەر تۆڕا Tron (TRC20) فرێکە و TxID بنڤیسە' }
};

export default function StorePage() {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState(null);
  const [fileType, setFileType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    paymentMethod: 'FIB',
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const cartSectionRef = useRef(null);
  const productsSectionRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToCart = () => {
    if (cartSectionRef.current) {
      cartSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetForNewOrder = () => {
    setSuccess(false);
    setFormData({
      name: '',
      phone: '',
      paymentMethod: 'FIB',
      transactionId: ''
    });
    setFileName('');
    setFileBase64(null);
    setFileType('');
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    if (!product.isOpen) return;
    if (!cart.some((item) => item.id === product.id)) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalIQD = cart.reduce((acc, curr) => acc + curr.priceIQD, 0);

  const copyPaymentNumber = () => {
    const accNum = PAYMENT_ACCOUNTS[formData.paymentMethod]?.number || '';
    if (accNum) {
      navigator.clipboard.writeText(accNum);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result;
        if (typeof resultStr === 'string') {
          const base64 = resultStr.split(',')[1];
          setFileBase64(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFileName('');
    setFileBase64(null);
    setFileType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('بێ زەحمەت، ئۆفەرا زێڕین زێدە بکە د سەبەتێ دا!');
      return;
    }

    setLoading(true);
    const orderDetails = {
      ...formData,
      items: cart.map(i => i.name).join(', '),
      totalIQD,
      image: fileBase64 ? { base64: fileBase64, type: fileType } : null
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (res.ok) {
        setLastOrder(orderDetails);
        setSuccess(true);
        setCart([]);
      } else {
        alert('خەلەتییەک چێبوو د فرێکرنا داخوازیێ دا!');
      }
    } catch (err) {
      console.error(err);
      alert('ئاریشەیەک د پەیوەندیا سێرڤەری دا ڕویدا!');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  const sendToWhatsApp = () => {
    if (!lastOrder) return;
    const msg = `سڵاڤ، من داخوازییا ئۆفەرا AI تۆمار کر ل IPBITS STORE:%0A%0A👤 ناڤ: ${lastOrder.name}%0A📱 ژمارە: ${lastOrder.phone}%0A📦 پشکداری: ${lastOrder.items}%0A💰 کۆم: ${lastOrder.totalIQD.toLocaleString()} IQD%0A💳 رێکا پارەدانێ: ${lastOrder.paymentMethod}%0A🧾 کۆدێ وەسڵێ: ${lastOrder.transactionId}`;
    window.open(`https://wa.me/9647504060378?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white pb-20" dir="rtl">
      
      {/* سەرێ لاپەری (Navbar) */}
      <nav className="border-b border-slate-800/60 bg-[#0c1022]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <IPBitsLogo />
            <div>
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                IPBITS STORE
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">باشترین خزمەتگوزاریێن دیجیتال و ژیرییا دەستکرد</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={scrollToCart}
            className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-purple-950/50 border border-purple-500/20 hover:border-purple-500/50 px-4 py-2 rounded-2xl text-purple-300 font-bold text-sm shadow-inner transition-all cursor-pointer active:scale-95"
            title="چوون بۆ سەبەتێ"
          >
            <ShoppingBag size={18} className="text-purple-400" />
            <span>{cart.length}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        
        {/* سەردێڕ و ناساندن */}
        <div ref={productsSectionRef} className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/80 to-indigo-950/80 text-purple-300 px-5 py-2 rounded-full text-xs font-black mb-5 border border-purple-500/40 shadow-xl shadow-purple-900/30 animate-pulse">
            <Sparkles size={15} className="text-amber-400" />
            <span>ئۆفەرا مەزن یا تایبەت بۆ دەمەکێ کاتی ڤەبوو! 🔥</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            پتر ژ ٢٠٠ سایتێن ژیرییا دەستکرد <br className="hidden sm:inline"/> 
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              ب بهایەکی کو کەس باوەر ناکەت!
            </span>
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            ئێک ئەکاونت بۆ هەمی کارێن تە: نڤیسین، کۆدینگ، مۆنتاژ، وێنە و دەنگ ب بهایێ چەند سەنتان.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* بەشێ بەرهەمان */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCTS.map((product) => {
              const inCart = cart.some(item => item.id === product.id);
              const isOpen = product.isOpen;

              return (
                <div 
                  key={product.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isOpen 
                      ? 'sm:col-span-2 bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-indigo-950/60 border-purple-500/60 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500/40' 
                      : 'bg-slate-900/30 border-slate-800/50 opacity-60 grayscale hover:grayscale-0 transition-all'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className={`text-[11px] font-bold px-3.5 py-1 rounded-full border ${
                        isOpen
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 flex items-center gap-1 shadow-sm' 
                          : 'text-slate-400 bg-slate-800/60 border-slate-700/60 flex items-center gap-1'
                      }`}>
                        {isOpen ? <Flame size={13} className="text-amber-400" /> : <Lock size={12} />}
                        {product.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{product.category}</span>
                    </div>

                    <h3 className={`font-black text-white mb-2 ${isOpen ? 'text-xl sm:text-2xl text-purple-200' : 'text-base'}`}>
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-row items-baseline gap-2 mb-6">
                      {isOpen ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                            {product.priceIQD.toLocaleString()} IQD
                          </span>
                          <span className="text-xs text-slate-400 line-through">65,000 IQD</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-slate-500">{product.priceIQD.toLocaleString()} IQD</span>
                      )}
                    </div>
                  </div>

                  {isOpen ? (
                    <button
                      onClick={() => inCart ? removeFromCart(product.id) : addToCart(product)}
                      className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        inCart
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 text-white shadow-xl shadow-purple-600/40 active:scale-98'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Trash2 size={16} /> لابرن ژ سەبەتێ
                        </>
                      ) : (
                        <>
                          <Zap size={16} className="text-amber-300 fill-amber-300" /> دەستڤەئینانا ئۆفەرێ (زێدەکرن بۆ سەبەتێ)
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-2xl font-bold text-xs bg-slate-800/40 border border-slate-800 text-slate-500 flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Lock size={14} /> ل نێزیک دهێتە بەردەستکرن
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* سەبەتە و فۆرمێ داخوازیێ */}
          <div ref={cartSectionRef} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md sticky top-28 scroll-mt-28">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <h3 className="font-extrabold text-lg flex items-center gap-2 text-white">
                <ShoppingBag className="text-purple-400" size={20} /> سەبەتە و داخوازی
              </h3>
              <span className="text-xs bg-slate-800/90 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold">
                {cart.length} پشکداری
              </span>
            </div>

            {success ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-xl font-bold mb-1 text-white">داخوازی ب سەرکەفتی هاتە فرێکرن!</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  زانیاریێن داخوازییا تە هاتنە تۆمارکرن. بۆ وەرگرتنا ئەکاونتی د چەند خۆلەکاندا، پەیامەکێ بۆ واتساپی بنێرە:
                </p>

                <button
                  type="button"
                  onClick={sendToWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/30 mb-3 transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>پەیوەندی ب واتساپی بکە</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForNewOrder}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw size={14} className="text-purple-400" />
                  <span>تۆمارکرنا داخوازیەکا نوی</span>
                </button>
              </div>
            ) : (
              <div>
                {cart.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-7 border border-dashed border-slate-800 rounded-2xl mb-5 font-medium">
                    سەبەتە یا ڤالایە، ئۆفەرا زێڕین زێدە بکە.
                  </p>
                ) : (
                  <div className="space-y-2 mb-5 max-h-40 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-950/70 p-3 rounded-xl border border-purple-500/30 text-xs">
                        <span className="font-bold text-slate-200">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-bold">{item.priceIQD.toLocaleString()} IQD</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800/80 mb-5">
                  <div className="flex justify-between text-base font-extrabold text-white">
                    <span>کۆمێ پارەی:</span>
                    <span className="text-purple-400 font-black">{totalIQD.toLocaleString()} IQD</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ناڤێ تە</label>
                    <input
                      required
                      type="text"
                      placeholder="ناڤێ سیانی بنڤیسە..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ژمارا واتساپی</label>
                    <input
                      required
                      type="tel"
                      placeholder="0750XXXXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">رێکا پارەدانێ</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="FIB">First Iraqi Bank (FIB)</option>
                      <option value="FastPay">FastPay Wallet</option>
                      <option value="ZainCash">Zain Cash</option>
                      <option value="PayPal">PayPal</option>
                      <option value="USDT">USDT (TRC20 Crypto)</option>
                    </select>

                    <div className="mt-2 bg-purple-950/40 border border-purple-800/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div className="truncate max-w-[200px]">
                        <span className="text-[10px] text-purple-300 block">{PAYMENT_ACCOUNTS[formData.paymentMethod]?.note || 'ناڤنیشان / ژمارا پارەدانێ:'}</span>
                        <span className="font-bold text-white tracking-wider text-[11px] truncate block">{PAYMENT_ACCOUNTS[formData.paymentMethod]?.number}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyPaymentNumber}
                        className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0"
                      >
                        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copied ? 'هاتە کۆپیکرن' : 'کۆپی بکە'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">کۆدێ وەسڵێ (Transaction ID / TxID / ئیمەیل)</label>
                    <input
                      required
                      type="text"
                      placeholder="کۆدێ وەسڵا پارەدانێ بنڤیسە..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">وێنەیێ وەسڵێ (ئارەزوومەندانە)</label>
                    <label className="border border-dashed border-slate-700 hover:border-purple-500/60 bg-slate-950/60 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-colors text-xs text-slate-400">
                      <div className="flex items-center gap-2 truncate">
                        <UploadCloud size={16} className="text-purple-400 shrink-0" />
                        <span className="truncate">{fileName || 'بارکرنا وێنەیێ وەسڵێ (Screenshot)'}</span>
                      </div>
                      {fileName && (
                        <button type="button" onClick={clearFile} className="text-slate-400 hover:text-rose-400 p-1">
                          <X size={14} />
                        </button>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-xl shadow-purple-600/30 mt-2 text-white cursor-pointer"
                  >
                    {loading ? 'تکایە چاڤەرێ بە...' : (
                      <>
                        <span>تەمامکرن و ناردنا داخوازیێ</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1 font-medium">
                    <ShieldCheck size={13} className="text-purple-400" /> هەمی پشکداری ب گرەنتی و پشتەڤانییا بەردەوامن
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}