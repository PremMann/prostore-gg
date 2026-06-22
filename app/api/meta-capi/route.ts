import { NextRequest, NextResponse } from 'next/server';
import { sendMetaServerEvent } from '@/lib/meta-capi-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, eventId, eventSourceUrl, customData, userParams } = body;

    if (!eventName || !eventId) {
      return NextResponse.json({ success: false, error: 'Missing eventName or eventId' }, { status: 400 });
    }

    // Capture standard headers for Conversions API requirements
    const clientIpAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    const clientUserAgent = req.headers.get('user-agent') || '';
    
    // Extract first party cookies
    const fbp = req.cookies.get('_fbp')?.value || userParams?.fbp;
    const fbc = req.cookies.get('_fbc')?.value || userParams?.fbc;

    const result = await sendMetaServerEvent({
      eventName,
      eventId,
      eventSourceUrl,
      clientIpAddress,
      clientUserAgent,
      fbp,
      fbc,
      phone: userParams?.phone,
      email: userParams?.email,
      customData,
    });

    return NextResponse.json(result);
  } catch (error) {
    const err = error as Error;
    console.error('[Meta CAPI Route Handler Error]:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
