import { NextResponse } from 'next/server';
import { scrapeTrending } from '@/lib/scraper';
import { enrichBatch } from '@/lib/github';
import { translateBatch } from '@/lib/translator';
import { saveCache } from '@/lib/cache';
import type { TrendingData } from '@/types';

export async function GET(request: Request) {
  // Vercel Cron認証
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // トレンドデータ更新（全言語、daily）
    let repos = await scrapeTrending('', 'daily');
    repos = await enrichBatch(repos);
    repos = await translateBatch(repos);

    const trendingData: TrendingData = {
      date: new Date().toISOString(),
      repos,
      period: 'daily',
    };

    await saveCache(trendingData);

    return NextResponse.json({
      success: true,
      count: repos.length,
      date: trendingData.date,
      period: 'daily',
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
