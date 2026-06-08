import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// ── GET /api/messenger-orders ─────────────────────────────────
// Returns all Messenger bot orders. Protected — admin only.
export async function GET(req: NextRequest) {
  // Auth guard — only admins can access
  const session = await auth()
  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))
  const skip  = (page - 1) * limit

  const [orders, total] = await Promise.all([
    prisma.messengerOrder.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.messengerOrder.count(),
  ])

  return NextResponse.json({
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}
