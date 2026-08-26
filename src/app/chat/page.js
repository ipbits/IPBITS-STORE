'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const MODELS = [
  { id: 'openai/gpt-4o', name: 'ChatGPT 4o' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'x-ai/grok-2-1212', name: 'Grok 2' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' }
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
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'خەلەتییەک چێبوو د وەرگرتنا بەرسڤێ دا.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-[#0c1022]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-400" size={20} />
          <h1 className="font-bold text-white text-base">IPBITS AI HUB</h1>
        </div>
        
        {/* هەلبژارتنا مۆدێلان */}
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          className="bg-slate-900 border border-purple-500/40 text-purple-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
        >
          {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </header>

      {/* Messages View */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-purple-600' : 'bg-slate-800 border border-purple-500/30'}`}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-purple-400" />}
            </div>
            <div className={`p-3.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-purple-600/30 border border-purple-500/40 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-purple-400 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              چاڤەڕێ بە، ژیرییا دەستکرد یا دنڤیسیت...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Box */}
      <footer className="p-4 bg-[#0c1022]/80 border-t border-slate-800 sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="پرسیارا خۆ ل ڤێرە بنڤیسە..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 rounded-2xl flex items-center justify-center transition-all cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}