import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';

const VALID_KEYS = ['greetingAudioUrl', 'productAudioUrl'] as const;
type SettingKey = typeof VALID_KEYS[number];

// GET /api/bot-settings — returns all audio settings
export async function GET() {
  try {
    const rows = await prisma.botSettings.findMany({
      where: { key: { in: [...VALID_KEYS] } },
    });

    const settings: Record<string, string> = {};
    for (const key of VALID_KEYS) {
      settings[key] = rows.find((r) => r.key === key)?.value ?? '';
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error('Failed to load bot settings:', err);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

// PUT /api/bot-settings — upsert one or more audio settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as Partial<Record<SettingKey, string>>;

    const updates = Object.entries(body).filter(([key]) =>
      VALID_KEYS.includes(key as SettingKey)
    );

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid keys provided' }, { status: 400 });
    }

    await Promise.all(
      updates.map(([key, value]) =>
        prisma.botSettings.upsert({
          where: { key },
          create: { key, value: value ?? '' },
          update: { value: value ?? '' },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to save bot settings:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
