import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import LentilsPageClient from './LentilsPageClient';

const sql = neon(process.env.DATABASE_URL!);

// SEO Metadata
export const metadata: Metadata = {
  title: 'Premium Lentils Collection | Organic Protein Powerhouses | Lentils & Millets',
  description: 'Discover our premium collection of organic lentils - red, green, black beluga and more. Complete nutritional guides, cooking tips, and healthy recipes for modern living.',
  keywords: 'organic lentils, red lentils, green lentils, black beluga lentils, protein, healthy recipes, gluten-free, vegetarian, vegan, cooking guides',
  openGraph: {
    title: 'Premium Lentils Collection | Organic Protein Powerhouses',
    description: 'Discover our premium collection of organic lentils with complete nutritional guides and healthy recipes.',
    url: 'https://lentilsandmillets.com/lentils',
    siteName: 'Lentils & Millets',
    images: [
      {
        url: 'https://lentilsandmillets.com/og-lentils.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Organic Lentils Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Lentils Collection | Organic Protein Powerhouses',
    description: 'Discover our premium collection of organic lentils with complete nutritional guides and healthy recipes.',
    images: ['https://lentilsandmillets.com/og-lentils.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://lentilsandmillets.com/lentils',
  },
};

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

async function fetchLentilsPageData() {
  try {
    // Fetch articles for L1-L6 positions (lentil varieties and guides)
    const articlePositions = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
    const articles: CMSArticle[] = [];
    
    for (const position of articlePositions) {
      const result = await sql`
        SELECT 
          id, title, slug, excerpt, content, hero_image_url, hero_image_id, author, category,
          card_position, factoid_data, meta_title, meta_description, tags,
          status, published_at, created_at, updated_at
        FROM cms_articles 
        WHERE card_position = ${position} 
          AND status = 'published'
          AND category = 'lentils'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      if (result.length > 0) {
        articles.push(result[0] as CMSArticle);
      }
    }
    
    // Fetch recipes for L7-L8 positions (featured lentil recipes)
    const recipePositions = ['L7', 'L8'];
    const recipes: CMSRecipe[] = [];
    
    for (const position of recipePositions) {
      const result = await sql`
        SELECT 
          id, title, slug, description, hero_image_url, hero_image_id, category,
          card_position, prep_time, cook_time, total_time, servings, difficulty,
          calories_per_serving, protein_grams, fiber_grams, nutritional_highlights,
          health_benefits, ingredients, instructions, meal_type, dietary_tags,
          is_featured, meta_title, meta_description, status, published_at
        FROM cms_recipes 
        WHERE card_position = ${position} 
          AND status = 'published'
          AND category = 'lentils'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      if (result.length > 0) {
        recipes.push(result[0] as CMSRecipe);
      }
    }
    
    return { articles, recipes };
  } catch (error) {
    console.error('Error fetching lentils page data:', error);
    return { articles: [], recipes: [] };
  }
}

export default async function LentilsPage() {
  const { articles, recipes } = await fetchLentilsPageData();
  
  // Add structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Premium Lentils Collection",
    "description": "Discover our premium collection of organic lentils with complete nutritional guides and healthy recipes.",
    "url": "https://lentilsandmillets.com/lentils",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Lentil Varieties",
      "itemListElement": articles.map((article, index) => ({
        "@type": "Article",
        "position": index + 1,
        "name": article.title,
        "description": article.excerpt,
        "url": `https://lentilsandmillets.com/articles/${article.slug}`,
        "author": {
          "@type": "Person",
          "name": article.author
        },
        "datePublished": article.published_at
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://lentilsandmillets.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Lentils Collection",
          "item": "https://lentilsandmillets.com/lentils"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LentilsPageClient articles={articles} recipes={recipes} />
    </>
  );
}