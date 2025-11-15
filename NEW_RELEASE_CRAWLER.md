# New Release Crawler Feature

## 概要

このドキュメントでは、bookshelfアプリケーションに追加された新刊情報クローラー機能について説明します。

## 機能概要

この機能により、以下のことが可能になります：

1. **ユーザー設定の管理**: 興味のあるジャンル、出版社、作家、キーワードを保存
2. **新刊情報の自動収集**: 定期的にWeb上から新刊情報をクローリング
3. **フィルタリングされた新刊情報の閲覧**: 自分の興味に合った新刊のみを表示
4. **スケジュール実行**: 日次または週次で自動的にクローラーを実行

## データベーススキーマ

### user_preferences
ユーザーの興味設定を保存

- `id`: プライマリーキー
- `preference_type`: 設定タイプ (genre, publisher, author, keyword)
- `value`: 設定値
- `is_active`: アクティブ状態
- `created_at`, `updated_at`: タイムスタンプ

### publishers
出版社マスターデータ

- `id`: プライマリーキー
- `name`: 出版社名
- `website_url`: ウェブサイトURL
- `rss_url`: RSSフィードURL
- `is_active`: アクティブ状態
- `created_at`, `updated_at`: タイムスタンプ

### new_releases
クローリングした新刊情報

- `id`: プライマリーキー
- `title`: タイトル
- `author`: 著者
- `publisher_id`: 出版社ID (外部キー)
- `publisher_name`: 出版社名
- `genre`: ジャンル
- `isbn`: ISBN
- `publication_date`: 発売日
- `cover_url`: 表紙画像URL
- `price`: 価格 (円)
- `description`: 説明
- `source_url`: 情報源URL
- `crawled_at`: クローリング日時
- `is_notified`: 通知済みフラグ
- `created_at`, `updated_at`: タイムスタンプ

### crawler_schedules
クローラーのスケジュール設定

- `id`: プライマリーキー
- `name`: スケジュール名
- `description`: 説明
- `frequency`: 実行頻度 (daily, weekly)
- `last_run_at`: 最終実行日時
- `next_run_at`: 次回実行日時
- `is_active`: アクティブ状態
- `created_at`, `updated_at`: タイムスタンプ

### crawler_logs
クローラーの実行ログ

- `id`: プライマリーキー
- `schedule_id`: スケジュールID (外部キー)
- `status`: ステータス (running, success, failed)
- `started_at`: 開始日時
- `completed_at`: 完了日時
- `items_found`: 見つかったアイテム数
- `error_message`: エラーメッセージ
- `created_at`: タイムスタンプ

## API エンドポイント

### User Preferences

- `GET /api/preferences`: 全ての設定を取得
- `POST /api/preferences`: 新しい設定を追加
- `PATCH /api/preferences/:id`: 設定を更新
- `DELETE /api/preferences/:id`: 設定を削除

### Publishers

- `GET /api/publishers`: 全ての出版社を取得
- `POST /api/publishers`: 新しい出版社を追加
- `PATCH /api/publishers/:id`: 出版社を更新

### New Releases

- `GET /api/new-releases`: 新刊情報を取得 (フィルター可能)
- `PATCH /api/new-releases/:id`: 新刊情報を更新 (通知済みフラグなど)

### Crawler

- `GET /api/crawler/schedules`: スケジュール一覧を取得
- `PATCH /api/crawler/schedules/:id`: スケジュールを更新
- `POST /api/crawler/run`: クローラーを手動実行
- `GET /api/crawler/logs`: 実行ログを取得

## ユーザーインターフェース

### ページ一覧

1. **My Bookshelf** (`/`): 既存の本棚機能
2. **New Releases** (`/new-releases`): 新刊情報の閲覧
3. **Preferences** (`/preferences`): ユーザー設定の管理
4. **Publishers** (`/publishers`): 出版社の管理
5. **Crawler** (`/crawler`): クローラーの管理と実行

## セットアップ

### 1. データベースマイグレーション

```bash
npm run db:migrate
```

### 2. スケジューラーの有効化

開発環境でスケジューラーを有効にするには、環境変数を設定します：

```bash
export ENABLE_CRAWLER_SCHEDULER=true
```

本番環境では自動的に有効になります。

### 3. 出版社の追加

Publishers ページから、監視したい出版社を追加します。RSSフィードURLを設定すると、自動的にフィードを解析します。

### 4. ユーザー設定の追加

Preferences ページから、興味のあるジャンル、出版社、作家、キーワードを追加します。

### 5. クローラーの実行

Crawler ページから手動でクローラーを実行するか、スケジュールに従って自動実行されます。

## クローラーの仕組み

### データソース

クローラーは以下のソースから新刊情報を収集します：

1. **出版社のRSSフィード**: publishers テーブルに登録されたRSSフィードを解析
2. **OpenBD API**: 日本の書籍データベース（ISBN検索）
3. **将来的な拡張**: 書店のウェブサイトなど（利用規約に注意）

### フィルタリングロジック

クローラーは、ユーザーの設定に基づいて新刊情報をフィルタリングします：

- **ジャンル**: 書籍のジャンルが設定値に一致
- **出版社**: 出版社名が設定値に一致
- **作家**: 著者名が設定値に一致
- **キーワード**: タイトルまたは説明に設定値が含まれる

### スケジュール実行

- **Daily Crawler**: 毎日深夜0時に実行
- **Weekly Crawler**: 毎週日曜日深夜0時に実行（デフォルトで無効）

スケジューラーは1時間ごとにチェックし、実行が必要なタスクを実行します。

## カスタマイズ

### クローラーの拡張

`server/utils/crawler.ts` を編集して、新しいデータソースを追加できます。

```typescript
// 例: 新しいデータソースの追加
async function fetchFromNewSource(): Promise<BookData[]> {
  // データ取得ロジック
}
```

### スケジュールのカスタマイズ

データベースの `crawler_schedules` テーブルを直接編集するか、APIエンドポイントを使用して、スケジュールの頻度や次回実行時刻を調整できます。

## トラブルシューティング

### クローラーが実行されない

1. スケジューラーが有効になっているか確認
2. `crawler_schedules` テーブルで `is_active` が `true` になっているか確認
3. `next_run_at` が現在時刻より前になっているか確認

### 新刊情報が見つからない

1. ユーザー設定が正しく設定されているか確認
2. 出版社が登録されているか確認
3. RSSフィードURLが正しいか確認
4. クローラーログでエラーメッセージを確認

### データベース接続エラー

1. MySQLサーバーが起動しているか確認
2. `.env` ファイルで接続情報が正しいか確認
3. DevContainerを使用している場合、コンテナが起動しているか確認

## 今後の改善案

1. **通知機能**: 新刊が見つかったときにメール通知
2. **詳細検索**: より高度な検索とフィルタリング
3. **ウィッシュリスト**: 興味のある本をウィッシュリストに追加
4. **価格追跡**: 価格の変動を追跡
5. **レビュー統合**: レビューサイトからの評価を取得
6. **購入リンク**: オンライン書店への直接リンク

## ライセンスと利用規約

クローラーを使用する際は、以下の点に注意してください：

1. **robots.txt の遵守**: ウェブサイトのrobots.txtを必ず確認
2. **利用規約の確認**: スクレイピング対象サイトの利用規約を確認
3. **適切なアクセス頻度**: サーバーに負荷をかけないよう、適切な間隔でアクセス
4. **個人利用**: 商用利用する場合は、各サービスの利用規約を確認

## 参考リソース

- [OpenBD API](https://openbd.jp/): 日本の書籍データベース
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
