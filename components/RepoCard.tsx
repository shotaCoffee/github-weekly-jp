'use client';

import Image from 'next/image';
import type { TrendingRepo } from '@/types';

interface Props {
  repo: TrendingRepo;
}

export function RepoCard({ repo }: Props) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        {/* アバター */}
        {repo.avatarUrl && (
          <a
            href={`https://github.com/${repo.owner}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Image
              src={repo.avatarUrl}
              alt={repo.owner}
              width={48}
              height={48}
              className="rounded-full hover:opacity-80 transition"
            />
          </a>
        )}

        <div className="flex-1 min-w-0">
          {/* リポジトリ名 */}
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold text-blue-600 hover:underline block"
          >
            {repo.name}
          </a>

          {/* 日本語説明 */}
          <p className="text-gray-700 mt-2 leading-relaxed">
            {repo.descriptionJa || repo.description}
          </p>

          {/* オリジナル説明（折りたたみ可能） */}
          {repo.descriptionJa && repo.description && (
            <details className="mt-2">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                原文を表示
              </summary>
              <p className="text-sm text-gray-600 mt-1 italic">{repo.description}</p>
            </details>
          )}

          {/* メタ情報 */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            {/* 言語 */}
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: repo.languageColor || '#858585' }}
                />
                {repo.language}
              </span>
            )}

            {/* スター数 */}
            <span className="flex items-center gap-1">⭐ {repo.stars.toLocaleString()}</span>

            {/* フォーク数 */}
            <span className="flex items-center gap-1">🍴 {repo.forks.toLocaleString()}</span>

            {/* 今週のスター数 */}
            {repo.starsThisWeek > 0 && (
              <span className="flex items-center gap-1 text-orange-600 font-semibold">
                🔥 +{repo.starsThisWeek.toLocaleString()} 今週
              </span>
            )}
          </div>

          {/* Built by */}
          {repo.builtBy && repo.builtBy.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-gray-500">Built by</span>
              <div className="flex -space-x-2">
                {repo.builtBy.slice(0, 5).map((contributor) => (
                  <a
                    key={contributor.username}
                    href={`https://github.com/${contributor.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={contributor.username}
                  >
                    <Image
                      src={contributor.avatarUrl}
                      alt={contributor.username}
                      width={24}
                      height={24}
                      className="rounded-full border-2 border-white hover:scale-110 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
