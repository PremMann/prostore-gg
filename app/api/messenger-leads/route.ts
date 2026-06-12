import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'

const LEAD_STATUSES = new Set(['new', 'contacted', 'closed'])

async function requireAdmin() {
  const session = await auth()
  return Boolean(session && (session.user as { role?: string })?.role === 'admin')
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10', 10))
  const skip = (page - 1) * limit

  const [leads, total] = await Promise.all([
    prisma.messengerLead.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.messengerLead.count(),
  ])

  return NextResponse.json({
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const status = typeof body?.status === 'string' ? body.status : ''

  if (!id || !LEAD_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid lead status update' }, { status: 400 })
  }

  const lead = await prisma.messengerLead.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json({ lead })
}

