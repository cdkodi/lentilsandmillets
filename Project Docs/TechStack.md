# Technical Architecture: lentilsandmillets.com
**Single-Platform Serverless Architecture with Dual Product Line Support**

---

## Executive Summary

This document outlines the technical architecture for lentilsandmillets.com, a content-first platform that scales from educational authority to e-commerce marketplace. The architecture leverages modern serverless technologies to deliver enterprise-grade performance at startup-friendly costs.

**Key Design Principles:**
- **Single-platform simplicity**: Everything managed through Vercel
- **Performance-first**: Sub-2 second load times globally
- **Type-safe development**: End-to-end TypeScript
- **Dual product line support**: Native content differentiation for lentils vs millets
- **Phase-appropriate scaling**: Architecture evolves with business needs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL PLATFORM                         │
│                   (Single Dashboard)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   FRONTEND      │    │    BACKEND      │                │
│  │                 │    │                 │                │
│  │ • Next.js 14    │◄──►│ • Payload 3.0   │                │
│  │ • React 18      │    │ • Admin Panel   │                │
│  │ • TypeScript    │    │ • REST/GraphQL  │                │
│  │ • Tailwind CSS  │    │ • Custom Models │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ VERCEL EDGE CDN │    │ VERCEL BLOB     │                │
│  │ • Global Cache  │    │ • Recipe Images │                │
│  │ • Image Opt     │    │ • File Storage  │                │
│  │ • Core Vitals   │    │ • Asset CDN     │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │  NEON POSTGRES  │
                    │ • Content Data  │
                    │ • User Accounts │
                    │ • Recipe Meta   │
                    │ • Product Info  │
                    │ • Analytics     │
                    └─────────────────┘
```

---

## Core Technology Stack

### Frontend Technologies

#### **Next.js 14 (App Router)**
```typescript
// Example routing structure
app/
├── (lentils)/
│   ├── recipes/
│   ├── nutrition/
│   └── meal-prep/
├── (millets)/
│   ├── recipes/
│   ├── ancient-grains/
│   └── gluten-free/
├── api/
└── layout.tsx
```

**Key Features:**
- **Server Components**: Optimal SEO and performance
- **Static Generation**: Pre-rendered content for speed
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Route Groups**: Clean dual product line organization

#### **React 18 with TypeScript**
```typescript
// Product line-aware component example
interface RecipeCardProps {
  recipe: Recipe;
  productLine: 'lentils' | 'millets' | 'combination';
  theme: ProductLineTheme;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  productLine,
  theme
}) => {
  return (
    <div className={`recipe-card ${theme.colorScheme}`}>
      <ProductLineBadge type={productLine} />
      <CookingTimeIndicator 
        time={recipe.cookingTime} 
        category={productLine} 
      />
    </div>
  );
};
```

#### **Styling & UI Framework**
- **Tailwind CSS**: Utility-first responsive design
- **Custom Design System**: Dual product line theming
- **Component Library**: Reusable UI components
- **Mobile-First**: Progressive enhancement approach

### Backend Technologies

#### **Payload 3.0 CMS**
```typescript
// Content models for dual product lines
export const Recipe: CollectionConfig = {
  slug: 'recipes',
  fields: [
    {
      name: 'productLine',
      type: 'select',
      options: [
        { label: 'Lentils', value: 'lentils' },
        { label: 'Millets', value: 'millets' },
        { label: 'Combination', value: 'combination' }
      ],
      required: true,
    },
    {
      name: 'cookingTime',
      type: 'number',
      admin: {
        description: 'Minutes required for preparation + cooking'
      }
    },
    {
      name: 'difficulty',
      type: 'select',
      options: ['beginner', 'intermediate', 'advanced']
    },
    {
      name: 'nutritionalFocus',
      type: 'select',
      options: [
        'high-protein',
        'gluten-free', 
        'low-glycemic',
        'heart-healthy',
        'weight-management'
      ]
    }
  ]
};
```

**Key Capabilities:**
- **Custom Admin UI**: Tailored for recipe and content management
- **TypeScript Integration**: Type-safe content models
- **Rich Media Support**: Image galleries and video embeds
- **Version Control**: Content drafts and publishing workflow
- **API Generation**: Automatic REST and GraphQL endpoints

#### **API Architecture**
```typescript
// Example API structure
api/
├── recipes/
│   ├── [slug]/route.ts
│   ├── by-product-line/[type]/route.ts
│   └── search/route.ts
├── articles/
├── products/
└── analytics/
```

### Database & Storage

#### **Neon Postgres (Managed)**
```sql
-- Example schema structure
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  product_line VARCHAR(50) NOT NULL,
  cooking_time INTEGER,
  difficulty VARCHAR(20),
  nutritional_focus VARCHAR(50)[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipes_product_line ON recipes(product_line);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time);
```

**Features:**
- **Serverless-optimized**: Fast cold starts (<50ms)
- **Connection pooling**: Automatic scaling
- **Database branching**: Git-like workflow for schema changes
- **Point-in-time recovery**: Data protection

#### **Vercel Blob Storage**
```typescript
// File upload handling
import { put } from '@vercel/blob';

export async function uploadRecipeImage(file: File) {
  const blob = await put(`recipes/${file.name}`, file, {
    access: 'public',
  });
  
  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
  };
}
```

---

## Performance Architecture

### **Core Web Vitals Optimization**

#### **Largest Contentful Paint (LCP)**
```typescript
// Image optimization strategy
import Image from 'next/image';

const RecipeHero = ({ recipe }: { recipe: Recipe }) => (
  <Image
    src={recipe.featuredImage.url}
    alt={recipe.title}
    width={800}
    height={600}
    priority // LCP optimization
    sizes="(max-width: 768px) 100vw, 800px"
    className="recipe-hero"
  />
);
```

#### **First Input Delay (FID)**
```typescript
// Code splitting by product line
const LentilsModule = dynamic(() => import('./LentilsModule'));
const MilletsModule = dynamic(() => import('./MilletsModule'));

const ProductLineRouter = ({ productLine }: { productLine: string }) => {
  if (productLine === 'lentils') return <LentilsModule />;
  if (productLine === 'millets') return <MilletsModule />;
  return <CombinationModule />;
};
```

#### **Cumulative Layout Shift (CLS)**
```css
/* Stable layout patterns */
.recipe-card {
  aspect-ratio: 4/3;
  container-type: inline-size;
}

.nutrition-chart {
  min-height: 200px; /* Prevent layout shift */
}
```

### **Caching Strategy**

#### **Static Generation**
```typescript
// Recipe pages - static with ISR
export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export const revalidate = 3600; // 1 hour ISR
```

#### **Edge Caching**
```typescript
// API responses with cache headers
export async function GET(request: Request) {
  const recipes = await getRecipesByProductLine('lentils');
  
  return new Response(JSON.stringify(recipes), {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      'Content-Type': 'application/json',
    },
  });
}
```

---

## Content Architecture

### **Dual Product Line Content Models**

#### **Lentils Content Strategy**
```typescript
interface LentilContent {
  productLine: 'lentils';
  quickCookingTime: number; // 15-30 minutes
  proteinContent: number; // grams per serving
  familyFriendly: boolean;
  mealPrepSuitable: boolean;
  cuisineType: 'indian' | 'mediterranean' | 'american' | 'fusion';
}
```

#### **Millets Content Strategy**  
```typescript
interface MilletContent {
  productLine: 'millets';
  varietyType: 'pearl' | 'finger' | 'foxtail' | 'barnyard' | 'little';
  glutenFree: boolean;
  glycemicIndex: 'low' | 'medium';
  sustainabilityScore: number;
  traditionalOrigin: string;
}
```

### **Content Relationships**
```typescript
// Cross-product recommendations
interface ContentRelationships {
  complementaryRecipes: Recipe[]; // Lentil recipe → suggest millet pairing
  nutritionalComplements: Ingredient[]; // Complete amino acid profiles
  seasonalPairings: Recipe[]; // Seasonal content strategy
  difficultyProgression: Recipe[]; // Beginner → Advanced learning path
}
```

---

## Deployment & DevOps

### **Git Workflow**
```bash
# Development flow
git checkout -b feature/millet-breakfast-recipes
git add .
git commit -m "Add ancient millet breakfast bowl recipes"
git push origin feature/millet-breakfast-recipes

# Automatic Vercel preview deployment created
# → https://lentilsandmillets-git-feature-milletbreakfast.vercel.app
```

### **Environment Management**
```typescript
// Environment-specific configuration
const config = {
  development: {
    database: process.env.DATABASE_URL_DEV,
    imageOptimization: false,
    analytics: false,
  },
  preview: {
    database: process.env.DATABASE_URL_PREVIEW,
    imageOptimization: true,
    analytics: true,
  },
  production: {
    database: process.env.DATABASE_URL,
    imageOptimization: true,
    analytics: true,
    seo: true,
  }
};
```

### **Deployment Pipeline**
```yaml
# Automatic deployment flow
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

steps:
  1. Code pushed to GitHub
  2. Vercel detects changes
  3. Builds Next.js application
  4. Runs Payload migrations
  5. Deploys to global edge network
  6. Invalidates CDN cache
  7. Runs post-deployment tests
  8. Notifies team of deployment status
```

---

## Security Architecture

### **Authentication & Authorization**
```typescript
// Payload admin authentication
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `Verify your email: ${token}`;
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return { id: { equals: user?.id } };
    },
  },
};
```

### **Data Protection**
- **Encryption at rest**: Neon Postgres automatic encryption
- **Encryption in transit**: TLS 1.3 for all connections
- **Environment variables**: Secure secret management via Vercel
- **API rate limiting**: Built-in DDoS protection

### **Content Security**
```typescript
// Content Security Policy headers
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    connect-src 'self' https:;
  `,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
};
```

---

## Monitoring & Analytics

### **Performance Monitoring**
```typescript
// Core Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    productLine: getCurrentProductLine(),
  });
  
  fetch('/api/analytics', {
    method: 'POST',
    body,
    keepalive: true,
  });
}
```

### **Content Analytics**
```typescript
// Track dual product line engagement
interface ContentMetrics {
  pageViews: number;
  timeOnPage: number;
  productLinePreference: 'lentils' | 'millets' | 'both';
  recipeCompletionRate: number;
  emailSignupSource: string;
  searchQueries: string[];
}
```

### **Business Intelligence**
```typescript
// Dashboard metrics for business decisions
interface BusinessMetrics {
  contentPerformance: {
    topLentilRecipes: Recipe[];
    topMilletRecipes: Recipe[];
    crossProductEngagement: number;
  };
  userBehavior: {
    learningProgression: 'lentils-first' | 'millets-first';
    retentionRate: number;
    emailEngagement: number;
  };
  technicalPerformance: {
    coreWebVitals: CoreWebVitalsScore;
    apiResponseTimes: number[];
    errorRates: number;
  };
}
```

---

## Cost Analysis & Scaling

### **Phase 1: Content Authority (Months 1-6)**
```
Infrastructure Costs:
├── Vercel Hobby: FREE
├── Neon Free: FREE (0.5GB database)
├── Domain: Already owned
└── Total: $0/month

Scaling Triggers:
├── Database: Upgrade at 0.5GB usage
├── Bandwidth: Upgrade at 100GB/month
├── Team: Upgrade when adding developers
```

### **Phase 2: E-commerce Integration (Months 7-12)**
```
Infrastructure Costs:
├── Vercel Pro: $20/month (team features)
├── Neon Scale: $19/month (10GB database)
├── Vercel Blob: $10/month (product images)
├── Shopify API: $29/month (basic plan)
└── Total: $78/month
```

### **Phase 3: Mobile & Subscription (Year 2+)**
```
Infrastructure Costs:
├── Vercel Pro: $20/month
├── Neon Pro: $69/month (advanced features)
├── Vercel Blob: $25/month (higher usage)
├── Mobile API costs: $15/month
├── Analytics platform: $50/month
└── Total: $179/month
```

### **Auto-scaling Capabilities**
```typescript
// Automatic scaling without configuration
const scalingFeatures = {
  compute: 'Serverless functions auto-scale to zero',
  database: 'Neon scales connections automatically',
  cdn: 'Global edge network scales with traffic',
  storage: 'Pay-per-use blob storage',
  bandwidth: 'Automatic geographic optimization',
};
```

---

## Integration Architecture

### **Phase 2: E-commerce Integration**
```typescript
// Shopify integration example
interface ShopifyIntegration {
  products: {
    sync: () => Promise<void>;
    webhook: (product: ShopifyProduct) => Promise<void>;
  };
  orders: {
    webhook: (order: ShopifyOrder) => Promise<void>;
    fulfillment: (orderId: string) => Promise<void>;
  };
  customers: {
    sync: (email: string) => Promise<Customer>;
  };
}

// API route for Shopify webhooks
export async function POST(request: Request) {
  const { type, data } = await request.json();
  
  switch (type) {
    case 'order.created':
      await handleNewOrder(data);
      break;
    case 'product.updated':
      await syncProductToPayload(data);
      break;
  }
}
```

### **Phase 3: Mobile App Support**
```typescript
// Mobile-optimized API endpoints
export const mobileAPI = {
  recipes: {
    discover: '/api/mobile/recipes/discover',
    favorites: '/api/mobile/recipes/favorites',
    offline: '/api/mobile/recipes/offline-sync',
  },
  planning: {
    mealPlan: '/api/mobile/meal-plan',
    shopping: '/api/mobile/shopping-list',
    nutrition: '/api/mobile/nutrition-tracking',
  },
  social: {
    share: '/api/mobile/share',
    reviews: '/api/mobile/reviews',
    community: '/api/mobile/community',
  },
};
```

---

## Development Guidelines

### **Code Standards**
```typescript
// TypeScript configuration
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### **Component Architecture**
```typescript
// Component organization
components/
├── ui/                 # Generic UI components
├── lentils/           # Lentils-specific components
├── millets/           # Millets-specific components
├── shared/            # Cross-product line components
└── layouts/           # Page layouts
```

### **Testing Strategy**
```typescript
// Test coverage requirements
const testingStrategy = {
  unit: 'All utility functions and hooks',
  integration: 'API routes and database operations',
  e2e: 'Critical user journeys (recipe discovery, email signup)',
  performance: 'Core Web Vitals and load testing',
  accessibility: 'WCAG 2.1 AA compliance',
};
```

---

## Future Architecture Considerations

### **Scalability Roadmap**
```typescript
interface ScalingConsiderations {
  year1: {
    traffic: '10K monthly visitors',
    content: '100+ recipes, 50+ articles',
    features: 'Basic e-commerce integration',
  };
  year2: {
    traffic: '100K monthly visitors',
    content: '500+ recipes, 200+ articles',
    features: 'Mobile app, subscription model',
  };
  year3: {
    traffic: '500K monthly visitors',
    content: '1000+ recipes, 500+ articles',
    features: 'AI recommendations, international expansion',
  };
}
```

### **Technology Evolution**
```typescript
const technologyRoadmap = {
  immediate: 'Payload 3.0 + Next.js 14 + Vercel',
  shortTerm: 'AI content assistance, advanced analytics',
  mediumTerm: 'Edge computing, personalization engine',
  longTerm: 'Machine learning recommendations, IoT integration',
};
```

---

## Conclusion

This technical architecture provides a solid foundation for lentilsandmillets.com that balances current needs with future scalability. The single-platform approach minimizes operational complexity while the serverless architecture ensures optimal performance and cost efficiency.

**Key Success Factors:**
1. **Performance-first design** ensures excellent SEO and user experience
2. **Type-safe development** reduces bugs and improves maintainability  
3. **Dual product line architecture** supports the unique business model
4. **Cost-effective scaling** grows with the business without major re-architecture
5. **Developer experience** enables rapid feature development and deployment

The architecture is designed to evolve seamlessly from Phase 1 (content authority) through Phase 3 (mobile + subscription), providing a stable technical foundation for long-term business growth.