import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, model } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY || "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";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ipbits.store",
        "X-Title": "IPBITS AI Hub",
      },
      body: JSON.stringify({
        model: model || "google/gemini-2.0-flash-001",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API Error:", data);
      return NextResponse.json({ error: data.error?.message || "ئاریشەیەک د OpenRouter دا هەیە" }, { status: response.status });
    }

    const reply = data.choices?.[0]?.message?.content || "بەرسڤەک نەهاتە وەرگرتن.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat Route Error:", error);
    return NextResponse.json({ error: "خەلەتیەک د سێرڤەری دا چێبوو" }, { status: 500 });
  }
}