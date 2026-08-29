'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Volume2, Sparkles, AlertCircle, Play, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const VOICES = [
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (دەنگێ زەلامی - هێمن و فەرمی)' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (دەنگێ ژنێ - نەرم و ڕوون)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (دەنگێ گەنجی - پڕ ووزە)' },
];

export default function TTSPage() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState('');
  const [charsLeft, setCharsLeft] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('tts_characters_left')
          .eq('id', session.user.id)
          .single();
        if (profile) setCharsLeft(profile.tts_characters_left);
      }
    }
    fetchUserData();
  }, []);

  const handleGenerateVoice = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setAudioUrl(null);

    if (!user) {
      setError('تکایە پێشتر لۆگین بە دا بشێی دەنگی دروست بکەی.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: selectedVoice,
          userId: user.id,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'ئاریشەیەک چێبوو');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setCharsLeft((prev) => (prev !== null ? prev - text.trim().length : prev));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/20">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">گۆڕینا تێکستی بۆ دەنگ (AI Voice)</h1>
              <p className="text-xs text-zinc-400">ب هێزا زیرەکییا دەستکرد یا ElevenLabs</p>
            </div>
          </div>
          {charsLeft !== null && (
            <div className="bg-zinc-800/80 border border-zinc-700/50 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300">
              پیتێن ماین: <span className="text-white font-bold">{charsLeft}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">هەلبژارتنا دەنگی:</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-purple-500 transition"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <label className="font-medium text-zinc-300">نڤیسینا تە:</label>
            <span>{text.length} پیت</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ئەو دەقێ تە دڤێت ببیتە دەنگ ل ڤێرێ بنڤیسە..."
            className="w-full h-36 p-4 bg-zinc-800/60 border border-zinc-700/60 rounded-2xl text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none text-sm leading-relaxed"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerateVoice}
          disabled={loading || !text.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-2xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>دروستکرنا دەنگی...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>دروستکرنا دەنگی</span>
            </>
          )}
        </button>

        {audioUrl && (
          <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-2xl space-y-2 animate-fade-in">
            <p className="text-xs text-purple-300 font-medium">دەنگێ تە ئامادەیە:</p>
            <audio controls src={audioUrl} className="w-full h-10 accent-purple-500" autoPlay />
          </div>
        )}

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1">
            <span>زڤڕین بۆ لاپەڕێ سەرەکی</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}