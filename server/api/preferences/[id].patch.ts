import { query } from '../../utils/db';
import type { UpdatePreferenceRequest } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<UpdatePreferenceRequest>(event);

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid preference ID',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (body.value !== undefined) {
      updates.push('value = ?');
      params.push(body.value);
    }

    if (body.isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(body.isActive);
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update',
      });
    }

    params.push(Number(id));

    const sql = `UPDATE user_preferences SET ${updates.join(', ')} WHERE id = ?`;
    const result = await query<any>(sql, params);

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
      statusMessage: 'Failed to update preference',
    });
  }
});
