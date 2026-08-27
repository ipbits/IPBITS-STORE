'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const MODELS = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (بێ بەرامبەر)' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (بێ بەرامبەر)' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder (بێ بەرامبەر)' }
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'سڵاڤ! ئەڤە پلاتفۆڕما IPBITS AI Hubە. هەر پرسیارەکا تە هەبیت بنڤیسە.' }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: model
        })
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
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
    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between" dir="rtl">
      <header className="border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20">
            <Sparkles className="text-purple-400" size={18} />
          </div>
          <span className="font-black text-lg tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            IPBITS AI HUB
          </span>
        </div>

        <div>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-3 py-2 text-purple-300 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </header>

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
              {m.content}
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

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پرسیارا خۆ ل ڤێرە بنڤیسە..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white p-3.5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-purple-600/30"
          >
            <Send size={18} className="transform rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
