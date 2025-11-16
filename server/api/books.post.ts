import { query } from '../utils/db';
import type { ResultSetHeader } from 'mysql2/promise';

export interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
  cover?: string;
  color?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  color?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateBookRequest>(event);

  // Validate required fields
  if (!body.title || !body.author || !body.genre) {
    throw createError({
      statusCode: 400,
      statusMessage: 'title, author, and genre are required fields',
    });
  }

  // Generate default cover if not provided
  const defaultColor = body.color || getRandomColor();
  const cover = body.cover || generateDefaultCover(body.title, defaultColor);

  try {
    const result = await query<ResultSetHeader>(
      'INSERT INTO books (title, author, genre, cover, color) VALUES (?, ?, ?, ?, ?)',
      [body.title, body.author, body.genre, cover, defaultColor]
    );

    const insertId = (result as unknown as ResultSetHeader).insertId;

    const [newBook] = await query<Book>(
      'SELECT id, title, author, genre, cover, color FROM books WHERE id = ?',
      [insertId]
    );

    return newBook;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create book',
    });
  }
});

function getRandomColor(): string {
  const colors = [
    '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD',
    '#FF4500', '#DA70D6', '#20B2AA', '#B22222', '#778899',
    '#8B4513', '#556B2F', '#9932CC', '#4B0082', '#800000',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateDefaultCover(title: string, color: string): string {
  const shortTitle = title.substring(0, 15).replace(/\s+/g, '');
  const textColor = isLightColor(color) ? '000000' : 'FFFFFF';
  return `https://placehold.co/150x200/${color.replace('#', '')}/${textColor}?text=${encodeURIComponent(shortTitle)}`;
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
