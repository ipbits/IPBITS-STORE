import { NextResponse } from 'next/server';

// لینکێ وێب ئەپا تە یا Google Apps Script ل ڤێرە دانێ
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

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

    // پشکنینا ناڤ و تەلەفۆنێ
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'تکایە ناڤەکێ دروست بنڤیسە.' }, { status: 400 });
    }

    const cleanPhone = phone ? phone.replace(/\s+/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 8) {
      return NextResponse.json({ error: 'تکایە ژمارەکا تەلەفۆنێ یا دروست بنڤیسە.' }, { status: 400 });
    }

    const finalIQD = Number(totalIQD || totalPrice || 0);

    // ١. فرێکرنا داتایێ ب تەمامی بۆ Google Apps Script
    if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
      const payload = {
        name: name.trim(),
        phone: cleanPhone,
        items: items,
        totalIQD: finalIQD,
        totalUSD: totalUSD || '',
        paymentMethod: paymentMethod || 'نەدیار',
        transactionId: transactionId || 'نینە',
        image: image || null,
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Baghdad" })
      };

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (scriptErr) {
        console.error('Apps Script Fetch Error:', scriptErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'داخوازی ب سەرکەفتیانە هاتە تۆمارکرن.' 
    }, { status: 200 });

  } catch (error) {
    console.error('Order Route Error:', error);
    return NextResponse.json({ error: 'خەلەتیەک د سێرڤەری دا ڕوویدا.' }, { status: 500 });
  }
}