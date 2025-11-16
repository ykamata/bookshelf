# Bookshelf MCP Server

MCPサーバーを使用して、ChatGPT、Claude、その他のAIアシスタントから本棚アプリに書籍データを追加できます。本棚の写真をAIに解析させ、認識した書籍を自動的にアプリに登録できます。

## 機能

- **add_book**: 単一の書籍を追加
- **add_bulk_books**: 複数の書籍を一括追加（最大100冊）
- **search_books**: 既存の書籍を検索
- **list_all_books**: すべての書籍を一覧表示
- **get_genres**: 利用可能なジャンル一覧を取得

## セットアップ

### 1. MCPサーバーの依存関係をインストール

```bash
cd mcp-server
npm install
```

### 2. MCPサーバーをビルド

```bash
cd mcp-server
npm run build
```

### 3. Bookshelfアプリを起動

MCPサーバーを使用する前に、本体のBookshelfアプリが起動している必要があります。

```bash
# プロジェクトルートで
npm run dev
```

デフォルトでは `http://localhost:3000` で起動します。

## Claude Desktop での設定

### macOS

`~/Library/Application Support/Claude/claude_desktop_config.json` を編集：

```json
{
  "mcpServers": {
    "bookshelf": {
      "command": "node",
      "args": ["/path/to/bookshelf/mcp-server/dist/index.js"],
      "env": {
        "BOOKSHELF_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

### Windows

`%APPDATA%\Claude\claude_desktop_config.json` を編集：

```json
{
  "mcpServers": {
    "bookshelf": {
      "command": "node",
      "args": ["C:\\path\\to\\bookshelf\\mcp-server\\dist\\index.js"],
      "env": {
        "BOOKSHELF_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 開発モードで実行（tsxを使用）

```json
{
  "mcpServers": {
    "bookshelf": {
      "command": "npx",
      "args": ["tsx", "/path/to/bookshelf/mcp-server/src/index.ts"],
      "env": {
        "BOOKSHELF_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

## 使用方法

### 本棚の写真を解析して書籍を追加

1. 本棚の写真をClaude/ChatGPTにアップロード
2. 以下のようにリクエスト：

```
この本棚の写真に写っている本を識別して、bookshelfアプリに追加してください。
```

AIが写真を解析し、認識できた書籍の情報を使って `add_book` または `add_bulk_books` ツールを呼び出します。

### 使用例

#### 単一の書籍を追加

```
「1984」という本をアプリに追加してください。
```

AIが実行するツールコール：
```json
{
  "name": "add_book",
  "arguments": {
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian"
  }
}
```

#### 複数の書籍を一括追加

```
以下の3冊を追加してください：
- 「The Hobbit」 by J.R.R. Tolkien (Fantasy)
- 「Dune」 by Frank Herbert (Sci-Fi)
- 「It」 by Stephen King (Horror)
```

AIが実行するツールコール：
```json
{
  "name": "add_bulk_books",
  "arguments": {
    "books": [
      {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "genre": "Fantasy"
      },
      {
        "title": "Dune",
        "author": "Frank Herbert",
        "genre": "Sci-Fi"
      },
      {
        "title": "It",
        "author": "Stephen King",
        "genre": "Horror"
      }
    ]
  }
}
```

#### 既存の書籍を検索

```
Stephen Kingの本が既に登録されているか確認してください。
```

AIが実行するツールコール：
```json
{
  "name": "search_books",
  "arguments": {
    "author": "Stephen King"
  }
}
```

## サポートされているジャンル

- Fiction（フィクション）
- Sci-Fi（SF）
- Fantasy（ファンタジー）
- Horror（ホラー）
- Thriller（スリラー）
- YA（ヤングアダルト）
- Classic（古典）
- Historical（歴史）
- Dystopian（ディストピア）
- Adventure（冒険）

カスタムジャンルも使用可能です。

## API エンドポイント

MCPサーバーは以下のBookshelf APIを使用します：

- `GET /api/books` - 書籍一覧取得
- `POST /api/books` - 単一書籍追加
- `POST /api/books/bulk` - 一括書籍追加

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `BOOKSHELF_API_URL` | `http://localhost:3000` | Bookshelf APIのベースURL |

## トラブルシューティング

### MCPサーバーが接続できない

1. Bookshelfアプリが起動しているか確認
2. `BOOKSHELF_API_URL` が正しく設定されているか確認
3. ファイアウォールやネットワーク設定を確認

### 書籍が追加されない

1. 必須フィールド（title、author、genre）が含まれているか確認
2. データベースが正しく初期化されているか確認
3. API エラーログを確認

### Claude Desktopでツールが表示されない

1. 設定ファイルのパスが正しいか確認
2. MCPサーバーがビルドされているか確認
3. Claude Desktopを再起動

## 開発

### ローカルでテスト

```bash
# MCPサーバーディレクトリで
npm run dev
```

### ビルド

```bash
npm run build
```

### コード構造

```
mcp-server/
├── src/
│   └── index.ts      # メインMCPサーバー実装
├── dist/             # コンパイル済みJavaScript
├── package.json
└── tsconfig.json
```

## セキュリティ考慮事項

- MCPサーバーはローカル環境での使用を想定しています
- 本番環境で使用する場合は、適切な認証機能を追加してください
- APIエンドポイントに対する適切なアクセス制御を実装してください

## ライセンス

MIT License
