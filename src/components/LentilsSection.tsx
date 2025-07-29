'use client'

import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Filter } from 'lucide-react';
import SearchBar from './SearchBar';

interface LentilsSectionProps {
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

export default function LentilsSection({ onNavigate, onSearch }: LentilsSectionProps) {
  const [lentilArticles, setLentilArticles] = useState<CMSArticle[]>([]);
  const [lentilRecipes, setLentilRecipes] = useState<CMSRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch CMS content for lentil positions
  useEffect(() => {
    const fetchLentilContent = async () => {
      try {
        setLoading(true);
        
        // Fetch lentil articles for H7-H9 positions (lentil types)
        const articlePositions = ['H7', 'H8', 'H9'];
        const articles: CMSArticle[] = [];
        
        for (const position of articlePositions) {
          const response = await fetch(`/api/cms/articles?status=published&card_position=${position}&limit=1`);
          if (response.ok) {
            const data = await response.json();
            if (data.data?.articles?.length > 0) {
              articles.push(data.data.articles[0]);
            }
          }
        }
        
        setLentilArticles(articles);
        
        // Fetch lentil recipes for H10-H11 positions (featured recipes)
        const recipePositions = ['H10', 'H11'];
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
        
        setLentilRecipes(recipes);
        
      } catch (error) {
        console.error('Error fetching lentil content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLentilContent();
  }, []);

  // Fallback hardcoded data for positions without CMS content
  const lentilTypes = [
    {
      name: 'Red Lentils',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Quick-cooking, perfect for soups and curries',
      cookTime: '15 min'
    },
    {
      name: 'Green Lentils',
      image: 'https://images.unsplash.com/photo-1567306301408-e6d4607c2b51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Hearty texture, ideal for salads and stews',
      cookTime: '25 min'
    },
    {
      name: 'Black Beluga',
      image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Caviar-like appearance, gourmet dishes',
      cookTime: '20 min'
    }
  ];

  const featuredRecipes = [
    {
      id: 'spiced-red-lentil-curry',
      title: 'Spiced Red Lentil Curry',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      time: '30 min',
      serves: '4',
      rating: 4.8,
      type: 'lentils'
    },
    {
      id: 'mediterranean-lentil-salad',
      title: 'Mediterranean Lentil Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      time: '20 min',
      serves: '6',
      rating: 4.9,
      type: 'lentils'
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Lentils section search:', query);
    onSearch?.(query);
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Lentils suggestion clicked:', suggestion);
    if (suggestion.type === 'recipe') {
      onNavigate?.('recipe', suggestion);
    } else if (suggestion.type === 'article') {
      onNavigate?.('article', suggestion);
    }
  };

  return (
    <div className="lentils-theme min-h-screen py-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl mb-6" style={{ color: 'var(--color-lentils-secondary)' }}>
            Premium Lentils Collection
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-80 mb-8">
            From vibrant red lentils to earthy black beluga varieties, our collection offers 
            exceptional quality and flavor for every culinary adventure.
          </p>

          {/* Section Search */}
          <div className="max-w-lg mx-auto mb-8">
            <SearchBar
              variant="section"
              theme="lentils"
              placeholder="Search lentil recipes, varieties, nutrition..."
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
              Quick Cooking
            </button>
            <button className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm transition-colors">
              High Protein
            </button>
            <button className="px-4 py-2 bg-white/60 hover:bg-white/80 rounded-full text-sm transition-colors">
              Salad-Friendly
            </button>
          </div>
        </div>

        {/* Lentil Types Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-200 animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-4 bg-gray-400 rounded mb-2"></div>
                    <div className="h-3 bg-gray-400 rounded mb-3 w-3/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-400 rounded w-16"></div>
                      <div className="h-3 bg-gray-400 rounded w-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Render CMS articles first */}
              {lentilArticles.map((article, index) => (
                <div 
                  key={`cms-${article.id}`} 
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/articles/${article.slug}`}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <ImageWithFallback
                      src={article.hero_image_url}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl mb-2">{article.title}</h3>
                      <p className="text-sm opacity-90 mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">By {article.author}</span>
                        </div>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Fill remaining slots with fallback data */}
              {lentilTypes.slice(0, Math.max(0, 3 - lentilArticles.length)).map((lentil, index) => (
                <div key={`fallback-${index}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <ImageWithFallback
                      src={lentil.image}
                      alt={lentil.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl mb-2">{lentil.name}</h3>
                      <p className="text-sm opacity-90 mb-3">{lentil.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span className="text-sm">{lentil.cookTime}</span>
                        </div>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Featured Recipes */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl mb-4" style={{ color: 'var(--color-lentils-secondary)' }}>
            Featured Lentil Recipes
          </h3>
          <p className="text-lg opacity-80">
            Discover delicious ways to incorporate lentils into your daily meals
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
              {lentilRecipes.map((recipe) => (
                <div
                  key={`cms-recipe-${recipe.id}`}
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
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">{recipe.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl mb-3">{recipe.title}</h4>
                      <div className="flex items-center justify-between text-sm opacity-70">
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
              {featuredRecipes.slice(0, Math.max(0, 2 - lentilRecipes.length)).map((recipe) => (
                <div
                  key={`fallback-recipe-${recipe.id}`}
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
            </>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => onNavigate?.('recipes')}
            className="px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            style={{ 
              backgroundColor: 'var(--color-lentils-secondary)', 
              color: 'white' 
            }}
          >
            View All Lentil Recipes
          </button>
        </div>
      </div>
    </div>
  );
}