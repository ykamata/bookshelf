import { query } from '../../utils/db';
import type { CrawlerLog } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const limit = queryParams.limit ? Number(queryParams.limit) : 50;
    const scheduleId = queryParams.scheduleId;

    let sql = `
      SELECT cl.*, cs.name as schedule_name
      FROM crawler_logs cl
      JOIN crawler_schedules cs ON cl.schedule_id = cs.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (scheduleId) {
      sql += ' AND cl.schedule_id = ?';
      params.push(Number(scheduleId));
    }

    sql += ' ORDER BY cl.started_at DESC LIMIT ?';
    params.push(limit);

    const results = await query<any>(sql, params);

    const logs: (CrawlerLog & { scheduleName?: string })[] = results.map(row => ({
      id: row.id,
      scheduleId: row.schedule_id,
      scheduleName: row.schedule_name,
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      itemsFound: row.items_found,
      errorMessage: row.error_message,
      createdAt: row.created_at,
    }));

    return logs;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch crawler logs',
    });
  }
});
