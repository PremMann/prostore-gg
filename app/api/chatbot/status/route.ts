import { NextResponse } from 'next/server'
import { auth } from '@/auth'

function hasEnv(name: string) {
  return Boolean(process.env[name])
}

export async function GET() {
  const session = await auth()
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    webhook: {
      verifyTokenConfigured: hasEnv('VERIFY_TOKEN'),
      pageAccessTokenConfigured: hasEnv('PAGE_ACCESS_TOKEN'),
    },
    telegram: {
      botTokenConfigured: hasEnv('TELEGRAM_BOT_TOKEN'),
      chatIdConfigured: hasEnv('TELEGRAM_CHAT_ID'),
    },
  })
}

