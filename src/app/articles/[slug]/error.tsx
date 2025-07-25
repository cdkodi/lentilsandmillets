'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Article page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentSection="article"
      />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-8">
            We encountered an error while loading this article.
          </p>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}