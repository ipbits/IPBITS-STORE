'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Volume2, Mic, FileText, Sparkles, AlertCircle, 
  Download, Loader2, ArrowRight, UploadCloud, Radio 
} from 'lucide-react';
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

export default function VoiceHubPage() {
  const [activeTab, setActiveTab] = useState('tts'); // 'tts' | 'sts' | 'stt' | 'sfx'
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [sttResult, setSttResult] = useState('');
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

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setAudioUrl(null);
    setSttResult('');

    if (!user) {
      setError('تکایە پێشتر لۆگین بە.');
      setLoading(false);
      return;
    }

    try {
      // ئەگەر Speech to Speech یان Speech to Text بیت
      if (activeTab === 'sts' || activeTab === 'stt') {
        if (!file) throw new Error('تکایە فایلەکا دەنگی هەلبژێرە.');

        const formData = new FormData();
        formData.append('mode', activeTab);
        formData.append('file', file);
        formData.append('userId', user.id);
        formData.append('voiceId', selectedVoice);

        const res = await fetch('/api/tts', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || 'ئاریشەیەک چێبوو');
        }

        if (activeTab === 'stt') {
          const data = await res.json();
          setSttResult(data.text);
        } else {
          const blob = await res.blob();
          setAudioUrl(URL.createObjectURL(blob));
        }
      } 
      // ئەگەر TTS یان Sound Effects بیت
      else {
        if (!text.trim()) throw new Error('تکایە دەقەکێ بنڤیسە.');

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: activeTab,
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
        setAudioUrl(URL.createObjectURL(blob));

        if (activeTab === 'tts') {
          setCharsLeft((prev) => (prev !== null ? Math.max(0, prev - text.trim().length) : prev));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* سەردێڕ و باڵانس */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl border border-purple-500/20">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">دەنگ و زیرەکییا دەستکرد (AI Voice Studio)</h1>
              <p className="text-xs text-zinc-400">هەمى خزمەتگوزاریێن دەنگی ل ئێک جهـ</p>
            </div>
          </div>
          {charsLeft !== null && (
            <div className="bg-zinc-800/90 border border-zinc-700/60 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300">
              پیتێن ماین: <span className="text-white font-bold">{charsLeft}</span>
            </div>
          )}
        </div>

        {/* تابێن خزمەتگوزاریان */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-zinc-950/60 p-1.5 rounded-2xl border border-zinc-800/80">
          <button
            onClick={() => { setActiveTab('tts'); setError(''); setAudioUrl(null); setSttResult(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'tts' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>دەق بۆ دەنگ</span>
          </button>

          <button
            onClick={() => { setActiveTab('sts'); setError(''); setAudioUrl(null); setSttResult(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'sts' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>دەنگ بۆ دەنگ</span>
          </button>

          <button
            onClick={() => { setActiveTab('stt'); setError(''); setAudioUrl(null); setSttResult(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'stt' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>دەنگ بۆ نڤیسین</span>
          </button>

          <button
            onClick={() => { setActiveTab('sfx'); setError(''); setAudioUrl(null); setSttResult(''); }}
            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'sfx' ? 'bg-purple-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sound Effects</span>
          </button>
        </div>

        {/* هەلبژارتنا دەنگی (بۆ TTS و STS) */}
        {(activeTab === 'tts' || activeTab === 'sts') && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">هەلبژارتنا دەنگێ AI:</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 outline-none focus:border-purple-500 transition"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* بەشێ نڤیسینێ (بۆ TTS و SFX) */}
        {(activeTab === 'tts' || activeTab === 'sfx') && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <label className="font-medium text-zinc-300">
                {activeTab === 'tts' ? 'نڤیسینا تە:' : 'وەسفا کاریگەریا دەنگی بنڤیسە (ب ئینگلیزی باشترە):'}
              </label>
              {activeTab === 'tts' && <span>{text.length} پیت</span>}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                activeTab === 'tts'
                  ? 'ئەو دەقێ تە دڤێت ببیتە دەنگ ل ڤێرێ بنڤیسە...'
                  : 'بۆ نموونە: cinematic car explosion in the rain'
              }
              className="w-full h-32 p-3.5 bg-zinc-800/60 border border-zinc-700/60 rounded-2xl text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none text-xs leading-relaxed"
            />
          </div>
        )}

        {/* بەشێ بارکرنا فایلێ دەنگی (بۆ STS و STT) */}
        {(activeTab === 'sts' || activeTab === 'stt') && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">فایلا دەنگی باربکە (MP3, WAV, M4A):</label>
            <div className="border-2 border-dashed border-zinc-700 hover:border-purple-500/60 rounded-2xl p-6 text-center cursor-pointer bg-zinc-800/40 transition">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="w-8 h-8 text-purple-400" />
                <span className="text-xs text-zinc-300 font-medium">
                  {file ? file.name : 'کلیکێ ل ڤێرێ بکە بۆ هەلبژارتنا فایلا دەنگی'}
                </span>
                <span className="text-[10px] text-zinc-500">حەجما فایلێ بلا کێمتر ژ 10MB بیت</span>
              </label>
            </div>
          </div>
        )}

        {/* پەیاما خەلەتیێ */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* دوگما سەرەکی */}
        <button
          onClick={handleProcess}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-2xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 text-xs transition active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جێبەجێکرن...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>دەستپێکرن و دروستکرن</span>
            </>
          )}
        </button>

        {/* بەرسڤا دەنگ بۆ نڤیسین (STT) */}
        {sttResult && (
          <div className="p-4 bg-zinc-800/80 border border-zinc-700/60 rounded-2xl space-y-2">
            <p className="text-xs text-purple-300 font-medium">نڤیسینا هاتە وەرگرتن ژ دەنگی:</p>
            <p className="text-xs text-zinc-200 bg-zinc-900/90 p-3 rounded-xl leading-relaxed border border-zinc-800 select-all">
              {sttResult}
            </p>
          </div>
        )}

        {/* پلەیەرێ دەنگی دگەل دوگمەیا داونلۆد (Download MP3) */}
        {audioUrl && (
          <div className="p-4 bg-purple-950/40 border border-purple-800/40 rounded-2xl space-y-3 animate-fade-in">
            <p className="text-xs text-purple-300 font-medium">دەنگێ تە ئامادەیە:</p>
            <audio controls src={audioUrl} className="w-full h-10 accent-purple-500" autoPlay />
            
            <a
              href={audioUrl}
              download={`ipbits-${activeTab}-${Date.now()}.mp3`}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>داونلۆدکرنا فایلا دەنگی (Download MP3)</span>
            </a>
          </div>
        )}

        {/* زڤڕین بۆ سەرەکی */}
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