import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('CMS: Proxying AI generation request:', body)
    
    // Check if we should use mock data (fallback for SSL issues)
    const useMockData = process.env.USE_MOCK_AI === 'true'
    
    if (useMockData) {
      console.log('CMS: Using mock AI data for testing')
      
      // Generate mock article based on the request
      const mockResult = {
        success: true,
        data: {
          title: `Complete Guide to ${body.topic}`,
          slug: body.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          content: `# ${body.topic}

${body.topic} represents one of nature's most remarkable nutritional powerhouses. This comprehensive guide explores the incredible benefits, nutritional profile, and practical applications of this exceptional ${body.product_line === 'lentils' ? 'legume' : 'ancient grain'}.

## Nutritional Excellence

${body.product_line === 'lentils' ? 'Lentils' : 'Millets'} are packed with essential nutrients that support overall health and wellbeing. Rich in plant-based protein, dietary fiber, and vital minerals, they offer a complete nutritional solution for modern dietary needs.

## Key Benefits

- **High Protein Content**: Excellent source of plant-based protein
- **Rich in Fiber**: Supports digestive health and satiety
- **Mineral Dense**: Provides essential minerals like iron, magnesium, and potassium
- **Heart Healthy**: Supports cardiovascular health
- **Sustainable**: Environmentally friendly crop choice

## Cooking Methods

${body.product_line === 'lentils' ? 'Lentils cook quickly and easily' : 'Millets are versatile and can be prepared in many ways'}. Here are the most effective preparation methods:

1. **Basic Preparation**: Rinse and sort before cooking
2. **Optimal Cooking**: Use 2:1 water ratio for best results
3. **Flavor Enhancement**: Add herbs and spices during cooking
4. **Storage**: Store properly to maintain freshness

## Health Impact

Regular consumption of ${body.product_line === 'lentils' ? 'lentils' : 'millets'} can contribute significantly to a balanced, healthy diet. The combination of protein, fiber, and essential nutrients makes them an ideal choice for health-conscious consumers.

## Conclusion

${body.topic} offers exceptional nutritional value and culinary versatility. Whether you're looking to improve your health, support sustainable agriculture, or simply enjoy delicious, nutritious meals, ${body.product_line === 'lentils' ? 'lentils' : 'millets'} provide an excellent solution.`,
          excerpt: `Discover the incredible benefits and nutritional power of ${body.topic}. Learn about cooking methods, health benefits, and why this ${body.product_line === 'lentils' ? 'legume' : 'ancient grain'} should be part of your healthy lifestyle.`,
          author: 'Lentils & Millets Team',
          product_line: body.product_line,
          reading_time: 7,
          seo: {
            meta_title: `${body.topic} - Complete Nutritional Guide | Lentils & Millets`,
            meta_description: `Everything you need to know about ${body.topic}. Nutritional benefits, cooking tips, and health advantages of this amazing ${body.product_line === 'lentils' ? 'legume' : 'grain'}.`,
            keywords: body.keywords || []
          }
        }
      }
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return NextResponse.json(mockResult)
    }
    
    // For testing: Use the development token that AI service accepts
    // In production, this should use proper user authentication
    const testToken = process.env.AI_SERVICE_TEST_TOKEN || 'dev-token'
    
    // Forward the request to the AI service with auth
    console.log('CMS: Attempting to call AI service at:', `${AI_SERVICE_URL}/api/ai/generate-article`)
    
    try {
      // Create an AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minute timeout
      
      const aiResponse = await fetch(`${AI_SERVICE_URL}/api/ai/generate-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      console.log('CMS: AI service response status:', aiResponse.status)
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text()
        console.error('AI service error:', aiResponse.status, errorText)
        return NextResponse.json(
          { 
            success: false, 
            error: `AI service error: ${aiResponse.statusText}`,
            details: errorText
          },
          { status: aiResponse.status }
        )
      }
      
      const result = await aiResponse.json()
      console.log('CMS: AI generation successful, session_id:', result.session_id)
      
      return NextResponse.json({
        success: true,
        data: result
      })
      
    } catch (fetchError) {
      console.error('CMS: Fetch error:', fetchError)
      
      // Handle timeout specifically
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'AI generation timeout',
            details: 'Article generation is taking longer than expected. Please try again or use a simpler topic.'
          },
          { status: 408 }
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Network error calling AI service',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('CMS: Error in AI proxy:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}