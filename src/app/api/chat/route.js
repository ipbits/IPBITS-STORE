import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// گرێدان ب داتابەیسا Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  try {
    const { messages, model, userEmail } = await req.json();

    // ١. ئینانا خۆکار یا کلیلا وی کڕیاری ژ تابلۆیێ profiles
    let activeApiKey = process.env.OPENROUTER_API_KEY;

    if (userEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('api_key')
        .eq('email', userEmail)
        .single();

      if (profile?.api_key) {
        activeApiKey = profile.api_key;
      }
    }

    if (!activeApiKey) {
      return NextResponse.json(
        { error: "چو کلیلا چالاک بۆ ڤی بەکارهێنەری نەهاتە دیتن." },
        { status: 400 }
      );
    }

    // ٢. پشکنینا دروستکرنا وێنەیان
    const lastMessage = messages[messages.length - 1]?.content;
    let promptText = '';

    if (typeof lastMessage === 'string') {
      promptText = lastMessage;
    } else if (Array.isArray(lastMessage)) {
      const textPart = lastMessage.find(p => p.type === 'text');
      promptText = textPart?.text || '';
    }

    const lowerText = promptText.toLowerCase();
    const isImageModel = model?.includes('flux') || model?.includes('recraft');
    const hasImageKeyword = 
      lowerText.includes('وێنە') || 
      lowerText.includes('چێکە') || 
      lowerText.includes('صورة') || 
      lowerText.includes('image') || 
      lowerText.includes('photo');

    if (isImageModel || (hasImageKeyword && !lowerText.includes('شیکار'))) {
      const cleanPrompt = encodeURIComponent(
        promptText.replace(/وێنە|چێکە|photo|image|draw|generate|picture|بۆ من|صورة/gi, '').trim() || 'beautiful scenery'
      );
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true&model=flux`;

      return NextResponse.json({ reply: `![AI Image](${generatedImageUrl})` });
    }

    // ٣. هنارتنا پرسیارێ ب کلیلا تایبەت یا وی کڕیاری بۆ OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${activeApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ipbits.store",
        "X-Title": "IPBITS AI Hub",
      },
      body: JSON.stringify({
        model: model || "openai/gpt-4o-mini",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || "ئاریشەیەک هەیە د کلیلێ یان باڵانسی دا";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const reply = data.choices?.[0]?.message?.content || "بەرسڤ نەهات.";
    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}