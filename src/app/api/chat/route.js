import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, model } = await req.json();

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