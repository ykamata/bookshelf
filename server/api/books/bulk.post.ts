import { query } from '../../utils/db';
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

export interface BulkCreateResponse {
  success: boolean;
  created: Book[];
  errors: Array<{ index: number; error: string; book: CreateBookRequest }>;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ books: CreateBookRequest[] }>(event);

  if (!body.books || !Array.isArray(body.books)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'books array is required',
    });
  }

  if (body.books.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'books array cannot be empty',
    });
  }

  if (body.books.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Maximum 100 books can be added at once',
    });
  }

  const created: Book[] = [];
  const errors: Array<{ index: number; error: string; book: CreateBookRequest }> = [];

  for (let i = 0; i < body.books.length; i++) {
    const bookData = body.books[i];

    if (!bookData) {
      errors.push({
        index: i,
        error: 'Invalid book data',
        book: { title: '', author: '', genre: '' },
      });
      continue;
    }

    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.genre) {
      errors.push({
        index: i,
        error: 'title, author, and genre are required fields',
        book: bookData,
      });
      continue;
    }

    // Generate default cover if not provided
    const defaultColor = bookData.color || getRandomColor();
    const cover = bookData.cover || generateDefaultCover(bookData.title, defaultColor);

    try {
      const result = await query<ResultSetHeader>(
        'INSERT INTO books (title, author, genre, cover, color) VALUES (?, ?, ?, ?, ?)',
        [bookData.title, bookData.author, bookData.genre, cover, defaultColor]
      );

      const insertId = (result as unknown as ResultSetHeader).insertId;

      const [newBook] = await query<Book>(
        'SELECT id, title, author, genre, cover, color FROM books WHERE id = ?',
        [insertId]
      );

      if (newBook) {
        created.push(newBook);
      }
    } catch (error) {
      console.error(`Failed to create book at index ${i}:`, error);
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Unknown error',
        book: bookData,
      });
    }
  }

  return {
    success: errors.length === 0,
    created,
    errors,
  } as BulkCreateResponse;
});

function getRandomColor(): string {
  const colors = [
    '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD',
    '#FF4500', '#DA70D6', '#20B2AA', '#B22222', '#778899',
    '#8B4513', '#556B2F', '#9932CC', '#4B0082', '#800000',
  ] as const;
  return colors[Math.floor(Math.random() * colors.length)] ?? '#FF6347';
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
