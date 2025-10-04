'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TrendingList } from '@/components/TrendingList';
import { LanguageFilter } from '@/components/LanguageFilter';
import { PeriodFilter } from '@/components/PeriodFilter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { TrendingData, Period } from '@/types';

export default function Home() {
  const [data, setData] = useState<TrendingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (selectedLanguage) {
      params.set('language', selectedLanguage);
    }
    params.set('period', selectedPeriod);

    fetch(`/api/trending?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch trending repositories');
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setFormattedDate(new Date(data.date).toLocaleString('ja-JP'));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedLanguage, selectedPeriod, mounted]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {mounted && (
            <>
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <LanguageFilter
                    currentLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                  <div className="flex flex-col items-end gap-2">
                    <PeriodFilter
                      currentPeriod={selectedPeriod}
                      onPeriodChange={setSelectedPeriod}
                    />
                    {formattedDate && (
                      <div className="text-sm text-gray-500">最終更新: {formattedDate}</div>
                    )}
                  </div>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  エラーが発生しました: {error}
                </div>
              )}

              {!loading && !error && data && <TrendingList repos={data.repos} />}
            </>
          )}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
