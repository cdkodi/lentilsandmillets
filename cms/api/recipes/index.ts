import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getRecipes(req, res);
      case 'POST':
        return await createRecipe(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('CMS Recipes API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

async function getRecipes(req: NextApiRequest, res: NextApiResponse) {
  const { 
    category, 
    status = 'published', 
    card_position,
    is_featured,
    meal_type,
    page = '1', 
    limit = '10' 
  } = req.query;

  let query = `
    SELECT 
      id, title, slug, description, hero_image_url, prep_time, cook_time, total_time,
      servings, difficulty, calories_per_serving, protein_grams, fiber_grams,
      nutritional_highlights, health_benefits, category, meal_type, dietary_tags,
      card_position, display_pages, is_featured, meta_title, status, 
      published_at, created_at, updated_at
    FROM cms_recipes 
    WHERE 1=1
  `;
  
  const params = [];
  let paramIndex = 1;

  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (status) {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (card_position) {
    query += ` AND card_position = $${paramIndex}`;
    params.push(card_position);
    paramIndex++;
  }

  if (is_featured !== undefined) {
    query += ` AND is_featured = $${paramIndex}`;
    params.push(is_featured === 'true');
    paramIndex++;
  }

  if (meal_type) {
    query += ` AND meal_type = $${paramIndex}`;
    params.push(meal_type);
    paramIndex++;
  }

  query += ` ORDER BY created_at DESC`;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const offset = (pageNum - 1) * limitNum;
  
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limitNum, offset);

  const recipes = await sql.query(query, params);
  
  // Get total count for pagination
  let countQuery = `SELECT COUNT(*) as total FROM cms_recipes WHERE 1=1`;
  const countParams = [];
  let countParamIndex = 1;

  if (category) {
    countQuery += ` AND category = $${countParamIndex}`;
    countParams.push(category);
    countParamIndex++;
  }

  if (status) {
    countQuery += ` AND status = $${countParamIndex}`;
    countParams.push(status);
    countParamIndex++;
  }

  if (card_position) {
    countQuery += ` AND card_position = $${countParamIndex}`;
    countParams.push(card_position);
    countParamIndex++;
  }

  if (is_featured !== undefined) {
    countQuery += ` AND is_featured = $${countParamIndex}`;
    countParams.push(is_featured === 'true');
    countParamIndex++;
  }

  if (meal_type) {
    countQuery += ` AND meal_type = $${countParamIndex}`;
    countParams.push(meal_type);
    countParamIndex++;
  }

  const totalResult = await sql.query(countQuery, countParams);
  const total = parseInt(totalResult[0].total);

  return res.json({
    success: true,
    data: {
      recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}

async function createRecipe(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    description,
    hero_image_url,
    prep_time,
    cook_time,
    servings,
    difficulty,
    ingredients,
    instructions,
    calories_per_serving,
    protein_grams,
    fiber_grams,
    nutritional_highlights,
    health_benefits,
    category,
    meal_type,
    dietary_tags,
    card_position,
    display_pages,
    is_featured,
    meta_title,
    meta_description,
    status = 'draft'
  } = req.body;

  // Validate required fields
  if (!title || !category || !ingredients || !instructions) {
    return res.status(400).json({
      success: false,
      error: 'Title, category, ingredients, and instructions are required'
    });
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Validate card position assignment if provided
  if (card_position) {
    const isValidAssignment = await validateCardAssignment(
      'recipe', 
      category, 
      card_position, 
      is_featured,
      null // recipe ID for updates
    );
    
    if (!isValidAssignment.valid) {
      return res.status(400).json({
        success: false,
        error: isValidAssignment.message
      });
    }
  }

  const result = await sql`
    INSERT INTO cms_recipes (
      title, slug, description, hero_image_url, prep_time, cook_time, servings, difficulty,
      ingredients, instructions, calories_per_serving, protein_grams, fiber_grams,
      nutritional_highlights, health_benefits, category, meal_type, dietary_tags,
      card_position, display_pages, is_featured, meta_title, meta_description,
      status, published_at
    ) VALUES (
      ${title}, ${slug}, ${description}, ${hero_image_url}, ${prep_time}, ${cook_time},
      ${servings}, ${difficulty}, ${ingredients}, ${instructions}, ${calories_per_serving},
      ${protein_grams}, ${fiber_grams}, ${nutritional_highlights || []}, ${health_benefits || []},
      ${category}, ${meal_type}, ${dietary_tags || []}, ${card_position}, ${display_pages || []},
      ${is_featured || false}, ${meta_title}, ${meta_description}, ${status},
      ${status === 'published' ? new Date() : null}
    )
    RETURNING *
  `;

  return res.json({
    success: true,
    data: result[0]
  });
}

async function validateCardAssignment(
  contentType: 'article' | 'recipe',
  category: 'lentils' | 'millets',
  cardPosition: string,
  isFeatured: boolean,
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

  // Featured recipe positions
  const featuredPositions = {
    lentils: ['H10', 'H11', 'L7', 'L8'],
    millets: ['H18', 'H19', 'M7', 'M8']
  };

  const validPositionsForType = validPositions[contentType][category];
  
  if (!validPositionsForType.includes(cardPosition)) {
    return {
      valid: false,
      message: `${contentType} with category ${category} cannot be assigned to position ${cardPosition}`
    };
  }

  // Check featured recipe requirements
  if (contentType === 'recipe') {
    const isFeaturedPosition = featuredPositions[category].includes(cardPosition);
    
    if (isFeaturedPosition && !isFeatured) {
      return {
        valid: false,
        message: `Position ${cardPosition} requires recipe to be marked as featured`
      };
    }
    
    if (!isFeaturedPosition && isFeatured) {
      return {
        valid: false,
        message: `Featured recipes can only be assigned to featured positions: ${featuredPositions[category].join(', ')}`
      };
    }
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