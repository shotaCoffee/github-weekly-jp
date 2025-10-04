import axios from 'axios';
import * as cheerio from 'cheerio';
import type { TrendingRepo, Period } from '@/types';

const TRENDING_URL = 'https://github.com/trending';

export async function scrapeTrending(language: string = '', period: Period = 'weekly'): Promise<TrendingRepo[]> {
  const url = `${TRENDING_URL}${language ? `/${language}` : ''}?since=${period}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GitWeeklyJP/1.0)',
      },
    });

    const $ = cheerio.load(response.data);
    const repos: TrendingRepo[] = [];

    $('article.Box-row').each((_, element) => {
      const $el = $(element);

      // リポジトリ名取得
      const repoLink = $el.find('h2 a').attr('href');
      if (!repoLink) return;

      const fullName = repoLink.replace(/^\//, '');
      const [owner, repo] = fullName.split('/');
      if (!owner || !repo) return;

      // 説明文
      const description = $el.find('p.col-9').text().trim();

      // プログラミング言語
      const language = $el.find('[itemprop="programmingLanguage"]').text().trim();

      // スター数
      const starsText = $el.find('svg.octicon-star').parent().text().trim();
      const stars = parseNumber(starsText);

      // 今週のスター数
      const weekStarsText = $el
        .find('span.d-inline-block.float-sm-right')
        .first()
        .text()
        .trim();
      const starsThisWeek = parseNumber(weekStarsText);

      // フォーク数
      const forksText = $el.find('svg.octicon-repo-forked').parent().text().trim();
      const forks = parseNumber(forksText);

      // Built By
      const builtBy: Array<{ username: string; avatarUrl: string }> = [];
      $el.find('.avatar').each((_, avatarEl) => {
        const username = $(avatarEl).attr('alt')?.replace('@', '') || '';
        const avatarUrl = $(avatarEl).attr('src') || '';
        if (username && avatarUrl) {
          builtBy.push({ username, avatarUrl });
        }
      });

      repos.push({
        name: fullName,
        owner,
        repo,
        description,
        descriptionJa: '', // 後で翻訳
        language,
        languageColor: '', // GitHub APIで取得
        stars,
        starsThisWeek,
        forks,
        url: `https://github.com/${fullName}`,
        avatarUrl: '', // GitHub APIで取得
        builtBy,
      });
    });

    // TOP 10のみ返す
    return repos.slice(0, 10);
  } catch {
    throw new Error('Failed to scrape GitHub Trending');
  }
}

function parseNumber(text: string): number {
  // "1,234" or "1.2k" 形式をパース
  const match = text.match(/([\d,\.]+)([km])?/i);
  if (!match) return 0;

  let num = parseFloat(match[1].replace(/,/g, ''));
  const suffix = match[2]?.toLowerCase();

  if (suffix === 'k') num *= 1000;
  if (suffix === 'm') num *= 1000000;

  return Math.floor(num);
}
