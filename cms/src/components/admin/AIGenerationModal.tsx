'use client'

import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AIGenerationRequest {
  topic: string;
  keywords: string;
  product_line: 'lentils' | 'millets';
  content_type: 'educational' | 'recipe' | 'guide';
  target_audience: string;
}

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (articleData: any) => void;
}

export default function AIGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate 
}: AIGenerationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AIGenerationRequest>({
    topic: '',
    keywords: '',
    product_line: 'lentils',
    content_type: 'educational',
    target_audience: 'health-conscious consumers'
  });

  const handleInputChange = (field: keyof AIGenerationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      // Convert keywords string to array
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const requestData = {
        ...formData,
        keywords: keywordsArray
      };

      console.log('Generating article with:', requestData);

      // Call CMS API proxy endpoint (we'll create this next)
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Handle specific error types
        if (response.status === 408) {
          alert('AI generation is taking longer than expected. The article may still be processing. Please check back in a few moments.');
        } else {
          const errorMsg = result.details || result.error || response.statusText;
          alert(`Generation failed: ${errorMsg}`);
        }
        return;
      }

      console.log('Generated article:', result);

      // Pass the generated data to parent component
      onGenerate(result);
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error generating article:', error);
      if (error instanceof Error && error.message.includes('fetch')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert('Failed to generate article. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Generate Article with AI</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Topic */}
          <div>
            <Label htmlFor="topic">Article Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="e.g., Benefits of Red Lentils for Heart Health"
              disabled={loading}
            />
          </div>

          {/* Keywords */}
          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              placeholder="e.g., red lentils, protein, heart health, nutrition"
              disabled={loading}
            />
          </div>

          {/* Product Line */}
          <div>
            <Label htmlFor="product_line">Product Line *</Label>
            <select
              id="product_line"
              value={formData.product_line}
              onChange={(e) => handleInputChange('product_line', e.target.value as 'lentils' | 'millets')}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lentils">Lentils</option>
              <option value="millets">Millets</option>
            </select>
          </div>

          {/* Content Type */}
          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <select
              id="content_type"
              value={formData.content_type}
              onChange={(e) => handleInputChange('content_type', e.target.value as any)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="educational">Educational Article</option>
              <option value="guide">How-to Guide</option>
              <option value="recipe">Recipe Article</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              value={formData.target_audience}
              onChange={(e) => handleInputChange('target_audience', e.target.value)}
              placeholder="e.g., health-conscious consumers, busy families"
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={loading || !formData.topic.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Article
              </>
            )}
          </Button>
        </div>

        {/* Progress indicator */}
        {loading && (
          <div className="px-6 pb-6">
            <div className="text-sm text-gray-600 text-center">
              🤖 AI is crafting your article... This may take 30-60 seconds.
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Using OpenAI GPT-4, Claude, and Gemini AI models
            </div>
          </div>
        )}

        {/* AI Service Notice */}
        {!loading && (
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Full AI Service Active
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Powered by OpenAI GPT-4, Anthropic Claude, and Google Gemini. 
                    Articles include fact-checking, SEO optimization, and quality assessment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}