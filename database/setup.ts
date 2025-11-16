import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'bookshelf',
    password: process.env.DB_PASSWORD || 'bookshelf',
    database: process.env.DB_NAME || 'bookshelf',
    multipleStatements: true,
  });

  try {
    console.log('Connected to MySQL database');

    // Read and execute schema SQL
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await connection.query(schemaSQL);

    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

setupDatabase();
