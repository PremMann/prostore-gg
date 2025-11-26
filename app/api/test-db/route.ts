import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;

    return NextResponse.json({
        hasDbUrl: !!dbUrl,
        dbUrlPrefix: dbUrl?.substring(0, 30) + '...',
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
}
