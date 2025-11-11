import { query } from '../../utils/db';
import type { CrawlerSchedule } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const results = await query<any>(
      'SELECT * FROM crawler_schedules ORDER BY created_at DESC'
    );

    const schedules: CrawlerSchedule[] = results.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      frequency: row.frequency,
      lastRunAt: row.last_run_at,
      nextRunAt: row.next_run_at,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return schedules;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch crawler schedules',
    });
  }
});
