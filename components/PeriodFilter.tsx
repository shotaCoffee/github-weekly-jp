'use client';

import type { Period } from '@/types';

interface Props {
  currentPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

const PERIODS: Array<{ value: Period; label: string }> = [
  { value: 'daily', label: '今日' },
  { value: 'weekly', label: '今週' },
  { value: 'monthly', label: '今月' },
];

export function PeriodFilter({ currentPeriod, onPeriodChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPeriod === period.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
