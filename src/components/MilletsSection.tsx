'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Leaf, Filter, BookOpen } from 'lucide-react';
import SearchBar from './SearchBar';

interface MilletsSectionProps {
  onNavigate?: (section: string, data?: any) => void;
  onSearch?: (query: string) => void;
}

export default function MilletsSection({ onNavigate, onSearch }: MilletsSectionProps) {
  const [milletArticles, setMilletArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    fetchMilletArticles()
  }, [])

  const fetchMilletArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/articles')
      
      if (response.ok) {
        const data = await response.json()
        const articles = data.docs || data || []
        
        // Filter for millets articles that are published
        const milletArticles = articles.filter((article: any) => 
          article.productLine === 'millets' && article.status === 'published'
        )
        
        setMilletArticles(milletArticles)
      }
    } catch (error) {
      // Silently handle error - component will work without articles
      setMilletArticles([])
    } finally {
      setIsLoading(false)
    }
  }

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
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6" style={{ color: 'var(--color-millets-secondary)' }}>
            Ancient Millets Collection
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-8">
            Rediscover the golden grains of our ancestors. These nutrient-dense superfoods 
            are perfect for modern healthy living and sustainable nutrition.
          </p>

          {/* Section Search */}
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
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button className="flex items-center space-x-1 px-4 py-2 bg-white/80 hover:bg-white rounded-full text-sm transition-colors">
              <Filter size={14} />
              <span>All Types</span>
            </button>
            <button className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm transition-colors">
              Gluten-Free
            </button>
            <button className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm transition-colors">
              High Calcium
            </button>
            <button className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm transition-colors">
              Diabetic-Friendly
            </button>
          </div>
        </div>

        {/* Health Benefits Banner */}
        <div className="mb-16 p-8 rounded-2xl" style={{ backgroundColor: 'var(--color-millets-muted)' }}>
          <div className="flex items-center justify-center mb-4">
            <Leaf size={32} style={{ color: 'var(--color-millets-secondary)' }} />
          </div>
          <h3 className="text-2xl text-center mb-4" style={{ color: 'var(--color-millets-secondary)' }}>
            Why Choose Millets?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="mb-2">Gluten-Free</h4>
              <p className="text-sm opacity-80">Perfect for celiac and gluten-sensitive individuals</p>
            </div>
            <div>
              <h4 className="mb-2">Nutrient Dense</h4>
              <p className="text-sm opacity-80">Packed with protein, fiber, and essential minerals</p>
            </div>
            <div>
              <h4 className="mb-2">Sustainable</h4>
              <p className="text-sm opacity-80">Climate-resilient crops with minimal water needs</p>
            </div>
          </div>
        </div>

        {/* Millet Nutritional Facts Section - Force refresh 2025-07-26 */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="text-sm text-orange-500 font-medium mb-2">NUTRITION SCIENCE</div>
            <h3 className="text-2xl md:text-4xl mb-4" style={{ color: 'var(--color-millets-secondary)' }}>
              Millet Nutritional Facts
            </h3>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Discover the scientific evidence behind these nutritional powerhouses and their impact on modern health.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Loading skeletons for nutritional fact cards */}
            {isLoading && (
              Array.from({length: 3}).map((_, index) => (
                <div key={`skeleton-${index}`} className="rounded-2xl p-6 shadow-lg transition-all duration-300" style={{ backgroundColor: 'var(--color-millets-muted)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-millets-primary)' }}></div>
                    <div className="text-xs font-medium animate-pulse" style={{ color: 'var(--color-millets-secondary)' }}>MILLETS</div>
                  </div>
                  <div className="h-32 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="h-8 rounded mb-1 animate-pulse" style={{ backgroundColor: 'var(--color-millets-secondary)' }}></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-8 rounded mb-1 animate-pulse" style={{ backgroundColor: 'var(--color-millets-secondary)' }}></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3 animate-pulse" style={{ backgroundColor: 'var(--color-millets-secondary)' }}></div>
                        <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Nutritional fact cards */}
            {!isLoading && milletArticles.map((article, index) => {
              if (!article.nutritionalData) return null;
              
              return (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 premium-image" 
                         style={{ backgroundColor: 'var(--color-millets-muted)' }}>
                      {/* Header with icon and label */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                             style={{ backgroundColor: 'var(--color-millets-primary)' }}>
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                        <div className="text-xs font-medium subheading" 
                             style={{ color: 'var(--color-millets-secondary)' }}>
                          MILLETS
                        </div>
                      </div>

                      {/* Image placeholder with sophisticated styling */}
                      <div className="h-32 bg-gray-200 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
                        <div className="w-16 h-16 border-2 rounded flex items-center justify-center" 
                             style={{ borderColor: 'var(--color-millets-secondary)' }}>
                          <div className="w-8 h-8 border rounded" 
                               style={{ borderColor: 'var(--color-millets-primary)' }}></div>
                        </div>
                      </div>

                      {/* Title with proper typography */}
                      <h4 className="text-lg font-semibold mb-4 line-clamp-2" 
                          style={{ 
                            color: 'var(--color-millets-text)',
                            fontFamily: 'var(--font-primary)'
                          }}>
                        {article.title}
                      </h4>

                      {/* Metrics with enhanced styling */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1" 
                               style={{ 
                                 color: 'var(--color-millets-secondary)',
                                 fontFamily: 'var(--font-display)'
                               }}>
                            {article.nutritionalData.metric1?.value || 'N/A'}
                          </div>
                          <div className="text-xs" 
                               style={{ color: 'var(--color-millets-text)' }}>
                            {article.nutritionalData.metric1?.label || 'Metric 1'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1" 
                               style={{ 
                                 color: 'var(--color-millets-secondary)',
                                 fontFamily: 'var(--font-display)'
                               }}>
                            {article.nutritionalData.metric2?.value || 'N/A'}
                          </div>
                          <div className="text-xs" 
                               style={{ color: 'var(--color-millets-text)' }}>
                            {article.nutritionalData.metric2?.label || 'Metric 2'}
                          </div>
                        </div>
                      </div>

                      {/* Key Benefits with bullet styling */}
                      <div className="space-y-2">
                        {article.nutritionalData.keyBenefits?.slice(0, 3).map((benefit: any, benefitIndex: number) => (
                          <div key={benefitIndex} className="flex items-center text-sm" 
                               style={{ color: 'var(--color-millets-text)' }}>
                            <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                                 style={{ backgroundColor: 'var(--color-millets-secondary)' }}></div>
                            <span className="line-clamp-1">{benefit.benefit}</span>
                          </div>
                        )) || Array.from({length: 3}).map((_, i) => (
                          <div key={i} className="flex items-center text-sm" 
                               style={{ color: 'var(--color-muted-foreground)' }}>
                            <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                            <span>Benefit {i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Show placeholder cards with exact design from screenshots */}
            {!isLoading && milletArticles.length === 0 && (
              <>
                {/* Pearl Millet Card */}
                <div className="group cursor-pointer">
                  <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105" 
                       style={{ backgroundColor: 'var(--color-millets-muted)' }}>
                    {/* Header with icon and label */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                           style={{ backgroundColor: '#f39c12' }}>
                        <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="text-xs font-medium" 
                           style={{ color: 'var(--color-millets-secondary)' }}>
                        MILLETS
                      </div>
                    </div>

                    {/* Image placeholder */}
                    <div className="h-40 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      <div className="w-20 h-20 border-2 rounded flex items-center justify-center" 
                           style={{ borderColor: 'var(--color-millets-secondary)' }}>
                        <div className="w-12 h-12 border rounded" 
                             style={{ borderColor: 'var(--color-millets-primary)' }}></div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-medium mb-6 text-center" 
                        style={{ color: '#8B4513' }}>
                      Pearl Millet: Climate-Resilient Champion
                    </h4>

                    {/* Metrics with exact values from screenshot */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          200mm
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Min Rainfall
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          46°C
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Heat Tolerance
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits with bullet styling */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Drought-resistant supercrop</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Grows in marginal lands</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Carbon-negative farming</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finger Millet Card */}
                <div className="group cursor-pointer">
                  <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105" 
                       style={{ backgroundColor: 'var(--color-millets-muted)' }}>
                    {/* Header with icon and label */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                           style={{ backgroundColor: '#f39c12' }}>
                        <div className="w-4 h-4 bg-white rounded"></div>
                      </div>
                      <div className="text-xs font-medium" 
                           style={{ color: 'var(--color-millets-secondary)' }}>
                        MILLETS
                      </div>
                    </div>

                    {/* Image placeholder */}
                    <div className="h-40 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                      <div className="w-20 h-20 border-2 rounded flex items-center justify-center" 
                           style={{ borderColor: 'var(--color-millets-secondary)' }}>
                        <div className="w-12 h-12 border rounded" 
                             style={{ borderColor: 'var(--color-millets-primary)' }}></div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-medium mb-6 text-center" 
                        style={{ color: '#8B4513' }}>
                      Finger Millet: Natural Calcium Source
                    </h4>

                    {/* Metrics with exact values from screenshot */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          344mg
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Calcium per 100g
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          3.9mg
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Iron per 100g
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits with bullet styling */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Superior to dairy for calcium</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Supports bone health</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Rich in amino acids</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foxtail Millet Card */}
                <div className="group cursor-pointer">
                  <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105" 
                       style={{ backgroundColor: 'var(--color-millets-muted)' }}>
                    {/* Header with icon and label */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" 
                           style={{ backgroundColor: '#f39c12' }}>
                        <Star size={16} />
                      </div>
                      <div className="text-xs font-medium" 
                           style={{ color: 'var(--color-millets-secondary)' }}>
                        MILLETS
                      </div>
                    </div>

                    {/* Real image like in screenshot */}
                    <div className="h-40 rounded-xl mb-4 overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Foxtail Millet"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h4 className="text-lg font-medium mb-6 text-center" 
                        style={{ color: '#8B4513' }}>
                      Foxtail Millet: Diabetic-Friendly Grain
                    </h4>

                    {/* Metrics with exact values from screenshot */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          50
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Glycemic Index
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1" 
                             style={{ color: '#f39c12' }}>
                          12.3g
                        </div>
                        <div className="text-xs" 
                             style={{ color: '#8B4513' }}>
                          Protein per 100g
                        </div>
                      </div>
                    </div>

                    {/* Key Benefits with bullet styling */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Low glycemic index</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>Balances blood sugar</span>
                      </div>
                      <div className="flex items-center text-sm" 
                           style={{ color: '#8B4513' }}>
                        <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                             style={{ backgroundColor: '#DAA520' }}></div>
                        <span>High in B-vitamins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Explore All Button */}
          <div className="text-center">
            <button 
              className="px-8 py-3 border-2 rounded-full transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: 'var(--color-millets-secondary)',
                color: 'var(--color-millets-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-millets-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Explore All Millet Varieties
            </button>
          </div>
        </div>

        {/* Ancient Millets Collection Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl mb-4" style={{ color: 'var(--color-millets-secondary)' }}>
              Ancient Millets Collection
            </h3>
            <p className="text-lg opacity-80 max-w-3xl mx-auto">
              Rediscover the golden grains of our ancestors. These nutrient-dense superfoods are perfect for modern healthy living and sustainable nutrition.
            </p>
          </div>

          {/* Traditional Millet Types Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {milletTypes.map((millet, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                  <ImageWithFallback
                    src={millet.image}
                    alt={millet.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl mb-2">{millet.name}</h3>
                    <p className="text-sm opacity-90 mb-2">{millet.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs opacity-80">{millet.benefits}</div>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Recipes */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl mb-4" style={{ color: 'var(--color-millets-secondary)' }}>
            Featured Millet Recipes
          </h3>
          <p className="text-lg opacity-80">
            Wholesome and delicious ways to enjoy these golden grains
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {featuredRecipes.map((recipe) => (
            <div
              key={recipe.id}
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
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm">{recipe.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl mb-3">{recipe.title}</h4>
                  <div className="flex items-center justify-between text-sm opacity-70">
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
        </div>


        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate?.('recipes')}
            className="px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ 
              backgroundColor: 'var(--color-millets-secondary)', 
              color: 'white' 
            }}
          >
            View All Millet Recipes
          </button>
        </div>
      </div>
    </div>
  );
}