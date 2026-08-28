'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Image as ImageIcon, X } from 'lucide-react';

// مۆدێلێن بنەڕەتی هەتا لیستا مەزن بار دبیت
const DEFAULT_MODELS = [
  // مۆدێلێن دروستکرنا وێنەیان
  { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell (دروستکرنا وێنەی 🎨)' },
  { id: 'recraft-ai/recraft-20b', name: 'Recraft AI (دیزاین و وێنە 🎨)' },

  // مۆدێلێن چات و شیکاریا وێنەیان
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (🎁 وێنە + بەلاش)' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (🎁 بەلاش)' },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek V3 (🎁 بەلاش)' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (🎁 بەلاش)' },
  { id: 'openai/gpt-4o-mini', name: 'ChatGPT 4o Mini (وێنە ⚡)' },
  { id: 'anthropic/claude-3-5-haiku', name: 'Claude 3.5 Haiku (وێنە ⚡)' }
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'سڵاڤ! ئەڤە پلاتفۆڕما IPBITS AI Hubە. هەر پرسیارەکا تە هەبیت بنڤیسە یان وێنەیان بار بکە.' }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(DEFAULT_MODELS[0].id);
  const [modelsList, setModelsList] = useState(DEFAULT_MODELS);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // ئینانا هەمی مۆدێلێن OpenRouter ب ئۆتۆماتیکی (پتر ژ ١٠٠ مۆدێلان)
  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && data.data.length > 0) {
          // رێزبەندیکرن: مۆدێلێن بەلاش (:free) دێ هێنە سەرێ لیستێ
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

  // وەرگرتن و گوهۆڕینا وێنەی بۆ Base64
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
      // ئامادەکرنا فۆرماتا پەیامان بۆ مۆدێلێن دەق و وێنەیان (Multi-modal)
      const apiMessages = newMessages.map(m => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || 'ڤی وێنەی شیکار بکە:' },
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
        setMessages(prev => [...prev, { role: 'assistant', content: 'ببورە، ئاریشەیەک چێبوو: ' + (data.error || 'پەیوەندی دروست نەبوو') }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'خەلەتیەک د گرێدانێ دا چێبوو.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between font-sans" dir="rtl">
      
      {/* سەرێ لاپەڕی */}
      <header className="border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <Sparkles className="text-purple-400" size={18} />
          </div>
          <span className="font-black text-lg tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            IPBITS AI HUB
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loadingModels ? (
            <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
              <Loader2 size={13} className="animate-spin text-purple-400" />
              <span>مۆدێل دهێنە بارکرن...</span>
            </div>
          ) : (
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-purple-300 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[220px] sm:max-w-xs truncate"
            >
              {modelsList.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {m.name || m.id} {m.id.includes(':free') ? '🎁 (بەلاش)' : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {/* ناڤەرۆکا چاتێ */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-purple-600' : 'bg-slate-800 border border-slate-700'}`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-purple-400" />}
            </div>
            
            <div
              className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {/* پیشاندانا وێنەیێ هاتیە بارکرن ژ لایێ بەکارهێنەری */}
              {m.image && (
                <img 
                  src={m.image} 
                  alt="Uploaded Asset" 
                  className="max-w-xs max-h-60 rounded-xl mb-2.5 border border-purple-400/30 object-cover" 
                />
              )}

              {/* پیشاندانا وێنەیێ زیرەکیا دەستکرد دروستکری */}
              {typeof m.content === 'string' && (m.content.includes('![AI Image]') || m.content.includes('image.pollinations.ai') || m.content.startsWith('http://') || m.content.startsWith('https://')) && (m.content.includes('.jpg') || m.content.includes('.png') || m.content.includes('pollinations.ai')) ? (
                <div className="space-y-2">
                  <img 
                    src={m.content.replace('![AI Image](', '').replace(')', '').trim()} 
                    alt="AI Generated" 
                    className="rounded-2xl max-w-sm w-full border border-purple-500 shadow-xl object-cover" 
                  />
                  <span className="text-[10px] text-purple-300 block">✨ وێنە ب سەرکەفتی هاتە دروستکرن</span>
                </div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-purple-400 animate-pulse" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
              ل هزرکرنێ دایە...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* جهێ نڤیسینێ و بارکرنا وێنەی */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        
        {/* نیشاندانا وێنەیێ هەلبژارتی بەرامبەر شاشێ بەری فرێکرنێ */}
        {selectedImage && (
          <div className="max-w-4xl mx-auto mb-2 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-16 w-16 object-cover rounded-xl border-2 border-purple-500 shadow-md" 
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
          
          {/* دوگمەیا بارکرنا وێنەی */}
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
            className="bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 p-3.5 rounded-2xl transition-all cursor-pointer hover:border-purple-500/50"
            title="بارکرنا وێنەی"
          >
            <ImageIcon size={18} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پرسیارا خۆ بنڤیسە یان داخوازییا وێنەی بکە..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          
          <button
            type="submit"
            disabled={(!input.trim() && !selectedImage) || loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white p-3.5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-purple-600/30"
          >
            <Send size={18} className="transform rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
}