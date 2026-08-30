import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { code, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "پێدڤیە پێشتر لۆگین بی." }, { status: 401 });
    }

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "تکایە کۆدێ کلیلێ بنڤیسە." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // ١. پشکنینا دروستییا کۆدی د داتابەیسێ دا
    const { data: card, error: cardErr } = await supabase
      .from('redeem_codes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (cardErr || !card) {
      return NextResponse.json({ error: "ئەڤ کۆدە خەلەتە و بوونی نینە!" }, { status: 404 });
    }

    if (card.is_used) {
      return NextResponse.json({ error: "ئەڤ کۆدە بەرێ هاتییە بکارئینان!" }, { status: 400 });
    }

    // ٢. وەرگرتنا باڵانسێ نوکە یێ بکارهێنەری
    const { data: profile } = await supabase
      .from('profiles')
      .select('tts_characters_left')
      .eq('id', userId)
      .single();

    const currentBalance = profile?.tts_characters_left || 0;
    const newBalance = currentBalance + card.characters;

    // ٣. زێدەکرنا باڵانسی بۆ بکارهێنەری
    await supabase
      .from('profiles')
      .update({ tts_characters_left: newBalance })
      .eq('id', userId);

    // ٤. سوتاندن و قفڵکرنا کۆدی دا دووبارە نەهێتە بکارئینان
    await supabase
      .from('redeem_codes')
      .update({
        is_used: true,
        used_by: userId,
      })
      .eq('id', card.id);

    return NextResponse.json({
      success: true,
      addedCharacters: card.characters,
      newTotal: newBalance,
      message: `ب سەرکەفتیانە ${card.characters.toLocaleString()} پیت هاتنە زێدەکرن بۆ ئەکاونتێ تە!`,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}