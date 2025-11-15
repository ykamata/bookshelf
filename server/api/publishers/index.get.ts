import { query } from '../../utils/db';
import type { Publisher } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const isActive = queryParams.active;

    let sql = 'SELECT * FROM publishers WHERE 1=1';
    const params: any[] = [];

    if (isActive !== undefined) {
      sql += ' AND is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY name';

    const results = await query<any>(sql, params);

    const publishers: Publisher[] = results.map(row => ({
      id: row.id,
      name: row.name,
      websiteUrl: row.website_url,
      rssUrl: row.rss_url,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return publishers;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch publishers',
    });
  }
});
