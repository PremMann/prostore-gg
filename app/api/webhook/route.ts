import { NextRequest, NextResponse } from 'next/server'

const REQUIRED_ENV = ['PAGE_ACCESS_TOKEN', 'VERIFY_TOKEN', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'] as const
const MISSING_ENV  = REQUIRED_ENV.filter(key => !process.env[key])
if (MISSING_ENV.length > 0) {
  throw new Error(`Missing required env vars: ${MISSING_ENV.join(', ')}`)
}

const PAGE_ACCESS_TOKEN  = process.env.PAGE_ACCESS_TOKEN!
const VERIFY_TOKEN       = process.env.VERIFY_TOKEN!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID!
const GRAPH_URL          = 'https://graph.facebook.com/v19.0/me/messages'

// ── PRODUCT CATALOG ───────────────────────────────────────────
type ColorOption = {
  name: string
  imageUrl: string
}

type Product = {
  id: string
  name: string
  nameKh: string
  price: number
  colors: ColorOption[]
  sizes: string[]
  image: string
  url: string
  category: 'shorts' | 'pants' | 'polo' | 'tshirt'
}

const PRODUCTS: Product[] = [
  {
    id: 'CHINO_SHORTS',
    name: 'DORMAX Chino Shorts',
    nameKh: 'ខោខ្លី DORMAX',
    price: 13.99,
    colors: [
      { name: '⚫ Black',  imageUrl: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg' },
      { name: '🔵 Navy',  imageUrl: 'https://via.placeholder.com/600x400/000080/ffffff?text=Navy+Chino+Shorts' },
      { name: '🩶 Grey',  imageUrl: 'https://via.placeholder.com/600x400/808080/ffffff?text=Grey+Chino+Shorts' },
      { name: '🟤 Khaki', imageUrl: 'https://via.placeholder.com/600x400/c3b091/ffffff?text=Khaki+Chino+Shorts' },
      { name: '⚪ White', imageUrl: 'https://via.placeholder.com/600x400/ffffff/000000?text=White+Chino+Shorts' },
    ],
    sizes: ['29', '30', '31', '32', '34', '35'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg',
    url: 'https://prostore-gg.vercel.app/product/dormax',
    category: 'shorts',
  },
  {
    id: 'CHINO_JOGGERS',
    name: 'Chino Joggers',
    nameKh: 'ខោ Jogger DORMAX',
    price: 14.50,
    colors: [
      { name: '⚫ Black',      imageUrl: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1775106306643_IMAGE_2026-03-13_12%3A14%3A54-Cty6miifN0Nfcj3v3iU7NYt27aZaNf.jpg' },
      { name: '🔵 Navy',      imageUrl: 'https://via.placeholder.com/600x400/000080/ffffff?text=Navy+Chino+Joggers' },
      { name: '🟢 Army Green', imageUrl: 'https://via.placeholder.com/600x400/4b5320/ffffff?text=Army+Green+Joggers' },
      { name: '🟤 Khaki',     imageUrl: 'https://via.placeholder.com/600x400/c3b091/ffffff?text=Khaki+Joggers' },
    ],
    sizes: ['29', '30', '32', '34', '36'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1775106306643_IMAGE_2026-03-13_12%3A14%3A54-Cty6miifN0Nfcj3v3iU7NYt27aZaNf.jpg',
    url: 'https://prostore-gg.vercel.app/product/ignature-chino-joggers-dormax-series',
    category: 'pants',
  },
  {
    id: 'LONG_PANTS',
    name: 'DORMAX Long Pants',
    nameKh: 'ខោវែង DORMAX',
    price: 15.50,
    colors: [
      { name: '⚫ Black',      imageUrl: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305172479_2026-01-26_11.42.01-CjK8tiQU6SrpCMTLgiJyZ61DOnk5Fr.jpg' },
      { name: '🔵 Navy',      imageUrl: 'https://via.placeholder.com/600x400/000080/ffffff?text=Navy+Long+Pants' },
      { name: '🟢 Army Green', imageUrl: 'https://via.placeholder.com/600x400/4b5320/ffffff?text=Army+Green+Long+Pants' },
      { name: '🟤 Khaki',     imageUrl: 'https://via.placeholder.com/600x400/c3b091/ffffff?text=Khaki+Long+Pants' },
    ],
    sizes: ['29', '30', '32', '34', '36'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305172479_2026-01-26_11.42.01-CjK8tiQU6SrpCMTLgiJyZ61DOnk5Fr.jpg',
    url: 'https://prostore-gg.vercel.app/product/long-pants',
    category: 'pants',
  },
  {
    id: 'POLO_SHIRT',
    name: 'DORMAX Polo Shirt',
    nameKh: 'អាវវែង Polo DORMAX',
    price: 12.50,
    colors: [
      { name: '⚫ Black', imageUrl: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305187477_IMAGE_2026-01-20_23%3A02%3A34-rBpeAbq9F6BqSF8nfOIQuzXOzMgLiy.jpg' },
      { name: '🟤 Brown', imageUrl: 'https://via.placeholder.com/600x400/5c4033/ffffff?text=Brown+Polo+Shirt' },
      { name: '🟡 Cream', imageUrl: 'https://via.placeholder.com/600x400/fffdd0/000000?text=Cream+Polo+Shirt' },
      { name: '⚪ White', imageUrl: 'https://via.placeholder.com/600x400/ffffff/000000?text=White+Polo+Shirt' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305187477_IMAGE_2026-01-20_23%3A02%3A34-rBpeAbq9F6BqSF8nfOIQuzXOzMgLiy.jpg',
    url: 'https://prostore-gg.vercel.app/product/dormax01',
    category: 'polo',
  },
  {
    id: 'TSHIRT',
    name: 'DORMAX T-Shirt',
    nameKh: 'អាវខ្លី DORMAX',
    price: 12.00,
    colors: [
      { name: '⚫ Black', imageUrl: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg' },
      { name: '🟤 Khaki', imageUrl: 'https://via.placeholder.com/600x400/c3b091/ffffff?text=Khaki+T-Shirt' },
      { name: '⚪ White', imageUrl: 'https://via.placeholder.com/600x400/ffffff/000000?text=White+T-Shirt' },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg',
    url: 'https://prostore-gg.vercel.app/product/dormax',
    category: 'tshirt',
  },
]

function getMatchingProducts(category: 'shorts' | 'tops' | 'pants'): Product[] {
  if (category === 'shorts') return PRODUCTS.filter(p => p.category === 'shorts')
  if (category === 'pants')  return PRODUCTS.filter(p => p.category === 'pants')
  return PRODUCTS.filter(p => p.category === 'polo' || p.category === 'tshirt')
}

// ── WEBHOOK VERIFY (GET) ──────────────────────────────────────
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

  // Direct category shortcuts
  if (t.includes('ខោខ្លី')) return showCategoryColors(psid, 'shorts')
  if (t.includes('ខោវែង')) return showCategoryColors(psid, 'pants')
  if (t.includes('អាវ'))    return showCategoryColors(psid, 'tops')

  // Greeting → welcome message + menu
  if (GREETING_KEYWORDS.some(kw => t.includes(kw))) {
    await sendText(psid, `សួស្តី! ស្វាគមន៍មកកាន់ DORMAX 🙏\nDORMAX — Simple Style For Man 🇰🇭`)
    return sendMainMenu(psid)
  }

  // Everything else → show menu
  return sendMainMenu(psid)
}

// ── HANDLE POSTBACK / QUICK REPLY PAYLOADS ───────────────────
async function handlePostback(psid: string, payload: string) {
  if (payload === 'GET_STARTED') {
    return sendMainMenu(psid)
  }

  if (payload === 'MAIN_MENU') {
    return sendMainMenu(psid)
  }

  // Category selection
  if (payload.startsWith('CAT_')) {
    const cat = payload.replace('CAT_', '').toLowerCase() as 'shorts' | 'tops' | 'pants'
    return showCategoryColors(psid, cat)
  }

  // Color selected → confirm + notify
  if (payload.startsWith('SELECT_COLOR_')) {
    await sendText(psid, 'We will contact to you soon 🙏')
    await sendTelegramAlert()
    return
  }
}

// ── TELEGRAM ALERT ────────────────────────────────────────────
async function sendTelegramAlert() {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: 'new protaintal customer' }),
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

// ── MAIN MENU CAROUSEL ────────────────────────────────────────
async function sendMainMenu(psid: string) {
  const elements = [
    {
      title:     '👖 ខោខ្លី (Shorts)',
      subtitle:  'ចាប់ពី $13.99 | ពណ៌ច្រើនជម្រើស',
      image_url: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg',
      buttons: [{ type: 'postback', title: 'មើលខោខ្លី និងតម្លៃ', payload: 'CAT_SHORTS' }],
    },
    {
      title:     '👕 អាវបុរស (Tops)',
      subtitle:  'ចាប់ពី $12.00 | ប៉ូឡូ និងអាវយឺត',
      image_url: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305187477_IMAGE_2026-01-20_23%3A02%3A34-rBpeAbq9F6BqSF8nfOIQuzXOzMgLiy.jpg',
      buttons: [{ type: 'postback', title: 'មើលអាវ និងតម្លៃ', payload: 'CAT_TOPS' }],
    },
    {
      title:     '👖 ខោវែង (Pants)',
      subtitle:  'ចាប់ពី $14.50 | ខោវែង DORMAX',
      image_url: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1770305172479_2026-01-26_11.42.01-CjK8tiQU6SrpCMTLgiJyZ61DOnk5Fr.jpg',
      buttons: [{ type: 'postback', title: 'មើលខោវែង និងតម្លៃ', payload: 'CAT_PANTS' }],
    },
  ]

  await sendRequest({
    recipient: { id: psid },
    message: { attachment: { type: 'template', payload: { template_type: 'generic', elements } } },
  })
}

// ── COLOR CARDS PER CATEGORY ──────────────────────────────────
async function showCategoryColors(psid: string, category: 'shorts' | 'tops' | 'pants') {
  const products = getMatchingProducts(category)
  if (products.length === 0) return sendMainMenu(psid)

  await sendTyping(psid)

  const elements: object[] = []
  for (const p of products) {
    for (const color of p.colors) {
      elements.push({
        title:     `${p.nameKh} — ${color.name}`,
        subtitle:  `💰 $${p.price.toFixed(2)} | 📏 ទំហំ: ${p.sizes.join(' ')}`,
        image_url: color.imageUrl,
        buttons: [{
          type: 'postback',
          title: '🛍️ ជ្រើសរើស',
          payload: `SELECT_COLOR_${p.id}_${color.name.replace(/\s+/g, '_')}`,
        }],
      })
      if (elements.length === 10) break
    }
    if (elements.length === 10) break
  }

  await sendRequest({
    recipient: { id: psid },
    message: { attachment: { type: 'template', payload: { template_type: 'generic', elements } } },
  })

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ឬត្រឡប់ទៅម៉ឺនុយដើម:',
      quick_replies: [{ content_type: 'text', title: '🔙 ម៉ឺនុយដើម', payload: 'MAIN_MENU' }],
    },
  })
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
  const res = await fetch(`${GRAPH_URL}?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    console.error('Meta API error:', JSON.stringify(err))
  }
}
