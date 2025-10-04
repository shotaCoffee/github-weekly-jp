import fs from 'fs/promises';
import path from 'path';
import type { TrendingData, Period } from '@/types';

const CACHE_DIR = path.join(process.cwd(), 'public', 'data');

function getCacheFileName(period: Period = 'weekly', language: string = ''): string {
  const lang = language ? `_${language}` : '';
  return `trending_${period}${lang}.json`;
}

export async function saveCache(data: TrendingData): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const fileName = getCacheFileName(data.period, data.language);
  const filePath = path.join(CACHE_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function loadCache(
  period: Period = 'weekly',
  language: string = ''
): Promise<TrendingData | null> {
  try {
    const fileName = getCacheFileName(period, language);
    const filePath = path.join(CACHE_DIR, fileName);
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
