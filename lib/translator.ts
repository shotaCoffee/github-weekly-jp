import axios from 'axios';
import type { TrendingRepo } from '@/types';

export async function translateDescription(
  description: string,
  repoName: string,
  retries: number = 3
): Promise<string> {
  if (!description || description.length === 0) {
    return '';
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`Translating ${repoName}... (attempt ${attempt + 1}/${retries})`);

      const response = await axios.post(
        'https://api-free.deepl.com/v2/translate',
        new URLSearchParams({
          auth_key: process.env.DEEPL_API_KEY!,
          text: description,
          target_lang: 'JA',
          // source_langを指定しないことで自動検出
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const translated = response.data.translations[0].text;
      console.log(`✓ Translated ${repoName}`);
      return translated;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429 && attempt < retries - 1) {
        // 429エラー時は指数バックオフで待機
        const waitTime = Math.pow(2, attempt) * 2000; // 2秒, 4秒, 8秒
        console.log(`Rate limit hit for ${repoName}, waiting ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.status
        : error instanceof Error
          ? error.message
          : 'Unknown error';
      console.error(`Translation error for ${repoName}:`, errorMessage);
      return description; // フォールバック
    }
  }

  return description;
}

// バッチ翻訳（レート制限対策で順次処理）
export async function translateBatch(repos: TrendingRepo[]): Promise<TrendingRepo[]> {
  console.log(`Starting translation for ${repos.length} repositories...`);
  const translated: TrendingRepo[] = [];

  for (const repo of repos) {
    const descriptionJa = await translateDescription(repo.description, repo.name);
    translated.push({
      ...repo,
      descriptionJa,
    });

    // レート制限対策: 各リクエストの間に500ms待機(DeepL無料版対応)
    if (translated.length < repos.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log('✓ All translations completed');
  return translated;
}
