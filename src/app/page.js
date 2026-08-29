'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, CheckCircle2, Trash2, Sparkles, Send, 
  ShieldCheck, MessageCircle, Copy, Check, Flame, UploadCloud, X, RefreshCw, Lock, Zap, Clock
} from 'lucide-react';

const TRANSLATIONS = {
  ku: {
    dir: 'rtl',
    storeSubtitle: 'باشترین خزمەتگوزاریێن دیجیتال و ژیرییا دەستکرد',
    heroBadge: 'ئۆفەرا مەزن یا تایبەت بۆ دەمەکێ کاتی ڤەبوو! 🔥',
    heroTitle1: 'پتر ژ ٢٠٠ سایتێن ژیرییا دەستکرد',
    heroTitle2: 'ب بهایەکی کو کەس باوەر ناکەت!',
    heroDesc: 'ئێک ئەکاونت بۆ هەمی کارێن تە: نڤیسین، کۆدینگ، مۆنتاژ، وێنە و شیکاریا فایلان. دەمێ خو هەلبژێرە:',
    mainOfferBadge: 'ئۆفەرا سەرەکی و چاڤەڕێکری 👑',
    officialBadge: 'فەرمی و دەستبەجێ',
    mainOfferTitle: 'پاکێجا گشتگیر: پتر ژ ٢٠٠ ماڵپەڕ و مۆدێلێن AI',
    mainOfferDesc: 'دەستڤەئینانا هەمی مۆدێلێن پێشکەفتی (DeepSeek R1/V3, Claude 3.5, ChatGPT 4o Mini, Gemini 2.0, Flux ) بێی پێدڤیبوون ب چەندین پشکدارییان.',
    selectDuration: 'مەودایێ دەمی هەلبژێرە:',
    selectedPriceFor: 'بهایێ پاکێجا هەلبژارتی',
    addToCartBtn: 'دەستڤەئینان:',
    inCartBtn: 'د سەبەتێ دا یا زێدەکرییە (داگرتن بۆ گوهۆڕینێ)',
    comingSoonBtn: 'ل نێزیک دهێتە بەردەستکرن',
    comingSoonBadge: 'ل نێزیک ⏳',
    cartTitle: 'سەبەتە و داخوازی',
    subscriptions: 'پشکداری',
    cartEmpty: 'سەبەتە یا ڤالایە، پاکێجەکێ هەلبژێرە.',
    totalPrice: 'بهایێ گشتی:',
    labelName: 'ناڤێ تە',
    placeholderName: 'ناڤێ سیانی بنڤیسە...',
    labelPhone: 'ژمارا واتساپی',
    labelPayment: 'رێکا پارەدانێ',
    labelTxId: 'کۆدێ وەسڵێ (Transaction ID / TxID / ئیمەیل)',
    placeholderTxId: 'کۆدێ وەسڵا پارەدانێ بنڤیسە...',
    labelUpload: 'وێنەیێ وەسڵێ (ئارەزوومەندانە)',
    uploadPlaceholder: 'بارکرنا وێنەیێ وەسڵێ (Screenshot)',
    submitBtn: 'تەمامکرن و ناردنا داخوازیێ',
    submittingBtn: 'تکایە چاڤەرێ بە...',
    guaranteeText: 'هەمی پشکداری ب گرەنتی و پشتەڤانییا بەردەوامن',
    successTitle: 'داخوازی ب سەرکەفتی هاتە فرێکرن!',
    successDesc: 'زانیاریێن داخوازییا تە هاتنە تۆمارکرن. بۆ وەرگرتنا ئەکاونت و پاسوۆردی، مەساجێ بۆ واتساپێ بنێرە:',
    whatsappBtn: 'پەیوەندی ب واتساپی بکە',
    newOrderBtn: 'تۆمارکرنا داخوازیەکا نوی',
    copyBtn: 'کۆپی بکە',
    copiedBtn: 'هاتە کۆپیکرن',
    alertEmptyCart: 'بێ زەحمەت، ئۆفەرەکێ زێدە بکە د سەبەتێ دا!',
    alertError: 'خەلەتییەک چێبوو د فرێکرنا داخوازیێ دا!',
    alertServer: 'ئاریشەیەک د پەیوەندیا سێرڤەری دا ڕویدا!',
    allRightsReserved: 'هەمی ماف پاراستینە.',
    tiers: {
      '1_day': { name: 'تێست (١ ڕۆژ)', duration: '٢٤ دەمژمێر', badge: 'تێست و ب لەز ⚡' },
      '7_days': { name: 'هەفتانە (٧ ڕۆژ)', duration: '١ هەفتە', badge: 'گونجای 👍' },
      '30_days': { name: 'هەیڤانە (٣٠ ڕۆژ)', duration: '١ هەیڤ', badge: 'پڕفرۆشترین 🔥' },
      '90_days': { name: '٣ هەیڤی (٩٠ ڕۆژ)', duration: '٣ هەیڤ', badge: 'داشکاندن ٪٥٠ 🌟' },
      '1_year': { name: 'ساڵانە (١ ساڵ) 👑', duration: '١ ساڵا تەمام', badge: 'VIP بێ سنور 👑' }
    }
  },
  ar: {
    dir: 'rtl',
    storeSubtitle: 'أفضل الخدمات الرقمية والذكاء الاصطناعي',
    heroBadge: 'العرض الأكبر متاح الآن لفترة محدودة! 🔥',
    heroTitle1: 'أكثر من ٢٠٠ موقع ذكاء اصطناعي',
    heroTitle2: 'بسعر لا يُصدق!',
    heroDesc: 'حساب واحد لجميع مهامك: الكتابة، البرمجة، المونتاج، الصور وتحليل الملفات. اختر مدتك:',
    mainOfferBadge: 'العرض الرئيسي المنتظر 👑',
    officialBadge: 'رسمي وفوري',
    mainOfferTitle: 'الباقة الشاملة: أكثر من ٢٠٠ موقع ونموذج AI',
    mainOfferDesc: 'وصول إلى جميع النماذج المتقدمة (DeepSeek R1/V3, Claude 3.5, ChatGPT 4o Mini, Gemini 2.0, Flux 🎨) دون الحاجة لاشتراكات متعددة.',
    selectDuration: 'اختر المدة الزمنية:',
    selectedPriceFor: 'سعر الباقة المختارة',
    addToCartBtn: 'الحصول على العرض:',
    inCartBtn: 'مضاف إلى السلة (انقر للتغيير)',
    comingSoonBtn: 'سيتوفر قريباً',
    comingSoonBadge: 'قريباً ⏳',
    cartTitle: 'السلة والطلب',
    subscriptions: 'اشتراكات',
    cartEmpty: 'السلة فارغة، اختر إحدى الباقات.',
    totalPrice: 'المجموع الكلي:',
    labelName: 'الاسم الكامل',
    placeholderName: 'اكتب اسمك الثلاثي...',
    labelPhone: 'رقم الواتساب',
    labelPayment: 'طريقة الدفع',
    labelTxId: 'رمز الإشعار / التحويل (Transaction ID / TxID)',
    placeholderTxId: 'اكتب رقم أو رمز وصل التحويل...',
    labelUpload: 'صورة الوصل (اختياري)',
    uploadPlaceholder: 'رفع صورة الوصل (Screenshot)',
    submitBtn: 'إتمام وإرسال الطلب',
    submittingBtn: 'يرجى الانتظار...',
    guaranteeText: 'جميع الاشتراكات بضمان كامل ودعم مستمر',
    successTitle: 'تم إرسال الطلب بنجاح!',
    successDesc: 'تم حفظ تفاصيل طلبك. لاستلام الحساب وكلمة المرور فوراً، راسلنا عبر واتساب:',
    whatsappBtn: 'تواصل عبر واتساب',
    newOrderBtn: 'تسجيل طلب جديد',
    copyBtn: 'نسخ',
    copiedBtn: 'تم النسخ',
    alertEmptyCart: 'يرجى إضافة باقة إلى السلة أولاً!',
    alertError: 'حدث خطأ أثناء إرسال الطلب!',
    alertServer: 'حدث خطأ في الاتصال بالخادم!',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    tiers: {
      '1_day': { name: 'تجربة (يوم واحد)', duration: '٢٤ ساعة', badge: 'سريع وتجريبي ⚡' },
      '7_days': { name: 'أسبوعي (٧ أيام)', duration: 'أسبوع واحد', badge: 'اقتصادي 👍' },
      '30_days': { name: 'شهري (٣٠ يوماً)', duration: 'شهر كامل', badge: 'الأكثر طلباً 🔥' },
      '90_days': { name: '٣ أشهر (٩٠ يوماً)', duration: '٣ أشهر', badge: 'خصم ٥٠٪ 🌟' },
      '1_year': { name: 'سنوي (سنة كاملة) 👑', duration: 'سنة كاملة', badge: 'VIP بلا حدود 👑' }
    }
  },
  en: {
    dir: 'ltr',
    storeSubtitle: 'Premium Digital & Artificial Intelligence Services',
    heroBadge: 'Special Mega Offer Live for a Limited Time! 🔥',
    heroTitle1: 'Over 200+ AI Platforms & Models',
    heroTitle2: 'At an Unbelievable Price!',
    heroDesc: 'One single account for all your workflows: Writing, Coding, Video Editing, Images, and File Analysis. Choose your duration:',
    mainOfferBadge: 'Featured & Awaited Offer 👑',
    officialBadge: 'Official & Instant',
    mainOfferTitle: 'All-In-One Hub: Over 200+ AI Models',
    mainOfferDesc: 'Instant access to all top-tier models (DeepSeek R1/V3, Claude 3.5, ChatGPT 4o Mini, Gemini 2.0, Flux 🎨) without multiple subscriptions.',
    selectDuration: 'Choose Plan Duration:',
    selectedPriceFor: 'Selected Plan Price',
    addToCartBtn: 'Get Access:',
    inCartBtn: 'Added to Cart (Click to update)',
    comingSoonBtn: 'Coming Soon',
    comingSoonBadge: 'Coming Soon ⏳',
    cartTitle: 'Cart & Checkout',
    subscriptions: 'Items',
    cartEmpty: 'Your cart is empty, please select a plan.',
    totalPrice: 'Total Amount:',
    labelName: 'Your Full Name',
    placeholderName: 'Enter your full name...',
    labelPhone: 'WhatsApp Number',
    labelPayment: 'Payment Method',
    labelTxId: 'Transaction ID / TxID / Email',
    placeholderTxId: 'Enter transaction confirmation code...',
    labelUpload: 'Payment Receipt (Optional)',
    uploadPlaceholder: 'Upload receipt screenshot',
    submitBtn: 'Complete & Submit Order',
    submittingBtn: 'Please wait...',
    guaranteeText: 'All subscriptions come with full warranty & 24/7 support',
    successTitle: 'Order Placed Successfully!',
    successDesc: 'Your order details have been saved. To receive your login details immediately, message us on WhatsApp:',
    whatsappBtn: 'Contact via WhatsApp',
    newOrderBtn: 'Place a New Order',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    alertEmptyCart: 'Please add a package to the cart first!',
    alertError: 'An error occurred while submitting your order!',
    alertServer: 'A server connection error occurred!',
    allRightsReserved: 'All rights reserved.',
    tiers: {
      '1_day': { name: 'Trial (1 Day)', duration: '24 Hours', badge: 'Fast Trial ⚡' },
      '7_days': { name: 'Weekly (7 Days)', duration: '1 Week', badge: 'Affordable 👍' },
      '30_days': { name: 'Monthly (30 Days)', duration: '1 Month', badge: 'Best Seller 🔥' },
      '90_days': { name: '3 Months (90 Days)', duration: '3 Months', badge: '50% OFF 🌟' },
      '1_year': { name: 'Annual (1 Year) 👑', duration: 'Full Year', badge: 'Unlimited VIP 👑' }
    }
  }
};

const AI_TIERS_DATA = [
  { id: '1_day', priceIQD: 2500, oldPriceIQD: 5000 },
  { id: '7_days', priceIQD: 5000, oldPriceIQD: 10000 },
  { id: '30_days', priceIQD: 12000, oldPriceIQD: 25000 },
  { id: '90_days', priceIQD: 25000, oldPriceIQD: 50000 },
  { id: '1_year', priceIQD: 50000, oldPriceIQD: 120000 }
];

const LOCKED_PRODUCTS = [
  { id: 'chatgpt', name: 'ChatGPT Plus (GPT-4o)', priceIQD: 35000, category: 'AI Assistant' },
  { id: 'claude', name: 'Claude Pro (Claude 3.5 Sonnet)', priceIQD: 35000, category: 'AI Assistant' },
  { id: 'google_flow', name: 'Google Flow AI', priceIQD: 25000, category: 'AI Assistant' },
  { id: 'elevenlabs', name: 'ElevenLabs AI', priceIQD: 26250, category: 'AI Voice' },
  { id: 'kling', name: 'Kling AI Video', priceIQD: 21000, category: 'AI Video' },
  { id: 'canva', name: 'Canva Pro', priceIQD: 8750, category: 'Design' },
  { id: 'capcut', name: 'CapCut Pro', priceIQD: 15000, category: 'Video Editing' },
  { id: 'paypal_acc', name: 'PayPal Verified Account', priceIQD: 20000, category: 'Financial Service' },
  { id: 'netflix', name: 'Netflix Premium', priceIQD: 7000, category: 'Cinema & Movies' },
  { id: 'shahid_vip', name: 'Shahid VIP', priceIQD: 13500, category: 'Cinema & Movies' },
  { id: 'spotify', name: 'Spotify Premium', priceIQD: 13000, category: 'Music & Audio' },
  { id: 'apple_music', name: 'Apple Music', priceIQD: 7000, category: 'Music & Audio' },
  { id: 'youtube_music', name: 'YouTube Premium', priceIQD: 13000, category: 'Music & Audio' },
  { id: 'ps_plus', name: 'PlayStation Plus', priceIQD: 22000, category: 'Gaming' }
];

const PAYMENT_ACCOUNTS = {
  FIB: { title: 'First Iraqi Bank (FIB)', number: '07504060378', note: 'Account / FIB: IPBITS' },
  FastPay: { title: 'FastPay Wallet', number: '07504060378', note: 'FastPay Account' },
  ZainCash: { title: 'Zain Cash', number: '07504060378', note: 'Zain Cash Wallet' },
  PayPal: { title: 'PayPal', number: 'https://www.paypal.com/ncp/payment/VDDES8YRYJG46', note: 'Send via Friends & Family' },
  USDT: { title: 'USDT (TRC20)', number: 'TUeqkjzFdD7b1EtnAJL9tbzB1uN8wDbU6T', note: 'TRC20 Network Only' }
};

export default function StorePage() {
  const [lang, setLang] = useState('ku');
  const t = TRANSLATIONS[lang];

  const [selectedTierId, setSelectedTierId] = useState('30_days');
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

  const currentTierData = AI_TIERS_DATA.find(tItem => tItem.id === selectedTierId) || AI_TIERS_DATA[2];
  const currentTierText = t.tiers[selectedTierId];

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

  const addAIToCart = () => {
    const item = {
      id: `ai_bundle_${selectedTierId}`,
      name: `AI Hub - ${currentTierText.name}`,
      priceIQD: currentTierData.priceIQD
    };
    const filteredCart = cart.filter(i => !i.id.startsWith('ai_bundle_'));
    setCart([...filteredCart, item]);
    scrollToCart();
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
      alert(t.alertEmptyCart);
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
        alert(t.alertError);
      }
    } catch (err) {
      console.error(err);
      alert(t.alertServer);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  const sendToWhatsApp = () => {
    if (!lastOrder) return;
    const msg = `Hello IPBITS STORE,%0A%0A👤 Name: ${lastOrder.name}%0A📱 Phone: ${lastOrder.phone}%0A📦 Plan: ${lastOrder.items}%0A💰 Total: ${lastOrder.totalIQD.toLocaleString()} IQD%0A💳 Method: ${lastOrder.paymentMethod}%0A🧾 TxID: ${lastOrder.transactionId}`;
    window.open(`https://wa.me/9647504060378?text=${msg}`, '_blank');
  };

  const isCurrentTierInCart = cart.some(i => i.id === `ai_bundle_${selectedTierId}`);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col justify-between" dir={t.dir}>
      
      {/* هێدەرێ ستاندارد یێ مۆبایل و دێسکتۆپێ */}
      <nav className="w-full border-b border-slate-800 bg-[#0c1022]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          
          {/* لۆگۆ و ناڤ */}
          <div className="flex items-center gap-2 shrink-0">
            <img 
              src="/logo.png" 
              alt="IPBITS Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-purple-500/40 shrink-0 block" 
            />
            <span className="text-sm sm:text-lg font-black tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
              IPBITS STORE
            </span>
          </div>

          {/* زمان و سەبەتە */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('ku')}
                className={`px-2 py-1 rounded transition-all ${
                  lang === 'ku' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                کوردى
              </button>
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded transition-all ${
                  lang === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-all ${
                  lang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button 
              type="button"
              onClick={scrollToCart}
              className="flex items-center gap-1 bg-purple-600/20 border border-purple-500/40 text-purple-300 px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
            >
              <ShoppingBag size={14} className="text-purple-400" />
              <span>{cart.length}</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ناڤەرۆکا سەرەکی */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10 mb-16 flex-1">
        
        {/* سەردێڕ */}
        <div ref={productsSectionRef} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-950/80 via-fuchsia-950/80 to-indigo-950/80 text-purple-300 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-black mb-4 border border-purple-500/40 shadow-xl shadow-purple-900/30 animate-pulse">
            <Sparkles className="text-amber-400" size={14} />
            <span>{t.heroBadge}</span>
          </div>
          
          <h2 className="text-2xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            {t.heroTitle1} <br className="hidden sm:inline"/> 
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            {t.heroDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* بەشێ ئۆفەرا سەرەکی */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-5 sm:p-8 rounded-3xl border border-purple-500/60 bg-gradient-to-br from-purple-950/60 via-slate-900/95 to-indigo-950/60 shadow-2xl shadow-purple-950/40 ring-1 ring-purple-500/40 relative overflow-hidden">
              
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[11px] sm:text-xs font-bold px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <Flame className="text-amber-400" size={13} />
                  {t.mainOfferBadge}
                </span>
                <span className="text-xs text-purple-300 font-bold flex items-center gap-1">
                  <Clock size={13} /> {t.officialBadge}
                </span>
              </div>

              <h3 className="font-black text-xl sm:text-3xl text-white mb-2">
                {t.mainOfferTitle}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {t.mainOfferDesc}
              </p>

              {/* هەلبژارتنا دەمێ پاکێجێ */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-purple-300 mb-2.5">
                  {t.selectDuration}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AI_TIERS_DATA.map((tierData) => {
                    const isSelected = selectedTierId === tierData.id;
                    const tierLang = t.tiers[tierData.id];
                    return (
                      <button
                        key={tierData.id}
                        type="button"
                        onClick={() => setSelectedTierId(tierData.id)}
                        className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          t.dir === 'rtl' ? 'text-right' : 'text-left'
                        } ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-400 text-white shadow-md shadow-purple-900/40 ring-2 ring-purple-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-xs">{tierLang.name}</span>
                          {isSelected && <Check className="text-purple-400" size={13} />}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-black text-white block">
                            {tierData.priceIQD.toLocaleString()} IQD
                          </span>
                          <span className="text-[10px] text-slate-400 line-through">
                            {tierData.oldPriceIQD.toLocaleString()} IQD
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* بهایێ گشتی */}
              <div className="flex items-baseline justify-between p-3.5 sm:p-4 bg-slate-950/70 rounded-xl sm:rounded-2xl border border-purple-500/20 mb-6">
                <div>
                  <span className="text-xs text-slate-400 block">{t.selectedPriceFor} ({currentTierText.duration}):</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-200">
                      {currentTierData.priceIQD.toLocaleString()} IQD
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      {currentTierData.oldPriceIQD.toLocaleString()} IQD
                    </span>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg sm:rounded-xl">
                  {currentTierText.badge}
                </span>
              </div>

              <button
                type="button"
                onClick={addAIToCart}
                className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:opacity-95 text-white shadow-xl shadow-purple-600/40 active:scale-98"
              >
                {isCurrentTierInCart ? (
                  <>
                    <CheckCircle2 className="text-emerald-300" size={16} />
                    <span>{t.inCartBtn}</span>
                  </>
                ) : (
                  <>
                    <Zap className="text-amber-300 fill-amber-300" size={16} />
                    <span>{t.addToCartBtn} {currentTierText.name} - {currentTierData.priceIQD.toLocaleString()} IQD</span>
                  </>
                )}
              </button>
            </div>

            {/* بەرهەمێن قوفڵکری */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {LOCKED_PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border bg-slate-900/30 border-slate-800/50 opacity-60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border text-slate-400 bg-slate-800/60 border-slate-700/60 flex items-center gap-1">
                        <Lock size={11} /> {t.comingSoonBadge}
                      </span>
                      <span className="text-[11px] text-slate-400">{product.category}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">{product.name}</h3>
                    <span className="text-base sm:text-lg font-bold text-slate-500 block mb-3">{product.priceIQD.toLocaleString()} IQD</span>
                  </div>

                  <button
                    disabled
                    className="w-full py-2 rounded-lg sm:rounded-xl font-bold text-xs bg-slate-800/40 border border-slate-800 text-slate-500 flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock size={12} /> {t.comingSoonBtn}
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* بەشێ سەبەتێ و فۆرمێ داخوازیێ */}
          <div ref={cartSectionRef} className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md sticky top-28 scroll-mt-28">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 sm:pb-4 mb-4 sm:mb-5">
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-white">
                <ShoppingBag className="text-purple-400" size={18} /> {t.cartTitle}
              </h3>
              <span className="text-xs bg-slate-800/90 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                {cart.length} {t.subscriptions}
              </span>
            </div>

            {success ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold mb-1 text-white">{t.successTitle}</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-5">
                  {t.successDesc}
                </p>

                <button
                  type="button"
                  onClick={sendToWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/30 mb-2.5 transition-all cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>{t.whatsappBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForNewOrder}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-md"
                >
                  <RefreshCw className="text-purple-400" size={13} />
                  <span>{t.newOrderBtn}</span>
                </button>
              </div>
            ) : (
              <div>
                {cart.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-6 border border-dashed border-slate-800 rounded-xl mb-4 font-medium">
                    {t.cartEmpty}
                  </p>
                ) : (
                  <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-950/70 p-2.5 rounded-xl border border-purple-500/30 text-xs">
                        <span className="font-bold text-slate-200 truncate max-w-[150px]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-bold">{item.priceIQD.toLocaleString()} IQD</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-950/90 p-3.5 rounded-xl sm:rounded-2xl border border-slate-800/80 mb-4">
                  <div className="flex justify-between text-sm sm:text-base font-extrabold text-white">
                    <span>{t.totalPrice}</span>
                    <span className="text-purple-400 font-black">{totalIQD.toLocaleString()} IQD</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">{t.labelName}</label>
                    <input
                      required
                      type="text"
                      placeholder={t.placeholderName}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">{t.labelPhone}</label>
                    <input
                      required
                      type="tel"
                      placeholder="0750XXXXXXX"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">{t.labelPayment}</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-white"
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
                      <div className="truncate max-w-[180px]">
                        <span className="text-[10px] text-purple-300 block">{PAYMENT_ACCOUNTS[formData.paymentMethod]?.note}</span>
                        <span className="font-bold text-white tracking-wider text-[11px] truncate block">{PAYMENT_ACCOUNTS[formData.paymentMethod]?.number}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyPaymentNumber}
                        className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0"
                      >
                        {copied ? <Check className="text-emerald-400" size={11} /> : <Copy size={11} />}
                        <span>{copied ? t.copiedBtn : t.copyBtn}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">{t.labelTxId}</label>
                    <input
                      required
                      type="text"
                      placeholder={t.placeholderTxId}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500 text-white"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">{t.labelUpload}</label>
                    <label className="border border-dashed border-slate-700 hover:border-purple-500/60 bg-slate-950/60 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-colors text-xs text-slate-400">
                      <div className="flex items-center gap-2 truncate">
                        <UploadCloud className="text-purple-400 shrink-0" size={15} />
                        <span className="truncate text-[11px]">{fileName || t.uploadPlaceholder}</span>
                      </div>
                      {fileName && (
                        <button type="button" onClick={clearFile} className="text-slate-400 hover:text-rose-400 p-0.5">
                          <X size={13} />
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
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xl shadow-purple-600/30 mt-2 text-white cursor-pointer"
                  >
                    {loading ? t.submittingBtn : (
                      <>
                        <span>{t.submitBtn}</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-slate-500 pt-0.5 font-medium">
                    <ShieldCheck className="text-purple-400" size={12} /> {t.guaranteeText}
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* فۆتەر */}
      <footer className="w-full border-t border-slate-800/80 bg-[#0c1022]/90 backdrop-blur-md py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span>© 2026 IPBITS STORE. {t.allRightsReserved}</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com/ipbits" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-slate-900/80 hover:bg-purple-950/60 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-fuchsia-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@ipbits</span>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}