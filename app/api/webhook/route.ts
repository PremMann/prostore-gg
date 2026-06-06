import { NextRequest, NextResponse } from 'next/server'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN!
const VERIFY_TOKEN      = process.env.VERIFY_TOKEN!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID!
const GRAPH_URL          = 'https://graph.facebook.com/v19.0/me/messages'

// ── PRODUCT CATALOG ───────────────────────────────────────────
type Product = {
  id: string
  name: string
  nameKh: string
  price: number
  colors: string[]
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
    colors: ['⚫ Black', '🔵 Navy', '🩶 Grey', '🟤 Khaki', '⚪ White'],
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
    colors: ['⚫ Black', '🔵 Navy', '🟢 Army Green', '🟤 Khaki'],
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
    colors: ['⚫ Black', '🔵 Navy', '🟢 Army Green', '🟤 Khaki'],
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
    colors: ['⚫ Black', '🟤 Brown', '🟡 Cream', '⚪ White'],
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
    colors: ['⚫ Black', '🟤 Khaki', '⚪ White'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    image: 'https://zqok3vn32ri21uvw.public.blob.vercel-storage.com/uploads/1772766535501_2026-02-26_22.04.02-eSPbBRIQ9F7KIGTo8rpLFPYKRwIGT6.jpg',
    url: 'https://prostore-gg.vercel.app/product/dormax',
    category: 'tshirt',
  },
]

// ── SESSION STATE ─────────────────────────────────────────────
type CartItem = {
  product: Product
  colors: string[]
  size: string
}

type SessionState = {
  step: 'idle' | 'selecting_color' | 'selecting_size' | 'waiting_phone' | 'waiting_location' | 'confirming'
  currentProduct: Product | null
  selectedColors: string[]
  cart: CartItem[]
  phone: string
  location: string
}

const sessions = new Map<string, SessionState>()

function getSession(psid: string): SessionState {
  if (!sessions.has(psid)) {
    sessions.set(psid, {
      step: 'idle',
      currentProduct: null,
      selectedColors: [],
      cart: [],
      phone: '',
      location: '',
    })
  }
  return sessions.get(psid)!
}

function resetSession(psid: string) {
  sessions.set(psid, {
    step: 'idle',
    currentProduct: null,
    selectedColors: [],
    cart: [],
    phone: '',
    location: '',
  })
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
  const body = await req.json() as {
    object?: string
    entry?: Array<{ messaging?: Array<Record<string, unknown>> }>
  }

  if (body.object !== 'page') {
    return new NextResponse('OK', { status: 200 })
  }

  for (const entry of body.entry ?? []) {
    const event = entry.messaging?.[0]
    if (!event) continue

    const sender  = event.sender as { id?: string } | undefined
    const psid    = sender?.id
    if (!psid) continue

    console.log('EVENT from PSID:', psid)

    const message  = event.message  as { text?: string } | undefined
    const postback = event.postback as { payload?: string } | undefined

    if (message?.text) {
      await handleText(psid, String(message.text))
    } else if (postback?.payload) {
      await handlePostback(psid, String(postback.payload))
    }
  }

  return new NextResponse('OK', { status: 200 })
}

// ── HANDLE TEXT ───────────────────────────────────────────────
async function handleText(psid: string, text: string) {
  const session = getSession(psid)

  if (session.step === 'waiting_phone')    return handlePhone(psid, text)
  if (session.step === 'waiting_location') return handleLocation(psid, text)

  // Any text → show main menu
  return sendMainMenu(psid)
}

// ── HANDLE POSTBACK ───────────────────────────────────────────
async function handlePostback(psid: string, payload: string) {
  const session = getSession(psid)

  // Main menu
  if (payload === 'GET_STARTED' || payload === 'MAIN_MENU') {
    resetSession(psid)
    return sendMainMenu(psid)
  }

  // Category selection
  if (payload.startsWith('CAT_')) {
    const cat = payload.replace('CAT_', '').toLowerCase() as Product['category']
    return sendCategoryProducts(psid, cat)
  }

  // Order a product
  if (payload.startsWith('ORDER_')) {
    const productId = payload.replace('ORDER_', '')
    const product   = PRODUCTS.find(p => p.id === productId)
    if (!product) return

    session.currentProduct = product
    session.selectedColors = []
    session.step = 'selecting_color'
    return sendColorSelection(psid, product)
  }

  // Color selection
  if (payload.startsWith('COLOR_')) {
    if (session.step !== 'selecting_color' || !session.currentProduct) return
    const color = payload.replace('COLOR_', '').replace(/_/g, ' ')
    // Add color if not already selected
    if (!session.selectedColors.includes(color)) {
      session.selectedColors.push(color)
    }
    const remaining = session.currentProduct.colors.filter(
      c => !session.selectedColors.includes(c)
    )
    if (remaining.length === 0) {
      // All colors selected, auto-proceed to size
      return sendSizeSelection(psid, session.currentProduct)
    }
    await sendText(psid,
      `✅ ${color} បានជ្រើស!\n\n` +
      `ពណ៌ដែលបានជ្រើស: ${session.selectedColors.join(', ')}\n\n` +
      `ជ្រើសពណ៌បន្ថែម ឬចុច ✅ បញ្ចប់:`
    )
    return sendColorButtons(psid, remaining)
  }

  // Done selecting colors
  if (payload === 'COLORS_DONE') {
    if (!session.currentProduct || session.selectedColors.length === 0) {
      return sendText(psid, '⚠️ សូមជ្រើសរើសពណ៌យ៉ាងហោចណាស់មួយ!')
    }
    session.step = 'selecting_size'
    return sendSizeSelection(psid, session.currentProduct)
  }

  // Size selection
  if (payload.startsWith('SIZE_')) {
    if (!session.currentProduct) return
    const size = payload.replace('SIZE_', '')
    session.cart.push({
      product: session.currentProduct,
      colors:  [...session.selectedColors],
      size,
    })
    session.step = 'idle'
    session.currentProduct = null
    session.selectedColors = []

    const lastItem = session.cart[session.cart.length - 1]
    await sendText(psid,
      `✅ បានបន្ថែមទៅកន្ត្រក!\n\n` +
      `🛍️ ${lastItem.product.nameKh}\n` +
      `🎨 ពណ៌: ${lastItem.colors.join(', ')}\n` +
      `📏 ទំហំ: ${lastItem.size}\n` +
      `💰 $${lastItem.product.price.toFixed(2)}`
    )
    return sendContinueOrCheckout(psid)
  }

  // Checkout
  if (payload === 'CHECKOUT') {
    if (session.cart.length === 0) {
      return sendText(psid, '⚠️ កន្ត្រករបស់អ្នកទទេ! សូមជ្រើសរើសផលិតផលមុន។')
    }
    session.step = 'waiting_phone'
    return sendText(psid,
      `📞 សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នក:\n(ឧទាហរណ៍: 012 345 678)`
    )
  }

  // Confirm order
  if (payload === 'CONFIRM_ORDER') {
    return confirmOrder(psid)
  }

  // Cancel order
  if (payload === 'CANCEL_ORDER') {
    resetSession(psid)
    await sendText(psid,
      `❌ បានបោះបង់ការបញ្ជាទិញ។\nចុចខាងក្រោមដើម្បីចាប់ផ្តើមម្តងទៀត 😊`
    )
    return sendMainMenu(psid)
  }
}

// ── SEND MAIN MENU ────────────────────────────────────────────
async function sendMainMenu(psid: string) {
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `សូមស្វាគមន៍មក DORMAX 👋\nSimple Style For Man 🇰🇭\n\nសូមជ្រើសរើសប្រភេទផលិតផល:`,
      quick_replies: [
        { content_type: 'text', title: '👖 ខោខ្លី', payload: 'CAT_SHORTS' },
        { content_type: 'text', title: '👔 ខោវែង', payload: 'CAT_PANTS'  },
        { content_type: 'text', title: '👕 អាវវែង', payload: 'CAT_POLO'  },
        { content_type: 'text', title: '👕 អាវខ្លី', payload: 'CAT_TSHIRT'},
      ],
    },
  })
}

// ── SEND CATEGORY PRODUCTS ────────────────────────────────────
async function sendCategoryProducts(psid: string, category: Product['category']) {
  const products = PRODUCTS.filter(p => p.category === category)
  if (products.length === 0) return sendMainMenu(psid)

  await sendTyping(psid)

  const elements = products.map(p => ({
    title:     `${p.nameKh} — $${p.price.toFixed(2)}`,
    subtitle:  `📏 ${p.sizes.join(' ')} | 🎨 ${p.colors.length} ពណ៌`,
    image_url: p.image,
    default_action: {
      type: 'web_url',
      url:  p.url,
      webview_height_ratio: 'tall',
    },
    buttons: [
      { type: 'web_url',  url: p.url,              title: '👁️ មើលលម្អិត' },
      { type: 'postback', payload: `ORDER_${p.id}`, title: '🛍️ បញ្ជាទិញ'  },
    ],
  }))

  await sendRequest({
    recipient: { id: psid },
    message: {
      attachment: {
        type: 'template',
        payload: { template_type: 'generic', elements },
      },
    },
  })

  // Back button
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ឬត្រឡប់ទៅម៉ឺនុយដើម:',
      quick_replies: [
        { content_type: 'text', title: '🔙 ម៉ឺនុយដើម', payload: 'MAIN_MENU' },
      ],
    },
  })
}

// ── SEND COLOR SELECTION ──────────────────────────────────────
async function sendColorSelection(psid: string, product: Product) {
  await sendText(psid,
    `🛍️ ${product.nameKh}\n` +
    `💰 $${product.price.toFixed(2)}\n` +
    `📏 ទំហំ: ${product.sizes.join(', ')}\n\n` +
    `🎨 សូមជ្រើសរើសពណ៌ (អាចជ្រើសបានច្រើន):\n` +
    `(ចុច ✅ បញ្ចប់ នៅពេលអ្នកជ្រើសរួច)`
  )
  return sendColorButtons(psid, product.colors)
}

async function sendColorButtons(psid: string, colors: string[]) {
  const colorReplies = colors.map(c => ({
    content_type: 'text',
    title: c.length > 13 ? c.slice(0, 13) : c,
    payload: `COLOR_${c.replace(/\s+/g, '_')}`,
  }))

  colorReplies.push({
    content_type: 'text',
    title: '✅ បញ្ចប់',
    payload: 'COLORS_DONE',
  })

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ជ្រើសរើសពណ៌:',
      quick_replies: colorReplies,
    },
  })
}

// ── SEND SIZE SELECTION ───────────────────────────────────────
async function sendSizeSelection(psid: string, product: Product) {
  const session = getSession(psid)
  await sendText(psid,
    `✅ ពណ៌ដែលបានជ្រើស: ${session.selectedColors.join(', ')}\n\n` +
    `📏 សូមជ្រើសរើសទំហំ:`
  )

  const sizeReplies = product.sizes.map(s => ({
    content_type: 'text',
    title: s,
    payload: `SIZE_${s}`,
  }))

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ទំហំដែលមាន:',
      quick_replies: sizeReplies,
    },
  })
}

// ── CONTINUE OR CHECKOUT ──────────────────────────────────────
async function sendContinueOrCheckout(psid: string) {
  const session = getSession(psid)
  const cartSummary = session.cart
    .map((item, i) => `${i + 1}. ${item.product.nameKh} | ${item.colors.join('+')} | ${item.size}`)
    .join('\n')

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `🛒 កន្ត្រករបស់អ្នក:\n${cartSummary}\n\nតើអ្នកចង់បន្ថែមទៀតទេ?`,
      quick_replies: [
        { content_type: 'text', title: '🛍️ បន្ថែមទៀត', payload: 'MAIN_MENU' },
        { content_type: 'text', title: '🛒 បញ្ចប់',    payload: 'CHECKOUT'  },
      ],
    },
  })
}

// ── ORDER FLOW: PHONE ─────────────────────────────────────────
async function handlePhone(psid: string, text: string) {
  const session  = getSession(psid)
  session.phone  = text.trim()
  session.step   = 'waiting_location'
  return sendText(psid,
    `📞 ${session.phone} ✅\n\n` +
    `📍 សូមផ្ញើអាសយដ្ឋានដឹកជញ្ជូន:\n(ឧទាហរណ៍: ទួលគោក ភ្នំពេញ)`
  )
}

// ── ORDER FLOW: LOCATION ──────────────────────────────────────
async function handleLocation(psid: string, text: string) {
  const session    = getSession(psid)
  session.location = text.trim()
  session.step     = 'confirming'
  return sendOrderSummary(psid)
}

// ── SEND ORDER SUMMARY ────────────────────────────────────────
async function sendOrderSummary(psid: string) {
  const session = getSession(psid)

  const itemLines = session.cart.map((item, i) =>
    `${i + 1}. ${item.product.nameKh}\n   🎨 ${item.colors.join(', ')} | 📏 ${item.size} | 💰 $${item.product.price.toFixed(2)}`
  ).join('\n')

  await sendText(psid,
    `📋 សង្ខេបការបញ្ជាទិញ:\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📞 ${session.phone}\n` +
    `📍 ${session.location}`
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
async function confirmOrder(psid: string) {
  const session = getSession(psid)

  // Reply to customer
  await sendText(psid,
    `🎉 អរគុណសម្រាប់ការបញ្ជាទិញ!\n` +
    `យើងនឹងទំនាក់ទំនងអ្នកឆាប់ៗ 🙏\n` +
    `DORMAX — Simple Style For Man 🇰🇭`
  )

  // Send Telegram notification
  await sendTelegramNotification(session)

  // Log to console
  console.log('🛒 NEW ORDER:', JSON.stringify({
    cart: session.cart.map(i => ({
      product: i.product.name,
      colors: i.colors,
      size: i.size,
      price: i.product.price,
    })),
    phone: session.phone,
    location: session.location,
  }, null, 2))

  resetSession(psid)
}

// ── TELEGRAM NOTIFICATION ─────────────────────────────────────
async function sendTelegramNotification(session: SessionState) {
  const now = new Date()
  const cambodiaTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)

  const itemLines = session.cart.map(item =>
    `📦 ${item.product.name}\n🎨 ពណ៌: ${item.colors.join(', ')}\n📏 ទំហំ: ${item.size} | 💰 $${item.product.price.toFixed(2)}`
  ).join('\n\n')

  const message =
    `🛒 បញ្ជាទិញថ្មី — DORMAX\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📞 ${session.phone}\n` +
    `📍 ${session.location}\n` +
    `🕐 ${cambodiaTime}`

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    )
    if (!res.ok) {
      const err = await res.json()
      console.error('Telegram error:', JSON.stringify(err))
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
  await new Promise(r => setTimeout(r, 800))
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