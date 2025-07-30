'use client'

import React from 'react';
import Link from 'next/link';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { ArrowRight, Clock, Users, Star, Leaf, Zap, Heart, BookOpen } from 'lucide-react';

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

interface LentilsPageClientProps {
  articles: CMSArticle[];
  recipes: CMSRecipe[];
}

export default function LentilsPageClient({ articles, recipes }: LentilsPageClientProps) {
  // Fallback data for positions without CMS content
  const fallbackVarieties = [
    {
      id: 'red-lentils',
      title: 'Red Lentils: Complete Nutritional Guide',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Quick-cooking protein powerhouse with 25g protein per 100g',
      author: 'Nutrition Team',
      position: 'L1'
    },
    {
      id: 'green-lentils',
      title: 'Green Lentils: The Fiber Champion',
      image: 'https://images.unsplash.com/photo-1567306301408-e6d4607c2b51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Hearty texture with exceptional fiber content for digestive health',
      author: 'Culinary Team',
      position: 'L2'
    },
    {
      id: 'black-beluga',
      title: 'Black Beluga: Gourmet Protein Source',
      image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Premium caviar-like lentils with rich mineral content',
      author: 'Health Team',
      position: 'L3'
    },
    {
      id: 'french-green',
      title: 'French Green Lentils: Le Puy Excellence',
      image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Peppery flavor with firm texture, perfect for salads',
      author: 'Culinary Team',
      position: 'L4'
    },
    {
      id: 'yellow-lentils',
      title: 'Yellow Lentils: Traditional Dal Excellence',
      image: 'https://images.unsplash.com/photo-1599020792689-9cb4ac04e6c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Traditional split lentils perfect for authentic Indian cuisine',
      author: 'Traditional Cooking',
      position: 'L5'
    },
    {
      id: 'brown-lentils',
      title: 'Brown Lentils: Versatile Kitchen Staple',
      image: 'https://images.unsplash.com/photo-1585336719132-2e3d39b7b4c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      excerpt: 'Mild flavor, holds shape well, perfect for beginners',
      author: 'Cooking Team',
      position: 'L6'
    }
  ];

  const fallbackRecipes = [
    {
      id: 'mediterranean-lentil-salad',
      title: 'Mediterranean Lentil Power Salad',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Fresh herbs, feta cheese, and protein-packed lentils in perfect harmony',
      prep_time: 15,
      cook_time: 25,
      servings: 6,
      difficulty: 'Easy',
      position: 'L7'
    },
    {
      id: 'spiced-red-lentil-curry',
      title: 'Spiced Red Lentil Curry',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Aromatic spices with creamy coconut milk create comfort food perfection',
      prep_time: 10,
      cook_time: 30,
      servings: 4,
      difficulty: 'Medium',
      position: 'L8'
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
    <div className="lentils-theme min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-orange-600 hover:text-orange-800 transition-colors">
              Home
            </Link>
            <ArrowRight size={14} className="text-orange-400" />
            <span className="text-orange-800 font-medium">Lentils Collection</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl mb-6 text-orange-900 leading-tight">
              Premium Lentils Collection
            </h1>
            <p className="text-xl md:text-2xl text-orange-700 mb-8 leading-relaxed">
              From vibrant red lentils to earthy black beluga varieties, discover exceptional 
              quality and flavor for every culinary adventure. Complete with nutritional guides, 
              cooking tips, and healthy recipes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-orange-600">
              <div className="flex items-center space-x-2">
                <Zap size={20} />
                <span>High Protein</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart size={20} />
                <span>Heart Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf size={20} />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={20} />
                <span>Complete Guides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lentil Varieties Grid - L1-L6 Positions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-6 text-orange-900">
              Lentil Varieties & Nutrition Guides
            </h2>
            <p className="text-lg md:text-xl text-orange-700 max-w-3xl mx-auto">
              Discover the nutritional powerhouses behind these protein-packed legumes 
              and their impact on modern health.
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
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {variety.card_position || (variety as any).position}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 text-orange-900 group-hover:text-orange-700 transition-colors">
                        {variety.title}
                      </h3>
                      <p className="text-orange-600 mb-4 line-clamp-2">
                        {variety.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-orange-500">
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

      {/* Featured Recipes - L7-L8 Positions */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl mb-6 text-orange-900">
              Featured Lentil Recipes
            </h2>
            <p className="text-lg md:text-xl text-orange-700 max-w-3xl mx-auto">
              Discover delicious ways to incorporate lentils into your daily meals 
              with our chef-tested recipes.
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
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {recipe.card_position || (recipe as any).position}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl mb-3 text-orange-900 group-hover:text-orange-700 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-orange-600 mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-orange-500">
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
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl mb-6">
              Ready to Transform Your Kitchen?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore our complete collection of recipes, cooking guides, and nutritional insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/recipes"
                className="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                View All Recipes
              </Link>
              <Link
                href="/millets"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Explore Millets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}