import { query } from '../../utils/db';
import type { NewRelease, NewReleasesQuery } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event) as NewReleasesQuery;

    let sql = `
      SELECT nr.*, p.name as publisher_name
      FROM new_releases nr
      LEFT JOIN publishers p ON nr.publisher_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (queryParams.genre) {
      sql += ' AND nr.genre = ?';
      params.push(queryParams.genre);
    }

    if (queryParams.author) {
      sql += ' AND nr.author LIKE ?';
      params.push(`%${queryParams.author}%`);
    }

    if (queryParams.publisher) {
      sql += ' AND (p.name LIKE ? OR nr.publisher_name LIKE ?)';
      params.push(`%${queryParams.publisher}%`, `%${queryParams.publisher}%`);
    }

    if (queryParams.startDate) {
      sql += ' AND nr.publication_date >= ?';
      params.push(queryParams.startDate);
    }

    if (queryParams.endDate) {
      sql += ' AND nr.publication_date <= ?';
      params.push(queryParams.endDate);
    }

    if (queryParams.isNotified !== undefined) {
      sql += ' AND nr.is_notified = ?';
      params.push(queryParams.isNotified ? 1 : 0);
    }

    sql += ' ORDER BY nr.publication_date DESC, nr.crawled_at DESC';

    const limit = queryParams.limit ? Number(queryParams.limit) : 100;
    const offset = queryParams.offset ? Number(queryParams.offset) : 0;

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const results = await query<any>(sql, params);

    const releases: NewRelease[] = results.map(row => ({
      id: row.id,
      title: row.title,
      author: row.author,
      publisherId: row.publisher_id,
      publisherName: row.publisher_name,
      genre: row.genre,
      isbn: row.isbn,
      publicationDate: row.publication_date,
      coverUrl: row.cover_url,
      price: row.price,
      description: row.description,
      sourceUrl: row.source_url,
      crawledAt: row.crawled_at,
      isNotified: Boolean(row.is_notified),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return releases;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch new releases',
    });
  }
});
