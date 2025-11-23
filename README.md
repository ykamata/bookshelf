# Bookshelf

A modern Nuxt 3 bookshelf application with 3D CSS transforms for realistic book visualization. Books are stored in MySQL and retrieved via Nuxt API routes.

## Features

- 🎨 3D book visualization with CSS transforms
- 🔍 Search books by title or author
- 📚 Filter by genre
- 🔄 Sort by title or author
- 💾 MySQL database integration
- 🚀 Server-side rendering with Nuxt 3

## Prerequisites

- Node.js 24.x
- MySQL 8.x

## Setup

### Using Claude Code Web

When using Claude Code Web, the environment is automatically set up through the SessionStart hook. The following steps are performed automatically:

1. ✅ npm dependencies installation
2. ✅ Database schema initialization
3. ✅ Sample data seeding
4. ✅ Environment variables configuration

**No manual setup required!** Just wait for the initialization to complete, then run:

```bash
npm run dev
```

#### Troubleshooting (Claude Code Web)

If the automatic setup fails, you can:

1. **Check MySQL connection:**
   ```bash
   bash .claude/check-mysql.sh
   ```

2. **Manually run setup:**
   ```bash
   npm run db:reset
   ```

3. **Verify environment variables:**
   ```bash
   echo $DATABASE_URL
   ```

### Manual Setup (Local Development)

If you're not using Claude Code Web or devcontainer, follow these steps:

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure database connection

The application uses environment variables for database configuration. These are pre-configured in the devcontainer, but you can customize them by creating a `.env` file:

```bash
DATABASE_URL="mysql://bookshelf:bookshelf@localhost:3306/bookshelf"
```

Or set individual variables:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=bookshelf
DB_PASSWORD=bookshelf
DB_NAME=bookshelf
```

#### 3. Setup the database

Initialize the database schema and seed with test data:

```bash
# Create the database schema
npm run db:setup

# Seed the database with 115+ sample books
npm run db:seed

# Or do both at once
npm run db:reset
```

#### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Scripts

- `npm run db:setup` - Create database schema
- `npm run db:seed` - Populate database with sample books
- `npm run db:reset` - Reset database (setup + seed)

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (flat config)
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests with Vitest

## Project Structure

```
bookshelf/
├── .claude/             # Claude Code configuration
│   ├── settings.json    # Claude Code settings (SessionStart hook)
│   ├── web-session-init.sh # Web environment setup script
│   └── check-mysql.sh   # MySQL connection checker
├── .devcontainer/       # DevContainer configuration
├── components/          # Vue components
│   └── BookCard.vue     # 3D book card component
├── data/                # Type definitions
│   └── books.ts         # Book interface
├── database/            # Database scripts
│   ├── schema.sql       # MySQL schema definition
│   ├── setup.ts         # Database setup script
│   └── seed.ts          # Database seeding script
├── pages/               # Nuxt pages
│   └── index.vue        # Main bookshelf page
└── server/              # Server-side code
    ├── api/             # API routes
    │   └── books.get.ts # Books API endpoint
    └── utils/           # Server utilities
        └── db.ts        # Database connection pool
```

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS v4
- **Backend**: Nuxt Server API, MySQL 8.x
- **Database**: MySQL with mysql2 driver
- **Development**: TypeScript, ESLint, Vitest
- **Container**: DevContainer with Docker Compose
