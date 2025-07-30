import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page || !['home', 'lentils', 'millets'].includes(page)) {
      return NextResponse.json({
        success: false,
        error: 'Page parameter must be one of: home, lentils, millets'
      }, { status: 400 })
    }

    // Define card positions for each page
    const cardPositions = {
      home: Array.from({ length: 20 }, (_, i) => `H${i}`),
      lentils: Array.from({ length: 8 }, (_, i) => `L${i + 1}`),
      millets: Array.from({ length: 8 }, (_, i) => `M${i + 1}`)
    }

    const positions = cardPositions[page as keyof typeof cardPositions]

    const client = await pool.connect()

    // Get articles for this page
    const articlesResult = await client.query(`
      SELECT 
        id, title, slug, category, card_position, status,
        meta_title, meta_description, created_at, updated_at
      FROM cms_articles 
      WHERE status = 'published'
        AND card_position IS NOT NULL
    `)

    // Get recipes for this page  
    const recipesResult = await client.query(`
      SELECT 
        id, title, slug, category, card_position, status,
        difficulty, prep_time, cook_time, servings,
        created_at, updated_at
      FROM cms_recipes 
      WHERE status = 'published'
        AND card_position IS NOT NULL
    `)

    client.release()

    const articles = articlesResult.rows
    const recipes = recipesResult.rows

    // Build card data structure
    const cards = positions.map(position => {
      const article = articles.find(a => a.card_position === position)
      const recipe = recipes.find(r => r.card_position === position)
      
      if (article) {
        return {
          position,
          content_type: 'article',
          content: {
            id: article.id,
            title: article.title,
            slug: article.slug,
            category: article.category,
            card_position: article.card_position
          }
        }
      }
      
      if (recipe) {
        return {
          position,
          content_type: 'recipe',
          content: {
            id: recipe.id,
            title: recipe.title,
            slug: recipe.slug,
            category: recipe.category,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            servings: recipe.servings,
            difficulty: recipe.difficulty,
            card_position: recipe.card_position
          }
        }
      }
      
      return {
        position,
        content_type: null,
        content: null
      }
    })

    const emptyPositions = cards
      .filter(card => card.content === null)
      .map(card => card.position)

    return NextResponse.json({
      success: true,
      data: {
        page,
        cards,
        empty_positions: emptyPositions
      }
    })
    
  } catch (error) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_type, content_id, card_position, display_pages } = body

    if (!content_type || !content_id || !card_position) {
      return NextResponse.json({
        success: false,
        error: 'content_type, content_id, and card_position are required'
      }, { status: 400 })
    }

    if (!['article', 'recipe'].includes(content_type)) {
      return NextResponse.json({
        success: false,
        error: 'content_type must be either "article" or "recipe"'
      }, { status: 400 })
    }

    const client = await pool.connect()

    // Update the content with the new card position
    if (content_type === 'article') {
      const result = await client.query(
        `UPDATE cms_articles 
         SET card_position = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, title, card_position`,
        [card_position, content_id]
      )

      if (result.rows.length === 0) {
        client.release()
        return NextResponse.json({
          success: false,
          error: 'Article not found'
        }, { status: 404 })
      }

      client.release()
      return NextResponse.json({
        success: true,
        data: {
          message: 'Card assigned successfully',
          assignment: {
            content_type,
            content_id,
            card_position
          }
        }
      })
    } else {
      const result = await client.query(
        `UPDATE cms_recipes 
         SET card_position = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, title, card_position`,
        [card_position, content_id]
      )

      if (result.rows.length === 0) {
        client.release()
        return NextResponse.json({
          success: false,
          error: 'Recipe not found'
        }, { status: 404 })
      }

      client.release()
      return NextResponse.json({
        success: true,
        data: {
          message: 'Card assigned successfully',
          assignment: {
            content_type,
            content_id,
            card_position
          }
        }
      })
    }
    
  } catch (error) {
    console.error('Error assigning card:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to assign card' },
      { status: 500 }
    )
  }
}