'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  published_at: string
  status: string
  hero_image_url?: string
  hero_image_id?: number
  factoid_data?: {
    icon: string
    primary_stat: { value: string; label: string }
    secondary_stat: { value: string; label: string }
    highlights: string[]
  }
  meta_title?: string
  meta_description?: string
  tags?: string[]
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/cms/articles?status=published&limit=100')
        
        if (!res.ok) {
          throw new Error('Failed to fetch articles')
        }
        
        const data = await res.json()
        const articles = data.data?.articles || []
        
        // Find the article and ensure it's published
        const foundArticle = articles.find((a: Article) => a.slug === slug && a.status === 'published')
        
        if (!foundArticle) {
          setError('Article not found or not published')
        } else {
          setArticle(foundArticle)
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  const handleNavigate = (section: string) => {
    switch (section) {
      case 'home':
        router.push('/')
        break
      case 'lentils':
        router.push('/#lentils')
        break
      case 'millets':
        router.push('/#millets')
        break
      case 'recipes':
        router.push('/#recipes')
        break
      default:
        router.push('/')
    }
  }

  const getCurrentSection = () => {
    if (!article) return 'home'
    // Map article category to correct navigation section
    if (article.category === 'lentils') return 'lentils'
    if (article.category === 'millets') return 'millets'
    return 'home'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          currentSection={getCurrentSection()}
          onNavigate={handleNavigate}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading article...</div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          currentSection={getCurrentSection()}
          onNavigate={handleNavigate}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-8">{error || 'This article could not be found.'}</p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Site Header */}
      <Header 
        currentSection={getCurrentSection()}
        onNavigate={handleNavigate}
      />
      
      {/* Article Header */}
      <div className="pt-16">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center mb-4"
            >
              <svg className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          
          {/* Category Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              article.category === 'lentils' 
                ? 'bg-orange-100 text-orange-800'
                : article.category === 'millets'
                ? 'bg-amber-100 text-amber-800'  
                : 'bg-gray-100 text-gray-800'
            }`}>
              {article.category || 'General'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>By {article.author}</span>
            <span>•</span>
            <time dateTime={article.published_at}>
              {new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>5 min read</span>
          </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          {/* Excerpt */}
          <div className="text-xl text-gray-600 mb-8 not-prose">
            <p className="italic border-l-4 border-gray-300 pl-4">
              {article.excerpt}
            </p>
          </div>

          {/* Content */}
          <div className="prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Want to learn more about {article.category === 'general' ? 'lentils and millets' : article.category}?
          </h3>
          <p className="text-gray-600 mb-4">
            Explore our other articles and discover the nutritional benefits of these amazing foods.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/articles"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              More Articles
            </Link>
            <Link 
              href="/"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}