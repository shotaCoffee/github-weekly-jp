import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GitHub Weekly JP - 今週注目のリポジトリ TOP10を日本語で',
  description:
    'GitHub Trendingで話題のリポジトリを日本語説明付きで表示。プログラミング言語や期間で絞り込んで、最新のトレンドをチェックできます。',
  keywords: ['GitHub', 'Trending', '日本語', 'エンジニア', 'プログラミング', 'オープンソース'],
  openGraph: {
    title: 'GitHub Weekly JP',
    description: '人気のGitHubリポジトリを日本語で簡単チェック',
    url: 'https://github-weekly-jp.vercel.app',
    siteName: 'GitHub Weekly JP',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Weekly JP',
    description: '人気のGitHubリポジトリを日本語で簡単チェック',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
