import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import MilletsPageClient from './MilletsPageClient';

// Construct DATABASE_URL from individual environment variables if needed
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Construct from individual PG variables
  const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE, PGSSLMODE } = process.env;
  if (PGUSER && PGPASSWORD && PGHOST && PGDATABASE) {
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT || 5432}/${PGDATABASE}?sslmode=${PGSSLMODE || 'require'}`;
  }
  
  // Fallback for build-time when no real DB needed
  return 'postgresql://user:pass@localhost:5432/db';
};

const sql = neon(getDatabaseUrl());

// SEO Metadata
export const metadata: Metadata = {
  title: 'Ancient Millets Collection | Premium Gluten-Free Superfoods | Lentils & Millets',
  description: 'Discover our premium collection of ancient millets - pearl, finger, foxtail and more. Complete nutritional guides, gluten-free recipes, and superfood benefits for modern wellness.',
  keywords: 'ancient millets, pearl millet, finger millet, foxtail millet, gluten-free, superfood, ancient grains, healthy recipes, diabetes-friendly, weight loss, nutrition',
  openGraph: {
    title: 'Ancient Millets Collection | Premium Gluten-Free Superfoods',
    description: 'Discover our premium collection of ancient millets with complete nutritional guides and gluten-free recipes.',
    url: 'https://lentilsandmillets.com/millets',
    siteName: 'Lentils & Millets',
    images: [
      {
        url: 'https://lentilsandmillets.com/og-millets.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Ancient Millets Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ancient Millets Collection | Premium Gluten-Free Superfoods',
    description: 'Discover our premium collection of ancient millets with complete nutritional guides and gluten-free recipes.',
    images: ['https://lentilsandmillets.com/og-millets.jpg'],
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
    canonical: 'https://lentilsandmillets.com/millets',
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

async function fetchMilletsPageData() {
  try {
    // Fetch articles for M1-M6 positions (millet varieties and guides)
    const articlePositions = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
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
          AND category = 'millets'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      if (result.length > 0) {
        articles.push(result[0] as CMSArticle);
      }
    }
    
    // Fetch recipes for M7-M8 positions (featured millet recipes)
    const recipePositions = ['M7', 'M8'];
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
          AND category = 'millets'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      
      if (result.length > 0) {
        recipes.push(result[0] as CMSRecipe);
      }
    }
    
    return { articles, recipes };
  } catch (error) {
    console.error('Error fetching millets page data:', error);
    return { articles: [], recipes: [] };
  }
}

export default async function MilletsPage() {
  const { articles, recipes } = await fetchMilletsPageData();
  
  // Add structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Ancient Millets Collection",
    "description": "Discover our premium collection of ancient millets with complete nutritional guides and gluten-free recipes.",
    "url": "https://lentilsandmillets.com/millets",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Millet Varieties",
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
          "name": "Millets Collection",
          "item": "https://lentilsandmillets.com/millets"
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
      <MilletsPageClient articles={articles} recipes={recipes} />
    </>
  );
}