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
  color: string
  size: string
  quantity: number
}

type SessionState = {
  step: 'idle' | 'selecting_color' | 'selecting_size' | 'selecting_quantity' | 'waiting_phone' | 'waiting_location' | 'selecting_shipping' | 'selecting_payment' | 'confirming'
  currentProduct: Product | null
  selectedColor: string
  selectedSize: string
  cart: CartItem[]
  phone: string
  location: string
  shippingOption: 'phnom_penh' | 'province' | null
  paymentMethod: 'cod' | 'aba' | null
}

const sessions = new Map<string, SessionState>()

function getSession(psid: string): SessionState {
  if (!sessions.has(psid)) {
    sessions.set(psid, {
      step: 'idle',
      currentProduct: null,
      selectedColor: '',
      selectedSize: '',
      cart: [],
      phone: '',
      location: '',
      shippingOption: null,
      paymentMethod: null,
    })
  }
  return sessions.get(psid)!
}

function resetSession(psid: string) {
  sessions.delete(psid)
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

      const message = event.message
      const postback = event.postback

      // Extract quick reply payload or fallback to postback payload
      const payload = message?.quick_reply?.payload || postback?.payload

      if (payload) {
        await handlePostback(psid, payload)
      } else if (message?.text) {
        await handleText(psid, message.text)
      }
    })
  })

  // Process all incoming events concurrently
  await Promise.all(promises)

  return new NextResponse('OK', { status: 200 })
}

// ── HANDLE TEXT ───────────────────────────────────────────────
async function handleText(psid: string, text: string) {
  const session = getSession(psid)
  const t = text.trim()

  // Mid-order flow text inputs take priority
  if (session.step === 'waiting_phone')    return handlePhone(psid, t)
  if (session.step === 'waiting_location') return handleLocation(psid, t)

  // Quick reply title text detection fallback
  if (t.includes('ខោខ្លី'))  return sendCategoryProducts(psid, 'shorts')
  if (t.includes('ខោវែង'))  return sendCategoryProducts(psid, 'pants')
  if (t.includes('អាវវែង')) return sendCategoryProducts(psid, 'polo')
  if (t.includes('អាវខ្លី')) return sendCategoryProducts(psid, 'tshirt')
  if (t.includes('បន្ថែម') || t.includes('ម៉ឺនុយ')) {
    resetSession(psid)
    return sendMainMenu(psid)
  }
  if (t.includes('បញ្ចប់') && session.cart.length > 0) {
    session.step = 'waiting_phone'
    return sendText(psid, `📞 សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នក:\n(ឧទាហរណ៍: 012 345 678)`)
  }

  // Default → Main Menu
  resetSession(psid)
  return sendMainMenu(psid)
}

// ── HANDLE POSTBACK / QUICK REPLY PAYLOADS ───────────────────
async function handlePostback(psid: string, payload: string) {
  const session = getSession(psid)

  // Main menu navigation
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
    session.selectedColor = ''
    session.selectedSize = ''
    session.step = 'selecting_color'
    return sendColorSelection(psid, product)
  }

  // Color selection
  if (payload.startsWith('COLOR_')) {
    if (session.step !== 'selecting_color' || !session.currentProduct) return
    const color = payload.replace('COLOR_', '').replace(/_/g, ' ')
    session.selectedColor = color
    session.step = 'selecting_size'
    return sendSizeSelection(psid, session.currentProduct)
  }

  // Size selection
  if (payload.startsWith('SIZE_')) {
    if (session.step !== 'selecting_size' || !session.currentProduct) return
    const size = payload.replace('SIZE_', '')
    session.selectedSize = size
    session.step = 'selecting_quantity'
    return sendQuantitySelection(psid)
  }

  // Quantity selection
  if (payload.startsWith('QTY_')) {
    if (session.step !== 'selecting_quantity' || !session.currentProduct || !session.selectedColor || !session.selectedSize) return
    const qty = parseInt(payload.replace('QTY_', ''), 10) || 1
    session.cart.push({
      product: session.currentProduct,
      color: session.selectedColor,
      size: session.selectedSize,
      quantity: qty,
    })

    const lastItem = session.cart[session.cart.length - 1]
    
    // Reset selection states
    session.step = 'idle'
    session.currentProduct = null
    session.selectedColor = ''
    session.selectedSize = ''

    await sendText(psid,
      `✅ បានបន្ថែមទៅកន្ត្រក!\n\n` +
      `🛍️ ${lastItem.product.nameKh}\n` +
      `🎨 ពណ៌: ${lastItem.color}\n` +
      `📏 ទំហំ: ${lastItem.size}\n` +
      `🔢 ចំនួន: ${lastItem.quantity}\n` +
      `💰 $${(lastItem.product.price * lastItem.quantity).toFixed(2)}`
    )
    return sendContinueOrCheckout(psid)
  }

  // View Cart
  if (payload === 'VIEW_CART') {
    return sendContinueOrCheckout(psid)
  }

  // Clear Cart
  if (payload === 'CLEAR_CART') {
    resetSession(psid)
    await sendText(psid, '🗑️ កន្ត្រកទំនិញត្រូវបានលុប។')
    return sendMainMenu(psid)
  }

  // Checkout initiation
  if (payload === 'CHECKOUT') {
    if (session.cart.length === 0) {
      return sendText(psid, '⚠️ កន្ត្រករបស់អ្នកទទេ! សូមជ្រើសរើសផលិតផលមុន។')
    }
    session.step = 'waiting_phone'
    return sendText(psid, `📞 សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នក:\n(ឧទាហរណ៍: 012 345 678)`)
  }

  // Shipping selection
  if (payload.startsWith('SHIP_')) {
    if (session.step !== 'selecting_shipping') return
    const option = payload.replace('SHIP_', '') as 'PP' | 'PROV'
    session.shippingOption = option === 'PP' ? 'phnom_penh' : 'province'
    session.step = 'selecting_payment'
    return sendPaymentSelection(psid)
  }

  // Payment selection
  if (payload.startsWith('PAY_')) {
    if (session.step !== 'selecting_payment') return
    const method = payload.replace('PAY_', '') as 'COD' | 'ABA'
    session.paymentMethod = method === 'COD' ? 'cod' : 'aba'
    session.step = 'confirming'
    return sendOrderSummary(psid)
  }

  // Confirm order
  if (payload === 'CONFIRM_ORDER') {
    if (session.step !== 'confirming') return
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
        { content_type: 'text', title: '👖 ខោខ្លី',  payload: 'CAT_SHORTS'  },
        { content_type: 'text', title: '👔 ខោវែង',  payload: 'CAT_PANTS'   },
        { content_type: 'text', title: '👕 អាវវែង', payload: 'CAT_POLO'    },
        { content_type: 'text', title: '👕 អាវខ្លី', payload: 'CAT_TSHIRT'  },
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
    `📏 ទំហំដែលមាន: ${product.sizes.join(', ')}\n\n` +
    `🎨 សូមជ្រើសរើសពណ៌:`
  )
  return sendColorButtons(psid, product.colors)
}

async function sendColorButtons(psid: string, colors: string[]) {
  const colorReplies = colors.map(c => ({
    content_type: 'text',
    title: c.length > 13 ? c.slice(0, 13) : c,
    payload: `COLOR_${c.replace(/\s+/g, '_')}`,
  }))

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ពណ៌ដែលមាន:',
      quick_replies: colorReplies,
    },
  })
}

// ── SEND SIZE SELECTION ───────────────────────────────────────
async function sendSizeSelection(psid: string, product: Product) {
  const session = getSession(psid)
  await sendText(psid,
    `🎨 ពណ៌ដែលបានជ្រើស: ${session.selectedColor}\n\n` +
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

// ── SEND QUANTITY SELECTION ───────────────────────────────────
async function sendQuantitySelection(psid: string) {
  const session = getSession(psid)
  if (!session.currentProduct) return

  await sendText(psid,
    `🛍️ ${session.currentProduct.nameKh}\n` +
    `🎨 ពណ៌: ${session.selectedColor}\n` +
    `📏 ទំហំ: ${session.selectedSize}\n\n` +
    `🔢 សូមជ្រើសរើសចំនួន (Quantity):`
  )

  const qtyReplies = [1, 2, 3, 4, 5].map(q => ({
    content_type: 'text',
    title: String(q),
    payload: `QTY_${q}`,
  }))

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: 'ចំនួន:',
      quick_replies: qtyReplies,
    },
  })
}

// ── CONTINUE OR CHECKOUT ──────────────────────────────────────
async function sendContinueOrCheckout(psid: string) {
  const session = getSession(psid)
  
  let subtotal = 0
  const cartSummary = session.cart
    .map((item, i) => {
      const cost = item.product.price * item.quantity
      subtotal += cost
      return `${i + 1}. ${item.product.nameKh} | ${item.color} | ${item.size} x${item.quantity} — $${cost.toFixed(2)}`
    })
    .join('\n')

  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `🛒 កន្ត្រកទំនិញរបស់អ្នក:\n━━━━━━━━━━━━━━━\n${cartSummary}\n━━━━━━━━━━━━━━━\n💵 សរុបបណ្តោះអាសន្ន: $${subtotal.toFixed(2)}\n\nតើអ្នកចង់បន្ថែមទៀតទេ?`,
      quick_replies: [
        { content_type: 'text', title: '🛍️ ទិញបន្ថែម', payload: 'MAIN_MENU' },
        { content_type: 'text', title: '🗑️ លុបកន្ត្រក', payload: 'CLEAR_CART' },
        { content_type: 'text', title: '💳 ទៅទូទាត់ប្រាក់', payload: 'CHECKOUT'  },
      ],
    },
  })
}

// ── ORDER FLOW: PHONE ─────────────────────────────────────────
async function handlePhone(psid: string, text: string) {
  const session = getSession(psid)
  const phone = text.trim()

  // Validate Cambodian phone number format (must starts with 0 or +855 and contains 8-9 digits after)
  const cleanPhone = phone.replace(/[\s\-()]/g, '')
  const isCambodiaPhone = /^(?:\+855|0)\d{8,9}$/.test(cleanPhone)

  if (!isCambodiaPhone) {
    return sendText(psid, `⚠️ លេខទូរស័ព្ទមិនត្រឹមត្រូវឡើយ។ សូមផ្ញើលេខទូរស័ព្ទរបស់អ្នកម្តងទៀត:\n(ឧទាហរណ៍: 012 345 678)`)
  }

  session.phone = phone
  session.step = 'waiting_location'
  return sendText(psid,
    `📞 ${session.phone} ✅\n\n` +
    `📍 សូមផ្ញើអាសយដ្ឋានដឹកជញ្ជូន:\n(ឧទាហរណ៍: ទួលគោក ភ្នំពេញ)`
  )
}

// ── ORDER FLOW: LOCATION ──────────────────────────────────────
async function handleLocation(psid: string, text: string) {
  const session = getSession(psid)
  session.location = text.trim()
  session.step = 'selecting_shipping'
  return sendShippingSelection(psid)
}

// ── SEND SHIPPING SELECTION ───────────────────────────────────
async function sendShippingSelection(psid: string) {
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `🛵 សូមជ្រើសរើសតំបន់ដឹកជញ្ជូន (Shipping Option):`,
      quick_replies: [
        { content_type: 'text', title: '🛵 ភ្នំពេញ ($1.50)', payload: 'SHIP_PP' },
        { content_type: 'text', title: '🚚 ខេត្ត ($2.50)', payload: 'SHIP_PROV' },
      ],
    },
  })
}

// ── SEND PAYMENT SELECTION ────────────────────────────────────
async function sendPaymentSelection(psid: string) {
  await sendRequest({
    recipient: { id: psid },
    message: {
      text: `💳 សូមជ្រើសរើសវិធីទូទាត់ប្រាក់ (Payment Method):`,
      quick_replies: [
        { content_type: 'text', title: '💵 ទូទាត់ពេលទទួល (COD)', payload: 'PAY_COD' },
        { content_type: 'text', title: '🏦 វេរតាម ABA Bank', payload: 'PAY_ABA' },
      ],
    },
  })
}

// ── SEND ORDER SUMMARY ────────────────────────────────────────
async function sendOrderSummary(psid: string) {
  const session = getSession(psid)

  let itemsSubtotal = 0
  const itemLines = session.cart.map((item, i) => {
    const cost = item.product.price * item.quantity
    itemsSubtotal += cost
    return `${i + 1}. ${item.product.nameKh}\n   🎨 ${item.color} | 📏 ${item.size} | 🔢 x${item.quantity} | 💰 $${cost.toFixed(2)}`
  }).join('\n')

  const shippingFee = session.shippingOption === 'phnom_penh' ? 1.50 : 2.50
  const grandTotal = itemsSubtotal + shippingFee
  const shippingLabel = session.shippingOption === 'phnom_penh' ? 'ភ្នំពេញ ($1.50)' : 'តាមខេត្ត ($2.50)'
  const paymentLabel = session.paymentMethod === 'cod' ? 'ប្រគល់ប្រាក់ពេលទទួល (COD)' : 'ABA Bank (វេរប្រាក់)'

  await sendText(psid,
    `📋 សង្ខេបការបញ្ជាទិញ:\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🛵 ដឹកជញ្ជូន: ${shippingLabel}\n` +
    `💳 វិធីទូទាត់: ${paymentLabel}\n` +
    `💵 សរុបចុងក្រោយ (Grand Total): $${grandTotal.toFixed(2)}\n` +
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
async function confirmOrder(psid: string) {
  const session = getSession(psid)

  const itemsSubtotal = session.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shippingFee = session.shippingOption === 'phnom_penh' ? 1.50 : 2.50
  const grandTotal = itemsSubtotal + shippingFee

  // Reply to customer
  if (session.paymentMethod === 'aba') {
    await sendText(psid,
      `🎉 អរគុណសម្រាប់ការបញ្ជាទិញ!\n\n` +
      `🏦 សូមវេរប្រាក់ចំនួន $${grandTotal.toFixed(2)} មកកាន់គណនី ABA របស់យើង៖\n` +
      `• ឈ្មោះគណនី: DORMAX STORE\n` +
      `• លេខគណនី: 000 111 222\n\n` +
      `បន្ទាប់ពីវេររួច សូមផ្ញើរូបភាពវិក្កយបត្រ (Screenshot) មកទីនេះ។ យើងនឹងទំនាក់ទំនងទៅអ្នកភ្លាមៗ 🙏`
    )
  } else {
    await sendText(psid,
      `🎉 អរគុណសម្រាប់ការបញ្ជាទិញ!\n` +
      `យើងនឹងទំនាក់ទំនងអ្នកឆាប់ៗដើម្បីដឹកជញ្ជូន 🙏\n` +
      `DORMAX — Simple Style For Man 🇰🇭`
    )
  }

  // Send Telegram notification
  await sendTelegramNotification(session)

  // Log to console
  console.log('🛒 NEW ORDER CONTEXT:', JSON.stringify({
    cart: session.cart.map(i => ({
      product: i.product.name,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      price: i.product.price,
    })),
    phone: session.phone,
    location: session.location,
    shippingOption: session.shippingOption,
    paymentMethod: session.paymentMethod,
    grandTotal: grandTotal,
  }, null, 2))

  // Clean up session completely to prevent memory leaks
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

  let itemsSubtotal = 0
  const itemLines = session.cart.map(item => {
    const cost = item.product.price * item.quantity
    itemsSubtotal += cost
    return `📦 ${item.product.name}\n🎨 ពណ៌: ${item.color}\n📏 ទំហំ: ${item.size} | 🔢 ចំនួន: ${item.quantity} | 💰 $${cost.toFixed(2)}`
  }).join('\n\n')

  const shippingFee = session.shippingOption === 'phnom_penh' ? 1.50 : 2.50
  const grandTotal = itemsSubtotal + shippingFee
  const shippingLabel = session.shippingOption === 'phnom_penh' ? 'Phnom Penh ($1.50)' : 'Province ($2.50)'
  const paymentLabel = session.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'ABA Bank transfer'

  const message =
    `🛒 បញ្ជាទិញថ្មី — DORMAX\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${itemLines}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `🛵 ដឹកជញ្ជូន: ${shippingLabel}\n` +
    `💳 វិធីទូទាត់: ${paymentLabel}\n` +
    `💵 សរុបចុងក្រោយ (Grand Total): $${grandTotal.toFixed(2)}\n` +
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