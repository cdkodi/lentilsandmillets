'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Leaf, Filter, Shield, TrendingUp, Thermometer, BookOpen } from 'lucide-react';
import SearchBar from './SearchBar';
import Footer from './Footer';

interface MilletsSectionProps {
  onNavigate?: (section: string, data?: any) => void;
  onSearch?: (query: string) => void;
}

interface CMSArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  hero_image_url: string;
  hero_image_id: number;
  category: string;
  card_position: string;
  author: string;
  published_at: string;
}

interface CMSRecipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  hero_image_url: string;
  hero_image_id: number;
  category: string;
  card_position: string;
  cook_time: number;
  prep_time: number;
  servings: number;
  difficulty: string;
  rating: number;
}

export default function MilletsSection({ onNavigate, onSearch }: MilletsSectionProps) {
  const [milletArticles, setMilletArticles] = useState<CMSArticle[]>([])
  const [milletTypeArticles, setMilletTypeArticles] = useState<CMSArticle[]>([])
  const [milletRecipes, setMilletRecipes] = useState<CMSRecipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMilletContent = async () => {
      try {
        setLoading(true);
        
        // Fetch research articles (without card_position assignment)
        const researchResponse = await fetch('/api/cms/articles?status=published&category=millets&limit=10')
        if (researchResponse.ok) {
          const data = await researchResponse.json()
          const unassignedArticles = (data.data?.articles || []).filter(article => !article.card_position)
          setMilletArticles(unassignedArticles.slice(0, 3))
        }
        
        // Fetch millet type articles for H15-H17 positions
        const typePositions = ['H15', 'H16', 'H17'];
        const typeArticles: CMSArticle[] = [];
        
        for (const position of typePositions) {
          const response = await fetch(`/api/cms/articles?status=published&card_position=${position}&limit=1`);
          if (response.ok) {
            const data = await response.json();
            if (data.data?.articles?.length > 0) {
              typeArticles.push(data.data.articles[0]);
            }
          }
        }
        
        setMilletTypeArticles(typeArticles);
        
        // Fetch millet recipes for H18-H19 positions
        const recipePositions = ['H18', 'H19'];
        const recipes: CMSRecipe[] = [];
        
        for (const position of recipePositions) {
          const response = await fetch(`/api/cms/recipes?status=published&card_position=${position}&limit=1`);
          if (response.ok) {
            const data = await response.json();
            if (data.data?.recipes?.length > 0) {
              recipes.push(data.data.recipes[0]);
            }
          }
        }
        
        setMilletRecipes(recipes);
        
      } catch (error) {
        console.error('Error fetching millet content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMilletContent()
  }, [])

  const milletTypes = [
    {
      name: 'Pearl Millet',
      image: 'https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'High protein, gluten-free ancient grain',
      benefits: 'Rich in iron & magnesium'
    },
    {
      name: 'Finger Millet',
      image: 'https://images.unsplash.com/photo-1570495675092-84bde2eceb43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Calcium powerhouse, perfect for health',
      benefits: 'Excellent for bone health'
    },
    {
      name: 'Foxtail Millet',
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Low glycemic index, diabetic-friendly',
      benefits: 'Controls blood sugar'
    }
  ];

  const featuredRecipes = [
    {
      id: 'golden-millet-pilaf',
      title: 'Golden Millet Pilaf',
      image: 'https://images.unsplash.com/photo-1631515242350-76d3a9c87013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      time: '25 min',
      serves: '4',
      rating: 4.7,
      type: 'millets'
    },
    {
      id: 'millet-breakfast-bowl',
      title: 'Millet Breakfast Bowl',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      time: '15 min',
      serves: '2',
      rating: 4.9,
      type: 'millets'
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Millets section search:', query);
    onSearch?.(query);
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Millets suggestion clicked:', suggestion);
    if (suggestion.type === 'recipe') {
      onNavigate?.('recipe', suggestion);
    } else if (suggestion.type === 'article') {
      onNavigate?.('article', suggestion);
    }
  };

  return (
    <div className="millets-theme min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Millet Nutritional Facts Section - Updated to match original design */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-block text-sm font-medium mb-4 px-3 py-1 rounded-full" 
                 style={{ 
                   backgroundColor: '#FFF4E6', 
                   color: '#f39c12' 
                 }}>
              NUTRITION SCIENCE
            </div>
            <h1 className="text-3xl md:text-5xl mb-6 font-bold" 
                style={{ 
                  color: '#f39c12',
                  fontFamily: 'Playfair Display, serif'
                }}>
              Millet Nutritional Facts
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the scientific evidence behind these nutritional powerhouses and their impact on modern health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Pearl Millet Card */}
            <div className="group cursor-pointer">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                       style={{ backgroundColor: '#f39c12' }}>
                    <Thermometer size={20} />
                  </div>
                  <div className="text-xs font-medium tracking-wide" 
                       style={{ color: '#B8860B' }}>
                    MILLETS
                  </div>
                </div>
                
                {/* Pearl Millet Image */}
                <div className="h-32 rounded-xl mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Pearl Millet"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Pearl Millet: Climate-Resilient Champion
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      200mm
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Min Rainfall
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      46°C
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Heat Tolerance
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Drought-resistant supercrop</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Grows in marginal lands</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Carbon-negative farming</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Finger Millet Card */}
            <div className="group cursor-pointer">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                       style={{ backgroundColor: '#f39c12' }}>
                    <Shield size={20} />
                  </div>
                  <div className="text-xs font-medium tracking-wide" 
                       style={{ color: '#B8860B' }}>
                    MILLETS
                  </div>
                </div>
                
                {/* Finger Millet Image */}
                <div className="h-32 rounded-xl mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1570495675092-84bde2eceb43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Finger Millet"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Finger Millet: Natural Calcium Source
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      344mg
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Calcium per 100g
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      3.9mg
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Iron per 100g
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Superior to dairy for calcium</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Supports bone health</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Rich in amino acids</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Foxtail Millet Card */}
            <div className="group cursor-pointer">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                       style={{ backgroundColor: '#f39c12' }}>
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-xs font-medium tracking-wide" 
                       style={{ color: '#B8860B' }}>
                    MILLETS
                  </div>
                </div>
                
                {/* Foxtail Millet Image */}
                <div className="h-32 rounded-xl mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Foxtail Millet"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Foxtail Millet: Diabetic-Friendly Grain
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      50
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Glycemic Index
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" style={{ color: '#f39c12' }}>
                      12.3g
                    </div>
                    <div className="text-xs" style={{ color: '#8B4513' }}>
                      Protein per 100g
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Low glycemic index</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Balances blood sugar</span>
                  </div>
                  <div className="flex items-center text-sm" style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>High in B-vitamins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Explore All Button - Updated to match original design */}
          <div className="text-center">
            <button
              onClick={() => onNavigate?.('varieties')}
              className="px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-block text-center border-2"
              style={{
                borderColor: '#f39c12',
                color: '#f39c12',
                backgroundColor: 'transparent'
              }}
            >
              Explore All Millet Varieties
            </button>
          </div>
        </div>

        {/* Ancient Millets Collection Section - Updated to match original design */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-6 font-bold" 
                style={{ 
                  color: '#f39c12',
                  fontFamily: 'Playfair Display, serif'
                }}>
              Ancient Millets Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Rediscover the golden grains of our ancestors. These nutrient-dense superfoods are perfect for modern healthy living and sustainable nutrition.
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8">
              <SearchBar
                variant="section"
                theme="millets"
                placeholder="Search millet recipes, varieties, benefits..."
                onSearch={handleSearch}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-sm transition-colors font-medium">
                <Filter size={14} />
                <span>All Types</span>
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-sm transition-colors font-medium">
                Gluten-Free
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-sm transition-colors font-medium">
                High Calcium
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-sm transition-colors font-medium">
                Diabetic-Friendly
              </button>
            </div>
          </div>

          {/* Why Choose Millets Section - Positioned correctly as in original design */}
          <div className="mb-16 p-8 rounded-2xl" style={{ backgroundColor: '#FEF7E6' }}>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: '#f39c12' }}>
                <Leaf size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl text-center mb-8 font-bold" 
                style={{ 
                  color: '#f39c12',
                  fontFamily: 'Playfair Display, serif'
                }}>
              Why Choose Millets?
            </h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" 
                       style={{ backgroundColor: '#fff' }}>
                    <Shield size={24} style={{ color: '#f39c12' }} />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#8B4513' }}>
                  Gluten-Free
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Perfect for celiac and gluten-sensitive individuals
                </p>
              </div>
              <div>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" 
                       style={{ backgroundColor: '#fff' }}>
                    <TrendingUp size={24} style={{ color: '#f39c12' }} />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#8B4513' }}>
                  Nutrient Dense
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Packed with protein, fiber, and essential minerals
                </p>
              </div>
              <div>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" 
                       style={{ backgroundColor: '#fff' }}>
                    <Leaf size={24} style={{ color: '#f39c12' }} />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-3" style={{ color: '#8B4513' }}>
                  Sustainable
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Climate-resilient crops with minimal water needs
                </p>
              </div>
            </div>
          </div>

          {/* Millet Variety Cards - Updated to use CMS data */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="bg-gray-200 rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-400 rounded mb-2"></div>
                    <div className="h-3 bg-gray-400 rounded mb-3 w-3/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-400 rounded w-20"></div>
                      <div className="h-3 bg-gray-400 rounded w-4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Render CMS articles first */}
                {milletTypeArticles.map((article) => (
                  <div 
                    key={`cms-millet-${article.id}`} 
                    className="group cursor-pointer"
                    onClick={() => window.location.href = `/articles/${article.slug}`}
                  >
                    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                      <div className="h-48 rounded-xl mb-4 overflow-hidden">
                        <ImageWithFallback
                          src={article.hero_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          By {article.author}
                        </span>
                        <ArrowRight size={16} style={{ color: '#f39c12' }} 
                                   className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Fill remaining slots with fallback data */}
                {milletTypes.slice(0, Math.max(0, 3 - milletTypeArticles.length)).map((millet, index) => (
                  <div key={`fallback-millet-${index}`} className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                      <div className="h-48 rounded-xl mb-4 overflow-hidden">
                        <ImageWithFallback
                          src={millet.image}
                          alt={millet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                        {millet.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {millet.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {millet.benefits}
                        </span>
                        <ArrowRight size={16} style={{ color: '#f39c12' }} 
                                   className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Featured Millet Recipes - Updated to match original design */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-6 font-bold" 
              style={{ 
                color: '#f39c12',
                fontFamily: 'Playfair Display, serif'
              }}>
            Featured Millet Recipes
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Wholesome and delicious ways to enjoy these golden grains
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {loading ? (
            // Loading skeleton for recipes
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-gray-200 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-400 rounded mb-3"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-400 rounded w-16"></div>
                      <div className="h-3 bg-gray-400 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Render CMS recipes first */}
              {milletRecipes.map((recipe) => (
                <div
                  key={`cms-millet-recipe-${recipe.id}`}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/recipes/${recipe.slug}`}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <div className="relative">
                      <ImageWithFallback
                        src={recipe.hero_image_url}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{recipe.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3" style={{ color: '#8B4513' }}>
                        {recipe.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{recipe.cook_time + recipe.prep_time}min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>Serves {recipe.servings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Fill remaining slots with fallback data */}
              {featuredRecipes.slice(0, Math.max(0, 2 - milletRecipes.length)).map((recipe, index) => (
                <div
                  key={`fallback-millet-recipe-${recipe.id}`}
                  className="group cursor-pointer"
                  onClick={() => onNavigate?.('recipe', recipe)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <div className="relative">
                      <ImageWithFallback
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{recipe.rating}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3" style={{ color: '#8B4513' }}>
                        {recipe.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>Serves {recipe.serves}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Latest Millet Research Articles Section */}
        {milletArticles.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl mb-6 font-bold" 
                  style={{ 
                    color: '#f39c12',
                    fontFamily: 'Playfair Display, serif'
                  }}>
                Latest Millet Research
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Stay updated with the latest scientific findings and insights about millets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {milletArticles.map((article, index) => {
                const factoidData = article.factoid_data || {}
                const highlights = factoidData.highlights || []
                
                return (
                  <div key={article.id} className="group cursor-pointer" 
                       onClick={() => window.open(`/articles/${article.slug}`, '_blank')}>
                    <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 overflow-hidden">
                      {/* Article Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                               style={{ backgroundColor: '#f39c12' }}>
                            <BookOpen size={20} className="text-white" />
                          </div>
                          <div className="text-xs font-medium tracking-wide" 
                               style={{ color: '#B8860B' }}>
                            RESEARCH
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-semibold mb-3 leading-tight" 
                            style={{ color: '#8B4513' }}>
                          {article.title}
                        </h4>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        {/* Research Metrics */}
                        {(factoidData.primary_stat || factoidData.secondary_stat) && (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {factoidData.primary_stat && (
                              <div className="text-center rounded-lg p-3" 
                                   style={{ backgroundColor: '#FEF7E6' }}>
                                <div className="text-lg font-bold mb-1" 
                                     style={{ color: '#f39c12' }}>
                                  {factoidData.primary_stat.value}
                                </div>
                                <div className="text-xs" 
                                     style={{ color: '#8B4513' }}>
                                  {factoidData.primary_stat.label}
                                </div>
                              </div>
                            )}
                            {factoidData.secondary_stat && (
                              <div className="text-center rounded-lg p-3" 
                                   style={{ backgroundColor: '#FEF7E6' }}>
                                <div className="text-lg font-bold mb-1" 
                                     style={{ color: '#f39c12' }}>
                                  {factoidData.secondary_stat.value}
                                </div>
                                <div className="text-xs" 
                                     style={{ color: '#8B4513' }}>
                                  {factoidData.secondary_stat.label}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Key Findings */}
                        {highlights.length > 0 && (
                          <div className="space-y-2">
                            {highlights.slice(0, 3).map((highlight: string, highlightIndex: number) => (
                              <div key={highlightIndex} className="flex items-center text-sm" 
                                   style={{ color: '#8B4513' }}>
                                <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                                     style={{ backgroundColor: '#f39c12' }}></div>
                                <span>{highlight}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Read More */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              By {article.author}
                            </span>
                            <div className="flex items-center" style={{ color: '#f39c12' }}>
                              <span className="mr-1">Read More</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* View All Articles Button */}
            <div className="text-center mb-12">
              <Link href="/articles">
                <button
                  className="px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-block text-center border-2"
                  style={{
                    borderColor: '#f39c12',
                    color: '#f39c12',
                    backgroundColor: 'transparent'
                  }}
                >
                  View All Millet Articles
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* View All Millet Recipes Button - Updated to match original design */}
        <div className="text-center">
          <button
            onClick={() => onNavigate?.('recipes')}
            className="px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 inline-block text-center text-white"
            style={{
              backgroundColor: '#f39c12',
              boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)'
            }}
          >
            View All Millet Recipes
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer theme="millets" />
    </div>
  );
}