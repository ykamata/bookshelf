import { startScheduler, initializeDefaultSchedules } from '../utils/scheduler';

export default defineNitroPlugin(async (nitroApp) => {
  console.log('Initializing crawler scheduler plugin...');

  // Only run in production or if explicitly enabled
  const enableScheduler = process.env.ENABLE_CRAWLER_SCHEDULER === 'true' || process.env.NODE_ENV === 'production';

  if (enableScheduler) {
    try {
      // Initialize default schedules if they don't exist
      await initializeDefaultSchedules();

      // Start the scheduler
      startScheduler();

      console.log('Crawler scheduler initialized successfully');
    } catch (error) {
      console.error('Failed to initialize crawler scheduler:', error);
    }
  } else {
    console.log('Crawler scheduler disabled (set ENABLE_CRAWLER_SCHEDULER=true to enable in development)');
  }
});
