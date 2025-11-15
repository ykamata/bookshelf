import { query } from '../../utils/db';
import type { CreatePreferenceRequest } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<CreatePreferenceRequest>(event);

    // Validate input
    if (!body.preferenceType || !body.value) {
      throw createError({
        statusCode: 400,
        statusMessage: 'preferenceType and value are required',
      });
    }

    const validTypes = ['genre', 'publisher', 'author', 'keyword'];
    if (!validTypes.includes(body.preferenceType)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid preferenceType. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    // Check if preference already exists
    const existing = await query<any>(
      'SELECT id FROM user_preferences WHERE preference_type = ? AND value = ?',
      [body.preferenceType, body.value]
    );

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Preference already exists',
      });
    }

    // Insert new preference
    const result = await query<any>(
      'INSERT INTO user_preferences (preference_type, value) VALUES (?, ?)',
      [body.preferenceType, body.value]
    );

    return {
      success: true,
      id: (result as any).insertId,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create preference',
    });
  }
});
