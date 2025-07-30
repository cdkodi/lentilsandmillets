# API Documentation
## Card-Based CMS System

---

## API Overview

The API provides RESTful endpoints for managing articles, recipes, and card assignments. All endpoints follow REST conventions with proper HTTP status codes and JSON responses.

**Base URL**: `/api`

---

## Authentication

*Note: Authentication will be implemented in Phase 2. Currently using development mode.*

```typescript
// Future authentication header
Authorization: Bearer <jwt_token>
```

---

## Content Management Endpoints

### Articles

#### GET /api/articles
Fetch all articles with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by 'lentils' or 'millets'
- `status` (optional): Filter by 'draft', 'published', or 'archived'
- `card_position` (optional): Filter by specific card position
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": 1,
        "title": "Red Lentils: Complete Nutritional Guide",
        "slug": "red-lentils-complete-nutritional-guide",
        "excerpt": "Discover the complete nutritional profile...",
        "hero_image_url": "https://images.unsplash.com/...",
        "author": "Dr. Sarah Johnson",
        "category": "lentils",
        "card_position": "H4",
        "display_pages": ["home", "lentils"],
        "factoid_data": {
          "primary_stat": {"value": "25g", "label": "Protein per 100g"},
          "secondary_stat": {"value": "15min", "label": "Cook Time"},
          "icon": "protein",
          "highlights": ["Complete amino acid profile", "High in folate & iron"]
        },
        "tags": ["red lentils", "nutrition", "protein"],
        "status": "published",
        "published_at": "2025-01-27T10:00:00Z",
        "created_at": "2025-01-27T09:00:00Z",
        "updated_at": "2025-01-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### GET /api/articles/:id
Fetch a specific article by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Red Lentils: Complete Nutritional Guide",
    "content": "Red lentils are one of the most versatile...",
    "meta_title": "Red Lentils: Complete Nutritional Guide",
    "meta_description": "Learn about red lentil nutrition...",
    // ... all article fields
  }
}
```

#### POST /api/articles
Create a new article.

**Request Body:**
```json
{
  "title": "Green Lentils: Fiber Powerhouse",
  "content": "Green lentils are known for their high fiber content...",
  "excerpt": "Discover why green lentils are excellent for digestive health.",
  "hero_image_url": "https://images.unsplash.com/...",
  "author": "Dr. Sarah Johnson",
  "category": "lentils",
  "card_position": "H5",
  "display_pages": ["home", "lentils"],
  "factoid_data": {
    "primary_stat": {"value": "8g", "label": "Fiber per serving"},
    "secondary_stat": {"value": "230", "label": "Calories per cup"},
    "icon": "health",
    "highlights": [
      "Supports digestive health",
      "Helps manage cholesterol",
      "Promotes satiety"
    ]
  },
  "meta_title": "Green Lentils: High Fiber Nutrition Guide",
  "meta_description": "Learn about green lentil fiber benefits and nutrition facts.",
  "tags": ["green lentils", "fiber", "digestive health"],
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "slug": "green-lentils-fiber-powerhouse",
    // ... created article data
  }
}
```

#### PUT /api/articles/:id
Update an existing article.

#### DELETE /api/articles/:id
Delete an article (soft delete - sets status to 'archived').

---

### Recipes

#### GET /api/recipes
Fetch all recipes with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by 'lentils' or 'millets'
- `meal_type` (optional): Filter by meal type
- `dietary_tags` (optional): Filter by dietary tags (comma-separated)
- `is_featured` (optional): Filter featured recipes
- `difficulty` (optional): Filter by difficulty level

**Response:**
```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": 1,
        "title": "Spiced Red Lentil Curry",
        "slug": "spiced-red-lentil-curry",
        "description": "A warming, protein-rich curry perfect for weeknight dinners.",
        "hero_image_url": "https://images.unsplash.com/...",
        "prep_time": 10,
        "cook_time": 25,
        "total_time": 35,
        "servings": 4,
        "difficulty": "easy",
        "category": "lentils",
        "meal_type": "dinner",
        "dietary_tags": ["vegan", "gluten-free", "high-protein"],
        "card_position": "H10",
        "display_pages": ["home", "lentils"],
        "is_featured": true,
        "calories_per_serving": 245,
        "protein_grams": 12.5,
        "nutritional_highlights": ["High in plant-based protein", "Rich in dietary fiber"],
        "status": "published"
      }
    ],
    "pagination": {
      // ... pagination info
    }
  }
}
```

#### GET /api/recipes/:id
Fetch a specific recipe with full details including ingredients and instructions.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Spiced Red Lentil Curry",
    "ingredients": [
      {
        "item": "Red lentils",
        "amount": "1 cup",
        "notes": "rinsed and drained"
      },
      {
        "item": "Coconut oil",
        "amount": "2 tbsp",
        "notes": ""
      }
    ],
    "instructions": [
      {
        "step": 1,
        "instruction": "Heat coconut oil in a large pot over medium heat",
        "time": 2
      },
      {
        "step": 2,
        "instruction": "Add diced onion and cook until translucent",
        "time": 5
      }
    ],
    "health_benefits": [
      "Supports heart health",
      "Aids in digestion",
      "Helps stabilize blood sugar"
    ],
    // ... all recipe fields
  }
}
```

#### POST /api/recipes
Create a new recipe.

**Request Body:**
```json
{
  "title": "Mediterranean Lentil Salad",
  "description": "Fresh, healthy salad perfect for summer meals.",
  "prep_time": 15,
  "cook_time": 20,
  "servings": 6,
  "difficulty": "easy",
  "ingredients": [
    {
      "item": "Green lentils",
      "amount": "1 cup",
      "notes": "dried"
    },
    {
      "item": "Cherry tomatoes",
      "amount": "1 cup",
      "notes": "halved"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "Cook lentils according to package directions until tender",
      "time": 20
    },
    {
      "step": 2,
      "instruction": "Drain and let cool to room temperature",
      "time": 10
    }
  ],
  "category": "lentils",
  "meal_type": "lunch",
  "dietary_tags": ["vegan", "gluten-free"],
  "card_position": "H11",
  "display_pages": ["home", "lentils"],
  "is_featured": true,
  "calories_per_serving": 180,
  "protein_grams": 9.2,
  "fiber_grams": 7.8,
  "nutritional_highlights": ["Plant-based protein", "High fiber"],
  "health_benefits": ["Supports digestive health", "Heart-healthy fats"],
  "status": "draft"
}
```

---

## Card Management Endpoints

### GET /api/cards
Fetch content for specific pages and card positions.

**Query Parameters:**
- `page` (required): 'home', 'lentils', or 'millets'
- `positions` (optional): Comma-separated card positions (e.g., 'H0,H1,H2')

**Response:**
```json
{
  "success": true,
  "data": {
    "page": "home",
    "cards": [
      {
        "position": "H0",
        "content_type": "article",
        "content": {
          "id": 1,
          "title": "Premium Red Lentils",
          "hero_image_url": "https://images.unsplash.com/...",
          "slug": "premium-red-lentils"
        }
      },
      {
        "position": "H4",
        "content_type": "article",
        "content": {
          "id": 2,
          "title": "Red Lentils: Quick-Cooking Protein Powerhouse",
          "factoid_data": {
            "primary_stat": {"value": "25g", "label": "Protein per 100g"},
            "secondary_stat": {"value": "15min", "label": "Cook Time"},
            "icon": "protein",
            "highlights": ["Complete amino acid profile", "High in folate & iron"]
          },
          "slug": "red-lentils-complete-guide"
        }
      },
      {
        "position": "H10",
        "content_type": "recipe",
        "content": {
          "id": 1,
          "title": "Spiced Red Lentil Curry",
          "hero_image_url": "https://images.unsplash.com/...",
          "prep_time": 10,
          "cook_time": 25,
          "servings": 4,
          "difficulty": "easy",
          "slug": "spiced-red-lentil-curry"
        }
      }
    ],
    "empty_positions": ["H1", "H2", "H3", "H11"]
  }
}
```

### GET /api/cards/available
Get available card positions for content assignment.

**Query Parameters:**
- `content_type` (required): 'article' or 'recipe'
- `category` (required): 'lentils' or 'millets'
- `is_featured` (optional): For recipes, whether it's featured content

**Response:**
```json
{
  "success": true,
  "data": {
    "available_positions": [
      {
        "position": "H5",
        "page": "home",
        "section": "Lentils Facts",
        "description": "Lentils nutritional facts card"
      },
      {
        "position": "L2",
        "page": "lentils", 
        "section": "Lentils Facts",
        "description": "Lentils nutritional facts card"
      }
    ],
    "featured_slots": {
      "lentils_home": {
        "used": 1,
        "available": 1,
        "positions": ["H11"]
      }
    }
  }
}
```

### POST /api/cards/assign
Assign content to a specific card position.

**Request Body:**
```json
{
  "content_type": "article",
  "content_id": 2,
  "card_position": "H5",
  "display_pages": ["home", "lentils"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Content assigned successfully",
    "assignment": {
      "content_type": "article",
      "content_id": 2,
      "card_position": "H5",
      "display_pages": ["home", "lentils"]
    }
  }
}
```

---

## Validation Endpoints

### POST /api/validate/card-assignment
Validate a card assignment before saving.

**Request Body:**
```json
{
  "content_type": "recipe",
  "category": "lentils",
  "card_position": "H10",
  "is_featured": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Assignment is valid"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ASSIGNMENT",
    "message": "Featured lentil recipe slots are full. Please remove an existing featured recipe first.",
    "details": {
      "current_featured": [
        {"id": 1, "title": "Spiced Red Lentil Curry", "position": "H10"},
        {"id": 3, "title": "Lentil Bolognese", "position": "H11"}
      ]
    }
  }
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error context
    }
  }
}
```

### Common Error Codes

#### Content Management Errors
- `VALIDATION_ERROR`: Request validation failed
- `CONTENT_NOT_FOUND`: Requested content doesn't exist
- `DUPLICATE_SLUG`: Slug already exists
- `INVALID_STATUS`: Invalid content status transition

#### Card Assignment Errors
- `INVALID_ASSIGNMENT`: Card position assignment violates rules
- `POSITION_OCCUPIED`: Card position already has content assigned
- `FEATURED_SLOTS_FULL`: No available featured content slots
- `CATEGORY_MISMATCH`: Content category doesn't match card position requirements

#### Authentication Errors (Future)
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions for action

---

## Rate Limiting

**Development**: No rate limiting
**Production**: 
- Admin operations: 100 requests/minute
- Content fetching: 1000 requests/minute

---

## Response Headers

```
Content-Type: application/json
Cache-Control: public, max-age=300 (for GET requests)
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
```

---

## Example Usage

### Fetch Home Page Content
```javascript
// Fetch all home page cards
const response = await fetch('/api/cards?page=home');
const { data } = await response.json();

// Render cards based on position and content type
data.cards.forEach(card => {
  if (card.content_type === 'article' && card.content.factoid_data) {
    renderFactoidCard(card);
  } else if (card.content_type === 'recipe') {
    renderRecipeCard(card);
  } else {
    renderArticleCard(card);
  }
});
```

### Create New Recipe with Card Assignment
```javascript
const newRecipe = {
  title: "Pearl Millet Porridge",
  description: "Nutritious breakfast with ancient grains",
  prep_time: 5,
  cook_time: 15,
  servings: 2,
  difficulty: "easy",
  ingredients: [/* ... */],
  instructions: [/* ... */],
  category: "millets",
  meal_type: "breakfast",
  card_position: "M7",
  display_pages: ["millets"],
  is_featured: true,
  status: "published"
};

const response = await fetch('/api/recipes', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(newRecipe)
});
```

---

*API Documentation version: 1.0 | Last updated: January 2025*