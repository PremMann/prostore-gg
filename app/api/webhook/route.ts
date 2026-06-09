import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../db/prisma'

const GRAPH_URL = 'https://graph.facebook.com/v19.0/me/messages'

function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required env var: ${name}`)
  return val
}

// ── PRODUCT CATALOG (loaded from DB) ──────────────────────────

type ColorOption = {
  name: string
  imageUrl: string
}

type BotProduct = {
  id: string
  name: string
  nameKh: string
  price: number
  colors: ColorOption[]
  sizes: string[]
  image: string
  url: string
}

const CATEGORY_MAP: Record<string, true> = {
  shirts: true,
  pants: true,
  accessories: true,
}

let cachedProducts: BotProduct[] | null = null
let cacheTime = 0
const CACHE_TTL = 60_000

async function getProducts(): Promise<BotProduct[]> {
  const now = Date.now()
  if (cachedProducts && now - cacheTime < CACHE_TTL) return cachedProducts

  try {
    const rows = await prisma.product.findMany()
    cachedProducts = rows
      .filter(row => CATEGORY_MAP[row.category])
      .map(row => ({
        id: row.id,
        name: row.name,
        nameKh: row.nameKh,
        price: Number(row.price),
        colors: (row.colors as ColorOption[]) ?? [],
        sizes: row.sizes,
        image: row.images[0] ?? '',
        url: `/product/${row.slug}`,
      }))
    cacheTime = now
    return cachedProducts
  } catch (err) {
    console.error('Failed to load products from DB:', err)
    return cachedProducts ?? []
  }
}

// ── WEBHOOK VERIFY (GET) ──────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === requireEnv('VERIFY_TOKEN')) {
    console.log('Webhook verified ✅')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// ── RECEIVE MESSAGES (POST) ───────────────────────────────────

export async function POST(req: NextRequest) {
  let body: {
    object?: string
    entry?: Array<{
      messaging?: Array<{
        sender?: { id: string }
        message?: { text?: string; quick_reply?: { payload?: string } }
        postback?: { payload?: string }
      }>
    }>
  }

  try {
    body = await req.json()
  } catch (err) {
    console.error('Webhook JSON parse error:', err)
    return new NextResponse('Invalid JSON Body', { status: 400 })
  }

  if (body.object !== 'page') {
    return new NextResponse('OK', { status: 200 })
  }

  const entries = body.entry ?? []
  const promises = entries.flatMap(entry => {
    const events = entry.messaging ?? []
    return events.map(async event => {
      try {
        const psid = event.sender?.id
        if (!psid) return

        console.log('EVENT from PSID:', psid)

        const message  = event.message
        const postback = event.postback

        const payload = message?.quick_reply?.payload || postback?.payload

        if (payload) {
          await handlePostback(psid, payload)
        } else if (message?.text) {
          await handleText(psid, message.text)
        }
      } catch (err) {
        console.error(`Error handling event for PSID ${event.sender?.id}:`, err)
      }
    })
  })

  await Promise.all(promises)

  return new NextResponse('OK', { status: 200 })
}

// ── HANDLE TEXT ───────────────────────────────────────────────

const GREETING_KEYWORDS = ['hi', 'hello', 'សួស្តី', 'ជំរាបសួរ']

async function handleText(psid: string, text: string) {
  const t = text.toLowerCase().trim()

  // Greeting → welcome message + menu
  if (GREETING_KEYWORDS.some(kw => t.includes(kw))) {
    await sendText(psid, `សួស្តី! ស្វាគមន៍មកកាន់ DORMAX 🙏\nDORMAX — Simple Style For Man 🇰🇭`)
    return sendMainMenu(psid)
  }

  // Fallback → hint + See All Products quick reply
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'សួស្តី! សូមវាយ "hi" ដើម្បីមើលផលិតផល 🛍️',
      quick_replies: [{ content_type: 'text', title: '👀 មើលផលិតផលទាំងអស់', payload: 'MAIN_MENU' }],
    },
  })
}

// ── HANDLE POSTBACK / QUICK REPLY PAYLOADS ───────────────────

async function handlePostback(psid: string, payload: string) {
  if (payload === 'GET_STARTED') {
    return sendMainMenu(psid)
  }

  if (payload === 'MAIN_MENU') {
    return sendMainMenu(psid)
  }

  // Show product colors
  if (payload.startsWith('SHOW_PRODUCT_')) {
    const productId = payload.replace('SHOW_PRODUCT_', '')
    return handleProductSelection(psid, productId)
  }

  // Color selected → send Telegram alert + re-send color options
  if (payload.startsWith('SELECT_COLOR_')) {
    const rest = payload.replace('SELECT_COLOR_', '')
    const underscoreIdx = rest.indexOf('_')
    const productId = underscoreIdx === -1 ? rest : rest.slice(0, underscoreIdx)
    const colorName = underscoreIdx === -1 ? '' : rest.slice(underscoreIdx + 1).replace(/_/g, ' ')

    const products = await getProducts()
    const product = products.find(p => p.id === productId)
    if (product) {
      await sendTelegramAlert(product.nameKh || product.name, colorName)
    }

    // Re-send the same product colors so user can tap another color
    return handleProductSelection(psid, productId)
  }
}

// ── SHOW PRODUCT + COLOR QUICK REPLIES ────────────────────────

async function handleProductSelection(psid: string, productId: string) {
  const products = await getProducts()
  const product = products.find(p => p.id === productId)
  if (!product) return sendMainMenu(psid)

  await sendTyping(psid)

  // Single product card with image, name, price
  await sendRequest({
    recipient: { id: psid },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: product.nameKh || product.name,
            subtitle: `💰 $${product.price.toFixed(2)}`,
            image_url: product.image,
          }],
        },
      },
    },
  })

  // Colors as quick replies
  const quickReplies = product.colors.map(color => ({
    content_type: 'text' as const,
    title: `🎨 ${color.name}`,
    payload: `SELECT_COLOR_${product.id}_${color.name.replace(/\s+/g, '_')}`,
  }))

  quickReplies.push({
    content_type: 'text',
    title: '🔙 ត្រឡប់ក្រោយ',
    payload: 'MAIN_MENU',
  })

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ជ្រើសរើសពណ៌:',
      quick_replies: quickReplies,
    },
  })
}

// ── MAIN MENU CAROUSEL (dynamic from DB) ──────────────────────

async function sendMainMenu(psid: string) {
  const products = await getProducts()
  if (products.length === 0) {
    return sendText(psid, 'សូមទោស មិនទាន់មានផលិតផលនៅឡើយទេ 🙏')
  }

  await sendTyping(psid)

  const elements = products.slice(0, 10).map(p => ({
    title: p.nameKh || p.name,
    subtitle: `💰 $${p.price.toFixed(2)}`,
    image_url: p.image,
    buttons: [{ type: 'postback', title: 'មើលពណ៌', payload: `SHOW_PRODUCT_${p.id}` }],
  }))

  await sendRequest({
    recipient: { id: psid },
    message: { attachment: { type: 'template', payload: { template_type: 'generic', elements } } },
  })
}

// ── TELEGRAM ALERT ────────────────────────────────────────────

async function sendTelegramAlert(productName: string, colorName: string) {
  try {
    const text = `🔔 Customer interested in\n📍 Product: ${productName}\n🎨 Color: ${colorName}`
    const res = await fetch(
      `https://api.telegram.org/bot${requireEnv('TELEGRAM_BOT_TOKEN')}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: requireEnv('TELEGRAM_CHAT_ID'), text }),
      }
    )
    if (!res.ok) {
      console.error('Telegram error:', JSON.stringify(await res.json()))
    } else {
      console.log('Telegram alert sent ✅')
    }
  } catch (err) {
    console.error('Telegram fetch failed:', err)
  }
}

// ── HELPERS ───────────────────────────────────────────────────

async function sendText(psid: string, text: string) {
  await sendRequest({ recipient: { id: psid }, message: { text } })
}

async function sendTyping(psid: string) {
  await sendRequest({ recipient: { id: psid }, sender_action: 'typing_on' })
  await new Promise(r => setTimeout(r, 500))
}

async function sendRequest(body: Record<string, unknown>) {
  const res = await fetch(`${GRAPH_URL}?access_token=${requireEnv('PAGE_ACCESS_TOKEN')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('Meta API error:', JSON.stringify(err))
  }
}
