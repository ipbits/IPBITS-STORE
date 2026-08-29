import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "کلیلا ElevenLabs بەردەست نینە د سێرڤەری دا." }, { status: 500 });
    }

    const contentType = req.headers.get("content-type") || "";

    // ئەگەر فایل بیت (Speech-to-Speech یان Speech-to-Text)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const mode = formData.get("mode"); // sts or stt
      const userId = formData.get("userId");
      const file = formData.get("file");
      const voiceId = formData.get("voiceId") || "pNInz6obpgDQGcFmaJgB";

      if (!userId) {
        return NextResponse.json({ error: "پێدڤیە بکارهێنەر لۆگین بیت." }, { status: 401 });
      }

      if (!file) {
        return NextResponse.json({ error: "فایلا دەنگی نەهاتیە هەلبژارتن." }, { status: 400 });
      }

      // 1. گۆڕینا دەنگ بۆ دەنگ (Speech to Speech)
      if (mode === "sts") {
        const elevenFormData = new FormData();
        elevenFormData.append("audio", file);
        elevenFormData.append("model_id", "eleven_multilingual_sts_v2");

        const response = await fetch(
          `https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: { "xi-api-key": apiKey },
            body: elevenFormData,
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          return NextResponse.json({ error: errData.detail?.message || "کێشە د گۆڕینا دەنگ بۆ دەنگ دا هەیە" }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });
      }

      // 2. گۆڕینا دەنگ بۆ نڤیسین (Speech to Text)
      if (mode === "stt") {
        const sttFormData = new FormData();
        sttFormData.append("file", file);
        sttFormData.append("model_id", "scribe_v1");

        const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
          method: "POST",
          headers: { "xi-api-key": apiKey },
          body: sttFormData,
        });

        if (!response.ok) {
          const errData = await response.json();
          return NextResponse.json({ error: errData.detail?.message || "کێشە د گۆڕینا دەنگ بۆ نڤیسین دا هەیە" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });
      }
    }

    // ئەگەر دەق بیت (JSON) بۆ TTS یان Sound Effects
    const body = await req.json();
    const { mode, text, voiceId, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "پێدڤیە بکارهێنەر لۆگین بیت." }, { status: 401 });
    }

    const textLength = (text || "").trim().length;

    // پشکنینا باڵانسێ بکارهێنەری
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('tts_characters_left')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "هەژمار نەهاتە دیتن." }, { status: 404 });
    }

    if (profile.tts_characters_left < textLength) {
      return NextResponse.json(
        { error: `باڵانسێ تە بەس نینە! پیتێن ماین: ${profile.tts_characters_left}` },
        { status: 400 }
      );
    }

    // 3. Sound Effects (کاریگەریێن دەنگی)
    if (mode === "sfx") {
      const response = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          duration_seconds: 5,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        return NextResponse.json({ error: errData.detail?.message || "کێشە د دروستکرنا کاریگەریێن دەنگی دا هەیە" }, { status: response.status });
      }

      const audioBuffer = await response.arrayBuffer();
      return new Response(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });
    }

    // 4. Standart Text to Speech (TTS)
    const selectedVoice = voiceId || "pNInz6obpgDQGcFmaJgB";
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.8 },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json({ error: errData.detail?.message || "کێشە د ElevenLabs دا هەیە" }, { status: response.status });
    }

    // کێمکرنا پیتان
    await supabase
      .from('profiles')
      .update({ tts_characters_left: Math.max(0, profile.tts_characters_left - textLength) })
      .eq('id', userId);

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, { headers: { "Content-Type": "audio/mpeg" } });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}