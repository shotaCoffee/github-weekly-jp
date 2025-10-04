import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scrapeTrending } from './scraper';
import axios from 'axios';

vi.mock('axios');

describe('scraper', () => {
  describe('scrapeTrending', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should scrape trending repositories successfully', async () => {
      const mockHtml = `
        <article class="Box-row">
          <h2><a href="/vercel/next.js">next.js</a></h2>
          <p class="col-9">The React Framework</p>
          <span itemprop="programmingLanguage">TypeScript</span>
          <svg class="octicon-star"></svg>
          <span>100,000</span>
          <span class="d-inline-block float-sm-right">1,500 stars this week</span>
          <svg class="octicon-repo-forked"></svg>
          <span>20,000</span>
          <img class="avatar" alt="@vercel" src="https://avatars.githubusercontent.com/u/1234" />
        </article>
      `;

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await scrapeTrending();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('github.com/trending'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': expect.any(String),
          }),
        })
      );
    });

    it('should return empty array when no repositories found', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: '<html></html>' });

      const result = await scrapeTrending();

      expect(result).toEqual([]);
    });

    it('should throw error when scraping fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      await expect(scrapeTrending()).rejects.toThrow('Failed to scrape GitHub Trending');
    });

    it('should limit results to 10 repositories', async () => {
      const mockHtml = Array(15)
        .fill(0)
        .map(
          (_, i) => `
        <article class="Box-row">
          <h2><a href="/user/repo${i}">repo${i}</a></h2>
          <p class="col-9">Description ${i}</p>
          <span itemprop="programmingLanguage">JavaScript</span>
        </article>
      `
        )
        .join('');

      vi.mocked(axios.get).mockResolvedValue({ data: mockHtml });

      const result = await scrapeTrending();

      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should accept period parameter and use it in URL', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: '<html></html>' });

      await scrapeTrending('', 'daily');

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('?since=daily'),
        expect.any(Object)
      );
    });

    it('should accept language and period parameters', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: '<html></html>' });

      await scrapeTrending('javascript', 'monthly');

      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/javascript?since=monthly'),
        expect.any(Object)
      );
    });
  });
});
