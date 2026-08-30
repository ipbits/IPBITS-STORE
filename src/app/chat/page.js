'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Loader2, Image as ImageIcon, 
  X, Paperclip, Globe, Check, Copy, Download, Code2 
} from 'lucide-react';

// مۆدێلێن بنەڕەتی
const DEFAULT_MODELS = [
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek V3 (🎁 بەلاش - تایبەت ب کۆد و دەقی)' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (🎁 بەلاش)' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (🎁 بەلاش - هزرکرن)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (🎁 بەلاش)' },
  { id: 'openai/gpt-4o-mini', name: 'ChatGPT 4o Mini (⚡)' },
  { id: 'anthropic/claude-3-5-haiku', name: 'Claude 3.5 Haiku (⚡)' },
  { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell (🎨 وێنە)' },
  { id: 'recraft-ai/recraft-20b', name: 'Recraft AI (🎨 وێنە)' }
];

const TRANSLATIONS = {
  ku: {
    welcome: 'سڵاڤ! ئەڤە پلاتفۆڕما IPBITS AI Hubە. هەر پرسیارەکا تە هەبیت بنڤیسە، وێنەیان بار بکە یان فایلێن کۆدی بهنێرە دا هاریکاریا تە بکەم.',
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
    errorConnection: 'خەلەتیەک د گرێدانێ دا چێبوو.'
  },
  ar: {
    welcome: 'مرحباً! هذه منصة IPBITS AI Hub. اكتب أي سؤال لديك، أو قم برفع الصور أو ملفات الأكواد البرمجية وسأقوم بمساعدتك فوراً.',
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
    errorConnection: 'حدث خطأ في الاتصال بالخادم.'
  },
  en: {
    welcome: 'Hello! Welcome to IPBITS AI Hub. Ask anything, upload images, or attach code files and I will assist you right away.',
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
    errorConnection: 'A network connection error occurred.'
  }
};

// کۆمپۆنێنتێ نیشاندانا کۆدی دگەل دوگمەیێن کۆپیکرن و داونلۆدکرنا فایلی
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
      case 'sh':
      case 'bash': return 'sh';
      default: return 'txt';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = getExtension(cleanLang);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
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
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition active:scale-95"
            title="Copy Code"
          >
            {copied ? <Check className="text-emerald-400" size={13} /> : <Copy size={13} />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 rounded-lg transition active:scale-95"
            title="Download as File"
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

// فەنکشنا جوداکرنا دەقی و کۆدان د ناڤ پەیامێ دا
function renderMessageContent(content) {
  if (typeof content !== 'string') return content;

  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
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
  const [lang, setLang] = useState('ku'); // 'ku' | 'ar' | 'en'
  const t = TRANSLATIONS[lang];
  const isRtl = lang !== 'en';

  const [messages, setMessages] = useState([
    { role: 'assistant', content: TRANSLATIONS.ku.welcome }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(DEFAULT_MODELS[0].id);
  const [modelsList, setModelsList] = useState(DEFAULT_MODELS);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const codeFileInputRef = useRef(null);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: TRANSLATIONS[newLang].welcome }]);
    }
  };

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          const sorted = data.data.sort((a, b) => {
            const aFree = a.id.includes(':free');
            const bFree = b.id.includes(':free');
            if (aFree && !bFree) return -1;
            if (!aFree && bFree) return 1;
            return a.name.localeCompare(b.name);
          });
          setModelsList(sorted);
        }
      })
      .catch((err) => {
        console.error('ئاریشە د بارکرنا مۆدێلان دا:', err);
      })
      .finally(() => {
        setLoadingModels(false);
      });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          model: model
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
      {/* هێدەرێ سەرەکی دگەل هەلبژارتنا مۆدێلی و زمانان */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-20 gap-2 w-full max-w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 shrink-0">
            <Sparkles className="text-purple-400" size={16} />
          </div>
          <span className="font-black text-xs sm:text-sm tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent truncate">
            IPBITS AI HUB
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* دوگمەیێن زمانان */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleLangChange('ku')}
              className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-lg transition-all ${
                lang === 'ku' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              کوردى
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('ar')}
              className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-lg transition-all ${
                lang === 'ar' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('en')}
              className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-lg transition-all ${
                lang === 'en' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* لیستا مۆدێلان */}
          {loadingModels ? (
            <div className="flex items-center gap-1 text-[11px] text-purple-300 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <Loader2 size={12} className="animate-spin text-purple-400" />
              <span>{t.loadingModels}</span>
            </div>
          ) : (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-[11px] sm:text-xs rounded-xl px-2 py-1.5 text-purple-300 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[120px] sm:max-w-xs truncate"
            >
              {modelsList.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name || m.id}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* بەشێ نامە و بەرسڤان */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 max-w-full ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'}`}>
              {m.role === 'user' ? (
                <User size={14} />
              ) : (
                <img src="/logo.png" alt="AI" className="w-4 h-4 object-contain" />
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
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-950/40 border border-purple-500/40 flex items-center justify-center shrink-0 overflow-hidden shadow-lg shadow-purple-900/30">
              <img 
                src="/logo.png" 
                alt="IPBITS AI" 
                className="w-5 h-5 object-contain animate-pulse" 
              />
            </div>

            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 rounded-2xl text-xs text-purple-300 flex items-center gap-2 shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
              </span>
              <span>{t.thinking}</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* فۆرمێ نڤیسینێ ل ژێرێ */}
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
              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-500 transition-colors"
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