#!/bin/bash
set -e

# ====================================================
# Claude Code Web Session Initialization Script
# セッション開始時に実行される初期化スクリプト
# ====================================================

# CLAUDE_CODE_REMOTE が "true" の場合のみ Web セッション
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  echo "Local CLI environment detected. Skipping web-specific setup."
  exit 0
fi

echo "=== Claude Code Web Session Setup Started ==="
echo "Environment: CLAUDE_CODE_REMOTE=$CLAUDE_CODE_REMOTE"

# ====================================================
# 1. 環境変数の設定
# ====================================================
echo ""
echo "[1/4] Setting up environment variables..."

# CLAUDE_ENV_FILE に環境変数を書き込む
if [ -n "$CLAUDE_ENV_FILE" ]; then
  cat >> "$CLAUDE_ENV_FILE" << 'EOF'
# Database Configuration
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=bookshelf
export DB_PASSWORD=bookshelf
export DB_NAME=bookshelf
export DATABASE_URL="mysql://bookshelf:bookshelf@localhost:3306/bookshelf"

# Node Environment
export NODE_ENV=development

# Application Ports
export NUXT_PORT=3000
EOF
  echo "✓ Environment variables configured"

  # 環境変数を現在のシェルにも読み込む
  source "$CLAUDE_ENV_FILE"
else
  echo "WARNING: CLAUDE_ENV_FILE not set. Setting temporary environment variables."
  export DB_HOST=localhost
  export DB_PORT=3306
  export DB_USER=bookshelf
  export DB_PASSWORD=bookshelf
  export DB_NAME=bookshelf
  export DATABASE_URL="mysql://bookshelf:bookshelf@localhost:3306/bookshelf"
  export NODE_ENV=development
  export NUXT_PORT=3000
fi

# ====================================================
# 2. npm 依存関係のインストール
# ====================================================
echo ""
echo "[2/4] Installing npm dependencies..."

if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install --prefer-offline --no-audit
  echo "✓ Dependencies installed"
else
  echo "✓ Dependencies already installed"
fi

# ====================================================
# 3. データベースのセットアップ
# ====================================================
echo ""
echo "[3/4] Setting up database..."

# データベースサーバーが起動しているか確認（タイムアウト: 30秒）
echo "Waiting for MySQL server to become available..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if npm run db:setup 2>/dev/null; then
    echo "✓ Database schema initialized"
    break
  fi

  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "WARNING: Database setup timeout. MySQL may not be running."
    echo "Please check MySQL connection: $DATABASE_URL"
    echo ""
    echo "You can manually set up the database later with: npm run db:reset"
    exit 0  # エラーで終了せず、警告のみ
  fi

  sleep 1
done

# ====================================================
# 4. サンプルデータのシード
# ====================================================
echo ""
echo "[4/4] Seeding sample data..."

if npm run db:seed 2>/dev/null; then
  echo "✓ Sample data seeded"
else
  echo "WARNING: Failed to seed sample data. You can run 'npm run db:seed' manually later."
fi

echo ""
echo "=== Claude Code Web Session Setup Completed ==="
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Open http://localhost:3000 in your browser"
echo ""
