export interface TrendingRepo {
  name: string; // "vercel/next.js"
  owner: string; // "vercel"
  repo: string; // "next.js"
  description: string; // 元の英語説明
  descriptionJa: string; // 日本語説明（AI翻訳）
  language: string; // "TypeScript"
  languageColor: string; // "#3178c6"
  stars: number; // 100000
  starsThisWeek: number; // 1500（週間増加数）
  forks: number; // 20000
  url: string; // "https://github.com/vercel/next.js"
  avatarUrl: string; // オーナーのアバター
  builtBy: Array<{
    // コントリビューター
    username: string;
    avatarUrl: string;
  }>;
}

export interface TrendingData {
  date: string; // "2025-10-06T00:00:00.000Z"
  repos: TrendingRepo[]; // TOP 10のみ
  period?: Period; // 期間フィルター
  language?: string; // 言語フィルター
}

export type Period = 'daily' | 'weekly' | 'monthly';

export const LANGUAGES = [
  { value: '', label: 'すべての言語', color: '' },
  { value: 'javascript', label: 'JavaScript', color: '#f1e05a' },
  { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { value: 'python', label: 'Python', color: '#3572A5' },
  { value: 'go', label: 'Go', color: '#00ADD8' },
  { value: 'rust', label: 'Rust', color: '#dea584' },
  { value: 'java', label: 'Java', color: '#b07219' },
  { value: 'php', label: 'PHP', color: '#4F5D95' },
  { value: 'c++', label: 'C++', color: '#f34b7d' },
  { value: 'ruby', label: 'Ruby', color: '#701516' },
  { value: 'swift', label: 'Swift', color: '#ffac45' },
] as const;
