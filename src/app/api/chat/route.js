import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, model } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ipbits.store",
        "X-Title": "IPBITS AI Hub",
      },
      body: JSON.stringify({
        model: model || "openai/gpt-4o-mini",
        messages: messages,
      })
    });

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0]?.message?.content || "ببورە، بەرسڤ نەهات." });
  } catch (error) {
    return NextResponse.json({ error: "ئاریشەیەک د پەیوەندیێ دا هەیە" }, { status: 500 });
  }
}