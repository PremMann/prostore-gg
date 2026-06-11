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

type UserState = {
  psid: string
  selectedProductId?: string
  selectedProductName?: string
  selectedAt?: number
  lastFallbackAt?: number
}

const CATEGORY_MAP: Record<string, true> = {
  shirts: true,
  pants: true,
  accessories: true,
}

let cachedProducts: BotProduct[] | null = null
let cacheTime = 0
const CACHE_TTL = 60_000
const SELECTED_PRODUCT_TTL = 30 * 60_000
const FALLBACK_REPLY_TTL = 5 * 60_000

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

// ── USER STATE (in-memory, replaceable with Redis later) ──────

const userStates = new Map<string, UserState>()

function getUserState(psid: string): UserState {
  const state = userStates.get(psid)
  if (state) return state

  const newState = { psid }
  userStates.set(psid, newState)
  return newState
}

function updateUserState(psid: string, partialState: Partial<UserState>) {
  userStates.set(psid, { ...getUserState(psid), ...partialState })
}

function clearUserState(psid: string) {
  userStates.delete(psid)
}

function hasActiveProductSelection(psid: string, state: UserState): state is UserState & {
  selectedProductId: string
  selectedProductName: string
  selectedAt: number
} {
  if (!state.selectedProductId || !state.selectedProductName || !state.selectedAt) return false

  if (Date.now() - state.selectedAt > SELECTED_PRODUCT_TTL) {
    clearUserState(psid)
    return false
  }

  return true
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
const PRODUCT_TRIGGER_KEYWORDS = ['shop', 'product', 'products', 'buy', 'order', 'មើល', 'ទិញ', 'អាវ', 'ខោ']
const HUMAN_SUPPORT_KEYWORDS = [
  'admin',
  'staff',
  'support',
  'contact',
  'help',
  'អេដមីន',
  'អ្នកលក់',
  'បុគ្គលិក',
  'ជំនួយ',
  'ជួយ',
  'ទាក់ទង',
]

async function handleText(psid: string, text: string) {
  const t = text.toLowerCase().trim()
  const state = getUserState(psid)

  if (hasKeyword(t, HUMAN_SUPPORT_KEYWORDS)) {
    clearUserState(psid)
    await sendTelegramSupportRequest(psid, text)
    await sendText(psid, '📞 បុគ្គលិកនឹងឆ្លើយតបឆាប់ៗនេះ។')
    return
  }

  // After a product is selected, the next customer text becomes a lead.
  if (hasActiveProductSelection(psid, state)) {
    await sendTelegramLead(psid, state.selectedProductName, text)
    clearUserState(psid)
    await sendText(psid, '✅ អរគុណ! ក្រុមការងារនឹងទាក់ទងអ្នកឆាប់ៗនេះ។')
    return
  }

  // Product carousel triggers.
  if (hasKeyword(t, GREETING_KEYWORDS)) {
    clearUserState(psid)
    await sendText(psid, `សួស្តី! ស្វាគមន៍មកកាន់ PROMELODY 🙏\n — Simple Style For Man 🇰🇭`)
    await sendMainMenu(psid)
    // Sticky quick reply to re-show menu
    await sendRequest({
      recipient: { id: psid },
      message: {
        text: '👀 មើលផលិតផលទាំងអស់',
        quick_replies: [{ content_type: 'text', title: '👀 មើលផលិតផលទាំងអស់', payload: 'MAIN_MENU' }],
      },
    })
    return
  }

  if (hasKeyword(t, PRODUCT_TRIGGER_KEYWORDS)) {
    clearUserState(psid)
    await sendMainMenu(psid)
    return
  }

  await sendFallbackReply(psid, state)
}

// ── HANDLE POSTBACK / QUICK REPLY PAYLOADS ───────────────────

async function handlePostback(psid: string, payload: string) {
  if (payload === 'GET_STARTED') {
    clearUserState(psid)
    await sendText(psid, `សួស្តី! ស្វាគមន៍មកកាន់ PROMELODY 🙏\n — Simple Style For Man 🇰🇭`)
    return sendMainMenu(psid)
  }

  if (payload === 'MAIN_MENU') {
    clearUserState(psid)
    return sendMainMenu(psid)
  }

  if (payload === 'CONTACT_STAFF') {
    clearUserState(psid)
    await sendTelegramSupportRequest(psid, 'Customer tapped contact staff')
    return sendText(psid, '📞 បុគ្គលិកនឹងឆ្លើយតបឆាប់ៗនេះ។')
  }

  // Save product interest and wait for the user's next text message.
  if (payload.startsWith('SHOW_PRODUCT_')) {
    const productId = payload.replace('SHOW_PRODUCT_', '')
    return handleProductSelection(psid, productId)
  }
}

// ── PRODUCT SELECTION ─────────────────────────────────────────

async function handleProductSelection(psid: string, productId: string) {
  const products = await getProducts()
  const product = products.find(p => p.id === productId)
  if (!product) return sendMainMenu(psid)

  updateUserState(psid, {
    selectedProductId: product.id,
    selectedProductName: product.nameKh || product.name,
    selectedAt: Date.now(),
  })

  await sendProductColorCarousel(psid, product)

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'បើបងចាប់អារម្មណ៍ សូមផ្ញើសារមកបានបង។',
      quick_replies: [
        { content_type: 'text', title: '📞 ទាក់ទងបុគ្គលិក', payload: 'CONTACT_STAFF' },
        { content_type: 'text', title: '👀 មើលផលិតផលផ្សេង', payload: 'MAIN_MENU' },
      ],
    },
  })
}

async function sendProductColorCarousel(psid: string, product: BotProduct) {
  const colorElements = product.colors.slice(0, 10).map(color => ({
    title: `${product.nameKh || product.name} - ${color.name}`,
    subtitle: `💰 $${product.price.toFixed(2)}`,
    image_url: color.imageUrl,
  }))

  const elements = colorElements.length > 0
    ? colorElements
    : [{
      title: product.nameKh || product.name,
      subtitle: `💰 $${product.price.toFixed(2)}`,
      image_url: product.image,
    }]

  await sendRequest({
    recipient: { id: psid },
    message: { attachment: { type: 'template', payload: { template_type: 'generic', elements } } },
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
    buttons: [{ type: 'postback', title: 'ជ្រើសរើស', payload: `SHOW_PRODUCT_${p.id}` }],
  }))

  await sendRequest({
    recipient: { id: psid },
    message: { attachment: { type: 'template', payload: { template_type: 'generic', elements } } },
  })
}

// ── TELEGRAM ALERT ────────────────────────────────────────────

async function sendTelegramLead(psid: string, productName: string, customerMessage: string) {
  const text = [
    '🔥 New Messenger Lead',
    '',
    `Product: ${productName}`,
    `PSID: ${psid}`,
    `Message: ${customerMessage}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n')

  await sendTelegramMessage(text)
}

async function sendTelegramSupportRequest(psid: string, customerMessage: string) {
  const text = [
    '📞 Customer Requested Human Support',
    '',
    `PSID: ${psid}`,
    `Message: ${customerMessage}`,
    `Time: ${new Date().toISOString()}`,
  ].join('\n')

  await sendTelegramMessage(text)
}

async function sendTelegramMessage(text: string) {
  try {
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
      console.log('Telegram message sent ✅')
    }
  } catch (err) {
    console.error('Telegram fetch failed:', err)
  }
}

// ── HELPERS ───────────────────────────────────────────────────

async function sendText(psid: string, text: string) {
  await sendRequest({ recipient: { id: psid }, message: { text } })
}

async function sendFallbackReply(psid: string, state: UserState) {
  if (state.lastFallbackAt && Date.now() - state.lastFallbackAt < FALLBACK_REPLY_TTL) {
    return
  }

  updateUserState(psid, { lastFallbackAt: Date.now() })

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ប្អូនទទួលបានសារបងហើយ។ បើចង់មើលផលិតផល សូមចុចប៊ូតុងខាងក្រោម។',
      quick_replies: [{ content_type: 'text', title: '👀 មើលផលិតផល', payload: 'MAIN_MENU' }],
    },
  })
}

async function sendTyping(psid: string) {
  await sendRequest({ recipient: { id: psid }, sender_action: 'typing_on' })
  await new Promise(r => setTimeout(r, 500))
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some(kw => text.includes(kw))
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
