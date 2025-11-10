import { query } from '../utils/db';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover: string;
  color?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const books = await query<Book>(
      'SELECT id, title, author, genre, cover, color FROM books ORDER BY title'
    );
    return books;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch books from database',
    });
  }
});
