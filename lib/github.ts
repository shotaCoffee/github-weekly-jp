import { Octokit } from '@octokit/rest';
import type { TrendingRepo } from '@/types';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// 言語の色定義
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  PHP: '#4F5D95',
  'C++': '#f34b7d',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  C: '#555555',
  'C#': '#178600',
};

export async function enrichRepoData(repo: TrendingRepo): Promise<TrendingRepo> {
  try {
    const { data } = await octokit.repos.get({
      owner: repo.owner,
      repo: repo.repo,
    });

    return {
      ...repo,
      avatarUrl: data.owner.avatar_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      languageColor: LANGUAGE_COLORS[repo.language] || '#858585',
    };
  } catch {
    // フォールバック
    return repo;
  }
}

// 並列処理でAPIコール（5個ずつ）
export async function enrichBatch(repos: TrendingRepo[]): Promise<TrendingRepo[]> {
  const batchSize = 5;
  const results: TrendingRepo[] = [];

  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize);
    const enriched = await Promise.all(batch.map(enrichRepoData));
    results.push(...enriched);

    // レート制限対策
    if (i + batchSize < repos.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
