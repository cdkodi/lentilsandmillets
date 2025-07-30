'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Sparkles, FileText, CheckCircle, AlertCircle, Edit } from 'lucide-react'

interface GenerationOptions {
  target_length: number
  category: 'lentils' | 'millets' | 'general'
  include_factoids: boolean
}

interface GeneratedArticle {
  title: string
  slug: string
  content: string
  excerpt: string
  summary: string
  key_points: string[]
  meta_title: string
  meta_description: string
  fact_check_notes: Record<string, any>
  quality_metrics: Record<string, number>
}

interface GenerationResult {
  success: boolean
  session_id: number
  article: GeneratedArticle
  metadata: {
    model_used: string
    tokens_used: number
    processing_time_seconds: number
    cost_usd: number
    quality_score: number
    steps_completed: string[]
  }
}

const PROCESSING_STEPS = [
  'Content Generation',
  'Fact-Checking',
  'Summarization', 
  'CMS Formatting',
  'Quality Assessment'
]

export default function ContentGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [options, setOptions] = useState<GenerationOptions>({
    target_length: 1500,
    category: 'general',
    include_factoids: true
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep(0)
    setGenerationResult(null)

    try {
      // Simulate step progression
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < PROCESSING_STEPS.length - 1) {
            return prev + 1
          }
          clearInterval(stepInterval)
          return prev
        })
      }, 3000)

      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev-token' // In production, use actual JWT
        },
        body: JSON.stringify({
          topic,
          options
        })
      })

      clearInterval(stepInterval)

      if (!response.ok) {
        throw new Error('Failed to generate article')
      }

      const result: GenerationResult = await response.json()
      setGenerationResult(result)
      setCurrentStep(PROCESSING_STEPS.length)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAsDraft = async () => {
    if (!generationResult) return

    try {
      const response = await fetch(`/api/ai/save-draft?session_id=${generationResult.session_id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev-token'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to save as draft')
      }

      const result = await response.json()
      alert(`Article saved as draft! CMS Article ID: ${result.cms_article_id}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    }
  }

  const handleEditNow = () => {
    if (generationResult) {
      // In production, this would link to the actual CMS edit page
      alert('Opening CMS editor... (Integration pending)')
    }
  }

  const resetForm = () => {
    setTopic('')
    setGenerationResult(null)
    setError(null)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            AI Article Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Generate comprehensive, fact-checked articles from simple topic inputs
          </p>
        </div>

        {!generationResult ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
              <CardDescription>
                Enter a topic and configure generation options to create a comprehensive article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Article Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Health benefits of red lentils"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={options.category} onValueChange={(value: any) => setOptions({...options, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lentils">Lentils</SelectItem>
                      <SelectItem value="millets">Millets</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Target Length</Label>
                  <Select value={options.target_length.toString()} onValueChange={(value) => setOptions({...options, target_length: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1200">Short (1200 words)</SelectItem>
                      <SelectItem value="1500">Medium (1500 words)</SelectItem>
                      <SelectItem value="2000">Long (2000 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="factoids"
                      checked={options.include_factoids}
                      onChange={(e) => setOptions({...options, include_factoids: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="factoids" className="text-sm">Include factoids</Label>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !topic.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Article...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Article
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Generation Complete */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  Article Generated Successfully
                </CardTitle>
                <CardDescription>
                  Your article has been generated and is ready for review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">
                    Model: {generationResult.metadata.model_used}
                  </Badge>
                  <Badge variant="secondary">
                    Quality Score: {generationResult.metadata.quality_score}/100
                  </Badge>
                  <Badge variant="secondary">
                    Processing Time: {generationResult.metadata.processing_time_seconds.toFixed(1)}s
                  </Badge>
                  <Badge variant="secondary">
                    Cost: ${generationResult.metadata.cost_usd.toFixed(4)}
                  </Badge>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveAsDraft} className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={handleEditNow} variant="outline" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Now
                  </Button>
                  <Button onClick={resetForm} variant="outline">
                    Generate Another
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Article Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Article Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{generationResult.article.title}</h2>
                  <p className="text-gray-600 italic">{generationResult.article.excerpt}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Executive Summary</h3>
                  <p className="text-gray-700">{generationResult.article.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {generationResult.article.key_points.map((point, index) => (
                      <li key={index} className="text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Article Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {generationResult.article.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">SEO Meta Data</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {generationResult.article.meta_title}</div>
                      <div><strong>Description:</strong> {generationResult.article.meta_description}</div>
                      <div><strong>Slug:</strong> {generationResult.article.slug}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Quality Metrics</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(generationResult.article.quality_metrics).map(([metric, score]) => (
                        <div key={metric} className="flex justify-between">
                          <span className="capitalize">{metric.replace('_', ' ')}:</span>
                          <span>{typeof score === 'number' ? score.toFixed(1) : score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Processing Steps */}
        {isGenerating && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Article</CardTitle>
              <CardDescription>
                Please wait while we generate your article...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PROCESSING_STEPS.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-green-500 text-white' :
                      index === currentStep ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle size={14} />
                      ) : index === currentStep ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}