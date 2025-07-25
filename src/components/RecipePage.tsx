'use client'

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, Users, Star, ChefHat, ArrowLeft, Heart, Share } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  serves: string;
  rating: number;
  type: 'lentils' | 'millets';
  difficulty?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  nutrition?: { [key: string]: string };
}

interface RecipePageProps {
  recipe?: Recipe;
  onNavigate?: (section: string) => void;
}

export default function RecipePage({ recipe, onNavigate }: RecipePageProps) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isFavorited, setIsFavorited] = useState(false);

  // Default recipe data for demo
  const defaultRecipe: Recipe = {
    id: 'spiced-red-lentil-curry',
    title: 'Spiced Red Lentil Curry',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    time: '30 min',
    serves: '4',
    rating: 4.8,
    type: 'lentils',
    difficulty: 'Easy',
    description: 'A rich, aromatic curry featuring premium red lentils simmered in coconut milk with warming spices. This protein-packed dish is both comforting and nutritious.',
    ingredients: [
      '1 cup red lentils, rinsed',
      '1 can (400ml) coconut milk',
      '2 tbsp coconut oil',
      '1 large onion, diced',
      '3 cloves garlic, minced',
      '1 inch ginger, grated',
      '2 tsp curry powder',
      '1 tsp turmeric',
      '1 tsp cumin',
      '1 can (400g) diced tomatoes',
      '2 cups vegetable broth',
      'Salt and pepper to taste',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Heat coconut oil in a large pot over medium heat.',
      'Add onion and cook until softened, about 5 minutes.',
      'Add garlic, ginger, curry powder, turmeric, and cumin. Cook for 1 minute until fragrant.',
      'Add diced tomatoes and cook for 3-4 minutes.',
      'Add red lentils, coconut milk, and vegetable broth. Bring to a boil.',
      'Reduce heat and simmer for 15-20 minutes until lentils are tender.',
      'Season with salt and pepper to taste.',
      'Serve hot, garnished with fresh cilantro.'
    ],
    nutrition: {
      'Calories': '285',
      'Protein': '14g',
      'Carbs': '35g',
      'Fat': '12g',
      'Fiber': '8g'
    }
  };

  const currentRecipe = recipe || defaultRecipe;
  const isLentils = currentRecipe.type === 'lentils';
  
  const themeColors = isLentils ? {
    primary: 'var(--color-lentils-secondary)',
    background: 'var(--color-lentils-background)',
    text: 'var(--color-lentils-text)',
    muted: 'var(--color-lentils-muted)',
    accent: 'var(--color-lentils-accent)'
  } : {
    primary: 'var(--color-millets-secondary)',
    background: 'var(--color-millets-background)',
    text: 'var(--color-millets-text)',
    muted: 'var(--color-millets-muted)',
    accent: 'var(--color-millets-accent)'
  };

  const tabs = ['ingredients', 'instructions', 'nutrition'];

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      {/* Hero Section */}
      <div className="relative h-64 md:h-96">
        <ImageWithFallback
          src={currentRecipe.image}
          alt={currentRecipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Back Button */}
        <button
          onClick={() => onNavigate?.(isLentils ? 'lentils' : 'millets')}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} style={{ color: themeColors.text }} />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
          >
            <Heart 
              size={20} 
              style={{ color: isFavorited ? '#ef4444' : themeColors.text }}
              fill={isFavorited ? '#ef4444' : 'none'}
            />
          </button>
          <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors">
            <Share size={20} style={{ color: themeColors.text }} />
          </button>
        </div>

        {/* Recipe Title */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-2xl md:text-4xl mb-2">{currentRecipe.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{currentRecipe.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>Serves {currentRecipe.serves}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChefHat size={16} />
              <span>{currentRecipe.difficulty || 'Medium'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span>{currentRecipe.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        {currentRecipe.description && (
          <div className="mb-8">
            <p className="text-lg leading-relaxed opacity-80">{currentRecipe.description}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 text-current'
                    : 'text-gray-500 hover:text-current'
                }`}
                style={{
                  borderBottomColor: activeTab === tab ? themeColors.primary : 'transparent'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-xl mb-6" style={{ color: themeColors.primary }}>Ingredients</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentRecipe.ingredients?.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg"
                    style={{ backgroundColor: themeColors.muted }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: themeColors.primary }}
                    ></div>
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 className="text-xl mb-6" style={{ color: themeColors.primary }}>Instructions</h3>
              <div className="space-y-6">
                {currentRecipe.instructions?.map((instruction, index) => (
                  <div key={index} className="flex space-x-4">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {index + 1}
                    </div>
                    <p className="pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-xl mb-6" style={{ color: themeColors.primary }}>Nutrition Per Serving</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {currentRecipe.nutrition && Object.entries(currentRecipe.nutrition).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="text-center p-4 rounded-lg"
                    style={{ backgroundColor: themeColors.muted }}
                  >
                    <div className="text-2xl mb-1" style={{ color: themeColors.primary }}>{value}</div>
                    <div className="text-sm opacity-70">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Recipes CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate?.(isLentils ? 'lentils' : 'millets')}
            className="px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ 
              backgroundColor: themeColors.primary, 
              color: 'white' 
            }}
          >
            Explore More {isLentils ? 'Lentil' : 'Millet'} Recipes
          </button>
        </div>
      </div>
    </div>
  );
}