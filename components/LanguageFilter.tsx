'use client';

import { LANGUAGES } from '@/types';

interface Props {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export function LanguageFilter({ currentLanguage, onLanguageChange }: Props) {
  return (
    <div className="mb-6">
      <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 mb-2">
        プログラミング言語でフィルター
      </label>
      <select
        id="language-filter"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="w-full md:w-auto px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
