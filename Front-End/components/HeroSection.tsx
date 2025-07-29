'use client'

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sparkles, ArrowDown, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onNavigate, onSearch }: HeroSectionProps) {
  const handleSearch = (query: string) => {
    console.log('Hero search:', query);
    onSearch?.(query);
    onNavigate?.('recipes'); // Navigate to search results
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Hero suggestion clicked:', suggestion);
    if (suggestion.type === 'recipe') {
      onNavigate?.('recipes');
    } else if (suggestion.type === 'article') {
      onNavigate?.(suggestion.category || 'home');
    } else {
      onNavigate?.(suggestion.category || 'home');
    }
  };

  const popularSearches = [
    'Red lentil curry',
    'Pearl millet nutrition',
    'High protein recipes',
    'Gluten-free options',
    'Quick cooking lentils'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #d2691e 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, #ffd700 0%, transparent 50%)`,
        }}></div>
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
        
        {/* Left Column - Text Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles size={16} className="text-amber-600" />
            <span className="text-sm text-gray-700">Premium • Organic • Sustainably Sourced</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight">
            <span className="block text-gray-900">The Science of</span>
            <span className="block bg-gradient-to-r from-orange-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
              Lentils & Millets
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-2xl lg:max-w-none leading-relaxed">
            Where ancient wisdom meets modern nutrition science. Discover meticulously curated 
            collections of premium lentils and heritage millets, each variety selected for its 
            unique flavor profile and exceptional nutritional density.
          </p>

          {/* Hero Search Bar */}
          <div className="space-y-4">
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-600 mb-3">Find recipes, nutrition facts, or varieties</p>
              <SearchBar
                variant="hero"
                theme="neutral"
                placeholder="Search for recipes, lentil types, nutrition info..."
                onSearch={handleSearch}
                onSuggestionClick={handleSuggestionClick}
                className="mx-auto lg:mx-0"
              />
            </div>

            {/* Popular Searches */}
            <div className="text-center lg:text-left">
              <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1 text-xs bg-white/60 hover:bg-white/80 rounded-full text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4 py-6">
            <div className="text-center lg:text-left">
              <div className="text-2xl text-orange-600 mb-1">25+</div>
              <div className="text-sm text-gray-600">Premium Varieties</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl text-amber-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Organic Certified</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => onNavigate?.('lentils')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Explore Lentils</span>
                <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform rotate-[-45deg]" />
              </span>
            </button>
            <button
              onClick={() => onNavigate?.('millets')}
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Discover Millets</span>
                <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform rotate-[-45deg]" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column - Visual Content */}
        <div className="relative">
          {/* Main Product Showcase */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Lentils Showcase */}
            <div className="space-y-4">
              <div className="group cursor-pointer" onClick={() => onNavigate?.('lentils')}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1610450949065-1f2841536c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium red lentils in wooden bowl"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="mb-1">Premium Lentils</h3>
                    <p className="text-xs opacity-90">Protein • Fiber • Iron</p>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="group cursor-pointer" onClick={() => onNavigate?.('lentils')}>
                <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-105">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Mixed lentil varieties"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Millets Showcase */}
            <div className="space-y-4 mt-8">
              <div className="group cursor-pointer" onClick={() => onNavigate?.('millets')}>
                <div className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:scale-105">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Golden millet grains"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
                </div>
              </div>

              <div className="group cursor-pointer" onClick={() => onNavigate?.('millets')}>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Pearl millet in rustic bowl"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="mb-1">Ancient Millets</h3>
                    <p className="text-xs opacity-90">Gluten-Free • Sustainable • Nutritious</p>
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-red-200 to-orange-200 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Trust Indicators - Fixed height containers for consistent alignment */}
      <div className="absolute bottom-28 left-4 right-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-2 py-3 border border-white/20 flex flex-col justify-center" style={{ minHeight: '3.5rem' }}>
              <div className="font-medium leading-tight">Farm-to-Table</div>
              <div className="opacity-80 leading-tight">Traceability</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-2 py-3 border border-white/20 flex flex-col justify-center" style={{ minHeight: '3.5rem' }}>
              <div className="font-medium leading-tight">Lab-Tested</div>
              <div className="opacity-80 leading-tight">Purity</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-2 py-3 border border-white/20 flex flex-col justify-center" style={{ minHeight: '3.5rem' }}>
              <div className="font-medium leading-tight">Sustainable</div>
              <div className="opacity-80 leading-tight">Sourcing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Positioned at bottom */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <button 
          onClick={() => {
            window.scrollTo({ 
              top: window.innerHeight, 
              behavior: 'smooth' 
            });
          }}
          className="flex flex-col items-center space-y-1 text-gray-500 hover:text-gray-700 transition-colors group cursor-pointer"
        >
          <span className="text-xs opacity-80 group-hover:opacity-100">Explore</span>
          <div className="p-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 group-hover:bg-white/80 transition-all duration-300">
            <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
}