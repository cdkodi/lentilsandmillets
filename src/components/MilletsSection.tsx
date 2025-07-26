'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Leaf, Filter, BookOpen, Shield, TrendingUp, Droplets, Thermometer } from 'lucide-react';
import SearchBar from './SearchBar';
// Remove these imports - they don't exist yet, causing build failures

interface MilletsSectionProps {
  onNavigate?: (section: string, data?: any) => void;
  onSearch?: (query: string) => void;
}

export default function MilletsSection({ onNavigate, onSearch }: MilletsSectionProps) {
  // Simplified component without dynamic content for now

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

          <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
            {/* Always show three cards matching the reference design */}
            
            {/* Pearl Millet Card - Climate Resilient */}
            <div className="group cursor-pointer h-full">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                {/* Header with icon and label */}
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

                {/* Image placeholder */}
                <div className="h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 border-2 rounded flex items-center justify-center" 
                       style={{ borderColor: '#ccc' }}>
                    <div className="w-8 h-8 border rounded" 
                         style={{ borderColor: '#999' }}></div>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Pearl Millet: Climate-Resilient Champion
                </h4>

                {/* Metrics with white background boxes */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      200mm
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Min Rainfall
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      46°C
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Heat Tolerance
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Drought-resistant supercrop</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Grows in marginal lands</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Carbon-negative farming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Finger Millet Card - Natural Calcium Source */}
            <div className="group cursor-pointer h-full">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                {/* Header with icon and label */}
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

                {/* Image placeholder */}
                <div className="h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 border-2 rounded flex items-center justify-center" 
                       style={{ borderColor: '#ccc' }}>
                    <div className="w-8 h-8 border rounded" 
                         style={{ borderColor: '#999' }}></div>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Finger Millet: Natural Calcium Source
                </h4>

                {/* Metrics with white background boxes */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      344mg
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Calcium per 100g
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      3.9mg
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Iron per 100g
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Superior to dairy for calcium</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Supports bone health</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Rich in amino acids</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Foxtail Millet Card - Diabetic Friendly with real image */}
            <div className="group cursor-pointer h-full">
              <div className="rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 h-full flex flex-col" 
                   style={{ backgroundColor: '#FEF7E6' }}>
                {/* Header with icon and label */}
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

                {/* Real image like in original reference */}
                <div className="h-32 rounded-xl mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Foxtail Millet"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title */}
                <h4 className="text-lg font-medium mb-4 text-center leading-tight" 
                    style={{ color: '#8B4513' }}>
                  Foxtail Millet: Diabetic-Friendly Grain
                </h4>

                {/* Metrics with white background boxes */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      50
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Glycemic Index
                    </div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-3">
                    <div className="text-xl font-bold mb-1" 
                         style={{ color: '#f39c12' }}>
                      12.3g
                    </div>
                    <div className="text-xs" 
                         style={{ color: '#8B4513' }}>
                      Protein per 100g
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Low glycemic index</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
                    <div className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                         style={{ backgroundColor: '#f39c12' }}></div>
                    <span>Balances blood sugar</span>
                  </div>
                  <div className="flex items-center text-sm" 
                       style={{ color: '#8B4513' }}>
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

          {/* Millet Variety Cards - Updated to match original design */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Pearl Millet */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                <div className="h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-20 h-20 border-2 rounded flex items-center justify-center" 
                       style={{ borderColor: '#e67e22' }}>
                    <div className="w-12 h-12 border rounded" 
                         style={{ borderColor: '#f39c12' }}></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                  Pearl Millet
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  High protein, gluten-free ancient grain that is rich in magnesium
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Excellent for nutrition
                  </span>
                  <ArrowRight size={16} style={{ color: '#f39c12' }} 
                             className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Finger Millet */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                <div className="h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-20 h-20 border-2 rounded flex items-center justify-center" 
                       style={{ borderColor: '#e67e22' }}>
                    <div className="w-12 h-12 border rounded" 
                         style={{ borderColor: '#f39c12' }}></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                  Finger Millet
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Calcium powerhouse, perfect for health because of its high mineral
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Perfect for nutrition
                  </span>
                  <ArrowRight size={16} style={{ color: '#f39c12' }} 
                             className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Foxtail Millet */}
            <div className="group cursor-pointer">
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                <div className="h-48 rounded-xl mb-4 overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Foxtail Millet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                  Foxtail Millet
                </h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  Low glycemic index, diabetic-friendly. Contains protein and fiber
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Controls for nutrition
                  </span>
                  <ArrowRight size={16} style={{ color: '#f39c12' }} 
                             className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
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
          {/* Fallback: Golden Millet Pilaf */}
          <div className="group cursor-pointer" onClick={() => onNavigate?.('recipe', featuredRecipes[0])}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <div className="relative">
                <div className="h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center">
                  <div className="w-20 h-20 border-2 rounded flex items-center justify-center" 
                       style={{ borderColor: '#e67e22' }}>
                    <div className="w-12 h-12 border rounded" 
                         style={{ borderColor: '#f39c12' }}></div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.7</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3" style={{ color: '#8B4513' }}>
                  Golden Millet Pilaf
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>25 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>Serves 4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fallback: Millet Breakfast Bowl */}
          <div className="group cursor-pointer" onClick={() => onNavigate?.('recipe', featuredRecipes[1])}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Millet Breakfast Bowl"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.0</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-3" style={{ color: '#8B4513' }}>
                  Millet Breakfast Bowl
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>15 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>Serves 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


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
    </div>
  );
}