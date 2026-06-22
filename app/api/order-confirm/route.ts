import { NextRequest, NextResponse } from 'next/server';
import { sendMetaServerEvent } from '@/lib/meta-capi-server';

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

interface OrderItem {
  name: string;
  qty: number;
  price: string;
  size?: string;
  color?: string;
}

interface OrderConfirmPayload {
  phone: string;
  items: OrderItem[];
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  purchaseEventId?: string;
}

async function sendTelegramMessage(text: string): Promise<void> {
  const res = await fetch(
    `https://api.telegram.org/bot${requireEnv('TELEGRAM_BOT_TOKEN')}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: requireEnv('TELEGRAM_CHAT_ID'),
        text,
        parse_mode: 'HTML',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error('Telegram error:', JSON.stringify(err));
    throw new Error('Failed to send Telegram message');
  }
}

export async function POST(req: NextRequest) {
  let body: OrderConfirmPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { phone, items, itemsPrice, shippingPrice, totalPrice, purchaseEventId } = body;

  if (!phone || !items || items.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const itemLines = items
    .map((item) => {
      const variants = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
        .filter(Boolean)
        .join(', ');
      return `  • ${item.name}${variants ? ` (${variants})` : ''} × ${item.qty} — $${(Number(item.price) * item.qty).toFixed(2)}`;
    })
    .join('\n');

  const text = [
    '🛒 <b>New Order Confirmed!</b>',
    '',
    `📞 <b>Phone:</b> ${phone}`,
    `🕐 <b>Time:</b> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })}`,
    '',
    '<b>Items:</b>',
    itemLines,
    '',
    `💰 Subtotal: $${itemsPrice}`,
    `🚚 Shipping: $${shippingPrice}`,
    `✅ <b>Total: $${totalPrice}</b>`,
  ].join('\n');

  try {
    await sendTelegramMessage(text);

    // Call Meta CAPI Purchase event server-side
    if (purchaseEventId) {
      const clientIpAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
      const clientUserAgent = req.headers.get('user-agent') || '';
      const fbp = req.cookies.get('_fbp')?.value;
      const fbc = req.cookies.get('_fbc')?.value;
      const referer = req.headers.get('referer') || '';

      sendMetaServerEvent({
        eventName: 'Purchase',
        eventId: purchaseEventId,
        eventSourceUrl: referer,
        clientIpAddress,
        clientUserAgent,
        fbp,
        fbc,
        phone,
        customData: {
          currency: 'USD',
          value: Number(totalPrice),
          content_type: 'product',
          contents: items.map(item => ({
            title: item.name,
            quantity: item.qty,
            item_price: Number(item.price),
          })),
        },
      }).catch(err => {
        console.error('[Order Confirm API] Meta CAPI Purchase dispatch failed:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Order confirm error:', err);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
