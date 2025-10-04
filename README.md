# GitHub Weekly JP

> 今週注目のGitHubリポジトリ TOP10を日本語で

GitHub Trendingの人気リポジトリを日本語説明付きで表示するWebアプリケーション。

## 特徴

- ✨ **日本語翻訳**: DeepL APIで自動的に説明文を日本語化
- 🔥 **リアルタイム**: GitHub Trendingから最新のトレンドを取得
- 🎯 **フィルター機能**: プログラミング言語と期間で絞り込み
- 📱 **レスポンシブ**: スマートフォン・タブレット・PCに対応
- 🤖 **自動更新**: Vercel Cronで定期的にデータを更新
- 💰 **完全無料**: 無料枠のみで運用可能（月額 ¥0）

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes (Serverless)
- **翻訳**: DeepL API（無料版）
- **データ取得**: GitHub Trending スクレイピング + GitHub REST API
- **ホスティング**: Vercel（無料）
- **自動更新**: Vercel Cron Jobs

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- pnpm

### インストール

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
# .env.local を作成して必要なAPIキーを設定
```

### 環境変数

`.env.local`に以下を設定:

```bash
# GitHub Personal Access Token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# DeepL API Key（無料版）
DEEPL_API_KEY=xxxxx:fx

# Vercel Cron認証用
CRON_SECRET=your_random_secret_key
```

各APIキーの取得方法は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 を開いてアプリケーションを確認できます。

### テスト

```bash
# ユニットテスト
pnpm test

# ESLint
pnpm lint

# ビルドテスト
pnpm build
```

## デプロイ

詳細なデプロイ手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### クイックデプロイ

```bash
# Vercel CLIでデプロイ
vercel --prod
```

## プロジェクト構成

```
github-weekly-jp/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── trending/      # トレンドデータ取得API
│   │   └── cron/          # Cronジョブ
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   └── globals.css        # グローバルCSS
├── components/            # Reactコンポーネント
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TrendingList.tsx
│   ├── RepoCard.tsx
│   ├── LanguageFilter.tsx
│   ├── PeriodFilter.tsx
│   └── ErrorBoundary.tsx
├── lib/                   # ユーティリティ
│   ├── scraper.ts        # GitHub Trendingスクレイピング
│   ├── github.ts         # GitHub API
│   ├── translator.ts     # DeepL翻訳
│   └── cache.ts          # キャッシュ管理
├── types/                 # TypeScript型定義
│   └── index.ts
├── public/                # 静的ファイル
│   └── data/             # キャッシュデータ（gitignore）
├── vercel.json           # Vercel設定（Cron）
└── DEPLOYMENT.md         # デプロイガイド
```

## コスト

**月額運用コスト: ¥0**

すべて無料枠内で運用可能:

| サービス | プラン | 月額コスト |
|---------|--------|-----------|
| DeepL API | 無料版（月50万文字） | ¥0 |
| GitHub API | 無料（5,000 req/hour） | ¥0 |
| Vercel | Hobby Plan | ¥0 |
| **合計** | | **¥0** |

## ライセンス

MIT
