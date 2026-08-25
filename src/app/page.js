'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Music, 
  CreditCard, 
  Tv, 
  Film, 
  Smartphone, 
  Bot, 
  Ghost, 
  Cloud,
  Headphones
} from 'lucide-react';

// ١. بەهایێن بنەڕەتی (تێچوویێ تە)
const rawProducts = [
  {
    id: 'apple-id',
    name: 'Apple ID چێکرن',
    description: 'دروستکرنا هەژمارا ئەپڵ ئایدی یا ئەمریکی یان ئاسایی ب گەرەنتی',
    basePrice: 5000,
    currency: 'IQD',
    category: 'Accounts',
    icon: Smartphone,
    badge: 'داخوازکری'
  },
  {
    id: 'paypal-50',
    name: 'PayPal باڵانس $50',
    description: 'داگرتنا باڵانسێ فەرمی یێ پەیپاڵ بۆ کڕینێن ئۆنلاین',
    basePrice: 50,
    currency: 'USD',
    category: 'Payments',
    icon: CreditCard,
    badge: 'باڵانس'
  },
  {
    id: 'spotify-prem',
    name: 'Spotify Premium',
    description: 'ئیشتراکێ پریمیۆم یێ سپۆتیفای بێ ڕیکلام و گوهدانا ئۆفلاین',
    basePrice: 7000,
    currency: 'IQD',
    category: 'Music',
    icon: Headphones,
    badge: 'میوزیک'
  },
  {
    id: 'anghami-plus',
    name: 'Anghami Plus',
    description: 'ئیشتراکێ فەرمی یێ ئەنغامی پلەس ب کوالێتییا بلند',
    basePrice: 6000,
    currency: 'IQD',
    category: 'Music',
    icon: Music,
    badge: 'میوزیک'
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    description: 'ئیشتراکێ ئەپڵ میوزیک ب کوالێتییا Lossless Audio',
    basePrice: 8000,
    currency: 'IQD',
    category: 'Music',
    icon: Sparkles,
    badge: 'ئەپڵ'
  },
  {
    id: 'google-one',
    name: 'Google One / Drive',
    description: 'زێدەکرنا عەمبارا گووگل (Google Drive & Photos)',
    basePrice: 12000,
    currency: 'IQD',
    category: 'Cloud',
    icon: Cloud,
    badge: 'عەمبار'
  },
  {
    id: 'snapchat-plus',
    name: 'Snapchat+',
    description: 'تایبەتمەندیێن سناپ چات پلەس ب ستێرک و فیچەرێن تایبەت',
    basePrice: 9000,
    currency: 'IQD',
    category: 'Social',
    icon: Ghost,
    badge: 'سۆشیال'
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    description: 'ئیشتراکێ فەرمی یێ چات جی پی تی ب مۆدێلێن پێشکەفتی',
    basePrice: 20, // 20$ دێ بیتە 23$ ب ئۆتۆماتیکی
    currency: 'USD',
    category: 'AI',
    icon: Bot,
    badge: 'تایبەت'
  },
  {
    id: 'telegram-premium',
    name: 'Telegram Premium',
    description: 'چالاککرنا فەرمی یا ستێرکا تێلێگرامێ ب لەزاتییا بلند',
    basePrice: 15000,
    currency: 'IQD',
    category: 'Social',
    icon: Zap,
    badge: 'بەناوبانگ'
  },
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    description: 'ئەکاونتێ فەرمی یێ کانڤا پرۆ ب هەمی قاڵبان ڤە',
    basePrice: 10000,
    currency: 'IQD',
    category: 'Design',
    icon: Layers,
    badge: 'دیزاین'
  },
  {
    id: 'netflix-4k',
    name: 'Netflix Ultra HD 4K',
    description: 'ئیشتراکێ نێتفلیکس ب کوالێتییا 4K ب گەرەنتی',
    basePrice: 12000,
    currency: 'IQD',
    category: 'Streaming',
    icon: Film,
    badge: 'فیلم'
  },
  {
    id: 'iptv-vip',
    name: 'IPTV VIP پلەیەر',
    description: 'کەناڵێن جیهانی و وەرزشی ب کوالێتییا بلند',
    basePrice: 18000,
    currency: 'IQD',
    category: 'Streaming',
    icon: Tv,
    badge: 'وەرزش'
  }
];

// ٢. فەنکشنا هەژمارتنا قازانجێ ئۆتۆماتیکی
const PROFIT_USD = 3;     // هەر تشتەکێ ب دۆلار بیت ۳$ دچیتە سەر (وەک ٢٠$ دبیتە ٢٣$)
const PROFIT_IQD = 3000;  // هەر تشتەکێ ب دینار بیت ۳,۰۰۰ دینار دچنە سەر

const products = rawProducts.map((p) => ({
  ...p,
  price: p.currency === 'USD' ? p.basePrice + PROFIT_USD : p.basePrice + PROFIT_IQD
}));

export default function Home() {
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          items: cart,
          totalPrice: calculateTotal()
        })
      });

      if (res.ok) {
        setSuccess(true);
        setCart([]);
      } else {
        alert('خەلەتیەک ڕوویدا، تکایە زانیارییان ب دروستی پڕ بکە.');
      }
    } catch (err) {
      console.error(err);
      alert('پەیوەندی سەرکەفتی نەبوو.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-cyan-500 selection:text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg border border-cyan-500/30">
              <Image src="/logo.png" alt="IPBITS" fill className="object-cover" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                IPBITS STORE
              </span>
              <p className="text-xs text-slate-400">ستۆرا باوەرپێکری یا خزمەتگوزاری و ئیشتراکان</p>
            </div>
          </div>

          <button
            onClick={() => setIsOrdering(true)}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>سەبەتە</span>
            {cart.length > 0 && (
              <span className="w-6 h-6 rounded-full bg-white text-blue-900 font-extrabold text-xs flex items-center justify-center animate-pulse">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-14 border-b border-slate-800/60 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            گەرەنتیا تەواو و چالاککرنا لەز
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            هەمی ئیشتراک و باڵانسێن دیجیتالی ل ئێک جهـ
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            خزمەتگوزاریێن پریمیۆم، بەرهەمێن دیجیتاڵی، ئەپڵ ئایدی، پەیپاڵ و ئیشتراکێن میوزیکێ ب بهایێن گونجای.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900 hover:border-cyan-500/40 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400">بها:</span>
                    <span className="text-base font-extrabold text-cyan-400">
                      {item.price.toLocaleString()} {item.currency}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 font-bold text-xs text-slate-200 transition-all active:scale-95 border border-slate-700 hover:border-cyan-400"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    زێدەکرن
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Cart & Order Modal */}
      {isOrdering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0f172a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
                تەمامکرنا داخوازیێ
              </h2>
              <button
                onClick={() => {
                  setIsOrdering(false);
                  setSuccess(false);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">داخوازی هاتە تۆمارکرن!</h3>
                <p className="text-slate-400 text-sm mb-6">
                  سوپاس بۆ باوەریا تە، دێ ب لەزترین دەم پەیوەندی ب تە هێتە کرن.
                </p>
                <button
                  onClick={() => {
                    setIsOrdering(false);
                    setSuccess(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                >
                  داخستن
                </button>
              </div>
            ) : (
              <div>
                {/* Cart Items List */}
                <div className="max-h-48 overflow-y-auto mb-4 space-y-2 pr-1">
                  {cart.length === 0 ? (
                    <p className="text-center text-slate-500 py-4 text-sm">سەبەتە یا بەتاڵە!</p>
                  ) : (
                    cart.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-right">
                          <p className="font-bold text-sm text-white">{c.name}</p>
                          <p className="text-xs text-slate-400">
                            {c.qty} × {c.price.toLocaleString()} {c.currency}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(c.id)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-bold px-2 py-1"
                        >
                          ژێبرن
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <form onSubmit={handleOrderSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">ناڤێ تە یێ سیانی</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="نموونە: ئارام ئەحمەد"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">ژمارا تەلەفۆنێ (واتسئەپ)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0750xxxxxxx"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">ناڤونیشان / باژێر</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="باژێر / جهـ"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>تۆمارکرن...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>تەمامکرنا داخوازیێ</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}