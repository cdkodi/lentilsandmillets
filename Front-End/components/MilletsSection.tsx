import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Leaf, Filter } from 'lucide-react';
import SearchBar from './SearchBar';

interface MilletsSectionProps {
  onNavigate?: (section: string, data?: any) => void;
  onSearch?: (query: string) => void;
}

export default function MilletsSection({ onNavigate, onSearch }: MilletsSectionProps) {
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

        {/* Millet Types Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
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