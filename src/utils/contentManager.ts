export interface ContentFilter {
  productLine?: 'lentils' | 'millets' | 'general' | 'any'
  category?: 'nutritional' | 'variety' | 'recipe' | 'health' | 'cooking' | 'research' | 'any'
  featuredOnly?: boolean
  tags?: string[]
  maxItems?: number
  sortBy?: 'priority' | 'publishedAt' | 'title' | 'random'
}

export interface SectionConfig {
  sectionName: string
  sectionType: string
  contentFilter: ContentFilter
  displaySettings: {
    maxItems: number
    sortBy: string
    showMoreButton: boolean
    moreButtonText?: string
    moreButtonLink?: string
  }
  enabled: boolean
}

export class ContentManager {
  /**
   * Fetch articles with advanced filtering and sorting
   */
  static async fetchFilteredContent(filter: ContentFilter = {}): Promise<any[]> {
    try {
      const response = await fetch('/api/articles')
      
      if (!response.ok) {
        console.warn('Failed to fetch articles:', response.statusText)
        return []
      }
      
      const data = await response.json()
      let articles = data.docs || data || []
      
      // Apply filters
      articles = articles.filter((article: any) => {
        // Status filter - only published
        if (article.status !== 'published') return false
        
        // Product line filter
        if (filter.productLine && filter.productLine !== 'any') {
          if (article.productLine !== filter.productLine) return false
        }
        
        // Category filter
        if (filter.category && filter.category !== 'any') {
          if (article.category !== filter.category) return false
        }
        
        // Featured filter
        if (filter.featuredOnly && !article.featured) return false
        
        // Tags filter
        if (filter.tags && filter.tags.length > 0) {
          const articleTags = article.tags || []
          const hasMatchingTag = filter.tags.some(tag => articleTags.includes(tag))
          if (!hasMatchingTag) return false
        }
        
        return true
      })
      
      // Apply sorting
      articles = this.sortContent(articles, filter.sortBy || 'priority')
      
      // Apply limit
      if (filter.maxItems && filter.maxItems > 0) {
        articles = articles.slice(0, filter.maxItems)
      }
      
      return articles
      
    } catch (error) {
      console.warn('Error fetching filtered content:', error)
      return []
    }
  }
  
  /**
   * Sort content based on specified criteria
   */
  static sortContent(articles: any[], sortBy: string): any[] {
    switch (sortBy) {
      case 'priority':
        return articles.sort((a, b) => (b.priority || 50) - (a.priority || 50))
      
      case 'publishedAt':
        return articles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || 0)
          const dateB = new Date(b.publishedAt || b.createdAt || 0)
          return dateB.getTime() - dateA.getTime()
        })
      
      case 'title':
        return articles.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      
      case 'random':
        return articles.sort(() => Math.random() - 0.5)
      
      default:
        return articles
    }
  }
  
  /**
   * Fetch page layout configuration
   */
  static async fetchPageLayout(pageSlug: string): Promise<SectionConfig[]> {
    try {
      const response = await fetch(`/api/page-layouts?where[pageSlug][equals]=${pageSlug}`)
      
      if (!response.ok) {
        console.warn('Failed to fetch page layout:', response.statusText)
        return []
      }
      
      const data = await response.json()
      const layouts = data.docs || []
      
      if (layouts.length === 0) {
        console.warn(`No layout found for page: ${pageSlug}`)
        return []
      }
      
      const layout = layouts[0]
      return layout.sections?.filter((section: any) => section.enabled) || []
      
    } catch (error) {
      console.warn('Error fetching page layout:', error)
      return []
    }
  }
  
  /**
   * Get content for a specific section
   */
  static async getContentForSection(sectionConfig: SectionConfig): Promise<any[]> {
    const filter: ContentFilter = {
      ...sectionConfig.contentFilter,
      maxItems: sectionConfig.displaySettings.maxItems,
      sortBy: sectionConfig.displaySettings.sortBy as any,
    }
    
    return this.fetchFilteredContent(filter)
  }
  
  /**
   * Helper method to get featured recipes for a product line
   */
  static async getFeaturedRecipes(productLine: 'lentils' | 'millets', maxItems: number = 4): Promise<any[]> {
    return this.fetchFilteredContent({
      productLine,
      category: 'recipe',
      featuredOnly: true,
      maxItems,
      sortBy: 'priority',
    })
  }
  
  /**
   * Helper method to get nutritional facts for a product line
   */
  static async getNutritionalFacts(productLine: 'lentils' | 'millets', maxItems: number = 3): Promise<any[]> {
    return this.fetchFilteredContent({
      productLine,
      category: 'nutritional',
      maxItems,
      sortBy: 'priority',
    })
  }
  
  /**
   * Helper method to get variety guides for a product line
   */
  static async getVarietyGuides(productLine: 'lentils' | 'millets', maxItems: number = 6): Promise<any[]> {
    return this.fetchFilteredContent({
      productLine,
      category: 'variety',
      maxItems,
      sortBy: 'title',
    })
  }
  
  /**
   * Helper method to get latest research
   */
  static async getLatestResearch(productLine?: 'lentils' | 'millets', maxItems: number = 3): Promise<any[]> {
    return this.fetchFilteredContent({
      productLine: productLine || 'any',
      category: 'research',
      maxItems,
      sortBy: 'publishedAt',
    })
  }
}

export default ContentManager