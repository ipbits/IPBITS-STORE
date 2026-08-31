'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Loader2, Image as ImageIcon, 
  X, Paperclip, Check, Copy, Download, Code2, Globe, ChevronDown, Wallet, KeyRound
} from 'lucide-react';

const TRANSLATIONS = {
  ku: {
    welcome: 'سڵاڤ! ئەڤە پلاتفۆڕما IPBITS AI Hubە. پتر ژ ٢٠٠ مۆدێلێن جیهانی ل بەر دەستێ تەنە. هەر پرسیارەکا تە هەبیت بنڤیسە دا هاریکاریا تە بکەم.',
    inputPlaceholder: 'پرسیارەکێ بنڤیسە...',
    loadingModels: 'بارکرن...',
    thinking: 'د هزرکرنێ دایە...',
    imageCreated: '✨ وێنە هاتە دروستکرن',
    uploadFileTitle: 'بارکرنا فایل',
    uploadImageTitle: 'بارکرنا وێنە',
    analyzePrompt: 'ڤی وێنەی شیکار بکە:',
    fileHeader: '📄 [فایل: ',
    errorPrefix: 'ببورە، ئاریشەیەک چێبوو: ',
    errorDefault: 'پەیوەندی دروست نەبوو',
    errorConnection: 'خەلەتیەک د گرێدانێ دا چێبوو.',
    checkBalanceTitle: 'کۆنترۆلا باڵانسی',
    enterApiKeyPlaceholder: 'کلیلێ خۆ (sk-or-...) ل ڤێرە دابنێ دا باڵانس بهێتە پیشاندان...',
    hideBalance: 'ڤەشارتنا باڵانسی'
  },
  ar: {
    welcome: 'مرحباً! هذه منصة IPBITS AI Hub. أكثر من 200 نموذج ذكاء اصطناعي عالمي بين يديك. اكتب سؤالك وسأساعدك فوراً.',
    inputPlaceholder: 'اكتب سؤالك هنا...',
    loadingModels: 'جاري التحميل...',
    thinking: 'جاري التفكير...',
    imageCreated: '✨ تم إنشاء الصورة',
    uploadFileTitle: 'رفع ملف',
    uploadImageTitle: 'رفع صورة',
    analyzePrompt: 'قم بتحليل هذه الصورة:',
    fileHeader: '📄 [ملف: ',
    errorPrefix: 'عذراً، حدث خطأ: ',
    errorDefault: 'لم يتم الاتصال بنجاح',
    errorConnection: 'حدث خطأ في الاتصال بالخادم.',
    checkBalanceTitle: 'فحص الرصيد',
    enterApiKeyPlaceholder: 'ضع مفتاح API الخاص بك لعرض رصيدك المتبقي...',
    hideBalance: 'إخفاء بطاقة الرصيد'
  },
  en: {
    welcome: 'Hello! Welcome to IPBITS AI Hub. Over 200+ global AI models at your fingertips. Ask anything to get started.',
    inputPlaceholder: 'Type your prompt here...',
    loadingModels: 'Loading...',
    thinking: 'Thinking...',
    imageCreated: '✨ Image generated',
    uploadFileTitle: 'Upload file',
    uploadImageTitle: 'Upload image',
    analyzePrompt: 'Analyze this image:',
    fileHeader: '📄 [File: ',
    errorPrefix: 'Sorry, an error occurred: ',
    errorDefault: 'Connection failed',
    errorConnection: 'A network connection error occurred.',
    checkBalanceTitle: 'Check Balance',
    enterApiKeyPlaceholder: 'Paste your API key (sk-or-...) to view remaining balance...',
    hideBalance: 'Hide Balance Card'
  }
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const cleanLang = (language || 'code').trim().toLowerCase();
  
  const getExtension = (lang) => {
    switch (lang) {
      case 'html': return 'html';
      case 'js':
      case 'javascript': return 'js';
      case 'jsx': return 'jsx';
      case 'ts':
      case 'typescript': return 'ts';
      case 'tsx': return 'tsx';
      case 'css': return 'css';
      case 'python':
      case 'py': return 'py';
      case 'sql': return 'sql';
      case 'json': return 'json';
      case 'php': return 'php';
      case 'cpp':
      case 'c++': return 'cpp';
      case 'c': return 'c';
      case 'java': return 'java';
      default: return 'txt';
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    try {
      const ext = getExtension(cleanLang);
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 font-mono text-xs shadow-xl text-left" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="text-purple-400" size={14} />
          <span className="uppercase text-[11px] font-bold text-purple-300">{cleanLang}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="text-emerald-400" size={13} /> : <Copy size={13} />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 rounded-lg transition active:scale-95 cursor-pointer"
          >
            <Download size={13} />
            <span className="text-[10px]">.{getExtension(cleanLang)}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function UserBalanceCard({ apiKey }) {
  const [keyData, setKeyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;
    fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setKeyData(data.data);
      })
      .catch(err => console.error("Error fetching balance:", err))
      .finally(() => setLoading(false));
  }, [apiKey]);

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl animate-pulse text-xs text-slate-400 text-center">
        بارکرنا باڵانسی...
      </div>
    );
  }

  if (!keyData) return null;

  const totalLimit = keyData.limit || 0;
  const usedAmount = keyData.usage || 0;
  const remainingAmount = keyData.limit_remaining !== null ? keyData.limit_remaining : (totalLimit - usedAmount);
  const percentUsed = totalLimit > 0 ? Math.min(100, Math.round((usedAmount / totalLimit) * 100)) : 0;

  return (
    <div className="w-full bg-[#0c1022]/90 border border-purple-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md mb-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600/20 border border-purple-500/40 rounded-lg flex items-center justify-center">
            <Wallet className="text-purple-400" size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">باڵانس و لیمێتا ئەکاونتی</h4>
          </div>
        </div>
        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
          مەزێختن: {percentUsed}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block">لیمێت</span>
          <span className="text-xs font-black text-white">${totalLimit.toFixed(2)}</span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl">
          <span className="text-[10px] text-rose-400 block">مەزێختی</span>
          <span className="text-xs font-black text-rose-400">${usedAmount.toFixed(2)}</span>
        </div>
        <div className="bg-slate-950/60 border border-purple-500/30 p-2 rounded-xl bg-purple-950/20">
          <span className="text-[10px] text-emerald-400 block">یێ مای</span>
          <span className="text-xs font-black text-emerald-400">${remainingAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
          style={{ width: `${percentUsed}%` }}
        />
      </div>
    </div>
  );
}

function renderMessageContent(content) {
  if (typeof content !== 'string') return content;
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part && part.startsWith('```') && part.endsWith('```')) {
      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      const language = match ? match[1] || 'code' : 'code';
      const code = match ? match[2].trim() : part.slice(3, -3).trim();
      return <CodeBlock key={index} code={code} language={language} />;
    }
    return (
      <span key={index} className="whitespace-pre-wrap leading-relaxed">
        {part}
      </span>
    );
  });
}

export default function ChatPage() {
  const [lang, setLang] = useState('ku');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ku;
  const isRtl = lang !== 'en';

  const [messages, setMessages] = useState([
    { role: 'assistant', content: TRANSLATIONS.ku.welcome }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('');
  const [freeModels, setFreeModels] = useState([]);
  const [paidModels, setPaidModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // باڵانس و کلیلا بکارهێنەری
  const [userApiKey, setUserApiKey] = useState('');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const codeFileInputRef = useRef(null);

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          const frees = [];
          const paids = [];

          data.data.forEach((m) => {
            if (m.id && m.id.endsWith(':free')) {
              frees.push(m);
            } else {
              paids.push(m);
            }
          });

          paids.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));
          frees.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));

          setFreeModels(frees);
          setPaidModels(paids);

          if (frees.length > 0) {
            setModel(frees[0].id);
          } else if (paids.length > 0) {
            setModel(paids[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching models:', err);
      })
      .finally(() => {
        setLoadingModels(false);
      });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setLangDropdownOpen(false);
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: TRANSLATIONS[newLang].welcome }]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCodeFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result;
        setInput((prev) => {
          const header = `\n\n${t.fileHeader}${file.name}]\n\`\`\`\n`;
          const footer = `\n\`\`\`\n`;
          return prev ? `${prev}${header}${fileContent}${footer}` : `${header}${fileContent}${footer}`;
        });
      };
      reader.readAsText(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || loading) return;

    const userText = input.trim();
    const currentImage = selectedImage;

    const userMsg = { 
      role: 'user', 
      content: userText,
      image: currentImage 
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    clearImage();
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || t.analyzePrompt },
              { type: 'image_url', image_url: { url: m.image } }
            ]
          };
        }
        return {
          role: m.role,
          content: m.content
        };
      });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: model,
          userApiKey: userApiKey || undefined
        })
      });

      const data = await res.json();

      if (res.ok && (data.reply || data.choices?.[0]?.message?.content)) {
        const replyText = data.reply || data.choices[0].message.content;
        setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: t.errorPrefix + (data.error || t.errorDefault) }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: t.errorConnection }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#070913] text-white flex flex-col justify-between font-sans selection:bg-purple-600"
    >
      {/* هێدەرێ ستاندارد دگەل مینیویا زمانان و باڵانسی */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 gap-2 w-full max-w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0">
            <Sparkles className="text-purple-400" size={16} />
          </div>
          <span className="font-black text-xs sm:text-sm tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent truncate">
            IPBITS AI HUB
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* دوگمەیا پیشاندانا باڵانسی */}
          <button
            type="button"
            onClick={() => setShowBalanceModal(!showBalanceModal)}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm"
            title={t.checkBalanceTitle}
          >
            <Wallet size={13} className="text-purple-400" />
            <span className="hidden sm:inline">{t.checkBalanceTitle}</span>
          </button>

          {/* مینیویا بچووک یا زمانان (Dropdown) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
            >
              <Globe size={13} className="text-purple-400" />
              <span>{lang === 'ku' ? 'کوردی' : lang === 'ar' ? 'العربية' : 'EN'}</span>
              <ChevronDown size={11} className={`text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div 
                className={`absolute top-full mt-1.5 bg-[#0c1022] border border-slate-800 rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 min-w-[100px] backdrop-blur-xl ${
                  isRtl ? 'right-0' : 'left-0'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleLangChange('ku')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    lang === 'ku' ? 'bg-purple-600/30 text-purple-300' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>کوردی</span>
                  {lang === 'ku' && <Check size={11} className="text-purple-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleLangChange('ar')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    lang === 'ar' ? 'bg-purple-600/30 text-purple-300' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>العربية</span>
                  {lang === 'ar' && <Check size={11} className="text-purple-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleLangChange('en')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    lang === 'en' ? 'bg-purple-600/30 text-purple-300' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>English</span>
                  {lang === 'en' && <Check size={11} className="text-purple-400" />}
                </button>
              </div>
            )}
          </div>

          {/* هەلبژارتنا مۆدێلان */}
          {loadingModels ? (
            <div className="flex items-center gap-1 text-[11px] text-purple-300 bg-slate-900 px-2 py-1.5 rounded-xl border border-slate-800">
              <Loader2 size={12} className="animate-spin text-purple-400" />
              <span>{t.loadingModels}</span>
            </div>
          ) : (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-[11px] sm:text-xs rounded-xl px-2 py-1.5 text-purple-300 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[125px] sm:max-w-xs truncate"
            >
              {freeModels.length > 0 && (
                <optgroup label={lang === 'ar' ? '🎁 نماذج مجانية' : lang === 'en' ? '🎁 Free Models' : '🎁 مۆدێلێن بێ بەرامبەر'}>
                  {freeModels.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-emerald-400">
                      🎁 {m.name || m.id}
                    </option>
                  ))}
                </optgroup>
              )}

              {paidModels.length > 0 && (
                <optgroup label={lang === 'ar' ? '⚡ نماذج VIP المتقدمة (+200)' : lang === 'en' ? '⚡ VIP Models (+200)' : '⚡ مۆدێلێن VIP یێن پێشکەفتی (+200)'}>
                  {paidModels.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                      ⚡ {m.name || m.id}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          )}
        </div>
      </header>

      {/* بەشێ چات و کارتا باڵانسی */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
        
        {/* کارتا پشکنینا باڵانسی (دەردکەڤیت دەمێ کڕیار ل سەر دوگمەیا باڵانسی دگریت) */}
        {showBalanceModal && (
          <div className="bg-[#0c1022]/95 border border-purple-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md mb-4 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="text-purple-400" size={16} />
                <h4 className="text-xs sm:text-sm font-bold text-white">{t.checkBalanceTitle}</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setShowBalanceModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="password"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value.trim())}
              placeholder={t.enterApiKeyPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-purple-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 mb-3"
            />

            {userApiKey && <UserBalanceCard apiKey={userApiKey} />}
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 max-w-full ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'}`}>
              {m.role === 'user' ? (
                <User size={14} />
              ) : (
                <Sparkles size={14} className="text-purple-400" />
              )}
            </div>
            
            <div
              className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] sm:max-w-[80%] text-xs sm:text-sm leading-relaxed overflow-hidden break-words whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {m.image && (
                <img 
                  src={m.image} 
                  alt="Uploaded Asset" 
                  className="max-w-full max-h-52 rounded-xl mb-2.5 border border-purple-400/30 object-cover" 
                />
              )}

              {typeof m.content === 'string' && (m.content.includes('![AI Image]') || m.content.includes('image.pollinations.ai') || m.content.startsWith('http://') || m.content.startsWith('https://')) && (m.content.includes('.jpg') || m.content.includes('.png') || m.content.includes('pollinations.ai')) ? (
                <div className="space-y-2 max-w-full">
                  <img 
                    src={m.content.replace('![AI Image](', '').replace(')', '').trim()} 
                    alt="AI Generated" 
                    className="rounded-2xl max-w-full w-full border border-purple-500 shadow-xl object-cover" 
                  />
                  <span className="text-[10px] text-purple-300 block">{t.imageCreated}</span>
                </div>
              ) : (
                <div className="max-w-full overflow-x-auto">
                  {renderMessageContent(m.content)}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/50 flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-purple-900/40 p-1">
              <img 
                src="/logo.png" 
                alt="IPBITS AI" 
                className="w-full h-full object-contain rounded-full animate-pulse" 
              />
            </div>

            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs text-purple-300 flex items-center gap-2 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>{t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* فۆرمێ نڤیسینێ و بارکرنێ */}
      <footer className="p-2.5 sm:p-4 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky bottom-0 z-20 w-full">
        {selectedImage && (
          <div className="max-w-4xl mx-auto mb-2 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-14 w-14 object-cover rounded-xl border-2 border-purple-500 shadow-md" 
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-500 transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-1.5 sm:gap-2">
          <input
            type="file"
            accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.json,.txt,.sql,.md,.env,.php,.cpp,.c,.java"
            ref={codeFileInputRef}
            onChange={handleCodeFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => codeFileInputRef.current?.click()}
            className="bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 p-2.5 sm:p-3 rounded-xl transition-all shrink-0 cursor-pointer"
            title={t.uploadFileTitle}
          >
            <Paperclip size={16} />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 p-2.5 sm:p-3 rounded-xl transition-all shrink-0 cursor-pointer"
            title={t.uploadImageTitle}
          >
            <ImageIcon size={16} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors min-w-0"
          />
          
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white p-2.5 sm:p-3 rounded-xl transition-all shrink-0 cursor-pointer shadow-md shadow-purple-600/30"
          >
            <Send size={16} className={isRtl ? "transform rotate-180" : ""} />
          </button>
        </form>
      </footer>
    </div>
  );
}