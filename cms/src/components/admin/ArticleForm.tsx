'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Plus, Trash2, Eye, BarChart3, Heart, Leaf, Globe, Image as ImageIcon } from 'lucide-react';
import ImageManager from './ImageManager';
import ImageInsertionModal from './ImageInsertionModal';

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

interface ArticleFormData {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  hero_image_url: string;
  hero_image_id?: number;
  hero_image_data?: ImageRecord | null;
  author: string;
  category: 'lentils' | 'millets';
  card_position: string;
  display_pages: string[];
  factoid_data: FactoidData | null;
  meta_title: string;
  meta_description: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

interface ArticleFormProps {
  articleId?: number;
  onSave: (article: ArticleFormData) => void;
  onCancel: () => void;
}

const iconOptions = [
  { value: 'protein', label: 'Protein (Chart)', icon: BarChart3 },
  { value: 'health', label: 'Health (Heart)', icon: Heart },
  { value: 'nutrition', label: 'Nutrition (Leaf)', icon: Leaf },
  { value: 'sustainability', label: 'Sustainability (Globe)', icon: Globe },
];

export default function ArticleForm({ articleId, onSave, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    hero_image_url: '',
    hero_image_id: undefined,
    hero_image_data: null,
    author: 'Dr. Sarah Johnson',
    category: 'lentils',
    card_position: '',
    display_pages: [],
    factoid_data: null,
    meta_title: '',
    meta_description: '',
    tags: [],
    status: 'draft'
  });

  const [showFactoidBuilder, setShowFactoidBuilder] = useState(false);
  const [availableCardPositions, setAvailableCardPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageManager, setShowImageManager] = useState(false);
  const [showImageInsertionModal, setShowImageInsertionModal] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId);
    }
    fetchAvailableCardPositions();
  }, [articleId]);

  const fetchArticle = async (id: number) => {
    try {
      const response = await fetch(`/api/cms/articles/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const articleData = data.data;
        setFormData(articleData);
        setShowFactoidBuilder(!!articleData.factoid_data);
        
        // Fetch image data if hero_image_id exists
        if (articleData.hero_image_id) {
          try {
            const imageResponse = await fetch(`/api/cms/images/${articleData.hero_image_id}`);
            const imageData = await imageResponse.json();
            
            if (imageData.success) {
              setFormData(prev => ({
                ...prev,
                hero_image_data: imageData.image
              }));
            }
          } catch (imageError) {
            console.warn('Failed to fetch image data:', imageError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
    }
  };

  const fetchAvailableCardPositions = async () => {
    // Get valid positions for articles based on category
    const positions = formData.category === 'lentils' 
      ? ['H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6']
      : ['H0', 'H1', 'H2', 'H3', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
    
    setAvailableCardPositions(positions);
  };

  useEffect(() => {
    fetchAvailableCardPositions();
  }, [formData.category]);

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate meta title if not manually set
    if (field === 'title' && !formData.meta_title) {
      setFormData(prev => ({
        ...prev,
        meta_title: `${value} | Lentils & Millets`
      }));
    }
    
    // Clear related errors
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFactoidChange = (field: keyof FactoidData, value: any) => {
    setFormData(prev => ({
      ...prev,
      factoid_data: {
        ...prev.factoid_data!,
        [field]: value
      }
    }));
  };

  const addHighlight = () => {
    if (!formData.factoid_data) return;
    
    setFormData(prev => ({
      ...prev,
      factoid_data: {
        ...prev.factoid_data!,
        highlights: [...prev.factoid_data!.highlights, '']
      }
    }));
  };

  const updateHighlight = (index: number, value: string) => {
    if (!formData.factoid_data) return;
    
    const newHighlights = [...formData.factoid_data.highlights];
    newHighlights[index] = value;
    
    setFormData(prev => ({
      ...prev,
      factoid_data: {
        ...prev.factoid_data!,
        highlights: newHighlights
      }
    }));
  };

  const removeHighlight = (index: number) => {
    if (!formData.factoid_data) return;
    
    const newHighlights = formData.factoid_data.highlights.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      factoid_data: {
        ...prev.factoid_data!,
        highlights: newHighlights
      }
    }));
  };

  const initializeFactoidData = () => {
    setFormData(prev => ({
      ...prev,
      factoid_data: {
        primary_stat: { value: '', label: '' },
        secondary_stat: { value: '', label: '' },
        icon: 'protein',
        highlights: ['', '', '']
      }
    }));
    setShowFactoidBuilder(true);
  };

  const removeFactoidData = () => {
    setFormData(prev => ({
      ...prev,
      factoid_data: null
    }));
    setShowFactoidBuilder(false);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle image selection from image manager
  const handleImageSelect = (image: ImageRecord) => {
    setFormData(prev => ({
      ...prev,
      hero_image_id: image.id,
      hero_image_url: image.public_url,
      hero_image_data: image
    }));
    setShowImageManager(false);
  };

  // Remove selected image
  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      hero_image_id: undefined,
      hero_image_url: '',
      hero_image_data: null
    }));
  };

  // Handle image insertion into content
  const handleImageInsertion = (imageTag: string) => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = formData.content;
      
      // Insert image tag at cursor position or replace selection
      const newContent = 
        currentContent.substring(0, start) + 
        '\n\n' + imageTag + '\n\n' + 
        currentContent.substring(end);
      
      setFormData(prev => ({
        ...prev,
        content: newContent
      }));
      
      // Focus textarea and position cursor after inserted tag
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          const newCursorPosition = start + imageTag.length + 4; // +4 for the newlines
          textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (showFactoidBuilder && formData.factoid_data) {
      if (!formData.factoid_data.primary_stat.value) {
        newErrors.primary_stat_value = 'Primary stat value is required';
      }
      if (!formData.factoid_data.primary_stat.label) {
        newErrors.primary_stat_label = 'Primary stat label is required';
      }
      if (!formData.factoid_data.secondary_stat.value) {
        newErrors.secondary_stat_value = 'Secondary stat value is required';
      }
      if (!formData.factoid_data.secondary_stat.label) {
        newErrors.secondary_stat_label = 'Secondary stat label is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      onSave(formData);
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCardPositionLabel = (position: string) => {
    const sectionMap: Record<string, string> = {
      'H0': 'Hero Section - Product 1',
      'H1': 'Hero Section - Product 2', 
      'H2': 'Hero Section - Product 3',
      'H3': 'Hero Section - Product 4',
      'H4': 'Lentils Facts - Card 1',
      'H5': 'Lentils Facts - Card 2',
      'H6': 'Lentils Facts - Card 3',
      'H7': 'Lentils Collection - Variety 1',
      'H8': 'Lentils Collection - Variety 2',
      'H9': 'Lentils Collection - Variety 3',
      'H12': 'Millets Facts - Card 1',
      'H13': 'Millets Facts - Card 2',
      'H14': 'Millets Facts - Card 3',
      'H15': 'Millets Collection - Variety 1',
      'H16': 'Millets Collection - Variety 2',
      'H17': 'Millets Collection - Variety 3',
      'L1': 'Lentils Facts - Card 1',
      'L2': 'Lentils Facts - Card 2',
      'L3': 'Lentils Facts - Card 3',
      'L4': 'Lentils Collection - Variety 1',
      'L5': 'Lentils Collection - Variety 2',
      'L6': 'Lentils Collection - Variety 3',
      'M1': 'Millets Facts - Card 1',
      'M2': 'Millets Facts - Card 2',
      'M3': 'Millets Facts - Card 3',
      'M4': 'Millets Collection - Variety 1',
      'M5': 'Millets Collection - Variety 2',
      'M6': 'Millets Collection - Variety 3',
    };
    
    return sectionMap[position] || position;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border shadow-sm">
      <div className="border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {articleId ? 'Edit Article' : 'Create New Article'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Educational content with optional factoid display
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              <X size={16} className="inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              form="article-form"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="inline mr-2" />
              {loading ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Article title..."
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value as 'lentils' | 'millets')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="lentils">Lentils</option>
              <option value="millets">Millets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brief description for previews and SEO..."
          />
          {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Content *
            </label>
            <button
              type="button"
              onClick={() => setShowImageInsertionModal(true)}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ImageIcon size={16} />
              <span>Insert Image</span>
            </button>
          </div>
          <textarea
            ref={contentTextareaRef}
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={12}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Article content in markdown or plain text..."
          />
          <div className="mt-2 text-xs text-gray-500">
            <p>Use markdown syntax for formatting. Insert images with the button above.</p>
            <p>Example: <code>{`{image:filename:card_medium:center|Optional caption}`}</code></p>
          </div>
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* Factoid Builder */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Factoid Card Display</h3>
              <p className="text-sm text-gray-600">
                Optional: Display article as a factoid card with stats and highlights
              </p>
            </div>
            
            {!showFactoidBuilder ? (
              <button
                type="button"
                onClick={initializeFactoidData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={16} className="inline mr-2" />
                Add Factoid Display
              </button>
            ) : (
              <button
                type="button"
                onClick={removeFactoidData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} className="inline mr-2" />
                Remove Factoid
              </button>
            )}
          </div>

          {showFactoidBuilder && formData.factoid_data && (
            <div className="space-y-4">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Statistic *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.factoid_data.primary_stat.value}
                      onChange={(e) => handleFactoidChange('primary_stat', {
                        ...formData.factoid_data.primary_stat,
                        value: e.target.value
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.primary_stat_value ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="25g"
                    />
                    <input
                      type="text"
                      value={formData.factoid_data.primary_stat.label}
                      onChange={(e) => handleFactoidChange('primary_stat', {
                        ...formData.factoid_data.primary_stat,
                        label: e.target.value
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.primary_stat_label ? 'border-red-500' : 'border-gray-300'  
                      }`}
                      placeholder="Protein per 100g"
                    />
                  </div>
                  {(errors.primary_stat_value || errors.primary_stat_label) && (
                    <p className="text-red-500 text-sm mt-1">Both value and label are required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Statistic *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.factoid_data.secondary_stat.value}
                      onChange={(e) => handleFactoidChange('secondary_stat', {
                        ...formData.factoid_data.secondary_stat,
                        value: e.target.value
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.secondary_stat_value ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="15min"
                    />
                    <input
                      type="text"
                      value={formData.factoid_data.secondary_stat.label}
                      onChange={(e) => handleFactoidChange('secondary_stat', {
                        ...formData.factoid_data.secondary_stat,
                        label: e.target.value
                      })}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.secondary_stat_label ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Cook Time"
                    />
                  </div>
                  {(errors.secondary_stat_value || errors.secondary_stat_label) && (
                    <p className="text-red-500 text-sm mt-1">Both value and label are required</p>
                  )}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleFactoidChange('icon', option.value)}
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          formData.factoid_data.icon === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent size={20} className="mx-auto mb-1" />
                        <div className="text-xs">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlights (3 bullet points)
                </label>
                <div className="space-y-2">
                  {formData.factoid_data.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">•</span>
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Highlight ${index + 1}...`}
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {formData.factoid_data.highlights.length < 5 && (
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="mt-2 px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                  >
                    <Plus size={12} className="inline mr-1" />
                    Add Highlight
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hero Image Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Image
          </label>
          
          {formData.hero_image_data ? (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={formData.hero_image_data.variants.urls.thumbnail || formData.hero_image_data.public_url}
                  alt={formData.hero_image_data.alt_text || formData.hero_image_data.original_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formData.hero_image_data.original_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.hero_image_data.width}×{formData.hero_image_data.height} • 
                    {Math.round(formData.hero_image_data.file_size / 1024)}KB
                  </p>
                  {formData.hero_image_data.alt_text && (
                    <p className="text-xs text-gray-600 mt-1">
                      Alt: {formData.hero_image_data.alt_text}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowImageManager(true)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400" />
              <p className="text-sm text-gray-600 mt-2">No hero image selected</p>
              <button
                type="button"
                onClick={() => setShowImageManager(true)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Select Image
              </button>
            </div>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Author name..."
          />
        </div>

        {/* Card Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Position
            </label>
            <select
              value={formData.card_position}
              onChange={(e) => handleInputChange('card_position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No card assignment</option>
              {availableCardPositions.map(position => (
                <option key={position} value={position}>
                  {position} - {getCardPositionLabel(position)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Pages
            </label>
            <div className="space-y-2">
              {['home', 'lentils', 'millets'].map(page => (
                <label key={page} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.display_pages.includes(page)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('display_pages', [...formData.display_pages, page]);
                      } else {
                        handleInputChange('display_pages', formData.display_pages.filter(p => p !== page));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="capitalize">{page} Page</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">SEO & Metadata</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => handleInputChange('meta_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SEO optimized title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description for search engines (160 characters)..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type tags and press Enter..."
            />
          </div>
        </div>

        {/* Publishing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </form>

      {/* Image Manager Modal */}
      {showImageManager && (
        <ImageManager
          onSelectImage={handleImageSelect}
          onClose={() => setShowImageManager(false)}
          isModal={true}
          category={formData.category}
        />
      )}

      {showImageInsertionModal && (
        <ImageInsertionModal
          isOpen={showImageInsertionModal}
          onClose={() => setShowImageInsertionModal(false)}
          onInsert={handleImageInsertion}
        />
      )}
    </div>
  );
}