import { query } from '../../utils/db';
import type { UpdatePublisherRequest } from '../../types';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<UpdatePublisherRequest>(event);

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid publisher ID',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      params.push(body.name);
    }

    if (body.websiteUrl !== undefined) {
      updates.push('website_url = ?');
      params.push(body.websiteUrl);
    }

    if (body.rssUrl !== undefined) {
      updates.push('rss_url = ?');
      params.push(body.rssUrl);
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

    const sql = `UPDATE publishers SET ${updates.join(', ')} WHERE id = ?`;
    const result = await query<any>(sql, params);

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Publisher not found',
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
      statusMessage: 'Failed to update publisher',
    });
  }
});
