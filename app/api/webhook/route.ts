import { NextRequest, NextResponse } from 'next/server'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN!
const VERIFY_TOKEN = process.env.VERIFY_TOKEN!
const GRAPH_URL = 'https://graph.facebook.com/v19.0/me/messages'

// ── PRODUCTS (from your prostore-gg.vercel.app) ──────────────
const PRODUCTS = [
  {
    id: 'CHINO_SHORTS',
    title: 'DORMAX Chino Shorts',
    subtitle: '$13.99 | Sizes 29–36 | Cotton | Made in Vietnam',
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg',
    url: 'https://prostore-gg.vercel.app/product/dormax',
  },
  {
    id: 'CHINO_JOGGERS',
    title: 'Signature Chino Joggers',
    subtitle: '$14.50 | Sizes 29–36 | Cotton | Made in Vietnam',
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1775106306643_IMAGE_2026-03-13_12%3A14%3A54-Cty6miifN0Nfcj3v3iU7NYt27aZaNf.jpg',
    url: 'https://prostore-gg.vercel.app/product/ignature-chino-joggers-dormax-series',
  },
  {
    id: 'LONG_PANTS',
    title: 'DORMAX Long Pants',
    subtitle: '$14.50 | Sizes 29–36 | Cotton | Made in Vietnam',
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305172479_2026-01-26_11.42.01-CjK8tiQU6SrpCMTLgiJyZ61DOnk5Fr.jpg',
    url: 'https://prostore-gg.vercel.app/product/long-pants',
  },
]

// ── ORDER STATE (in-memory, resets on redeploy) ───────────────
// For production: replace with your Prisma database
type Order = {
  step?: 'waiting_size' | 'waiting_phone' | 'waiting_location' | 'done'
  productTitle?: string
  price?: string
  size?: string
  phone?: string
  location?: string
  time?: string
}

const orders: Record<string, Order> = {}

// ── STEP 1: META VERIFIES YOUR WEBHOOK (GET) ─────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified ✅')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// ── STEP 2: RECEIVE MESSAGES FROM META (POST) ────────────────
export async function POST(req: NextRequest) {
  const body = (await req.json()) as unknown;

  // Define a narrow type for the webhook payload we expect from Meta
  type WebhookPayload = {
    object?: string
    entry?: Array<{
      messaging?: Array<Record<string, unknown>>
    }>
  }

  const payload = body as WebhookPayload;

  // Always return 200 immediately — Meta requires this
  if (payload.object !== 'page') {
    return new NextResponse('OK', { status: 200 })
  }

  for (const entry of payload.entry ?? []) {
    const event = entry.messaging?.[0]
    if (!event) continue

    const sender = event.sender as { id?: string } | undefined
    const senderId = sender?.id
    if (!senderId) continue

    const message = event.message as { text?: string } | undefined
    const postback = event.postback as { payload?: string } | undefined

    if (message?.text) {
      await handleText(senderId, String(message.text))
    } else if (postback?.payload) {
      await handlePostback(senderId, String(postback.payload))
    }
  }

  return new NextResponse('OK', { status: 200 })
}

// ── HANDLE TEXT MESSAGES ──────────────────────────────────────
async function handleText(senderId: string, text: string) {
  const t = text.toLowerCase().trim()
  const order = orders[senderId]

  // If customer is in the middle of ordering, continue that flow
  if (order?.step === 'waiting_size')     return handleSize(senderId, text)
  if (order?.step === 'waiting_phone')    return handlePhone(senderId, text)
  if (order?.step === 'waiting_location') return handleLocation(senderId, text)

  // Keyword detection
  if (t.match(/^(hi|hello|hey|start|សួស្ដី|ជំរាបសួរ|ហេ)/)) {
    return sendWelcome(senderId)
  }
  if (t.match(/product|item|short|pant|jogger|ថ្លៃ|មាន|អ្វី|show|catalog/)) {
    return sendCarousel(senderId)
  }

  // Default fallback
  return sendWelcome(senderId)
}

// ── HANDLE BUTTON TAPS ────────────────────────────────────────
async function handlePostback(senderId: string, payload: string) {
  if (payload === 'GET_STARTED' || payload === 'SHOW_PRODUCTS') {
    return sendCarousel(senderId)
  }

  if (payload.startsWith('ORDER_')) {
    const productId = payload.replace('ORDER_', '')
    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) return

    orders[senderId] = { step: 'waiting_size', productTitle: product.title, price: product.subtitle }

    return sendText(senderId,
      `Great choice! 🙌\n\n` +
      `🛍️ *${product.title}*\n` +
      `💰 ${product.subtitle}\n\n` +
      `Please enter your size:\n👉 29  30  32  34  36`
    )
  }
}

// ── ORDER FLOW: SIZE ──────────────────────────────────────────
async function handleSize(senderId: string, text: string) {
  const size = text.trim()
  const validSizes = ['29', '30', '31', '32', '34', '36']

  if (!validSizes.includes(size)) {
    return sendText(senderId, '⚠️ Please enter a valid size: 29, 30, 31, 32, 34, or 36')
  }

  orders[senderId].size = size
  orders[senderId].step = 'waiting_phone'

  return sendText(senderId, `Size ${size} ✅\n\nPlease send your phone number 📞\n(e.g. 012 345 678)`)
}

// ── ORDER FLOW: PHONE ─────────────────────────────────────────
async function handlePhone(senderId: string, text: string) {
  orders[senderId].phone = text.trim()
  orders[senderId].step  = 'waiting_location'

  return sendText(senderId,
    `Got it! 📞\n\nNow please send your delivery address 📍\n` +
    `(e.g. St 271, Toul Kork, Phnom Penh)`
  )
}

// ── ORDER FLOW: LOCATION → CONFIRM ───────────────────────────
async function handleLocation(senderId: string, text: string) {
  const order = orders[senderId]
  order.location = text.trim()
  order.step     = 'done'
  order.time     = new Date().toISOString()

  const summary =
    `✅ *Order Confirmed!*\n\n` +
    `🛍️ ${order.productTitle}\n` +
    `📏 Size: ${order.size}\n` +
    `📞 Phone: ${order.phone}\n` +
    `📍 Location: ${order.location}\n\n` +
    `We will contact you shortly to confirm delivery!\n` +
    `Thank you for choosing DORMAX 🙏`

  await sendText(senderId, summary)

  // Log the order (replace with Prisma DB save in production)
  console.log('🛒 NEW ORDER:', JSON.stringify(order, null, 2))

  delete orders[senderId]
}

// ── SEND WELCOME MESSAGE ──────────────────────────────────────
async function sendWelcome(senderId: string) {
  await sendRequest({
    recipient: { id: senderId },
    message: {
      text: `Hello! Welcome to DORMAX 👋\nSimple Style For Man 🇰🇭\n\nHow can I help you today?`,
      quick_replies: [
        { content_type: 'text', title: '🛍️ See Products', payload: 'SHOW_PRODUCTS' },
        { content_type: 'text', title: '📞 Contact Us',   payload: 'CONTACT' },
      ]
    }
  })
}

// ── SEND PRODUCT CAROUSEL ─────────────────────────────────────
async function sendCarousel(senderId: string) {
  await sendTyping(senderId)

  await sendRequest({
    recipient: { id: senderId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: PRODUCTS.map(p => ({
            title:     p.title,
            subtitle:  p.subtitle,
            image_url: p.image,
            default_action: {
              type: 'web_url',
              url:  p.url,
              webview_height_ratio: 'tall',
            },
            buttons: [
              { type: 'web_url', url: p.url, title: '👁️ View Details' },
              { type: 'postback', title: '🛍️ Order Now', payload: `ORDER_${p.id}` },
            ]
          }))
        }
      }
    }
  })
}

// ── HELPERS ───────────────────────────────────────────────────
async function sendText(senderId: string, text: string) {
  await sendRequest({ recipient: { id: senderId }, message: { text } })
}

async function sendTyping(senderId: string) {
  await sendRequest({ recipient: { id: senderId }, sender_action: 'typing_on' })
  await new Promise(r => setTimeout(r, 800))
}

async function sendRequest(body: Record<string, unknown>) {
  const res = await fetch(`${GRAPH_URL}?access_token=${PAGE_ACCESS_TOKEN}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('Meta API error:', JSON.stringify(err))
  }
}