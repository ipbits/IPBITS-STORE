import { NextResponse } from 'next/server';

function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>]/g, '').trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { name, phone, address, items, totalPrice } = body;

    name = sanitizeInput(name);
    phone = sanitizeInput(phone);
    address = sanitizeInput(address);

    if (!name || name.length < 3 || name.length > 50) {
      return NextResponse.json({ error: 'تکایە ناڤەکێ دروست بنڤیسە.' }, { status: 400 });
    }

    const phoneRegex = /^[0-9+]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json({ error: 'تکایە ژمارەکا تەلەفۆنێ یا دروست بنڤیسە.' }, { status: 400 });
    }

    if (!address || address.length < 5 || address.length > 150) {
      return NextResponse.json({ error: 'تکایە ناڤونیشانەکێ دروست بنڤیسە.' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'سەبەتە یا بەتاڵە!' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // تۆمارکرنا داتایێ ب ڕێکا فەرمی یا REST API بێ پاکێج
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([{
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        items: items,
        total_price: totalPrice,
        created_at: new Date().toISOString()
      }])
    });

    if (!dbRes.ok) {
      const errText = await dbRes.text();
      console.error('Supabase Error:', errText);
      return NextResponse.json({ error: 'خەلەتیەک د تۆمارکرنا داخوازیێ دا ڕوویدا.' }, { status: 500 });
    }

    // هنارتنا ئاگاداریێ بۆ تێلێگرامێ
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

    return NextResponse.json({ success: true, message: 'داخوازی ب سەرکەفتیانە هاتە تۆمارکرن.' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'خەلەتیەک د سێرڤەری دا ڕوویدا.' }, { status: 500 });
  }
}