# Bookshelf リポジトリ構成分析

## プロジェクト概要

このbookshelfリポジトリは、**Nuxt 3で構築された本棚管理Webアプリケーション**です。3D CSS transformsを使用したリアルな本棚インターフェースを特徴とし、モダンなVue 3のComposition APIとTypeScriptで開発されています。

## ディレクトリ構造

```
bookshelf/
├── .devcontainer/          # DevContainer設定（Node 20）
├── .vscode/                # VS Code設定と推奨拡張機能
├── components/             # Vueコンポーネント
│   └── BookCard.vue       # 個別の本カードコンポーネント
├── data/                  # 静的データ
│   └── books.ts           # Book型定義とサンプルデータ（50冊）
├── pages/                 # ファイルベースルーティング
│   └── index.vue          # メイン本棚ページ
├── tests/                 # テストファイル
│   ├── components/        # コンポーネントテスト
│   │   └── BookCard.spec.ts
│   └── data.spec.ts       # データ検証テスト
├── app.vue               # ルートアプリケーションコンポーネント
├── nuxt.config.ts        # Nuxt設定
├── tsconfig.json         # TypeScript設定
├── vitest.config.ts      # テストフレームワーク設定
├── eslint.config.mjs     # Linting設定
├── package.json          # 依存関係とスクリプト
├── .editorconfig         # エディタフォーマット設定
├── .gitignore           # Git除外パターン
├── AGENTS.md            # AIエージェント開発ガイドライン
└── README.md            # プロジェクトドキュメント
```

## アプリケーション種別

- **Webアプリケーション** - シングルページアプリケーション（SPA）
- オプションでサーバーサイドレンダリング（SSR）対応
- パーソナル書籍管理インターフェース
- 3Dビジュアルエフェクト付きバーチャル本棚

## 技術スタック

### コアフレームワーク & 言語
- **Nuxt 3** (v^3.11.0) - Vue.jsメタフレームワーク（SSR/SSG対応）
- **Vue 3** - プログレッシブJavaScriptフレームワーク（Composition API使用）
- **TypeScript** (v^5.8.3) - strict mode有効

### スタイリング
- **Tailwind CSS v4** - ユーティリティファーストCSSフレームワーク
- **Scoped CSS** - コンポーネントレベルのスタイリング
- CSS custom properties（カスタムプロパティ）でテーマ管理

### 開発 & 品質管理ツール
- **ESLint** (v^9.0.0) - flat config形式（`@nuxt/eslint`モジュール使用）
- **Prettier** (v^3.2.5) - コードフォーマット
- **TypeScript** - strict mode（`@types/node`使用）
- **Vitest** (v^3.2.4) - ユニットテストフレームワーク
- **@vue/test-utils** (v^2.4.6) - Vueコンポーネントテストユーティリティ
- **jsdom** (v^26.1.0) - テスト用DOM実装

### ビルド & 開発ツール
- **Vite** - ビルドツール（Nuxt経由で統合）
- **@nuxt/devtools** (v^2.5.0) - 開発デバッグツール
- **vue-tsc** (v^3.0.1) - Vue用TypeScript型チェック
- **taze** (v^19.1.0) - 依存関係アップデートツール

## 主要設定ファイル

### `package.json`
プロジェクトの依存関係とnpmスクリプトを定義：
- `dev` - 開発サーバー起動
- `build` - プロダクションビルド
- `start` - プロダクションサーバー起動
- `lint` - ESLint実行
- `type-check` - TypeScript型チェック
- `test` - Vitestテスト実行

### `nuxt.config.ts`
Nuxt設定：
- `@nuxt/eslint`モジュール有効化
- DevTools有効化
- strict TypeScriptモード
- ESLint Stylisticルール（セミコロン使用）

### `tsconfig.json`
TypeScript設定（Nuxtの自動生成設定を継承、strict mode有効）

### `vitest.config.ts`
テスト設定：
- jsdom環境（ブラウザライクなテスト）
- グローバルテストユーティリティ
- Vueプラグイン（コンポーネントテスト用）
- パスエイリアス `~`（ルート参照用）

### `.editorconfig`
一貫したコーディングスタイルの強制：
- UTF-8エンコーディング
- 2スペースインデント
- LF改行
- 末尾空白の削除

## メインコンポーネントと構成

### データ層（`data/books.ts`）

```typescript
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  color?: string;
}
```

- 複数ジャンル（Sci-Fi、Horror、Fantasy、Classic等）の50冊のサンプル書籍
- 各書籍は視覚的な区別のためユニークなカラースキームを持つ
- placehold.coのプレースホルダー画像を使用

### コンポーネント層

**`components/BookCard.vue`**

洗練されたVueコンポーネント：
- **Composition API** - `<script setup lang="ts">` 構文使用
- **3D CSS transforms** - リアルな本の外観
- マウント時のランダム回転（-2〜2度）で自然な本棚の見た目
- 3Dパースペクティブのホバーエフェクト（rotateY、translateY）
- 3つのビジュアル層：
  - 本の表紙（画像付き）
  - 本の背表紙（左側、90度回転）
  - 本の底面（下端、90度回転）
- ホバー時に表示される情報オーバーレイ
- テーマ用のCSSカスタムプロパティ（--book-color、--rotation）

### ページ層

**`pages/index.vue`**

豊富な機能を持つメインアプリケーションページ：
- **検索フィルタリング** - タイトルまたは著者名で検索
- **ジャンルフィルタリング** - 全ジャンルのドロップダウン
- **ソート機能** - タイトルまたは著者名でアルファベット順
- **レスポンシブデザイン** - CSS Gridでauto-fillカラム
- **リアルな本棚スタイリング**：
  - 木目調の背景
  - CSSグラデーションを使用した繰り返し棚パターン
  - 調整可能な棚の高さと本のサイズ
  - 奥行き感のための影エフェクト
- **リアクティブな状態管理** - Vue Composition API（`ref`、`computed`）使用

### ルートコンポーネント

**`app.vue`**

シンプルなルートコンポーネント。ルーティング用に `<NuxtPage />` をレンダリング。

## 注目すべきパターンと設計判断

### モダンなVue 3パターン
- **Composition API** - 全コンポーネントで`<script setup lang="ts">`構文使用
- **自動インポート** - NuxtがVueユーティリティ（ref、computed等）を自動インポート
- **TypeScriptファースト** - 全体で厳格な型付け、明示的なprops/type定義
- **コンポーネントprops型付け** - `defineProps<{ book: Book }>()`パターン使用

### CSSアーキテクチャ
- **CSSカスタムプロパティ** - テーマ用に広範に使用（--book-color、--shelf-height等）
- **3D Transforms** - リアルな本の視覚化のための高度なCSS transforms
  - `transform-style: preserve-3d`
  - 複数回転軸（rotateX、rotateY、rotateZ）
  - 3D深度のためのperspective
- **レスポンシブデザイン** - メディアクエリでモバイル用の本サイズ調整
- **スコープドスタイル** - コンポーネントレベルのCSS分離

### 状態管理
- **ローカルコンポーネント状態** - シンプルな状態管理にVue refs使用
- **computed properties** - フィルタリングとソート用の派生状態
- **グローバル状態管理なし** - このシングルページアプリケーションに適切（将来的にPinia使用の可能性あり、AGENTS.mdに記載）

### コード品質
- **テスト戦略**：
  - コンポーネントテストでレンダリング検証（`BookCard.spec.ts`）
  - データ検証テスト（`data.spec.ts`）
  - ソースコードと同じ場所にテスト配置
- **Lintingとフォーマット**：
  - ESLint flat config（モダンなアプローチ）
  - 一貫したコードスタイルのためのStylisticルール
  - VS Codeで保存時フォーマット有効
- **型安全性**：
  - strict TypeScriptモード
  - 暗黙の`any`型なし
  - インターフェースベースのデータモデリング

### 開発者体験
- **DevContainerサポート** - Node 20のコンテナ化開発環境
- **VS Code統合** - 推奨拡張機能と設定
- **ホットモジュールリプレースメント** - 高速な開発フィードバック
- **AI対応ドキュメント** - AIコーディングアシスタント用の包括的なAGENTS.md

### ビジュアルデザインパターン
- **スキューモーフィックデザイン** - 3D本表現で実際の本棚を模倣
- **プログレッシブエンハンスメント** - ホバーエフェクトでインタラクティブ性を追加
- **カラーコード化された整理** - 各本がユニークなカラースキームを持つ
- **リアルな照明** - box-shadowとcolor-mixで奥行きと陰影

### パフォーマンス考慮事項
- **JavaScriptアニメーションではなくCSS transforms** - ハードウェアアクセラレーションアニメーション
- **フィルタリング用のcomputed properties** - 効率的なリアクティブ更新
- **静的データ** - 外部APIコールなし（メモリ内データ）

## まとめ

このプロジェクトは、コンポーネント設計、TypeScript使用、テスト、ビジュアルプレゼンテーションにおけるベストプラクティスを示す、よく設計されたモダンなVue 3アプリケーションです。特に、魅力的でリアルな本棚インターフェースを作成するためのCSS 3D transformsの創造的な使用が注目に値します。
