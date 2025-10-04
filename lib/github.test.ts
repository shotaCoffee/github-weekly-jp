import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TrendingRepo } from '@/types';

const mockGet = vi.fn();

// Octokitのモック
vi.mock('@octokit/rest', () => ({
  Octokit: vi.fn(() => ({
    repos: {
      get: mockGet,
    },
  })),
}));

describe('github', () => {
  const mockRepo: TrendingRepo = {
    name: 'vercel/next.js',
    owner: 'vercel',
    repo: 'next.js',
    description: 'The React Framework',
    descriptionJa: '',
    language: 'TypeScript',
    languageColor: '',
    stars: 0,
    starsThisWeek: 1500,
    forks: 0,
    url: 'https://github.com/vercel/next.js',
    avatarUrl: '',
    builtBy: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('enrichRepoData', () => {
    it('should enrich repository data with GitHub API data', async () => {
      mockGet.mockResolvedValue({
        data: {
          owner: {
            avatar_url: 'https://avatars.githubusercontent.com/u/14985020',
          },
          stargazers_count: 100000,
          forks_count: 20000,
        },
      });

      const { enrichRepoData } = await import('./github');
      const result = await enrichRepoData(mockRepo);

      expect(result.avatarUrl).toBe('https://avatars.githubusercontent.com/u/14985020');
      expect(result.stars).toBe(100000);
      expect(result.forks).toBe(20000);
      expect(result.languageColor).toBeTruthy();
    });

    it('should return original repo on API error', async () => {
      mockGet.mockRejectedValue(new Error('API Error'));

      const { enrichRepoData } = await import('./github');
      const result = await enrichRepoData(mockRepo);

      expect(result).toEqual(mockRepo);
    });
  });

  describe('enrichBatch', () => {
    it('should process repositories in batches', async () => {
      mockGet.mockResolvedValue({
        data: {
          owner: { avatar_url: 'https://example.com/avatar.jpg' },
          stargazers_count: 1000,
          forks_count: 100,
        },
      });

      const repos = Array(3).fill(mockRepo);
      const { enrichBatch } = await import('./github');
      const result = await enrichBatch(repos);

      expect(result).toHaveLength(3);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty array', async () => {
      const { enrichBatch } = await import('./github');
      const result = await enrichBatch([]);

      expect(result).toEqual([]);
    });
  });
});
