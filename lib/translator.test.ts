import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import type { TrendingRepo } from '@/types';

vi.mock('axios');

describe('translator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('translateDescription', () => {
    it('should translate description using OpenAI API', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          choices: [
            {
              message: {
                content: 'React フレームワーク',
              },
            },
          ],
        },
      });

      const { translateDescription } = await import('./translator');
      const result = await translateDescription('The React Framework', 'vercel/next.js');

      expect(result).toBe('React フレームワーク');
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          model: 'gpt-4o-mini',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
            }),
          ]),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('should return empty string for empty description', async () => {
      const { translateDescription } = await import('./translator');
      const result = await translateDescription('', 'test/repo');

      expect(result).toBe('');
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should return original description on API error', async () => {
      vi.mocked(axios.post).mockRejectedValue(new Error('API Error'));

      const { translateDescription } = await import('./translator');
      const result = await translateDescription('Original text', 'test/repo');

      expect(result).toBe('Original text');
    });
  });

  describe('translateBatch', () => {
    const mockRepos: TrendingRepo[] = [
      {
        name: 'test/repo1',
        owner: 'test',
        repo: 'repo1',
        description: 'Test 1',
        descriptionJa: '',
        language: 'TypeScript',
        languageColor: '#3178c6',
        stars: 1000,
        starsThisWeek: 100,
        forks: 50,
        url: 'https://github.com/test/repo1',
        avatarUrl: '',
        builtBy: [],
      },
      {
        name: 'test/repo2',
        owner: 'test',
        repo: 'repo2',
        description: 'Test 2',
        descriptionJa: '',
        language: 'JavaScript',
        languageColor: '#f1e05a',
        stars: 2000,
        starsThisWeek: 200,
        forks: 100,
        url: 'https://github.com/test/repo2',
        avatarUrl: '',
        builtBy: [],
      },
    ];

    it('should translate all repositories', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          choices: [
            {
              message: {
                content: 'テスト',
              },
            },
          ],
        },
      });

      const { translateBatch } = await import('./translator');
      const result = await translateBatch(mockRepos);

      expect(result).toHaveLength(2);
      expect(result[0].descriptionJa).toBe('テスト');
      expect(result[1].descriptionJa).toBe('テスト');
    });

    it('should handle empty array', async () => {
      const { translateBatch } = await import('./translator');
      const result = await translateBatch([]);

      expect(result).toEqual([]);
    });
  });
});
