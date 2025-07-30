'use client'

import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Clock, Users, Star, ChefHat, Image as ImageIcon } from 'lucide-react';
import ImageManager from './ImageManager';

interface Ingredient {
  item: string;
  amount: string;
  notes: string;
}

interface Instruction {
  step: number;
  instruction: string;
  time?: number;
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

interface RecipeFormData {
  id?: number;
  title: string;
  description: string;
  hero_image_url: string;
  hero_image_id?: number;
  hero_image_data?: ImageRecord | null;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  instructions: Instruction[];
  calories_per_serving: number;
  protein_grams: number;
  fiber_grams: number;
  nutritional_highlights: string[];
  health_benefits: string[];
  category: 'lentils' | 'millets';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dietary_tags: string[];
  card_position: string;
  display_pages: string[];
  is_featured: boolean;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
}

interface RecipeFormProps {
  recipeId?: number;
  onSave: (recipe: RecipeFormData) => void;
  onCancel: () => void;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'hard', label: 'Hard', color: 'red' },
];

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

const commonDietaryTags = [
  'vegan', 'gluten-free', 'high-protein', 'low-carb', 'keto-friendly',
  'dairy-free', 'nut-free', 'low-sodium', 'high-fiber', 'quick-cooking'
];

export default function RecipeForm({ recipeId, onSave, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    hero_image_url: '',
    hero_image_id: undefined,
    hero_image_data: null,
    prep_time: 0,
    cook_time: 0,
    servings: 4,
    difficulty: 'easy',
    ingredients: [{ item: '', amount: '', notes: '' }],
    instructions: [{ step: 1, instruction: '', time: 0 }],
    calories_per_serving: 0,
    protein_grams: 0,
    fiber_grams: 0,
    nutritional_highlights: [],
    health_benefits: [],
    category: 'lentils',
    meal_type: 'dinner',
    dietary_tags: [],
    card_position: '',
    display_pages: [],
    is_featured: false,
    meta_title: '',
    meta_description: '',
    status: 'draft'
  });

  const [availableCardPositions, setAvailableCardPositions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showImageManager, setShowImageManager] = useState(false);

  useEffect(() => {
    if (recipeId) {
      fetchRecipe(recipeId);
    }
    fetchAvailableCardPositions();
  }, [recipeId]);

  const fetchRecipe = async (id: number) => {
    try {
      const response = await fetch(`/api/cms/recipes/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const recipeData = data.data;
        setFormData(recipeData);
        
        // Fetch image data if hero_image_id exists
        if (recipeData.hero_image_id) {
          try {
            const imageResponse = await fetch(`/api/cms/images/${recipeData.hero_image_id}`);
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
      console.error('Failed to fetch recipe:', error);
    }
  };

  const fetchAvailableCardPositions = async () => {
    // Get valid positions for recipes based on category and featured status
    const baseLentilsPositions = ['H0', 'H1', 'H2', 'H3', 'H7', 'H8', 'H9', 'L4', 'L5', 'L6'];
    const featuredLentilsPositions = ['H10', 'H11', 'L7', 'L8'];
    const baseMilletsPositions = ['H0', 'H1', 'H2', 'H3', 'H15', 'H16', 'H17', 'M4', 'M5', 'M6'];
    const featuredMilletsPositions = ['H18', 'H19', 'M7', 'M8'];
    
    let positions: string[] = [];
    
    if (formData.category === 'lentils') {
      positions = [...baseLentilsPositions];
      if (formData.is_featured) {
        positions.push(...featuredLentilsPositions);
      }
    } else {
      positions = [...baseMilletsPositions];
      if (formData.is_featured) {
        positions.push(...featuredMilletsPositions);
      }
    }
    
    setAvailableCardPositions(positions);
  };

  useEffect(() => {
    fetchAvailableCardPositions();
  }, [formData.category, formData.is_featured]);

  const handleInputChange = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generate meta title if not manually set
    if (field === 'title' && !formData.meta_title) {
      setFormData(prev => ({
        ...prev,
        meta_title: `${value} Recipe | Lentils & Millets`
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

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', amount: '', notes: '' }]
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const addInstruction = () => {
    const nextStep = formData.instructions.length + 1;
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { step: nextStep, instruction: '', time: 0 }]
    }));
  };

  const updateInstruction = (index: number, field: keyof Instruction, value: string | number) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = { ...newInstructions[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));
      
      setFormData(prev => ({
        ...prev,
        instructions: newInstructions
      }));
    }
  };

  const addNutritionalHighlight = () => {
    setFormData(prev => ({
      ...prev,
      nutritional_highlights: [...prev.nutritional_highlights, '']
    }));
  };

  const updateNutritionalHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.nutritional_highlights];
    newHighlights[index] = value;
    
    setFormData(prev => ({
      ...prev,
      nutritional_highlights: newHighlights
    }));
  };

  const removeNutritionalHighlight = (index: number) => {
    const newHighlights = formData.nutritional_highlights.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      nutritional_highlights: newHighlights
    }));
  };

  const addHealthBenefit = () => {
    setFormData(prev => ({
      ...prev,
      health_benefits: [...prev.health_benefits, '']
    }));
  };

  const updateHealthBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.health_benefits];
    newBenefits[index] = value;
    
    setFormData(prev => ({
      ...prev,
      health_benefits: newBenefits
    }));
  };

  const removeHealthBenefit = (index: number) => {
    const newBenefits = formData.health_benefits.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      health_benefits: newBenefits
    }));
  };

  const toggleDietaryTag = (tag: string) => {
    if (formData.dietary_tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        dietary_tags: prev.dietary_tags.filter(t => t !== tag)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dietary_tags: [...prev.dietary_tags, tag]
      }));
    }
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.ingredients.some(ing => !ing.item.trim() || !ing.amount.trim())) {
      newErrors.ingredients = 'All ingredients must have item and amount';
    }

    if (formData.instructions.some(inst => !inst.instruction.trim())) {
      newErrors.instructions = 'All instruction steps must be filled';
    }

    if (formData.prep_time < 0) {
      newErrors.prep_time = 'Prep time must be positive';
    }

    if (formData.cook_time < 0) {
      newErrors.cook_time = 'Cook time must be positive';
    }

    if (formData.servings < 1) {
      newErrors.servings = 'Servings must be at least 1';
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
      console.error('Failed to save recipe:', error);
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
      'H7': 'Lentils Collection - Variety 1',
      'H8': 'Lentils Collection - Variety 2',
      'H9': 'Lentils Collection - Variety 3',
      'H10': 'Featured Lentil Recipe 1',
      'H11': 'Featured Lentil Recipe 2',
      'H15': 'Millets Collection - Variety 1',
      'H16': 'Millets Collection - Variety 2',
      'H17': 'Millets Collection - Variety 3',
      'H18': 'Featured Millet Recipe 1',
      'H19': 'Featured Millet Recipe 2',
      'L4': 'Lentils Collection - Variety 1',
      'L5': 'Lentils Collection - Variety 2',
      'L6': 'Lentils Collection - Variety 3',
      'L7': 'Featured Lentil Recipe 1',
      'L8': 'Featured Lentil Recipe 2',
      'M4': 'Millets Collection - Variety 1',
      'M5': 'Millets Collection - Variety 2',
      'M6': 'Millets Collection - Variety 3',
      'M7': 'Featured Millet Recipe 1',
      'M8': 'Featured Millet Recipe 2',
    };
    
    return sectionMap[position] || position;
  };

  const totalTime = formData.prep_time + formData.cook_time;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg border shadow-sm">
      <div className="border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {recipeId ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Cooking instructions with ingredients and nutrition data
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
              form="recipe-form"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="inline mr-2" />
              {loading ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </div>
      </div>

      <form id="recipe-form" onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Recipe title..."
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="lentils">Lentils</option>
              <option value="millets">Millets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brief description of the recipe..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Prep Time (min)
            </label>
            <input
              type="number"
              value={formData.prep_time}
              onChange={(e) => handleInputChange('prep_time', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.prep_time ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
            />
            {errors.prep_time && <p className="text-red-500 text-sm mt-1">{errors.prep_time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ChefHat size={16} className="inline mr-1" />
              Cook Time (min)
            </label>
            <input
              type="number"
              value={formData.cook_time}
              onChange={(e) => handleInputChange('cook_time', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.cook_time ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
            />
            {errors.cook_time && <p className="text-red-500 text-sm mt-1">{errors.cook_time}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users size={16} className="inline mr-1" />
              Servings
            </label>
            <input
              type="number"
              value={formData.servings}
              onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.servings ? 'border-red-500' : 'border-gray-300'
              }`}
              min="1"
            />
            {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {difficultyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalTime > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <strong>Total Time:</strong> {totalTime} minutes
          </div>
        )}

        {/* Ingredients */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Ingredients *</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Plus size={14} className="inline mr-1" />
              Add Ingredient
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ingredient name..."
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Amount..."
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ingredient.notes}
                    onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Notes (optional)..."
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={formData.ingredients.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
        </div>

        {/* Instructions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Instructions *</h3>
            <button
              type="button"
              onClick={addInstruction}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Plus size={14} className="inline mr-1" />
              Add Step
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-start">
                <div className="col-span-1">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {instruction.step}
                  </div>
                </div>
                <div className="col-span-8">
                  <textarea
                    value={instruction.instruction}
                    onChange={(e) => updateInstruction(index, 'instruction', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Instruction step..."
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={instruction.time || ''}
                    onChange={(e) => updateInstruction(index, 'time', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Time (min)"
                    min="0"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    disabled={formData.instructions.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.instructions && <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>}
        </div>

        {/* Nutrition Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Nutritional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories per Serving
              </label>
              <input
                type="number"
                value={formData.calories_per_serving}
                onChange={(e) => handleInputChange('calories_per_serving', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein (grams)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.protein_grams}
                onChange={(e) => handleInputChange('protein_grams', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiber (grams)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.fiber_grams}
                onChange={(e) => handleInputChange('fiber_grams', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
              />
            </div>
          </div>

          {/* Nutritional Highlights */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nutritional Highlights
              </label>
              <button
                type="button"
                onClick={addNutritionalHighlight}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Plus size={12} className="inline mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.nutritional_highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">•</span>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateNutritionalHighlight(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nutritional highlight..."
                  />
                  <button
                    type="button"
                    onClick={() => removeNutritionalHighlight(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Health Benefits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Health Benefits
              </label>
              <button
                type="button"
                onClick={addHealthBenefit}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                <Plus size={12} className="inline mr-1" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.health_benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">•</span>
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateHealthBenefit(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Health benefit..."
                  />
                  <button
                    type="button"
                    onClick={() => removeHealthBenefit(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={formData.meal_type}
              onChange={(e) => handleInputChange('meal_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {mealTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
                    className="px-3 py-1 text-sm text-green-600 border border-green-300 rounded hover:bg-green-50"
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
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Select Image
              </button>
            </div>
          )}
        </div>

        {/* Dietary Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {commonDietaryTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleDietaryTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.dietary_tags.includes(tag)
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Card Assignment & Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star size={16} className="inline mr-1" />
              Featured Recipe
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Mark as featured recipe</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Featured recipes can be assigned to special showcase positions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Position
            </label>
            <select
              value={formData.card_position}
              onChange={(e) => handleInputChange('card_position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">No card assignment</option>
              {availableCardPositions.map(position => (
                <option key={position} value={position}>
                  {position} - {getCardPositionLabel(position)}
                </option>
              ))}
            </select>
          </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief description for search engines (160 characters)..."
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
    </div>
  );
}