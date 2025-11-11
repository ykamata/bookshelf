import { query } from '../../utils/db';
import { runCrawler } from '../../utils/crawler';

export default defineEventHandler(async (event) => {
  try {
    // Create a crawler schedule entry if it doesn't exist
    let schedule = await query<any>(
      'SELECT id FROM crawler_schedules WHERE name = ? LIMIT 1',
      ['Manual Execution']
    );

    let scheduleId: number;

    if (schedule.length === 0) {
      const result = await query<any>(
        `INSERT INTO crawler_schedules (name, description, frequency, is_active)
         VALUES (?, ?, ?, ?)`,
        ['Manual Execution', 'Manually triggered crawler runs', 'manual', true]
      );
      scheduleId = (result as any).insertId;
    } else {
      scheduleId = schedule[0].id;
    }

    // Create log entry
    const logResult = await query<any>(
      `INSERT INTO crawler_logs (schedule_id, status, started_at)
       VALUES (?, ?, NOW())`,
      [scheduleId, 'running']
    );

    const logId = (logResult as any).insertId;

    try {
      // Run the crawler
      const result = await runCrawler();

      // Update log entry
      await query(
        `UPDATE crawler_logs
         SET status = ?, completed_at = NOW(), items_found = ?, error_message = ?
         WHERE id = ?`,
        [
          result.error ? 'failed' : 'success',
          result.itemsFound,
          result.error || null,
          logId,
        ]
      );

      // Update schedule last run
      await query(
        'UPDATE crawler_schedules SET last_run_at = NOW() WHERE id = ?',
        [scheduleId]
      );

      return {
        success: !result.error,
        itemsFound: result.itemsFound,
        error: result.error,
        logId,
      };
    } catch (error: any) {
      // Update log entry with error
      await query(
        `UPDATE crawler_logs
         SET status = ?, completed_at = NOW(), error_message = ?
         WHERE id = ?`,
        ['failed', error.message, logId]
      );

      throw error;
    }
  } catch (error: any) {
    console.error('Crawler execution error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to run crawler',
    });
  }
});
