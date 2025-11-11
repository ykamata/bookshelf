import { query } from './db';
import { runCrawler } from './crawler';

let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Calculate next run time based on frequency
 */
function calculateNextRun(frequency: string, lastRun?: Date): Date {
  const now = new Date();
  const next = new Date(lastRun || now);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0); // Run at midnight
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      next.setHours(0, 0, 0, 0); // Run at midnight
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  return next;
}

/**
 * Check and run scheduled tasks
 */
async function checkSchedules() {
  try {
    const now = new Date();

    // Get all active schedules that are due to run
    const schedules = await query<any>(
      `SELECT * FROM crawler_schedules
       WHERE is_active = 1
       AND (next_run_at IS NULL OR next_run_at <= ?)`,
      [now]
    );

    for (const schedule of schedules) {
      console.log(`Running scheduled crawler: ${schedule.name}`);

      // Create log entry
      const logResult = await query<any>(
        `INSERT INTO crawler_logs (schedule_id, status, started_at)
         VALUES (?, ?, NOW())`,
        [schedule.id, 'running']
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

        // Update schedule
        const nextRun = calculateNextRun(schedule.frequency, new Date());
        await query(
          `UPDATE crawler_schedules
           SET last_run_at = NOW(), next_run_at = ?
           WHERE id = ?`,
          [nextRun, schedule.id]
        );

        console.log(`Scheduled crawler completed: ${schedule.name}, next run: ${nextRun}`);
      } catch (error: any) {
        console.error(`Scheduled crawler failed: ${schedule.name}`, error);

        // Update log entry with error
        await query(
          `UPDATE crawler_logs
           SET status = ?, completed_at = NOW(), error_message = ?
           WHERE id = ?`,
          ['failed', error.message, logId]
        );

        // Still update next run time even if failed
        const nextRun = calculateNextRun(schedule.frequency, new Date());
        await query(
          `UPDATE crawler_schedules
           SET last_run_at = NOW(), next_run_at = ?
           WHERE id = ?`,
          [nextRun, schedule.id]
        );
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
}

/**
 * Start the scheduler
 */
export function startScheduler() {
  if (schedulerInterval) {
    console.log('Scheduler already running');
    return;
  }

  console.log('Starting crawler scheduler...');

  // Check every hour
  const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

  // Run immediately on start
  checkSchedules();

  // Then run periodically
  schedulerInterval = setInterval(checkSchedules, CHECK_INTERVAL);

  console.log('Crawler scheduler started (checking every hour)');
}

/**
 * Stop the scheduler
 */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Crawler scheduler stopped');
  }
}

/**
 * Initialize default schedules
 */
export async function initializeDefaultSchedules() {
  try {
    // Check if daily schedule exists
    const dailySchedule = await query<any>(
      'SELECT id FROM crawler_schedules WHERE name = ? LIMIT 1',
      ['Daily Crawler']
    );

    if (dailySchedule.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      await query(
        `INSERT INTO crawler_schedules (name, description, frequency, next_run_at, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Daily Crawler',
          'Automatically runs every day to check for new book releases',
          'daily',
          tomorrow,
          true,
        ]
      );
      console.log('Created daily crawler schedule');
    }

    // Check if weekly schedule exists
    const weeklySchedule = await query<any>(
      'SELECT id FROM crawler_schedules WHERE name = ? LIMIT 1',
      ['Weekly Crawler']
    );

    if (weeklySchedule.length === 0) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(0, 0, 0, 0);

      await query(
        `INSERT INTO crawler_schedules (name, description, frequency, next_run_at, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Weekly Crawler',
          'Automatically runs every week to check for new book releases',
          'weekly',
          nextWeek,
          false, // Disabled by default
        ]
      );
      console.log('Created weekly crawler schedule');
    }
  } catch (error) {
    console.error('Failed to initialize default schedules:', error);
  }
}
