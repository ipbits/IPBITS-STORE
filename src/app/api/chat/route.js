import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, model } = await req.json();

    // وەرگرتنا دووماهیک پەیاما بەکارهێنەری
    const lastMessage = messages[messages.length - 1]?.content;
    let promptText = '';

    if (typeof lastMessage === 'string') {
      promptText = lastMessage;
    } else if (Array.isArray(lastMessage)) {
      const textPart = lastMessage.find(p => p.type === 'text');
      promptText = textPart?.text || '';
    }

    const lowerText = promptText.toLowerCase();

    // پشکنین: ئەرێ داخوازی بۆ دروستکرنا وێنەی یە یان مۆدێلێ Flux/Recraft یە؟
    const isImageModel = model?.includes('flux') || model?.includes('recraft');
    const hasImageKeyword = 
      lowerText.includes('وێنە') || 
      lowerText.includes('چێکە') || 
      lowerText.includes('صورة') || 
      lowerText.includes('رسم') || 
      lowerText.includes('image') || 
      lowerText.includes('photo') || 
      lowerText.includes('draw') || 
      lowerText.includes('generate');

    // ئەگەر داخوازییا وێنەی بیت، ئێکسەر وێنەی ب مۆدێلێ Flux چێکە
    if (isImageModel || (hasImageKeyword && !lowerText.includes('شیکار'))) {
      const cleanPrompt = encodeURIComponent(
        promptText.replace(/وێنە|چێکە|photo|image|draw|generate|picture|بۆ من|صورة|رسم/gi, '').trim() || 'beautiful high quality aesthetic wallpaper'
      );
      
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true&model=flux`;

      return NextResponse.json({ 
        reply: `![AI Image](${generatedImageUrl})` 
      });
    }

    // بۆ چات و شیکاریا ئاسایی، پەیوەندیێ ب OpenRouter بکە
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "کلیلا API یا ئامادە نینە د سێرڤەری دا" },
        { status: 500 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
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
      console.error("OpenRouter API Error:", data);
      const errMsg = data.error?.message || "ئاریشەیەک د سێرڤەرێ OpenRouter دا هەیە";
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const reply = data.choices?.[0]?.message?.content || "بەرسڤەک نەهاتە وەرگرتن.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat Catch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}