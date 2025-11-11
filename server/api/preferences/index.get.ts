import { query } from '../../utils/db';
import type { UserPreference } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event);
    const preferenceType = queryParams.type as string | undefined;

    let sql = 'SELECT * FROM user_preferences WHERE 1=1';
    const params: any[] = [];

    if (preferenceType) {
      sql += ' AND preference_type = ?';
      params.push(preferenceType);
    }

    sql += ' ORDER BY preference_type, value';

    const results = await query<any>(sql, params);

    // Convert snake_case to camelCase
    const preferences: UserPreference[] = results.map(row => ({
      id: row.id,
      preferenceType: row.preference_type,
      value: row.value,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return preferences;
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch preferences',
    });
  }
});
