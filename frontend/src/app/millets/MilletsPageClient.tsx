'use client'

import React from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Shield, Sparkles, Zap, BookOpen } from 'lucide-react';

interface CMSArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  hero_image_url: string;
  hero_image_id: number;
  category: string;
  card_position: string;
  author: string;
  published_at: string;
  factoid_data?: {
    icon: string;
    primary_stat: { value: string; label: string };
    secondary_stat: { value: string; label: string };
    highlights: string[];
  };
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
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
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  calories_per_serving: number;
  protein_grams: number;
  fiber_grams: number;
  nutritional_highlights: string[];
  health_benefits: string[];
  ingredients: any[];
  instructions: any[];
  meal_type: string;
  dietary_tags: string[];
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
}

interface MilletsPageClientProps {
  articles: CMSArticle[];
  recipes: CMSRecipe[];
}

export default function MilletsPageClient({ articles, recipes }: MilletsPageClientProps) {
  // Fallback data for positions without CMS content
  const fallbackVarieties = [
    {
      id: 'pearl-millet',
      title: 'Pearl Millet: The Climate-Resilient Superfood',
      image: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Drought-resistant ancient grain packed with protein and minerals',
      author: 'Sustainability Team',
      position: 'M1'
    },
    {
      id: 'finger-millet',
      title: 'Finger Millet: Calcium Powerhouse for Bone Health',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Natural source of calcium with exceptional amino acid profile',
      author: 'Nutrition Team',
      position: 'M2'
    },
    {
      id: 'foxtail-millet',
      title: 'Foxtail Millet: Diabetes-Friendly Ancient Grain',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Low glycemic index grain perfect for blood sugar management',
      author: 'Health Team',
      position: 'M3'
    },
    {
      id: 'little-millet',
      title: 'Little Millet: Big Nutrition in Small Grains',
      image: 'https://images.unsplash.com/photo-1595851468191-0f2bb04ced01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Compact nutrition with high fiber and antioxidant content',
      author: 'Research Team',
      position: 'M4'
    },
    {
      id: 'proso-millet',
      title: 'Proso Millet: The Complete Protein Grain',
      image: 'https://images.unsplash.com/photo-1580130544401-1ce527dc4d35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Complete amino acid profile with excellent digestibility',
      author: 'Culinary Team',
      position: 'M5'
    },
    {
      id: 'barnyard-millet',
      title: 'Barnyard Millet: Weight Management Wonder',
      image: 'https://images.unsplash.com/photo-1569887888203-c6f4ba5e0f8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'High fiber content supports healthy weight management',
      author: 'Wellness Team',
      position: 'M6'
    }
  ];

  const fallbackRecipes = [
    {
      id: 'pearl-millet-porridge',
      title: 'Creamy Pearl Millet Breakfast Porridge',
      image: 'https://images.unsplash.com/photo-1571167267100-7ce5de6c0c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Nourishing breakfast bowl with seasonal fruits and nuts',
      prep_time: 10,
      cook_time: 25,
      servings: 4,
      difficulty: 'Easy',
      position: 'M7'
    },
    {
      id: 'finger-millet-cookies',
      title: 'Gluten-Free Finger Millet Cookies',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Wholesome treats packed with calcium and natural sweetness',
      prep_time: 20,
      cook_time: 15,
      servings: 24,
      difficulty: 'Medium',
      position: 'M8'
    }
  ];

  // Create combined arrays with CMS content prioritized
  const displayVarieties = [...articles];
  const displayRecipes = [...recipes];

  // Fill remaining slots with fallback data
  const remainingVarietySlots = Math.max(0, 6 - articles.length);
  const remainingRecipeSlots = Math.max(0, 2 - recipes.length);

  if (remainingVarietySlots > 0) {
    displayVarieties.push(...fallbackVarieties.slice(0, remainingVarietySlots));
  }

  if (remainingRecipeSlots > 0) {
    displayRecipes.push(...fallbackRecipes.slice(0, remainingRecipeSlots));
  }

  return (
    <div className="millets-theme min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-yellow-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-amber-600 hover:text-amber-800 transition-colors">
              Home
            </Link>
            <ArrowRight size={14} className="text-amber-400" />
            <span className="text-amber-800 font-medium">Millets Collection</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 text-amber-900 leading-tight">
              Ancient Millets Collection
            </h1>
            <p className="text-xl md:text-2xl text-amber-700 mb-8 leading-relaxed">
              Rediscover the wisdom of ancient civilizations with our premium collection 
              of nutrient-dense millets. From pearl to finger millet, experience the 
              perfect blend of tradition and modern wellness.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-amber-600">
              <div className="flex items-center space-x-2">
                <Shield size={20} />
                <span>Gluten-Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles size={20} />
                <span>Ancient Superfood</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={20} />
                <span>Low Glycemic</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>Complete Guides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Millet Varieties Grid - M1-M6 Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-6 text-amber-900">
              Millet Varieties & Health Benefits
            </h2>
            <p className="text-lg md:text-xl text-amber-700 max-w-3xl mx-auto">
              Explore the diverse world of ancient millets and discover their 
              exceptional nutritional profiles and health-promoting properties.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {displayVarieties.map((variety, index) => (
              <article
                key={variety.id || `fallback-${index}`}
                className="group cursor-pointer"
              >
                <Link href={variety.slug ? `/articles/${variety.slug}` : '#'}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <div className="relative">
                      <ImageWithFallback
                        src={variety.hero_image_url || (variety as any).image}
                        alt={variety.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {variety.card_position || (variety as any).position}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 text-amber-900 group-hover:text-amber-700 transition-colors">
                        {variety.title}
                      </h3>
                      <p className="text-amber-600 mb-4 line-clamp-2">
                        {variety.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-amber-500">
                        <span>By {variety.author}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes - M7-M8 Positions */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-6 text-amber-900">
              Featured Millet Recipes
            </h2>
            <p className="text-lg md:text-xl text-amber-700 max-w-3xl mx-auto">
              Transform ancient grains into modern culinary masterpieces with our 
              chef-curated recipes and cooking techniques.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {displayRecipes.map((recipe, index) => (
              <article
                key={recipe.id || `fallback-recipe-${index}`}
                className="group cursor-pointer"
              >
                <Link href={recipe.slug ? `/recipes/${recipe.slug}` : '#'}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <div className="relative">
                      <ImageWithFallback
                        src={recipe.hero_image_url || (recipe as any).image}
                        alt={recipe.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {recipe.card_position || (recipe as any).position}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">4.9</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 text-amber-900 group-hover:text-amber-700 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-amber-600 mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-amber-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock size={16} />
                            <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)}min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users size={16} />
                            <span>Serves {recipe.servings}</span>
                          </div>
                        </div>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl mb-6">
              Unlock Ancient Wisdom for Modern Wellness
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our complete collection of millet recipes, nutritional guides, and wellness insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/recipes"
                className="px-8 py-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
              >
                View All Recipes
              </Link>
              <Link
                href="/lentils"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors"
              >
                Explore Lentils
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}