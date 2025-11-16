# Bookshelf リポジトリ構成分析

## プロジェクト概要

このbookshelfリポジトリは、**Nuxt 4で構築されたフルスタック本棚管理Webアプリケーション**です。3D CSS transformsを使用したリアルな本棚インターフェースを特徴とし、モダンなVue 3のComposition APIとTypeScriptで開発されています。MySQL データベースによるデータ永続化、新刊情報クローラー、ユーザー設定管理などの高度な機能を備えています。

## ディレクトリ構造

```
bookshelf/
├── .devcontainer/              # DevContainer設定（Node 20）
├── .vscode/                    # VS Code設定と推奨拡張機能
├── app/                        # Nuxt 4 アプリケーションディレクトリ
│   ├── components/             # Vueコンポーネント
│   │   ├── BookCard.vue        # 個別の本カードコンポーネント（3D表示）
│   │   └── BookEditModal.vue   # 本の編集モーダルコンポーネント
│   ├── layouts/                # アプリケーションレイアウト
│   │   └── default.vue         # デフォルトナビゲーションレイアウト
│   ├── pages/                  # ファイルベースルーティング
│   │   ├── index.vue           # メイン本棚ページ（書籍一覧・検索・編集）
│   │   ├── new-releases.vue    # 新刊情報一覧ページ
│   │   ├── preferences.vue     # ユーザー設定ページ
│   │   ├── publishers.vue      # 出版社管理ページ
│   │   └── crawler.vue         # クローラー管理ページ
│   └── app.vue                 # ルートアプリケーションコンポーネント
├── data/                       # 静的データ（サンプルデータ）
│   └── books.ts                # Book型定義とサンプルデータ（50冊）
├── database/                   # データベース関連スクリプト
│   ├── schema.sql              # 基本スキーマ定義
│   ├── setup.ts                # データベース初期化スクリプト
│   ├── seed.ts                 # サンプルデータ投入
│   ├── migrate.ts              # マイグレーション実行
│   └── migrations/             # SQLマイグレーションファイル
│       └── 001_add_new_release_tracking.sql
├── prisma/                     # Prisma ORM設定
│   └── schema.prisma           # データベーススキーマ定義
├── server/                     # Nuxt Server API
│   ├── api/                    # RESTful APIエンドポイント
│   │   ├── books.get.ts        # 全書籍取得
│   │   ├── books/[id].patch.ts # 書籍更新
│   │   ├── preferences/        # ユーザー設定CRUD
│   │   ├── publishers/         # 出版社CRUD
│   │   ├── new-releases/       # 新刊情報取得・更新
│   │   └── crawler/            # クローラー管理API
│   ├── plugins/                # サーバープラグイン
│   │   └── scheduler.ts        # スケジューラー初期化
│   ├── types/                  # サーバー側型定義
│   │   └── index.ts            # ドメインモデル・リクエスト型
│   └── utils/                  # サーバーユーティリティ
│       ├── db.ts               # MySQLコネクションプール
│       ├── crawler.ts          # クローラー実装
│       └── scheduler.ts        # 定期実行スケジューラー
├── tests/                      # テストファイル
│   ├── components/             # コンポーネントテスト
│   │   └── BookCard.spec.ts
│   └── data.spec.ts            # データ検証テスト
├── nuxt.config.ts              # Nuxt設定
├── tsconfig.json               # TypeScript設定
├── vitest.config.ts            # テストフレームワーク設定
├── eslint.config.mjs           # Linting設定
├── package.json                # 依存関係とスクリプト
├── AGENTS.md                   # AIエージェント開発ガイドライン
├── NEW_RELEASE_CRAWLER.md      # クローラー機能ドキュメント
└── README.md                   # プロジェクトドキュメント
```

## アプリケーション種別

- **フルスタックWebアプリケーション** - サーバーサイドレンダリング（SSR）対応
- パーソナル書籍管理システム
- 新刊情報自動収集機能
- ユーザー設定によるパーソナライズ
- 3Dビジュアルエフェクト付きバーチャル本棚

## 技術スタック

### コアフレームワーク & 言語
- **Nuxt 4** (v^4.0.0) - Vue.jsメタフレームワーク（SSR/SSG対応）
- **Vue 3** - プログレッシブJavaScriptフレームワーク（Composition API使用）
- **TypeScript** (v^5.8.3) - strict mode有効

### データベース & ORM
- **MySQL** - リレーショナルデータベース
- **Prisma** (v^6.19.0) - TypeSafe ORM
- **mysql2** (v^3.15.3) - Node.js MySQL ドライバー

### スタイリング
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **Scoped CSS** - コンポーネントレベルのスタイリング
- CSS custom properties（カスタムプロパティ）でテーマ管理

### 開発 & 品質管理ツール
- **ESLint** (v^9.0.0) - flat config形式（`@nuxt/eslint`モジュール使用）
- **Prettier** (v^3.2.5) - コードフォーマット
- **TypeScript** - strict mode（`@types/node`使用）
- **Vitest** (v^3.2.4) - ユニットテストフレームワーク
- **@vue/test-utils** (v^2.4.6) - Vueコンポーネントテストユーティリティ
- **@nuxt/test-utils** (v^3.20.0) - Nuxt テストユーティリティ
- **jsdom** (v^26.1.0) - テスト用DOM実装

### ビルド & 開発ツール
- **Vite** - ビルドツール（Nuxt経由で統合）
- **@nuxt/devtools** (v^2.5.0) - 開発デバッグツール
- **vue-tsc** (v^3.0.1) - Vue用TypeScript型チェック
- **tsx** (v^4.20.6) - TypeScript実行環境（データベーススクリプト用）
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
- `db:setup` - データベース初期化
- `db:seed` - サンプルデータ投入
- `db:migrate` - マイグレーション実行
- `db:reset` - データベースリセット（setup + seed）

### `nuxt.config.ts`
Nuxt設定：
- `@nuxt/eslint`モジュール有効化
- DevTools有効化
- strict TypeScriptモード
- ESLint Stylisticルール（セミコロン使用）

### `prisma/schema.prisma`
データベーススキーマ定義：
- MySQLデータソース設定
- 6つの主要モデル定義（Book, UserPreference, Publisher, NewRelease, CrawlerSchedule, CrawlerLog）
- インデックス設定
- リレーションシップ定義

### `tsconfig.json`
TypeScript設定（Nuxtの自動生成設定を継承、strict mode有効）

### `vitest.config.ts`
テスト設定：
- jsdom環境（ブラウザライクなテスト）
- グローバルテストユーティリティ
- Vueプラグイン（コンポーネントテスト用）
- パスエイリアス `~`（ルート参照用）

## データベーススキーマ

### Book（書籍）
```typescript
{
  id: number;           // 自動採番ID
  title: string;        // 書籍タイトル
  author: string;       // 著者名
  genre: string;        // ジャンル
  cover: string;        // 表紙画像URL
  color?: string;       // テーマカラー（オプション）
}
```

### UserPreference（ユーザー設定）
```typescript
{
  id: number;
  preferenceType: string;  // 'genre', 'publisher', 'author', 'keyword'
  value: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Publisher（出版社）
```typescript
{
  id: number;
  name: string;           // 出版社名（一意）
  websiteUrl?: string;    // Webサイト URL
  rssUrl?: string;        // RSS フィード URL
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### NewRelease（新刊情報）
```typescript
{
  id: number;
  title: string;
  author: string;
  publisherId?: number;     // 出版社ID（外部キー）
  publisherName?: string;
  genre?: string;
  isbn?: string;            // ISBN（一意）
  publicationDate?: Date;   // 発売日
  coverUrl?: string;
  price?: number;           // 価格（円）
  description?: string;
  sourceUrl: string;        // 情報取得元URL
  crawledAt: Date;          // クロール日時
  isNotified: boolean;      // 通知済みフラグ
  createdAt: Date;
  updatedAt: Date;
}
```

### CrawlerSchedule（クローラースケジュール）
```typescript
{
  id: number;
  name: string;
  description?: string;
  frequency: string;      // 'daily', 'weekly'
  lastRunAt?: Date;
  nextRunAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### CrawlerLog（クローラー実行ログ）
```typescript
{
  id: number;
  scheduleId: number;      // スケジュールID（外部キー）
  status: string;          // 'running', 'success', 'failed'
  startedAt: Date;
  completedAt?: Date;
  itemsFound: number;
  errorMessage?: string;
  createdAt: Date;
}
```

## API エンドポイント

### Books（書籍管理）
- `GET /api/books` - 全書籍取得
- `PATCH /api/books/:id` - 書籍情報更新

### Preferences（ユーザー設定）
- `GET /api/preferences` - 全設定取得
- `POST /api/preferences` - 新規設定作成
- `PATCH /api/preferences/:id` - 設定更新
- `DELETE /api/preferences/:id` - 設定削除

### Publishers（出版社管理）
- `GET /api/publishers` - 全出版社取得
- `POST /api/publishers` - 新規出版社登録
- `PATCH /api/publishers/:id` - 出版社情報更新

### New Releases（新刊情報）
- `GET /api/new-releases` - 新刊情報取得（フィルタリング対応）
- `PATCH /api/new-releases/:id` - 新刊情報更新

### Crawler（クローラー管理）
- `GET /api/crawler/schedules` - スケジュール一覧取得
- `PATCH /api/crawler/schedules/:id` - スケジュール更新
- `POST /api/crawler/run` - 手動クロール実行
- `GET /api/crawler/logs` - 実行ログ取得

## メインコンポーネントと構成

### コンポーネント層

**`components/BookCard.vue`**

洗練されたVueコンポーネント：
- **Composition API** - `<script setup lang="ts">` 構文使用
- **3D CSS transforms** - リアルな本の外観
- マウント時のランダム回転（-2〜2度）で自然な本棚の見た目
- 3Dパースペクティブのホバーエフェクト（rotateY、translateY）
- クリックイベントのエミット（親コンポーネントへの通知）
- 3つのビジュアル層：
  - 本の表紙（画像付き）
  - 本の背表紙（左側、90度回転）
  - 本の底面（下端、90度回転）
- ホバー時に表示される情報オーバーレイ
- テーマ用のCSSカスタムプロパティ（--book-color、--rotation）

**`components/BookEditModal.vue`**

書籍編集用モーダルコンポーネント：
- フォームバリデーション（必須項目、URL形式チェック）
- ウォッチャーによるリアクティブなフォームデータ更新
- カラーピッカー統合
- Escapeキーでのモーダルクローズ
- Vueトランジションによるアニメーション
- 親コンポーネントへのイベントエミット（close、save）
- エラー表示とフィードバック

### レイアウト層

**`layouts/default.vue`**

アプリケーション共通レイアウト：
- レスポンシブナビゲーションバー
- NuxtLinkによるクライアントサイドルーティング
- アクティブルートのハイライト表示
- スロットによるコンテンツ注入
- Tailwind CSSによるスタイリング

### ページ層

**`pages/index.vue`**

メイン本棚ページ：
- **API連携** - `useFetch`によるサーバーからのデータ取得
- **検索フィルタリング** - タイトルまたは著者名で検索
- **ジャンルフィルタリング** - 動的に生成されたジャンルドロップダウン
- **ソート機能** - タイトルまたは著者名でアルファベット順
- **書籍編集** - クリックで編集モーダル表示、PATCH APIで更新
- **レスポンシブデザイン** - CSS Gridでauto-fillカラム
- **リアルな本棚スタイリング**：
  - 木目調の背景
  - CSSグラデーションを使用した繰り返し棚パターン
  - 調整可能な棚の高さと本のサイズ
  - 奥行き感のための影エフェクト
- **リアクティブな状態管理** - Vue Composition API（`ref`、`computed`）使用
- **エラーハンドリング** - API エラー時のフォールバック処理

**その他のページ**
- `pages/new-releases.vue` - 新刊情報一覧・フィルタリング
- `pages/preferences.vue` - ユーザー設定管理（CRUD）
- `pages/publishers.vue` - 出版社情報管理
- `pages/crawler.vue` - クローラースケジュール管理・手動実行

### サーバー層

**`server/utils/db.ts`**

MySQLコネクションプール管理：
- シングルトンパターンでプール管理
- 環境変数によるDB接続設定
- 型安全なクエリユーティリティ関数

**`server/utils/scheduler.ts`**

定期実行スケジューラー：
- 毎時間のスケジュールチェック
- 日次・週次のクローリング頻度サポート
- 自動次回実行時刻計算
- 実行ログの記録
- エラーハンドリングとリトライ
- デフォルトスケジュールの自動作成

**`server/utils/crawler.ts`**

新刊情報クローラー：
- 出版社サイトからの情報収集
- ISBNによる重複チェック
- データベースへの永続化

**`server/plugins/scheduler.ts`**

Nuxtサーバープラグイン：
- アプリケーション起動時のスケジューラー初期化
- デフォルトスケジュールの自動セットアップ

## 開発ワークフロー

### 環境セットアップ
```bash
# 依存関係インストール
npm install

# データベース初期化
npm run db:setup

# サンプルデータ投入
npm run db:seed

# 開発サーバー起動
npm run dev
```

### データベース操作
```bash
# スキーマリセット
npm run db:reset

# マイグレーション実行
npm run db:migrate

# Prismaスキーマ更新後のクライアント再生成
npx prisma generate
```

### 品質チェック
```bash
# リンティング
npm run lint

# 型チェック
npm run type-check

# テスト実行
npm run test
```

### 本番ビルド
```bash
# ビルド
npm run build

# 本番サーバー起動
npm run start
```

## 注目すべきパターンと設計判断

### モダンなVue 3パターン
- **Composition API** - 全コンポーネントで`<script setup lang="ts">`構文使用
- **自動インポート** - NuxtがVueユーティリティ（ref、computed等）を自動インポート
- **TypeScriptファースト** - 全体で厳格な型付け、明示的なprops/type定義
- **コンポーネントprops型付け** - `defineProps<Props>()`パターン使用
- **イベントエミット型付け** - `defineEmits<Emits>()`パターン使用
- **ウォッチャー** - リアクティブなデータ同期
- **ライフサイクルフック** - `onMounted`、`onUnmounted`の適切な使用

### Nuxt 4固有のパターン
- **app/ディレクトリ構造** - アプリケーションコードを`app/`ディレクトリに分離（Nuxt 4の新デフォルト）
- **パスエイリアス** - `~`は`app/`を指し、`~~`はプロジェクトルートを指す
  - `~/components` → `app/components`
  - `~~/data` → プロジェクトルートの`data/`
  - `~~/server` → プロジェクトルートの`server/`
- **compatibilityVersion: 4** - `nuxt.config.ts`の`future`ブロックで設定
- **noUncheckedIndexedAccess** - TypeScriptの厳格な配列アクセスチェック（デフォルト有効）
- **serverDir** - `server/`はプロジェクトルートに配置（`app/`の外）

### フルスタックアーキテクチャ
- **Nuxt Server Routes** - `/server/api/`ディレクトリによるAPIエンドポイント自動生成
- **RESTful API設計** - リソース指向のエンドポイント設計
- **型安全なAPI** - サーバーとクライアント間での型共有
- **useFetch** - SSR対応のデータフェッチング
- **$fetch** - クライアントサイドでのAPI呼び出し
- **defineEventHandler** - サーバーイベントハンドラーパターン

### データベース設計
- **正規化されたスキーマ** - リレーションシップによるデータ整合性
- **インデックス最適化** - 頻繁に使用されるカラムへのインデックス
- **マイグレーション管理** - SQLファイルによるスキーマ変更履歴
- **コネクションプール** - パフォーマンスと接続管理
- **Prismaスキーマ** - 型安全なORM定義

### CSSアーキテクチャ
- **CSSカスタムプロパティ** - テーマ用に広範に使用（--book-color、--shelf-height等）
- **3D Transforms** - リアルな本の視覚化のための高度なCSS transforms
  - `transform-style: preserve-3d`
  - 複数回転軸（rotateX、rotateY、rotateZ）
  - 3D深度のためのperspective
- **レスポンシブデザイン** - メディアクエリでモバイル用の本サイズ調整
- **スコープドスタイル** - コンポーネントレベルのCSS分離
- **Tailwind CSS** - ユーティリティクラスによる一貫したスタイリング
- **Vueトランジション** - スムーズなアニメーション効果

### 状態管理
- **ローカルコンポーネント状態** - シンプルな状態管理にVue refs使用
- **computed properties** - フィルタリングとソート用の派生状態
- **サーバー状態** - APIからのデータをローカル参照に保持
- **楽観的更新** - API呼び出し成功後のローカル状態更新
- **グローバル状態管理なし** - 現状では不要（将来的にPinia導入の可能性あり）

### バックグラウンドタスク
- **定期実行スケジューラー** - setIntervalによる毎時間チェック
- **非同期ジョブ処理** - クローラーの非同期実行
- **実行ログ記録** - 監査とデバッグのための詳細ログ
- **エラーリカバリー** - 失敗時も次回実行をスケジュール

### コード品質
- **テスト戦略**：
  - コンポーネントテストでレンダリング検証（`BookCard.spec.ts`）
  - データ検証テスト（`data.spec.ts`）
  - ソースコードと同じ場所にテスト配置
- **Lintingとフォーマット**：
  - ESLint flat config（モダンなアプローチ）
  - 一貫したコードスタイルのためのStylisticルール
  - セミコロン使用（設定で強制）
  - VS Codeで保存時フォーマット有効
- **型安全性**：
  - strict TypeScriptモード
  - 暗黙の`any`型なし
  - インターフェースベースのデータモデリング
  - サーバー・クライアント間の型共有

### 開発者体験
- **DevContainerサポート** - Node 20のコンテナ化開発環境
- **VS Code統合** - 推奨拡張機能と設定
- **ホットモジュールリプレースメント** - 高速な開発フィードバック
- **AI対応ドキュメント** - AIコーディングアシスタント用の包括的なAGENTS.md
- **NPMスクリプト** - 標準化されたコマンドによる開発タスク

### ビジュアルデザインパターン
- **スキューモーフィックデザイン** - 3D本表現で実際の本棚を模倣
- **プログレッシブエンハンスメント** - ホバーエフェクトでインタラクティブ性を追加
- **カラーコード化された整理** - 各本がユニークなカラースキームを持つ
- **リアルな照明** - box-shadowとcolor-mixで奥行きと陰影
- **モダンなUI** - Tailwind CSSによるクリーンなインターフェース

### パフォーマンス考慮事項
- **JavaScriptアニメーションではなくCSS transforms** - ハードウェアアクセラレーションアニメーション
- **フィルタリング用のcomputed properties** - 効率的なリアクティブ更新
- **データベースインデックス** - クエリパフォーマンスの最適化
- **コネクションプール** - 効率的なDB接続管理
- **SSRサポート** - 初期表示の高速化

## 環境変数

アプリケーションで使用される環境変数：

```bash
# データベース接続
DATABASE_URL=mysql://user:password@localhost:3306/bookshelf
DB_HOST=localhost
DB_PORT=3306
DB_USER=bookshelf
DB_PASSWORD=bookshelf
DB_NAME=bookshelf
```

## AI開発ガイドライン

### コード規約
- **セミコロン必須** - ESLint Stylisticルールで強制
- **Composition API** - Options APIは使用しない
- **TypeScript strict mode** - 暗黙の`any`は禁止
- **スコープドCSS** - グローバルスタイルは最小限に
- **関数型リアクティビティ** - `ref`、`computed`、`watch`を使用

### API設計原則
- **RESTful** - リソース指向のURL設計
- **HTTPメソッドの適切な使用** - GET（取得）、POST（作成）、PATCH（部分更新）、DELETE（削除）
- **適切なステータスコード** - 成功・エラーに応じた標準的なHTTPステータス
- **型安全性** - リクエスト・レスポンスの型定義

### ファイル命名規則
- **コンポーネント** - PascalCase（例：`BookCard.vue`）
- **ページ** - kebab-case（例：`new-releases.vue`）
- **APIエンドポイント** - リソース名.[method].ts（例：`books.get.ts`）
- **ユーティリティ** - camelCase（例：`scheduler.ts`）

### テスト方針
- **ユニットテスト** - Vitestによるコンポーネント・ロジックテスト
- **コンポーネントテスト** - @vue/test-utilsでのレンダリング検証
- **データ検証** - サンプルデータの整合性チェック

## 今後の拡張可能性

- **認証・認可** - ユーザー管理機能
- **通知システム** - 新刊情報のプッシュ通知
- **Pinia導入** - 複雑な状態管理が必要になった場合
- **i18n** - 多言語対応
- **PWA** - オフラインサポート
- **API キャッシュ** - パフォーマンス最適化
- **E2Eテスト** - Playwright/Cypressによる統合テスト

## まとめ

このプロジェクトは、シンプルな静的SPAから高機能なフルスタックアプリケーションへと進化を遂げています。Nuxt 3のサーバー機能を活用し、MySQLデータベース連携、RESTful API設計、スケジュールされたバックグラウンドタスクなど、本格的なWebアプリケーションの構成要素を備えています。

特徴的な点：
- **3D CSS transforms**を活用したリアルな本棚インターフェース
- **型安全なフルスタック開発**（TypeScript + Prisma）
- **新刊情報自動収集システム**による実用的な機能
- **モダンなVue 3パターン**の徹底した採用
- **明確な関心の分離**（コンポーネント、API、データベース）
- **拡張性を考慮した設計**

コンポーネント設計、TypeScript使用、API設計、データベース管理、ビジュアルプレゼンテーションにおけるベストプラクティスを示す、よく設計されたモダンなNuxt 3アプリケーションです。
