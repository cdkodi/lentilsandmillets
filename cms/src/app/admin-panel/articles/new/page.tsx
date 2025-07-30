'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, Image as ImageIcon, X, Plus, Trash2, BarChart3, Heart, Leaf, Globe, Sparkles } from 'lucide-react'
import ImageManager from '@/components/admin/ImageManager'

interface FactoidData {
  primary_stat: {
    value: string;
    label: string;
  };
  secondary_stat: {
    value: string;
    label: string;
  };
  icon: 'protein' | 'health' | 'nutrition' | 'sustainability';
  highlights: string[];
}

interface ImageRecord {
  id: number;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  public_url: string;
  variants: {
    urls: Record<string, string>;
    metadata: Record<string, any>;
    blur_placeholder: string;
  };
  alt_text: string | null;
  category: string;
  created_at: string;
}

export default function NewArticlePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [showImageManager, setShowImageManager] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null)
  const [showFactoidBuilder, setShowFactoidBuilder] = useState(false)
  const [isAIGenerated, setIsAIGenerated] = useState(false)
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
    featuredImage: null as ImageRecord | null,
    factoidData: null as FactoidData | null,
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

  // Check for AI-generated data on page load
  useEffect(() => {
    const fromAI = searchParams.get('from') === 'ai'
    if (fromAI) {
      const aiData = sessionStorage.getItem('ai_generated_article')
      if (aiData) {
        try {
          const parsedData = JSON.parse(aiData)
          console.log('Loading AI-generated data:', parsedData)
          
          // Map AI data to form structure
          setFormData(prev => ({
            ...prev,
            title: parsedData.data?.title || parsedData.title || '',
            slug: parsedData.data?.slug || parsedData.slug || '',
            productLine: parsedData.data?.product_line || parsedData.product_line || 'general',
            excerpt: parsedData.data?.excerpt || parsedData.excerpt || '',
            content: parsedData.data?.content || parsedData.content || '',
            author: parsedData.data?.author || parsedData.author || 'Lentils & Millets Team',
            readingTime: parsedData.data?.reading_time || parsedData.reading_time || 5,
            metaTitle: parsedData.data?.seo?.meta_title || '',
            metaDescription: parsedData.data?.seo?.meta_description || '',
            keywords: parsedData.data?.seo?.keywords?.join(', ') || ''
          }))
          
          setIsAIGenerated(true)
          
          // Clear the session storage
          sessionStorage.removeItem('ai_generated_article')
        } catch (error) {
          console.error('Error parsing AI data:', error)
        }
      }
    }
  }, [searchParams])

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

  const handleImageSelect = (image: ImageRecord) => {
    setSelectedImage(image)
    setFormData(prev => ({
      ...prev,
      featuredImage: image
    }))
    setShowImageManager(false)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setFormData(prev => ({
      ...prev,
      featuredImage: null
    }))
  }

  const handleFactoidChange = (field: keyof FactoidData, value: any) => {
    setFormData(prev => ({
      ...prev,
      factoidData: {
        ...prev.factoidData!,
        [field]: value
      }
    }))
  }

  const addHighlight = () => {
    if (!formData.factoidData) return
    
    setFormData(prev => ({
      ...prev,
      factoidData: {
        ...prev.factoidData!,
        highlights: [...prev.factoidData!.highlights, '']
      }
    }))
  }

  const updateHighlight = (index: number, value: string) => {
    if (!formData.factoidData) return
    
    const newHighlights = [...formData.factoidData.highlights]
    newHighlights[index] = value
    
    setFormData(prev => ({
      ...prev,
      factoidData: {
        ...prev.factoidData!,
        highlights: newHighlights
      }
    }))
  }

  const removeHighlight = (index: number) => {
    if (!formData.factoidData) return
    
    const newHighlights = formData.factoidData.highlights.filter((_, i) => i !== index)
    
    setFormData(prev => ({
      ...prev,
      factoidData: {
        ...prev.factoidData!,
        highlights: newHighlights
      }
    }))
  }

  const initializeFactoidData = () => {
    setFormData(prev => ({
      ...prev,
      factoidData: {
        primary_stat: { value: '', label: '' },
        secondary_stat: { value: '', label: '' },
        icon: 'protein',
        highlights: ['', '', '']
      }
    }))
    setShowFactoidBuilder(true)
  }

  const removeFactoidData = () => {
    setFormData(prev => ({
      ...prev,
      factoidData: null
    }))
    setShowFactoidBuilder(false)
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
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
        featuredImage: formData.featuredImage ? {
          id: formData.featuredImage.id,
          url: formData.featuredImage.public_url,
          alt: formData.featuredImage.alt_text || formData.title,
          filename: formData.featuredImage.filename
        } : null,
        factoidData: formData.factoidData
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
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
                  {isAIGenerated && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Generated
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  {isAIGenerated 
                    ? 'Review and edit the AI-generated content below, then add images and publish' 
                    : 'Add educational content for lentils and millets'
                  }
                </p>
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

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>Select a featured image for your article</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={formData.featuredImage.variants.urls.thumbnail || formData.featuredImage.public_url}
                      alt={formData.featuredImage.alt_text || formData.featuredImage.original_name}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formData.featuredImage.original_name}</p>
                    <p className="text-xs text-gray-500">
                      {formData.featuredImage.width}×{formData.featuredImage.height} • {Math.round(formData.featuredImage.file_size / 1024)}KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageManager(true)}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No featured image selected</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowImageManager(true)}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Select Featured Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Factoid Builder */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Factoid Card Display</CardTitle>
                  <CardDescription>Optional: Display article as a factoid card with stats and highlights</CardDescription>
                </div>
                {!showFactoidBuilder ? (
                  <Button
                    type="button"
                    onClick={initializeFactoidData}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Factoid Display
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={removeFactoidData}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Factoid
                  </Button>
                )}
              </div>
            </CardHeader>
            {showFactoidBuilder && formData.factoidData && (
              <CardContent className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Statistic *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        value={formData.factoidData.primary_stat.value}
                        onChange={(e) => handleFactoidChange('primary_stat', {
                          ...formData.factoidData.primary_stat,
                          value: e.target.value
                        })}
                        placeholder="25g"
                      />
                      <Input
                        value={formData.factoidData.primary_stat.label}
                        onChange={(e) => handleFactoidChange('primary_stat', {
                          ...formData.factoidData.primary_stat,
                          label: e.target.value
                        })}
                        placeholder="Protein per 100g"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Statistic *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Input
                        value={formData.factoidData.secondary_stat.value}
                        onChange={(e) => handleFactoidChange('secondary_stat', {
                          ...formData.factoidData.secondary_stat,
                          value: e.target.value
                        })}
                        placeholder="15min"
                      />
                      <Input
                        value={formData.factoidData.secondary_stat.label}
                        onChange={(e) => handleFactoidChange('secondary_stat', {
                          ...formData.factoidData.secondary_stat,
                          label: e.target.value
                        })}
                        placeholder="Cook Time"
                      />
                    </div>
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <Label>Display Icon</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[
                      { value: 'protein', icon: BarChart3, label: 'Protein' },
                      { value: 'health', icon: Heart, label: 'Health' },
                      { value: 'nutrition', icon: Leaf, label: 'Nutrition' },
                      { value: 'sustainability', icon: Globe, label: 'Sustainability' }
                    ].map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFactoidChange('icon', option.value)}
                          className={`p-3 border rounded-lg text-sm transition-colors ${
                            formData.factoidData.icon === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent size={20} className="mx-auto mb-1" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <Label>Highlights (bullet points)</Label>
                  <div className="space-y-2 mt-2">
                    {formData.factoidData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">•</span>
                        <Input
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          placeholder={`Highlight ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {formData.factoidData.highlights.length < 5 && (
                    <Button
                      type="button"
                      onClick={addHighlight}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Highlight
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
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

        {/* Image Manager Modal */}
        {showImageManager && (
          <ImageManager
            onSelectImage={handleImageSelect}
            onClose={() => setShowImageManager(false)}
            isModal={true}
            category={formData.productLine as 'lentils' | 'millets' | 'general'}
          />
        )}
      </main>
    </div>
  )
}