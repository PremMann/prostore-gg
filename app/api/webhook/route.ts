import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

// ── SESSION STATE (runtime shape — stored as JSON in DB) ──────
type CartItem = {
  productId: string
  productName: string
  productNameKh: string
  color: string
  size: string
  price: number
  quantity: number
}

type SessionState = {
  step: 'idle' | 'selecting_size' | 'waiting_phone' | 'waiting_location' | 'selecting_shipping' | 'selecting_payment' | 'confirming'
  pendingProductId: string | null
  pendingColor: string
  cart: CartItem[]
  phone: string
  location: string
  shippingOption: 'phnom_penh' | 'province' | null
  paymentMethod: 'cod' | 'aba' | null
}

// ── DB SESSION HELPERS ────────────────────────────────────────
async function getSession(psid: string): Promise<SessionState> {
  const row = await prisma.messengerSession.findUnique({ where: { psid } })
  if (!row) {
    return {
      step: 'idle',
      pendingProductId: null,
      pendingColor: '',
      cart: [],
      phone: '',
      location: '',
      shippingOption: null,
      paymentMethod: null,
    }
  }
  return {
    step: row.step as SessionState['step'],
    pendingProductId: row.pendingProductId ?? null,
    pendingColor: row.pendingColor ?? '',
    cart: (row.cart as unknown as CartItem[]) ?? [],
    phone: row.phone,
    location: row.location,
    shippingOption: (row.shippingOption as SessionState['shippingOption']) ?? null,
    paymentMethod: (row.paymentMethod as SessionState['paymentMethod']) ?? null,
  }
}

async function saveSession(psid: string, state: SessionState) {
  await prisma.messengerSession.upsert({
    where: { psid },
    create: {
      psid,
      step: state.step,
      pendingProductId: state.pendingProductId,
      pendingColor: state.pendingColor,
      cart: state.cart as object[],
      phone: state.phone,
      location: state.location,
      shippingOption: state.shippingOption,
      paymentMethod: state.paymentMethod,
    },
    update: {
      step: state.step,
      pendingProductId: state.pendingProductId,
      pendingColor: state.pendingColor,
      cart: state.cart as object[],
      phone: state.phone,
      location: state.location,
      shippingOption: state.shippingOption,
      paymentMethod: state.paymentMethod,
    },
  })
}

async function resetSession(psid: string) {
  await prisma.messengerSession.deleteMany({ where: { psid } })
}

// ── DORMAX CUSTOMER SERVICE SYSTEM PROMPT ──────────────────────
const DORMAX_SYSTEM_PROMPT = `You are a friendly customer service assistant for DORMAX, a Cambodian men's clothing brand.

## YOUR BEHAVIOR

You handle messages in this exact priority order:

### 1. ACTIVE FLOW — check first
If the customer is mid-order (waiting for phone, address, size, or color), 
continue that step. Never jump to free chat while a flow is in progress.

### 2. TRIGGER KEYWORDS — check second
If the customer says any of these, start the matching flow:
- "ទិញ", "order", "បញ្ជាទិញ", "ចង់បាន" → start order flow
- "តម្លៃ", "price", "ប៉ុន្មាន" → show product menu
- "hi", "hello", "សួស្តី", "ជំរាបសួរ" → send welcome + product menu

### 3. FREE CHAT — everything else
Answer naturally and helpfully. If the question is about 
products, shipping, or sizing, answer from your knowledge below.
If you cannot help, say:
"សូមទោស! ខ្ញុំនឹងភ្ជាប់អ្នកទៅកាន់ក្រុមការងារ 🙏"
and hand off to the human inbox.

---

## PRODUCT KNOWLEDGE

DORMAX sells men's clothing in Cambodia.

Shorts (ខោខ្លី) — $13.99
  Colors: Black, Navy, Grey, Khaki
  Sizes: 29 30 31 32 34 36

Tops / Polo (អាវវែង) — $12.50
  Colors: Black, Brown, Cream, White
  Sizes: S M L XL 2XL

Long Pants (ខោវែង) — $15.50
  Colors: Black, Navy, Army Green, Khaki
  Sizes: 29 30 32 34 36

Delivery: Phnom Penh same-day, provinces 1–3 days.
Payment: cash on delivery.

---

## ORDER FLOW (step by step)

Step 1 — Show the 3 category cards (Shorts / Tops / Pants)
Step 2 — Customer picks a category → show all color photos for that category
Step 3 — Customer picks a color → ask for size
Step 4 — Size chosen → confirm item, ask "add more or checkout?"
Step 5 — Checkout → ask for phone number
Step 6 — Ask for delivery address
Step 7 — Show order summary → ask confirm or cancel
Step 8 — Confirmed → thank customer, send to Telegram

---

## TONE
- Friendly, short messages
- Mix Khmer and English naturally
- Use emojis sparingly (✅ 🛍️ 📞 📍)
- Never use technical jargon`

// ── CALL GEMINI 2.5 FLASH API ─────────────────────────────────
async function askGemini(text: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not configured. Defaulting to silent human inbox routing.')
    return null
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          systemInstruction: { parts: [{ text: DORMAX_SYSTEM_PROMPT }] },
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800,
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Gemini API returned error status:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    return generatedText ? generatedText.trim() : null
  } catch (err) {
    console.error('Error calling Gemini API:', err)
    return null
  }
}

// ── KNOWN TRIGGER KEYWORDS ────────────────────────────────────
const TRIGGER_KEYWORDS = [
  'ទិញ', 'order', 'បញ្ជាទិញ', 'ចង់បាន',
  'តម្លៃ', 'price', 'ប៉ុន្មាន',
  'hi', 'hello', 'សួស្តី', 'ជំរាបសួរ',
  'ខោខ្លី', 'ខោវែង', 'អាវ',
  'បន្ថែម', 'ម៉ឺនុយ', 'បញ្ចប់', 'ចាប់ផ្តើម'
]

function isKnownTrigger(text: string): boolean {
  const t = text.toLowerCase().trim()
  return TRIGGER_KEYWORDS.some(kw => t.includes(kw))
}

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
      const psid = event.sender?.id
      if (!psid) return

      console.log('EVENT from PSID:', psid)

      const message  = event.message
      const postback = event.postback

      // Quick reply payload or postback payload are always routed to bot handlers
      const payload = message?.quick_reply?.payload || postback?.payload

      if (payload) {
        await handlePostback(psid, payload)
      } else if (message?.text) {
        await handleText(psid, message.text)
      }
    })
  })

  await Promise.all(promises)

  return new NextResponse('OK', { status: 200 })
}

// ── HANDLE TEXT — 3-LAYER DISPATCHER ─────────────────────────
async function handleText(psid: string, text: string) {
  const session = await getSession(psid)
  const t = text.trim()

  // ── Layer 1: User is mid active flow → continue it
  if (session.step === 'waiting_phone')    return handlePhone(psid, t, session)
  if (session.step === 'waiting_location') return handleLocation(psid, t, session)

  // ── Layer 2: Known trigger keyword → start or resume bot flow
  const lowerT = t.toLowerCase()
  if (isKnownTrigger(t)) {
    // 1. Direct category shortcuts
    if (lowerT.includes('ខោខ្លី'))  return showCategoryColors(psid, 'shorts')
    if (lowerT.includes('ខោវែង'))  return showCategoryColors(psid, 'pants')
    if (lowerT.includes('អាវ'))     return showCategoryColors(psid, 'tops')

    // 2. Welcome triggers: greeting keywords
    if (
      lowerT.includes('hi') ||
      lowerT.includes('hello') ||
      lowerT.includes('សួស្តី') ||
      lowerT.includes('ជំរាបសួរ')
    ) {
      await resetSession(psid)
      await sendText(psid, `សួស្តី! ស្វាគមន៍មកកាន់ DORMAX 🙏\nDORMAX — Simple Style For Man 🇰🇭`)
      return sendMainMenu(psid)
    }

    // 3. Price / Menu / Order triggers
    if (
      lowerT.includes('តម្លៃ') ||
      lowerT.includes('price') ||
      lowerT.includes('ប៉ុន្មាន') ||
      lowerT.includes('ម៉ឺនុយ') ||
      lowerT.includes('បន្ថែម') ||
      lowerT.includes('ទិញ') ||
      lowerT.includes('order') ||
      lowerT.includes('បញ្ជាទិញ') ||
      lowerT.includes('ចង់បាន') ||
      lowerT.includes('ចាប់ផ្តើម')
    ) {
      await resetSession(psid)
      return sendMainMenu(psid)
    }

    if (lowerT.includes('បញ្ចប់') && session.cart.length > 0) {
      const updated = { ...session, step: 'waiting_phone' as const }
      await saveSession(psid, updated)
      return sendText(psid, `📞 សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នក:\n(ឧទាហរណ៍: 012 345 678)`)
    }

    // Default fallback trigger response
    await resetSession(psid)
    return sendMainMenu(psid)
  }

  // ── Layer 3: Free-form chat → route via Gemini AI
  const aiResponse = await askGemini(t)
  if (aiResponse) {
    if (aiResponse.includes('សូមទោស! ខ្ញុំនឹងភ្ជាប់អ្នកទៅកាន់ក្រុមការងារ')) {
      console.log(`[HUMAN_INBOX] Handoff requested by AI for PSID ${psid}: "${t}"`)
      await sendText(psid, `សូមទោស! ខ្ញុំនឹងភ្ជាប់អ្នកទៅកាន់ក្រុមការងារ 🙏`)
      return
    }
    // Answer naturally
    return sendText(psid, aiResponse)
  }

  // Fallback if Gemini fails or is unconfigured
  console.log(`[HUMAN_INBOX] PSID ${psid}: "${t}"`)
  // No response — message lands naturally in Messenger Page Inbox for human agent
}

// ── HANDLE POSTBACK / QUICK REPLY PAYLOADS ───────────────────
async function handlePostback(psid: string, payload: string) {
  const session = await getSession(psid)

  // Main menu navigation
  if (payload === 'GET_STARTED' || payload === 'MAIN_MENU') {
    await resetSession(psid)
    return sendMainMenu(psid)
  }

  // Category selection (Step 1)
  if (payload.startsWith('CAT_')) {
    const cat = payload.replace('CAT_', '').toLowerCase() as 'shorts' | 'tops' | 'pants'
    return showCategoryColors(psid, cat)
  }

  // Color selection (Step 2)
  if (payload.startsWith('SELECT_COLOR_')) {
    // Format: SELECT_COLOR_<PRODUCT_ID>_<COLOR_NAME>
    const match = payload.match(/^SELECT_COLOR_([A-Z_]+)_(.+)$/)
    if (!match) return

    const productId = match[1]
    const colorName = match[2].replace(/_/g, ' ')
    const product   = PRODUCTS.find(p => p.id === productId)
    if (!product) return

    const updated: SessionState = {
      ...session,
      pendingProductId: productId,
      pendingColor: colorName,
      step: 'selecting_size',
    }
    await saveSession(psid, updated)
    return sendSizeSelection(psid, product, colorName)
  }

  // Size selection (Step 3) — directly add to cart
  if (payload.startsWith('SIZE_')) {
    if (session.step !== 'selecting_size' || !session.pendingProductId || !session.pendingColor) return
    const size    = payload.replace('SIZE_', '')
    const product = PRODUCTS.find(p => p.id === session.pendingProductId)
    if (!product) return

    const newItem: CartItem = {
      productId:      product.id,
      productName:    product.name,
      productNameKh:  product.nameKh,
      color:          session.pendingColor,
      size,
      price:          product.price,
      quantity:       1,
    }

    const updatedCart = [...session.cart, newItem]
    const updated: SessionState = {
      ...session,
      cart:            updatedCart,
      pendingProductId: null,
      pendingColor:    '',
      step:            'idle',
    }
    await saveSession(psid, updated)

    await sendText(psid,
      `✅ បានបន្ថែមទៅកន្ត្រក!\n\n` +
      `🛍️ ${newItem.productNameKh}\n` +
      `🎨 ពណ៌: ${newItem.color}\n` +
      `📏 ទំហំ: ${newItem.size}\n` +
      `💰 $${newItem.price.toFixed(2)}`
    )
    return sendContinueOrCheckout(psid, updatedCart)
  }

  // View / re-show cart
  if (payload === 'VIEW_CART') {
    return sendContinueOrCheckout(psid, session.cart)
  }

  // Clear cart
  if (payload === 'CLEAR_CART') {
    await resetSession(psid)
    await sendText(psid, '🗑️ កន្ត្រកទំនិញត្រូវបានលុប។')
    return sendMainMenu(psid)
  }

  // Start checkout
  if (payload === 'CHECKOUT') {
    if (session.cart.length === 0) {
      return sendText(psid, '⚠️ កន្ត្រករបស់អ្នកទទេ! សូមជ្រើសរើសផលិតផលមុន។')
    }
    const updated = { ...session, step: 'waiting_phone' as const }
    await saveSession(psid, updated)
    return sendText(psid, `📞 សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នក:\n(ឧទាហរណ៍: 012 345 678)`)
  }

  // Shipping selection
  if (payload.startsWith('SHIP_')) {
    if (session.step !== 'selecting_shipping') return
    const option = payload === 'SHIP_PP' ? 'phnom_penh' : 'province'
    const updated = { ...session, shippingOption: option as SessionState['shippingOption'], step: 'selecting_payment' as const }
    await saveSession(psid, updated)
    return sendPaymentSelection(psid)
  }

  // Payment selection
  if (payload.startsWith('PAY_')) {
    if (session.step !== 'selecting_payment') return
    const method = payload === 'PAY_COD' ? 'cod' : 'aba'
    const updated = { ...session, paymentMethod: method as SessionState['paymentMethod'], step: 'confirming' as const }
    await saveSession(psid, updated)
    return sendOrderSummary(psid, { ...updated })
  }

  // Confirm order
  if (payload === 'CONFIRM_ORDER') {
    if (session.step !== 'confirming') return
    return confirmOrder(psid, session)
  }

  // Cancel order
  if (payload === 'CANCEL_ORDER') {
    await resetSession(psid)
    await sendText(psid, `❌ បានបោះបង់ការបញ្ជាទិញ។\nចុចខាងក្រោមដើម្បីចាប់ផ្តើមម្តងទៀត 😊`)
    return sendMainMenu(psid)
  }
}

// ── STEP 1: MAIN MENU CAROUSEL ────────────────────────────────
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

// ── STEP 2: COLOR CARDS PER CATEGORY ─────────────────────────
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
      if (elements.length === 10) break  // Messenger carousel max
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

// ── STEP 3: SIZE QUICK REPLIES ────────────────────────────────
async function sendSizeSelection(psid: string, product: Product, color: string) {
  await sendText(psid,
    `🛍️ ${product.nameKh}\n` +
    `🎨 ពណ៌ដែលបានជ្រើស: ${color}\n\n` +
    `📏 សូមជ្រើសរើសទំហំ (Size):`
  )
  const sizeReplies = product.sizes.map(s => ({
    content_type: 'text',
    title: s,
    payload: `SIZE_${s}`,
  }))
  await sendRequest({
    recipient: { id: psid },
    message: { text: 'ទំហំដែលមាន:', quick_replies: sizeReplies },
  })
}

// ── CART SUMMARY + CONTINUE/CHECKOUT ─────────────────────────
async function sendContinueOrCheckout(psid: string, cart: CartItem[]) {
  let subtotal = 0
  const cartSummary = cart.map((item, i) => {
    const cost = item.price * item.quantity
    subtotal += cost
    return `${i + 1}. ${item.productNameKh} | ${item.color} | ${item.size} x${item.quantity} — $${cost.toFixed(2)}`
  }).join('\n')

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `🛒 កន្ត្រកទំនិញរបស់អ្នក:\n━━━━━━━━━━━━━━━\n${cartSummary}\n━━━━━━━━━━━━━━━\n💵 សរុបបណ្តោះអាសន្ន: $${subtotal.toFixed(2)}\n\nតើអ្នកចង់បន្ថែមទៀតទេ?`,
      quick_replies: [
        { content_type: 'text', title: '🛍️ ទិញបន្ថែម',      payload: 'MAIN_MENU'  },
        { content_type: 'text', title: '🗑️ លុបកន្ត្រក',     payload: 'CLEAR_CART' },
        { content_type: 'text', title: '💳 ទៅទូទាត់ប្រាក់', payload: 'CHECKOUT'   },
      ],
    },
  })
}

// ── PHONE VALIDATION ──────────────────────────────────────────
async function handlePhone(psid: string, text: string, session: SessionState) {
  const phone      = text.trim()
  const cleanPhone = phone.replace(/[\s\-()]/g, '')

  if (!/^(?:\+855|0)\d{8,9}$/.test(cleanPhone)) {
    return sendText(psid,
      `⚠️ លេខទូរស័ព្ទមិនត្រឹមត្រូវ។ សូមផ្ញើម្តងទៀត:\n(ឧទាហរណ៍: 012 345 678)`
    )
  }

  const updated = { ...session, phone, step: 'waiting_location' as const }
  await saveSession(psid, updated)
  return sendText(psid,
    `📞 ${phone} ✅\n\n📍 សូមផ្ញើអាសយដ្ឋានដឹកជញ្ជូន:\n(ឧទាហរណ៍: ទួលគោក ភ្នំពេញ)`
  )
}

// ── LOCATION ──────────────────────────────────────────────────
async function handleLocation(psid: string, text: string, session: SessionState) {
  const updated = { ...session, location: text.trim(), step: 'selecting_shipping' as const }
  await saveSession(psid, updated)
  return sendShippingSelection(psid)
}

// ── SHIPPING SELECTION ────────────────────────────────────────
async function sendShippingSelection(psid: string) {
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `🛵 សូមជ្រើសរើសតំបន់ដឹកជញ្ជូន:`,
      quick_replies: [
        { content_type: 'text', title: '🛵 ភ្នំពេញ ($1.50)', payload: 'SHIP_PP'   },
        { content_type: 'text', title: '🚚 ខេត្ត ($2.50)',   payload: 'SHIP_PROV' },
      ],
    },
  })
}

// ── PAYMENT SELECTION ─────────────────────────────────────────
async function sendPaymentSelection(psid: string) {
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `💳 សូមជ្រើសរើសវិធីទូទាត់ប្រាក់:`,
      quick_replies: [
        { content_type: 'text', title: '💵 ទូទាត់ពេលទទួល (COD)', payload: 'PAY_COD' },
        { content_type: 'text', title: '🏦 វេរតាម ABA Bank',     payload: 'PAY_ABA' },
      ],
    },
  })
}

// ── ORDER SUMMARY ─────────────────────────────────────────────
async function sendOrderSummary(psid: string, session: SessionState) {
  let itemsSubtotal = 0
  const itemLines = session.cart.map((item, i) => {
    const cost = item.price * item.quantity
    itemsSubtotal += cost
    return `${i + 1}. ${item.productNameKh}\n   🎨 ${item.color} | 📏 ${item.size} | 🔢 x${item.quantity} | 💰 $${cost.toFixed(2)}`
  }).join('\n')

  const shippingFee    = session.shippingOption === 'phnom_penh' ? 1.50 : 2.50
  const grandTotal     = itemsSubtotal + shippingFee
  const shippingLabel  = session.shippingOption === 'phnom_penh' ? 'ភ្នំពេញ ($1.50)' : 'តាមខេត្ត ($2.50)'
  const paymentLabel   = session.paymentMethod  === 'cod'        ? 'ប្រគល់ប្រាក់ពេលទទួល (COD)' : 'ABA Bank (វេរប្រាក់)'

  await sendText(psid,
    `📋 សង្ខេបការបញ្ជាទិញ:\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🛵 ដឹកជញ្ជូន: ${shippingLabel}\n` +
    `💳 វិធីទូទាត់: ${paymentLabel}\n` +
    `💵 សរុបចុងក្រោយ: $${grandTotal.toFixed(2)}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📞 ទូរស័ព្ទ: ${session.phone}\n` +
    `📍 អាសយដ្ឋាន: ${session.location}`
  )

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'តើអ្នកចង់បញ្ជាក់ការបញ្ជាទិញនេះទេ?',
      quick_replies: [
        { content_type: 'text', title: '✅ បញ្ជាក់',  payload: 'CONFIRM_ORDER' },
        { content_type: 'text', title: '❌ បោះបង់', payload: 'CANCEL_ORDER'  },
      ],
    },
  })
}

// ── CONFIRM ORDER ─────────────────────────────────────────────
async function confirmOrder(psid: string, session: SessionState) {
  let itemsSubtotal = 0
  session.cart.forEach(item => { itemsSubtotal += item.price * item.quantity })
  const shippingFee = session.shippingOption === 'phnom_penh' ? 1.50 : 2.50
  const grandTotal  = itemsSubtotal + shippingFee

  // 1. Reply to customer
  if (session.paymentMethod === 'aba') {
    await sendText(psid,
      `🎉 អរគុណសម្រាប់ការបញ្ជាទិញ!\n\n` +
      `🏦 សូមវេរប្រាក់ $${grandTotal.toFixed(2)} មកកាន់:\n` +
      `• ឈ្មោះ: DORMAX STORE\n` +
      `• ABA: 000 111 222\n\n` +
      `បន្ទាប់ពីវេររួច សូមផ្ញើ Screenshot វិក្កយបត្រ 🙏`
    )
  } else {
    await sendText(psid,
      `🎉 អរគុណសម្រាប់ការបញ្ជាទិញ!\n` +
      `យើងនឹងទំនាក់ទំនងអ្នកឆាប់ៗ 🙏\n` +
      `DORMAX — Simple Style For Man 🇰🇭`
    )
  }

  // 2. Save order to DB
  try {
    await prisma.messengerOrder.create({
      data: {
        psid,
        items:         session.cart as object[],
        phone:         session.phone,
        location:      session.location,
        shippingOption: session.shippingOption!,
        paymentMethod:  session.paymentMethod!,
        subtotal:      itemsSubtotal,
        shippingFee:   shippingFee,
        grandTotal:    grandTotal,
      },
    })
    console.log('✅ Order saved to DB for PSID:', psid)
  } catch (err) {
    console.error('❌ Failed to save order to DB:', err)
  }

  // 3. Telegram notification
  await sendTelegramNotification(session, grandTotal)

  // 4. Clean up session
  await resetSession(psid)
}

// ── TELEGRAM NOTIFICATION ─────────────────────────────────────
async function sendTelegramNotification(session: SessionState, grandTotal: number) {
  const now = new Date()
  const cambodiaTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)

  const itemLines = session.cart.map(item => {
    const cost = item.price * item.quantity
    return `📦 ${item.productName}\n🎨 ពណ៌: ${item.color}\n📏 ទំហំ: ${item.size} | 🔢 x${item.quantity} | 💰 $${cost.toFixed(2)}`
  }).join('\n\n')

  const shippingLabel = session.shippingOption === 'phnom_penh' ? 'Phnom Penh ($1.50)' : 'Province ($2.50)'
  const paymentLabel  = session.paymentMethod  === 'cod'        ? 'Cash on Delivery (COD)' : 'ABA Bank transfer'

  const message =
    `🛒 បញ្ជាទិញថ្មី — DORMAX\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🛵 ដឹកជញ្ជូន: ${shippingLabel}\n` +
    `💳 វិធីទូទាត់: ${paymentLabel}\n` +
    `💵 Grand Total: $${grandTotal.toFixed(2)}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📞 ទូរស័ព្ទ: ${session.phone}\n` +
    `📍 អាសយដ្ឋាន: ${session.location}\n` +
    `🕐 ${cambodiaTime}`

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
      }
    )
    if (!res.ok) {
      console.error('Telegram error:', JSON.stringify(await res.json()))
    } else {
      console.log('Telegram notification sent ✅')
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