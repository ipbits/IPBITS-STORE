import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    // لینکێ فەرمی یێ Google Sheets یێ تە فرێکری
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz6cPrMaQLa-3W5opaOCN8Scq5DS-OBUIM1wIzjS7oVS9JYk9EdGvYvLY-EWgCjb7j3/exec";

    const response = await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Baghdad' }),
        name: data.name,
        phone: data.phone,
        items: data.items,
        totalIQD: data.totalIQD,
        totalUSD: data.totalUSD,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
      }),
    });

    const result = await response.json();

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error('Error submitting order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}