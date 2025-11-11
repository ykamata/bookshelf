import { query } from '../../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<{
      isActive?: boolean;
      frequency?: string;
      nextRunAt?: string;
    }>(event);

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid schedule ID',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (body.isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(body.isActive ? 1 : 0);
    }

    if (body.frequency !== undefined) {
      const validFrequencies = ['daily', 'weekly', 'manual'];
      if (!validFrequencies.includes(body.frequency)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid frequency. Must be daily, weekly, or manual',
        });
      }
      updates.push('frequency = ?');
      params.push(body.frequency);
    }

    if (body.nextRunAt !== undefined) {
      updates.push('next_run_at = ?');
      params.push(body.nextRunAt);
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update',
      });
    }

    params.push(Number(id));

    const sql = `UPDATE crawler_schedules SET ${updates.join(', ')} WHERE id = ?`;
    const result = await query<any>(sql, params);

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Schedule not found',
      });
    }

    return {
      success: true,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update schedule',
    });
  }
});
