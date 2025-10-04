'use client';

import { RepoCard } from './RepoCard';
import type { TrendingRepo } from '@/types';

interface Props {
  repos: TrendingRepo[];
}

export function TrendingList({ repos }: Props) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">リポジトリが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-gray-600 mb-4">{repos.length} repositories found</div>

      {repos.map((repo, index) => (
        <div
          key={repo.name}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <RepoCard repo={repo} />
        </div>
      ))}
    </div>
  );
}
