import crypto from 'crypto';

interface ServerEventParams {
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  phone?: string;
  email?: string;
  customData?: Record<string, unknown>;
}

/**
 * Clean phone number to digits only, adding Cambodian country code if necessary
 */
function cleanPhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length >= 9) {
    return '855' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Hash values using SHA-256 for Meta API requirements
 */
function sha256(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex');
}

/**
 * Sends a server-side Conversions API event to Meta Graph API
 */
export async function sendMetaServerEvent({
  eventName,
  eventId,
  eventSourceUrl,
  clientIpAddress,
  clientUserAgent,
  fbp,
  fbc,
  phone,
  email,
  customData,
}: ServerEventParams) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '995516453117684';
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('[Meta CAPI] META_ACCESS_TOKEN is not configured. Skipping server event:', eventName);
    return { success: true, warning: 'META_ACCESS_TOKEN not configured' };
  }

  const userData: Record<string, unknown> = {
    client_ip_address: clientIpAddress || '127.0.0.1',
    client_user_agent: clientUserAgent || '',
  };

  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const formattedPhone = cleanPhone(phone);
  const hashedPhone = sha256(formattedPhone);
  if (hashedPhone) userData.ph = hashedPhone;

  const hashedEmail = sha256(email);
  if (hashedEmail) userData.em = hashedEmail;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: customData,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    console.log(`[Meta CAPI] Dispatching server event: ${eventName} (ID: ${eventId})`);
    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('[Meta CAPI] Meta API response error:', result);
      return { success: false, error: result };
    }
    
    console.log(`[Meta CAPI] Server event ${eventName} successfully dispatched.`);
    return { success: true, result };
  } catch (error) {
    console.error('[Meta CAPI] Meta Server CAPI request failed:', error);
    return { success: false, error };
  }
}
