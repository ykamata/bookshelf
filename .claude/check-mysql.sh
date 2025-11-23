#!/bin/bash

# MySQL 接続確認スクリプト
# 使用法: bash .claude/check-mysql.sh

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-bookshelf}
DB_PASSWORD=${DB_PASSWORD:-bookshelf}
DB_NAME=${DB_NAME:-bookshelf}

echo "=== MySQL Connection Check ==="
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo ""

# MySQL 接続テスト
if command -v mysql &> /dev/null; then
  if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" 2>/dev/null; then
    echo "✓ MySQL connection successful"
    echo ""

    # データベースとテーブルの確認
    echo "Tables in database '$DB_NAME':"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null

    exit 0
  else
    echo "✗ MySQL connection failed"
    echo ""
    echo "Troubleshooting steps:"
    echo "  1. Check if MySQL is running: docker ps | grep mysql"
    echo "  2. Verify environment variables:"
    echo "     echo \$DATABASE_URL"
    echo "  3. Try manual connection:"
    echo "     mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p"
    exit 1
  fi
else
  echo "ℹ MySQL client not installed. Skipping connection check."
  echo ""
  echo "You can verify connection with Node.js instead:"
  echo "  npm run db:setup"
  exit 0
fi
