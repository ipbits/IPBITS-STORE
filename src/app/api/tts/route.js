import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { text, voiceId, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "پێدڤیە بکارهێنەر لۆگین بیت." }, { status: 401 });
    }

    const textLength = text.trim().length;

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
        { error: `باڵانسێ تە بەس نینە! پیتێن مای: ${profile.tts_characters_left}، پێدڤی ب: ${textLength}` },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const selectedVoice = voiceId || "pNInz6obpgDQGcFmaJgB"; // دەنگێ Adam

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

    // کێمکرنا پیتان ژ باڵانسێ بکارهێنەری
    await supabase
      .from('profiles')
      .update({ tts_characters_left: profile.tts_characters_left - textLength })
      .eq('id', userId);

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}