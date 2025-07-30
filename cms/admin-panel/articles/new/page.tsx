'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewArticlePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    productLine: 'general',
    excerpt: '',
    content: '',
    author: 'Lentils & Millets Team',
    readingTime: 5,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    status: 'draft',
    nutritionalData: {
      metric1: {
        value: '',
        label: ''
      },
      metric2: {
        value: '',
        label: ''
      },
      keyBenefits: [
        { benefit: '' },
        { benefit: '' },
        { benefit: '' }
      ]
    }
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleNutritionalChange = (metric: 'metric1' | 'metric2', field: 'value' | 'label', value: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionalData: {
        ...prev.nutritionalData,
        [metric]: {
          ...prev.nutritionalData[metric],
          [field]: value
        }
      }
    }))
  }

  const handleBenefitChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionalData: {
        ...prev.nutritionalData,
        keyBenefits: prev.nutritionalData.keyBenefits.map((benefit, i) => 
          i === index ? { benefit: value } : benefit
        )
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const articleData: any = {
        title: formData.title,
        slug: formData.slug,
        productLine: formData.productLine,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        readingTime: formData.readingTime,
        seo: {
          metaTitle: formData.metaTitle || formData.title,
          metaDescription: formData.metaDescription || formData.excerpt,
          keywords: formData.keywords
        },
        status: formData.status,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null
      }

      // Add nutritional data only for millets articles
      if (formData.productLine === 'millets') {
        articleData.nutritionalData = formData.nutritionalData
      }

      console.log('Creating article:', articleData)

      const response = await fetch('/api/articles-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Article created successfully:', result)
        router.push('/admin-panel/dashboard')
      } else {
        const error = await response.text()
        console.error('Failed to create article:', error)
        alert('Failed to create article. Please try again.')
      }
    } catch (error) {
      console.error('Error creating article:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin-panel/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
                <p className="text-gray-600">Add educational content for lentils and millets</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core article details and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter article title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productLine">Product Line *</Label>
                  <select
                    id="productLine"
                    value={formData.productLine}
                    onChange={(e) => handleInputChange('productLine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="general">General</option>
                    <option value="lentils">Lentils</option>
                    <option value="millets">Millets</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                  <Input
                    id="readingTime"
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) => handleInputChange('readingTime', parseInt(e.target.value) || 5)}
                    placeholder="5"
                    min="1"
                    max="60"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Article content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* Nutritional Data - Only for Millets */}
          {formData.productLine === 'millets' && (
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Data</CardTitle>
                <CardDescription>Nutritional facts and key benefits for this millet variety</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Metric 1 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">First Metric</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="metric1-value">Value</Label>
                        <Input
                          id="metric1-value"
                          value={formData.nutritionalData.metric1.value}
                          onChange={(e) => handleNutritionalChange('metric1', 'value', e.target.value)}
                          placeholder="e.g., 200mm, 344mg, 50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="metric1-label">Label</Label>
                        <Input
                          id="metric1-label"
                          value={formData.nutritionalData.metric1.label}
                          onChange={(e) => handleNutritionalChange('metric1', 'label', e.target.value)}
                          placeholder="e.g., Min Rainfall, Calcium per 100g, Glycemic Index"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Second Metric</h4>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="metric2-value">Value</Label>
                        <Input
                          id="metric2-value"
                          value={formData.nutritionalData.metric2.value}
                          onChange={(e) => handleNutritionalChange('metric2', 'value', e.target.value)}
                          placeholder="e.g., 46°C, 3.9mg, 12.3g"
                        />
                      </div>
                      <div>
                        <Label htmlFor="metric2-label">Label</Label>
                        <Input
                          id="metric2-label"
                          value={formData.nutritionalData.metric2.label}
                          onChange={(e) => handleNutritionalChange('metric2', 'label', e.target.value)}
                          placeholder="e.g., Heat Tolerance, Iron per 100g, Protein per 100g"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Benefits (3 required)</h4>
                  <div className="space-y-2">
                    {formData.nutritionalData.keyBenefits.map((benefit, index) => (
                      <div key={index}>
                        <Label htmlFor={`benefit-${index}`}>Benefit {index + 1}</Label>
                        <Input
                          id={`benefit-${index}`}
                          value={benefit.benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          placeholder={`e.g., ${index === 0 ? 'Drought-resistant supercrop' : index === 1 ? 'Superior to dairy for calcium' : 'Rich in amino acids'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Information */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
              <CardDescription>Optimize your article for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="SEO optimized title (will use article title if empty)"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="SEO description (will use excerpt if empty)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="comma, separated, keywords"
                />
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Control article visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin-panel/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Article'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}