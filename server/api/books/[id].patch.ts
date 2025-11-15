import { query } from '../../utils/db';

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  genre?: string;
  cover?: string;
  color?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const body = await readBody<UpdateBookRequest>(event);

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid book ID',
      });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      params.push(body.title);
    }

    if (body.author !== undefined) {
      updates.push('author = ?');
      params.push(body.author);
    }

    if (body.genre !== undefined) {
      updates.push('genre = ?');
      params.push(body.genre);
    }

    if (body.cover !== undefined) {
      updates.push('cover = ?');
      params.push(body.cover);
    }

    if (body.color !== undefined) {
      updates.push('color = ?');
      params.push(body.color);
    }

    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No fields to update',
      });
    }

    params.push(Number(id));

    const sql = `UPDATE books SET ${updates.join(', ')} WHERE id = ?`;
    const result = await query<any>(sql, params);

    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found',
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
      statusMessage: 'Failed to update book',
    });
  }
});
