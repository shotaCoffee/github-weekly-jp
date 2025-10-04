import { NextResponse } from 'next/server';
import { scrapeTrending } from '@/lib/scraper';
import { enrichBatch } from '@/lib/github';
import { translateBatch } from '@/lib/translator';
import { saveCache, loadCache, isCacheValid } from '@/lib/cache';
import type { TrendingData, Period } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || '';
  const period = (searchParams.get('period') || 'weekly') as Period;
  const forceRefresh = searchParams.get('force') === 'true';

  try {
    // キャッシュチェック
    if (!forceRefresh) {
      const cached = await loadCache(period, language);
      if (cached && isCacheValid(cached.date)) {
        return NextResponse.json(cached);
      }
    }

    // 1. スクレイピング
    let repos = await scrapeTrending(language, period);

    // 2. GitHub API補完
    repos = await enrichBatch(repos);

    // 3. 日本語翻訳
    repos = await translateBatch(repos);

    const trendingData: TrendingData = {
      date: new Date().toISOString(),
      repos,
      period,
      language: language || undefined,
    };

    // キャッシュ保存
    await saveCache(trendingData);

    return NextResponse.json(trendingData);
  } catch {
    // エラー時はキャッシュを返す
    const cached = await loadCache(period, language);
    if (cached) {
      return NextResponse.json(cached);
    }

    return NextResponse.json(
      { error: 'Failed to fetch trending repositories' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Hobby Planは60秒まで
