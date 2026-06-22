'use client';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

/**
 * Sends a deduplicated event to Meta Pixel (browser) and Conversions API (server)
 */
export function trackMetaEvent(
  eventName: string,
  customData?: Record<string, unknown>,
  userParams?: Record<string, unknown>,
  overrideEventId?: string
): string {
  const eventId = overrideEventId || (
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now().toString(36)
  );

  // 1. Dispatch to Browser Meta Pixel
  if (typeof window !== 'undefined') {
    const w = window as Window & { fbq?: (action: string, name: string, data?: Record<string, unknown>, options?: { eventID: string }) => void };
    if (w.fbq) {
      w.fbq('track', eventName, customData, { eventID: eventId });
    }
  }

  // 2. Dispatch to Server-side Conversions API via Next.js api route
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');

  fetch('/api/meta-capi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventName,
      eventId,
      eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
      customData,
      userParams: {
        fbp,
        fbc,
        ...userParams,
      },
    }),
  }).catch((err) => {
    console.error('[Meta CAPI] Dispatch to CAPI endpoint failed:', err);
  });

  return eventId;
}
