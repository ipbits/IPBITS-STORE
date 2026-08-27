import { NextResponse } from 'next/server';

function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>]/g, '').trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { 
      name, 
      phone, 
      address, 
      items, 
      totalPrice, 
      totalIQD, 
      paymentMethod, 
      transactionId, 
      image 
    } = body;

    name = sanitizeInput(name);
    phone = sanitizeInput(phone);
    address = sanitizeInput(address);
    paymentMethod = sanitizeInput(paymentMethod);
    transactionId = sanitizeInput(transactionId);

    // پشکنینا ناڤی
    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: 'تکایە ناڤەکێ دروست بنڤیسە.' }, { status: 400 });
    }

    // پشکنینا تەلەفۆنێ
    const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';
    const phoneRegex = /^[0-9+]{8,16}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ error: 'تکایە ژمارەکا تەلەفۆنێ یا دروست بنڤیسە.' }, { status: 400 });
    }

    // پشکنینا سەبەتێ
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return NextResponse.json({ error: 'سەبەتە یا بەتاڵە!' }, { status: 400 });
    }

    const finalPrice = totalIQD || totalPrice || 0;
    const itemsFormatted = Array.isArray(items) ? JSON.stringify(items) : String(items);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials missing');
      return NextResponse.json({ error: 'کلیلێن داتابەیسێ نەهاتینە دیتن.' }, { status: 500 });
    }

    // تۆمارکرن د Supabase ب ڕێکا REST API
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify([{
        customer_name: name,
        phone: cleanPhone,
        payment_method: paymentMethod || 'نەدیار',
        transaction_id: transactionId || 'نینە',
        items: itemsFormatted,
        total_price: Number(finalPrice) || 0,
        image_url: image ? (image.base64 || image) : null,
        created_at: new Date().toISOString()
      }])
    });

    if (!dbRes.ok) {
      const errText = await dbRes.text();
      console.error('Supabase Error:', errText);
      return NextResponse.json({ error: 'خەلەتیەک د تۆمارکرنا داخوازیێ دا ڕوویدا د داتابەیسێ دا.' }, { status: 500 });
    }

    // هنارتنا ئاگاداریێ بۆ تێلێگرامێ
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const message = `🛍️ *داخوازیەکا نوی گەهشت!*\n\n` +
        `👤 *ناڤ:* ${name}\n` +
        `📞 *تەلەفۆن:* ${cleanPhone}\n` +
        `💳 *ڕێکا پارەدانێ:* ${paymentMethod || 'نەدیار'}\n` +
        `🔢 *کۆدێ وەصڵێ:* ${transactionId || 'نینە'}\n` +
        `💰 *کۆمێ پارەی:* ${finalPrice.toLocaleString ? finalPrice.toLocaleString() : finalPrice} IQD\n` +
        `📦 *بەرهەم:* ${Array.isArray(items) ? items.length : 1} دانە`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      } catch (tgError) {
        console.error('Telegram notification error:', tgError);
      }
    }

    return NextResponse.json({ success: true, message: 'داخوازی ب سەرکەفتیانە هاتە تۆمارکرن.' }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'خەلەتیەک د سێرڤەری دا ڕوویدا.' }, { status: 500 });
  }
}