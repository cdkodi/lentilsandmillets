import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ success: false, error: 'Invalid article ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getArticle(id, res);
      case 'PUT':
        return await updateArticle(id, req.body, res);
      case 'DELETE':
        return await deleteArticle(id, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('CMS Article API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

async function getArticle(id: string, res: NextApiResponse) {
  const result = await sql`
    SELECT * FROM cms_articles WHERE id = ${parseInt(id)}
  `;

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Article not found'
    });
  }

  return res.json({
    success: true,
    data: result[0]
  });
}

async function updateArticle(id: string, data: any, res: NextApiResponse) {
  const {
    title,
    content,
    excerpt,
    hero_image_url,
    hero_image_id,
    author,
    category,
    card_position,
    display_pages,
    factoid_data,
    meta_title,
    meta_description,
    tags,
    status
  } = data;

  // Validate card position assignment if provided
  if (card_position) {
    const isValidAssignment = await validateCardAssignment(
      'article', 
      category, 
      card_position, 
      parseInt(id)
    );
    
    if (!isValidAssignment.valid) {
      return res.status(400).json({
        success: false,
        error: isValidAssignment.message
      });
    }
  }

  // Generate new slug if title changed
  let slug;
  if (title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const result = await sql`
    UPDATE cms_articles 
    SET 
      title = COALESCE(${title}, title),
      slug = COALESCE(${slug}, slug),
      content = COALESCE(${content}, content),
      excerpt = COALESCE(${excerpt}, excerpt),
      hero_image_url = COALESCE(${hero_image_url}, hero_image_url),
      hero_image_id = COALESCE(${hero_image_id}, hero_image_id),
      author = COALESCE(${author}, author),
      category = COALESCE(${category}, category),
      card_position = ${card_position},
      display_pages = COALESCE(${display_pages}, display_pages),
      factoid_data = COALESCE(${factoid_data}, factoid_data),
      meta_title = COALESCE(${meta_title}, meta_title),
      meta_description = COALESCE(${meta_description}, meta_description),
      tags = COALESCE(${tags}, tags),
      status = COALESCE(${status}, status),
      published_at = CASE 
        WHEN ${status} = 'published' AND published_at IS NULL THEN NOW()
        WHEN ${status} != 'published' THEN NULL
        ELSE published_at
      END,
      updated_at = NOW()
    WHERE id = ${parseInt(id)}
    RETURNING *
  `;

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Article not found'
    });
  }

  return res.json({
    success: true,
    data: result[0]
  });
}

async function deleteArticle(id: string, res: NextApiResponse) {
  // Soft delete - set status to archived
  const result = await sql`
    UPDATE cms_articles 
    SET status = 'archived', updated_at = NOW()
    WHERE id = ${parseInt(id)}
    RETURNING id, title, status
  `;

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Article not found'
    });
  }

  return res.json({
    success: true,
    data: { message: 'Article archived successfully', article: result[0] }
  });
}

async function validateCardAssignment(
  contentType: 'article' | 'recipe',
  category: 'lentils' | 'millets',
  cardPosition: string,
  excludeId?: number
): Promise<{ valid: boolean; message?: string }> {
  // Define valid positions for each content type and category
  const validPositions = {
    article: {
      lentils: ['H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'],
      millets: ['H0', 'H1', 'H2', 'H3', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6']
    },
    recipe: {
      lentils: ['H0', 'H1', 'H2', 'H3', 'H7', 'H8', 'H9', 'H10', 'H11', 'L4', 'L5', 'L6', 'L7', 'L8'],
      millets: ['H0', 'H1', 'H2', 'H3', 'H15', 'H16', 'H17', 'H18', 'H19', 'M4', 'M5', 'M6', 'M7', 'M8']
    }
  };

  const validPositionsForType = validPositions[contentType][category];
  
  if (!validPositionsForType.includes(cardPosition)) {
    return {
      valid: false,
      message: `${contentType} with category ${category} cannot be assigned to position ${cardPosition}`
    };
  }

  // Check if position is already occupied
  const existingArticle = await sql`
    SELECT id FROM cms_articles 
    WHERE card_position = ${cardPosition} 
      AND status = 'published'
      ${excludeId ? sql`AND id != ${excludeId}` : sql``}
  `;

  const existingRecipe = await sql`
    SELECT id FROM cms_recipes 
    WHERE card_position = ${cardPosition} 
      AND status = 'published'
      ${excludeId ? sql`AND id != ${excludeId}` : sql``}
  `;

  if (existingArticle.length > 0 || existingRecipe.length > 0) {
    return {
      valid: false,
      message: `Card position ${cardPosition} is already occupied`
    };
  }

  return { valid: true };
}