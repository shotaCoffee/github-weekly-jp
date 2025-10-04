import fs from 'fs/promises';
import path from 'path';
import type { TrendingData, Period } from '@/types';

const CACHE_DIR = path.join(process.cwd(), 'public', 'data');
const isProduction = process.env.NODE_ENV === 'production';

// メモリキャッシュ（本番環境用）
const memoryCache = new Map<string, TrendingData>();

function getCacheFileName(period: Period = 'weekly', language: string = ''): string {
  const lang = language ? `_${language}` : '';
  return `trending_${period}${lang}.json`;
}

function getCacheKey(period: Period = 'weekly', language: string = ''): string {
  return getCacheFileName(period, language);
}

export async function saveCache(data: TrendingData): Promise<void> {
  const cacheKey = getCacheKey(data.period, data.language);

  // 本番環境ではメモリキャッシュのみ使用
  if (isProduction) {
    memoryCache.set(cacheKey, data);
    return;
  }

  // 開発環境ではファイルシステムに保存
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = path.join(CACHE_DIR, cacheKey);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save cache to file:', error);
  }
}

export async function loadCache(
  period: Period = 'weekly',
  language: string = ''
): Promise<TrendingData | null> {
  const cacheKey = getCacheKey(period, language);

  // 本番環境ではメモリキャッシュから取得
  if (isProduction) {
    return memoryCache.get(cacheKey) || null;
  }

  // 開発環境ではファイルシステムから読み込み
  try {
    const filePath = path.join(CACHE_DIR, cacheKey);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function isCacheValid(cacheDate: string, maxAgeHours: number = 24): boolean {
  const cache = new Date(cacheDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - cache.getTime()) / (1000 * 60 * 60);
  return hoursDiff < maxAgeHours;
}
