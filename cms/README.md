# CMS - Lentils & Millets

Content Management System for managing articles, recipes, and site content. Runs locally for security and development purposes.

## Features

- **Article Management**: Create, edit, publish articles
- **Recipe Management**: Recipe database with nutrition info
- **Card-Based Layout**: Manage homepage content cards (H0-H19, L1-L8, M1-M8)
- **Image Library**: Upload and manage images
- **Database Tools**: Migration and maintenance scripts

## Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp ../.env.local .env.local  # Copy database credentials

# Initialize database (first time only)
pnpm run db:init

# Run migrations
pnpm run migrate

# Start CMS server
pnpm dev  # http://localhost:3001

# Check database connection
pnpm run db:check
```

## Database Schema

- **Articles**: Title, content, SEO, product line
- **Recipes**: Ingredients, instructions, nutrition
- **Cards**: Homepage layout with positions
- **Images**: Media library with metadata

## API Endpoints

- `GET/POST /api/cms/articles` - Article management
- `GET/POST /api/cms/recipes` - Recipe management
- `GET/PUT /api/cms/cards` - Card layout management
- `POST /api/cms/upload` - Image upload

## Scripts

- `db:init` - Initialize database schema
- `migrate` - Run database migrations
- `db:check` - Verify database connection
- `check-schema` - Validate database structure

## Security

- **Local Only**: Not deployed to public internet
- **Database Access**: Shared Neon PostgreSQL with frontend
- **No Authentication**: Runs on trusted local environment