import { query } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<{ isNotified?: boolean }>(event);

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid release ID',
      });
    }

    if (body.isNotified === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'isNotified field is required',
      });
    }

    const result = await query<any>(
      'UPDATE new_releases SET is_notified = ? WHERE id = ?',
      [body.isNotified ? 1 : 0, Number(id)]
    );

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Release not found',
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
      statusMessage: 'Failed to update release',
    });
  }
});
