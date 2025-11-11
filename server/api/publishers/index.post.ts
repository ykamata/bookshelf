import { query } from '../../utils/db';
import type { CreatePublisherRequest } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreatePublisherRequest>(event);

    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Publisher name is required',
      });
    }

    // Check if publisher already exists
    const existing = await query<any>(
      'SELECT id FROM publishers WHERE name = ?',
      [body.name]
    );

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Publisher already exists',
      });
    }

    // Insert new publisher
    const result = await query<any>(
      'INSERT INTO publishers (name, website_url, rss_url) VALUES (?, ?, ?)',
      [body.name, body.websiteUrl || null, body.rssUrl || null]
    );

    return {
      success: true,
      id: (result as any).insertId,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create publisher',
    });
  }
});
