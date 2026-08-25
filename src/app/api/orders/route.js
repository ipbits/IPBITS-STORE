import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// فلتەرکرنا تێکستێ زیانبەخش و ژێبرنا تاگێن HTML/Script
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // لادانا نیشانێن HTML
    .trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { name, phone, address, items, totalPrice } = body;

    // ١. پاکژکرنا داتایان
    name = sanitizeInput(name);
    phone = sanitizeInput(phone);
    address = sanitizeInput(address);

    // ٢. پشکنینا ناڤی (پێدڤیە د ناڤبەرا ٣ تا ٥٠ پیتان بیت)
    if (!name || name.length < 3 || name.length > 50) {
      return NextResponse.json(
        { error: 'تکایە ناڤەکێ دروست بنڤیسە (د ناڤبەرا ٣ تا ٥٠ پیتان).' },
        { status: 400 }
      );
    }

    // ٣. پشکنینا ژمارە تەلەفۆنێ (پێدڤیە تنێ ژمارە بیت و د ناڤبەرا ١٠ تا ١٥ ژمارە بیت)
    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { error: 'تکایە ژمارەکا تەلەفۆنێ یا دروست بنڤیسە.' },
        { status: 400 }
      );
    }

    // ٤. پشکنینا ناڤونیشانی (پێدڤیە د ناڤبەرا ٥ تا ١٥٠ پیتان بیت)
    if (!address || address.length < 5 || address.length > 150) {
      return NextResponse.json(
        { error: 'تکایە ناڤونیشانەکێ دروست و تەمام بنڤیسە.' },
        { status: 400 }
      );
    }

    // ٥. پشکنینا سەبەتەیێ (Cart Items)
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'سەبەتە یا بەتاڵە!' },
        { status: 400 }
      );
    }

    // ٦. تۆمارکرن د داتابەیسا Supabase دا
    const { data: orderData, error: dbError } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          items: items,
          total_price: totalPrice,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json(
        { error: 'خەلەتیەک د تۆمارکرنا داخوازیێ دا ڕوویدا.' },
        { status: 500 }
      );
    }

    // ٧. هنارتنا ئاگاداریێ بۆ تێلێگرامێ (ئەگەر کلیل هەبن)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const message = `🛍️ *داخوازیەکا نوی گەهشت!*\n\n` +
        `👤 *ناڤ:* ${name}\n` +
        `📞 *تەلەفۆن:* ${phone}\n` +
        `📍 *ناڤونیشان:* ${address}\n` +
        `💰 *کۆمێ پارەی:* ${totalPrice || 0}\n` +
        `📦 *بەرهەم:* ${items.length} دانە`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return NextResponse.json(
      { success: true, message: 'داخوازی ب سەرکەفتیانە هاتە تۆمارکرن.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'خەلەتیەک د سێرڤەری دا ڕوویدا.' },
      { status: 500 }
    );
  }
}