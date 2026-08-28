import { NextResponse } from 'next/server';

// لینکێ Google Apps Script بۆ تۆمارکرنا د شیتێ دا
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6cPrMaQLa-3W5opaOCN8Scq5DS-OBUIM1wIzjS7oVS9JYk9EdGvYvLY-EWgCjb7j3/exec';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      phone, 
      items, 
      totalIQD, 
      totalPrice, 
      totalUSD, 
      paymentMethod, 
      transactionId, 
      image 
    } = body;

    const finalIQD = Number(totalIQD || totalPrice || 0);
    const cleanPhone = phone ? String(phone).replace(/\s+/g, '') : '';
    const itemsFormatted = Array.isArray(items) 
      ? items.map(i => `${i.name || i.title || 'بەرهەم'} (x${i.quantity || 1})`).join(', ') 
      : String(items || '');

    // ١. ئامادەکرنا بۆتێ تێلیگرامێ
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "8722719386:AAFLmuHmBOrAQmQ8sOC8nGRPwBippcwRfjk";
    const chatId = process.env.TELEGRAM_CHAT_ID || "5305335340";

    if (botToken && chatId) {
      const tgText = `👑 *ئۆفەرا ژیرییا دەستکرد هاتە کڕین (IPBITS STORE)*\n\n` +
        `👤 *ناڤ:* ${name || 'نەدیار'}\n` +
        `📱 *واتساپ:* ${cleanPhone || 'نینە'}\n` +
        `📦 *پشکداری:* ${itemsFormatted}\n` +
        `💰 *بڕێ پارەی:* ${finalIQD.toLocaleString()} IQD\n` +
        `💳 *ڕێکا پارەدانێ:* ${paymentMethod || 'نەدیار'}\n` +
        `🧾 *کۆدێ وەسڵێ:* \`${transactionId || 'نینە'}\``;

      try {
        // ئەگەر وێنەیێ وەسڵێ هەبیت، ب وێنە فرێکە تێلیگرامێ
        if (image?.base64) {
          const buffer = Buffer.from(image.base64, 'base64');
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', tgText);
          formData.append('parse_mode', 'Markdown');
          formData.append('photo', new Blob([buffer], { type: image.type || 'image/jpeg' }), 'receipt.jpg');

          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });
        } else {
          // ئەگەر وێنە نەبیت تنێ دەقێ بنێرە
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: tgText,
              parse_mode: 'Markdown'
            })
          });
        }
      } catch (tgErr) {
        console.error('Telegram Error:', tgErr);
      }
    }

    // ٢. فرێکرن بۆ Google Apps Script (بۆ گووگڵ شیت و درایڤ)
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: name || '',
          phone: cleanPhone || '',
          items: itemsFormatted,
          totalIQD: finalIQD,
          totalUSD: totalUSD || '',
          paymentMethod: paymentMethod || 'نەدیار',
          transactionId: transactionId || 'نینە',
          image: image || null
        }),
        redirect: 'follow'
      });
    } catch (sheetErr) {
      console.error('Google Sheet Error:', sheetErr);
    }

    return NextResponse.json({ success: true, message: 'داخوازی ب سەرکەفتیانە گەهشت' }, { status: 200 });

  } catch (error) {
    console.error('Order Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}