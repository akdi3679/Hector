// app/api/cron/ping/route.ts
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// ⭐ Route appelée par Vercel Cron pour garder Redis actif
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // ⭐ Vérification d'auth pour le cron (secret)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    // Ping Redis pour le garder actif
    const result = await redis.ping();

    return NextResponse.json({
      status: 'ok',
      redis: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[cron-ping] Error:', err);
    return NextResponse.json(
      { error: 'Redis ping failed' },
      { status: 500 }
    );
  }
}