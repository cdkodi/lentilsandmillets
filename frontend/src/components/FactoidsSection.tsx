'use client'

import React, { useState, useEffect } from 'react';
import FactoidCard from './FactoidCard';

interface FactoidsSection {
  category: 'lentils' | 'millets';
  onNavigate?: (section: string, data?: any) => void;
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
  factoid_data: {
    icon: string;
    primary_stat: { value: string; label: string };
    secondary_stat: { value: string; label: string };
    highlights: string[];
  };
  author: string;
}

export default function FactoidsSection({ category, onNavigate }: FactoidsSection) {
  const isLentils = category === 'lentils';
  const [factoidArticles, setFactoidArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine card positions based on category
  const cardPositions = isLentils ? ['H4', 'H5', 'H6'] : ['H12', 'H13', 'H14'];

  useEffect(() => {
    const fetchFactoidArticles = async () => {
      try {
        const articles: CMSArticle[] = [];
        
        // Fetch articles for each card position
        for (const position of cardPositions) {
          const response = await fetch(`/api/cms/articles?status=published&card_position=${position}&limit=1`);
          if (response.ok) {
            const data = await response.json();
            if (data.data?.articles?.length > 0) {
              articles.push(data.data.articles[0]);
            }
          }
        }
        
        setFactoidArticles(articles);
      } catch (error) {
        console.error('Error fetching factoid articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactoidArticles();
  }, [category, cardPositions]);

  // Fallback hardcoded data for positions without CMS content
  const lentilsFactoids = [
    {
      id: 'red-lentils-protein',
      title: 'Red Lentils: Quick-Cooking Protein Powerhouse',
      category: 'lentils' as const,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'protein' as const,
      stats: {
        primary: { value: '25g', label: 'Protein per 100g' },
        secondary: { value: '15min', label: 'Cook Time' }
      },
      highlights: [
        'Complete amino acid profile',
        'High in folate & iron',
        'Naturally gluten-free'
      ]
    },
    {
      id: 'green-lentils-fiber',
      title: 'Green Lentils: The Fiber Champion',
      category: 'lentils' as const,
      image: 'https://images.unsplash.com/photo-1567306301408-e6d4607c2b51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'health' as const,
      stats: {
        primary: { value: '8g', label: 'Fiber per serving' },
        secondary: { value: '230', label: 'Calories per cup' }
      },
      highlights: [
        'Supports digestive health',
        'Helps manage cholesterol',
        'Promotes satiety'
      ]
    },
    {
      id: 'black-beluga-antioxidants',
      title: 'Black Beluga: Antioxidant Superfood',
      category: 'lentils' as const,
      image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'nutrition' as const,
      stats: {
        primary: { value: '920', label: 'ORAC Score' },
        secondary: { value: '6.6mg', label: 'Iron per 100g' }
      },
      highlights: [
        'Rich in anthocyanins',
        'Premium texture & flavor',
        'Excellent for salads'
      ]
    }
  ];

  const milletsFactoids = [
    {
      id: 'pearl-millet-climate',
      title: 'Pearl Millet: Climate-Resilient Champion',
      category: 'millets' as const,
      image: 'https://images.unsplash.com/photo-1603833797131-3d9e8cff5058?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'sustainability' as const,
      stats: {
        primary: { value: '200mm', label: 'Min Rainfall' },
        secondary: { value: '46°C', label: 'Heat Tolerance' }
      },
      highlights: [
        'Drought-resistant supercrop',
        'Grows in marginal lands',
        'Carbon-negative farming'
      ]
    },
    {
      id: 'finger-millet-calcium',
      title: 'Finger Millet: Natural Calcium Source',
      category: 'millets' as const,
      image: 'https://images.unsplash.com/photo-1570495675092-84bde2eceb43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'health' as const,
      stats: {
        primary: { value: '344mg', label: 'Calcium per 100g' },
        secondary: { value: '3.9mg', label: 'Iron per 100g' }
      },
      highlights: [
        'Superior to dairy for calcium',
        'Supports bone health',
        'Rich in amino acids'
      ]
    },
    {
      id: 'foxtail-millet-glycemic',
      title: 'Foxtail Millet: Diabetic-Friendly Grain',
      category: 'millets' as const,
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      icon: 'nutrition' as const,
      stats: {
        primary: { value: '50', label: 'Glycemic Index' },
        secondary: { value: '12.3g', label: 'Protein per 100g' }
      },
      highlights: [
        'Low glycemic index',
        'Balances blood sugar',
        'High in B-vitamins'
      ]
    }
  ];

  // Transform CMS articles to factoid format
  const transformCMSToFactoid = (article: CMSArticle) => ({
    id: article.id.toString(),
    title: article.title,
    category: article.category as 'lentils' | 'millets',
    image: article.hero_image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: article.factoid_data?.icon || 'nutrition',
    stats: {
      primary: article.factoid_data?.primary_stat || { value: 'N/A', label: 'Data' },
      secondary: article.factoid_data?.secondary_stat || { value: 'N/A', label: 'Info' }
    },
    highlights: article.factoid_data?.highlights || []
  });

  // Use CMS data when available, fallback to hardcoded data
  const cmsFactoids = factoidArticles.map(transformCMSToFactoid);
  const fallbackFactoids = isLentils ? lentilsFactoids : milletsFactoids;
  
  // Combine CMS and fallback data (CMS takes priority)
  const factoids = [...cmsFactoids];
  
  // Fill remaining slots with fallback data if needed
  const maxFactoids = 3;
  const remainingSlots = maxFactoids - factoids.length;
  if (remainingSlots > 0) {
    factoids.push(...fallbackFactoids.slice(0, remainingSlots));
  }
  
  const themeColors = isLentils ? {
    primary: 'var(--color-lentils-secondary)',
    background: 'var(--color-lentils-background)',
    text: 'var(--color-lentils-text)'
  } : {
    primary: 'var(--color-millets-secondary)',
    background: 'var(--color-millets-background)',
    text: 'var(--color-millets-text)'
  };

  const handleFactoidClick = (factoid: any) => {
    // Check if this is a CMS article (has numeric id) or fallback data (string id)
    const isCMSArticle = typeof factoid.id === 'string' && !isNaN(Number(factoid.id));
    
    if (isCMSArticle) {
      // For CMS articles, navigate to the actual article page
      const cmsArticle = factoidArticles.find(article => article.id.toString() === factoid.id);
      if (cmsArticle) {
        console.log('Navigating to CMS article:', cmsArticle.slug);
        // Use window.location.href for better compatibility
        window.location.href = `/articles/${cmsArticle.slug}`;
        return;
      }
    }
    
    // Create a mock article based on the factoid for fallback data
    const article = {
      id: factoid.id + '-article',
      title: `The Complete Guide to ${factoid.title}`,
      category: factoid.category,
      author: 'Nutrition Team',
      publishDate: 'January 2025',
      readTime: '5 min read',
      views: '1.2k views',
      heroImage: factoid.image,
      content: {
        introduction: `Discover the remarkable properties and benefits of ${factoid.title.toLowerCase()}, a nutritional powerhouse that's transforming modern healthy eating.`,
        sections: [
          {
            heading: 'Nutritional Profile',
            content: `This ${isLentils ? 'lentil' : 'millet'} variety offers exceptional nutritional density with ${factoid.stats.primary.value} ${factoid.stats.primary.label.toLowerCase()}.`
          }
        ],
        conclusion: 'Understanding these nutritional facts helps you make informed choices for your health and culinary adventures.'
      },
      tags: [factoid.title.split(':')[0], 'Nutrition', 'Health']
    };
    
    onNavigate?.('article', article);
  };

  return (
    <div className="py-16" style={{ backgroundColor: themeColors.background, color: themeColors.text }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full text-sm mb-4 bg-white/80 backdrop-blur-sm">
            <span className="opacity-70">NUTRITION SCIENCE</span>
          </div>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: themeColors.primary }}>
            {isLentils ? 'Lentil' : 'Millet'} Nutritional Facts
          </h2>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Discover the scientific evidence behind these nutritional powerhouses and their impact on modern health.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="h-16 bg-gray-100 rounded"></div>
                  <div className="h-16 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            factoids.map((factoid) => (
              <FactoidCard
                key={factoid.id}
                factoid={factoid}
                onClick={handleFactoidClick}
              />
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate?.(isLentils ? 'lentils' : 'millets')}
            className="px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm hover:bg-white border"
            style={{ 
              color: themeColors.primary,
              borderColor: themeColors.primary + '40'
            }}
          >
            Explore All {isLentils ? 'Lentil' : 'Millet'} Varieties
          </button>
        </div>
      </div>
    </div>
  );
}