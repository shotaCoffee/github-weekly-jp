import { describe, it, expect } from 'vitest';
import type { TrendingData } from '@/types';
import { saveCache, loadCache, isCacheValid } from './cache';

describe('cache', () => {
  const mockData: TrendingData = {
    date: '2025-10-04T00:00:00.000Z',
    repos: [],
    period: 'weekly',
  };

  describe('saveCache', () => {
    it('should save and load cache data', async () => {
      await saveCache(mockData);

      const result = await loadCache('weekly');

      expect(result).toEqual(mockData);
    });

    it('should save cache with period-specific filename', async () => {
      const dailyData = { ...mockData, period: 'daily' as const };
      await saveCache(dailyData);

      const result = await loadCache('daily');

      expect(result).toEqual(dailyData);
    });

    it('should save cache with language-specific filename', async () => {
      const jsData = { ...mockData, language: 'javascript' };
      await saveCache(jsData);

      const result = await loadCache('weekly', 'javascript');

      expect(result).toEqual(jsData);
    });
  });

  describe('loadCache', () => {
    it('should return null when file does not exist', async () => {
      const result = await loadCache('daily', 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('isCacheValid', () => {
    it('should return true for recent cache', () => {
      const recentDate = new Date(Date.now() - 1000 * 60 * 30).toISOString(); // 30分前

      const result = isCacheValid(recentDate, 24);

      expect(result).toBe(true);
    });

    it('should return false for old cache', () => {
      const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(); // 25時間前

      const result = isCacheValid(oldDate, 24);

      expect(result).toBe(false);
    });

    it('should use custom maxAgeHours', () => {
      const date = new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(); // 2時間前

      expect(isCacheValid(date, 1)).toBe(false);
      expect(isCacheValid(date, 3)).toBe(true);
    });
  });
});
