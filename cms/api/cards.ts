import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await getCards(req, res);
      case 'POST':
        return await assignCard(req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('CMS Cards API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

async function getCards(req: NextApiRequest, res: NextApiResponse) {
  const { page } = req.query;

  if (!page || !['home', 'lentils', 'millets'].includes(page as string)) {
    return res.status(400).json({
      success: false,
      error: 'Page parameter must be one of: home, lentils, millets'
    });
  }

  // Define card positions for each page
  const cardPositions = {
    home: Array.from({ length: 20 }, (_, i) => `H${i}`),
    lentils: Array.from({ length: 8 }, (_, i) => `L${i + 1}`),
    millets: Array.from({ length: 8 }, (_, i) => `M${i + 1}`)
  };

  const positions = cardPositions[page as keyof typeof cardPositions];

  // Get articles for this page
  const articles = await sql`
    SELECT 
      id, title, slug, hero_image_url, category, card_position, factoid_data
    FROM cms_articles 
    WHERE ${page} = ANY(display_pages) 
      AND status = 'published'
      AND card_position IS NOT NULL
  `;

  // Get recipes for this page
  const recipes = await sql`
    SELECT 
      id, title, slug, hero_image_url, category, card_position, 
      prep_time, cook_time, servings, difficulty, is_featured
    FROM cms_recipes 
    WHERE ${page} = ANY(display_pages) 
      AND status = 'published'
      AND card_position IS NOT NULL
  `;

  // Build card data structure
  const cards = positions.map(position => {
    const article = articles.find(a => a.card_position === position);
    const recipe = recipes.find(r => r.card_position === position);
    
    if (article) {
      return {
        position,
        content_type: 'article',
        content: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          hero_image_url: article.hero_image_url,
          category: article.category,
          factoid_data: article.factoid_data
        }
      };
    }
    
    if (recipe) {
      return {
        position,
        content_type: 'recipe',
        content: {
          id: recipe.id,
          title: recipe.title,
          slug: recipe.slug,
          hero_image_url: recipe.hero_image_url,
          category: recipe.category,
          prep_time: recipe.prep_time,
          cook_time: recipe.cook_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          is_featured: recipe.is_featured
        }
      };
    }
    
    return {
      position,
      content_type: null,
      content: null
    };
  });

  const emptyPositions = cards
    .filter(card => card.content === null)
    .map(card => card.position);

  return res.json({
    success: true,
    data: {
      page,
      cards,
      empty_positions: emptyPositions
    }
  });
}

async function assignCard(req: NextApiRequest, res: NextApiResponse) {
  const { content_type, content_id, card_position, display_pages } = req.body;

  if (!content_type || !content_id || !card_position) {
    return res.status(400).json({
      success: false,
      error: 'content_type, content_id, and card_position are required'
    });
  }

  if (!['article', 'recipe'].includes(content_type)) {
    return res.status(400).json({
      success: false,
      error: 'content_type must be either "article" or "recipe"'
    });
  }

  // Update the content with the new card position
  if (content_type === 'article') {
    const result = await sql`
      UPDATE cms_articles 
      SET 
        card_position = ${card_position},
        display_pages = ${display_pages || []},
        updated_at = NOW()
      WHERE id = ${content_id}
      RETURNING id, title, card_position, display_pages
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    return res.json({
      success: true,
      data: {
        message: 'Card assigned successfully',
        assignment: {
          content_type,
          content_id,
          card_position,
          display_pages: result[0].display_pages
        }
      }
    });
  } else {
    const result = await sql`
      UPDATE cms_recipes 
      SET 
        card_position = ${card_position},
        display_pages = ${display_pages || []},
        updated_at = NOW()
      WHERE id = ${content_id}
      RETURNING id, title, card_position, display_pages
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Recipe not found'
      });
    }

    return res.json({
      success: true,
      data: {
        message: 'Card assigned successfully',
        assignment: {
          content_type,
          content_id,
          card_position,
          display_pages: result[0].display_pages
        }
      }
    });
  }
}