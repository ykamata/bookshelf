import { query } from '../../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid preference ID',
      });
    }

    const result = await query<any>(
      'DELETE FROM user_preferences WHERE id = ?',
      [Number(id)]
    );

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Preference not found',
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
      statusMessage: 'Failed to delete preference',
    });
  }
});
