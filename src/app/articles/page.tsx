import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  productLine: string
  author: string
  publishedAt: string
  status: string
  readingTime?: number
}

async function getPublishedArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/articles`, {
      next: { revalidate: 60 } // Revalidate every minute
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch articles')
    }
    
    const data = await res.json()
    const articles = data.docs || data
    
    // Filter only published articles
    return articles.filter((article: Article) => article.status === 'published')
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
              <p className="text-gray-600 mt-2">Educational content about lentils and millets</p>
            </div>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Articles Grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Articles Yet</h2>
            <p className="text-gray-600">Check back soon for educational content about lentils and millets!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {articles.map((article: Article) => (
              <article 
                key={article.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Product Line Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      article.productLine === 'lentils' 
                        ? 'bg-orange-100 text-orange-800'
                        : article.productLine === 'millets'
                        ? 'bg-amber-100 text-amber-800'  
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.productLine || 'General'}
                    </span>
                    {article.readingTime && (
                      <span className="text-sm text-gray-500">
                        {article.readingTime} min read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4">
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}