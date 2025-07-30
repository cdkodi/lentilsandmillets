# Deployment Guide - Lentils & Millets Platform

## Overview

This document outlines the deployment strategy for the Lentils & Millets platform, which consists of three main components:
- **Frontend**: Next.js application (deployed to Vercel)
- **CMS**: Content Management System (local development only)
- **AI Service**: Python-based article generation service (local development only)

## Project Architecture

```
lentils-and-millets/
├── src/                    # Frontend Next.js app (DEPLOYED TO VERCEL)
│   ├── app/
│   │   ├── recipes/page.tsx
│   │   ├── lentils/page.tsx
│   │   ├── millets/page.tsx
│   │   └── api/            # API routes for frontend
│   └── components/
├── cms/                    # CMS admin interface (LOCAL ONLY)
│   ├── src/app/admin-panel/
│   └── components/
├── ai-service/             # Python AI service (LOCAL ONLY)
│   ├── main.py
│   └── services/
├── vercel.json            # Vercel deployment configuration
└── package.json           # Root package.json for frontend
```

## Deployment Strategy

### What Gets Deployed Where

| Component | Deployment Target | Purpose | Access |
|-----------|------------------|---------|---------|
| **Frontend** (`src/`) | Vercel Production | Public website | https://lentilsandmillets.vercel.app/ |
| **CMS** (`cms/`) | Local Development | Content management | http://localhost:3001/admin-panel |
| **AI Service** (`ai-service/`) | Local Development | Article generation | http://localhost:8000 |

### Why This Architecture?

1. **Frontend Only to Vercel**: The public website needs to be fast, scalable, and globally distributed
2. **CMS Local Only**: Contains admin credentials and direct database access - security sensitive
3. **AI Service Local Only**: Resource-intensive Python service with API keys - not suitable for serverless

## Vercel Deployment Configuration

### Current Working Configuration (`vercel.json`)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs",
  "functions": { 
    "src/app/api/**/*.ts": {
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Key Configuration Details

- **Build Command**: `pnpm build` (runs from project root)
- **Install Command**: `pnpm install --no-frozen-lockfile` (uses pnpm, no frozen lockfile for CI)
- **Output Directory**: `.next` (Next.js build output at root level)
- **Functions**: API routes in `src/app/api/` with 30-second timeout
- **Framework**: `nextjs` (enables Vercel's Next.js optimizations)

## Step-by-Step Deployment Process

### Prerequisites

1. **Vercel Project Setup**:
   - Project Name: `lentilsandmillets`
   - Project ID: `prj_oxTLTBxBX9XS3NRK9ldN06nnd5p1`
   - Connected to GitHub repository: `cdkodi/lentilsandmillets`

2. **Required GitHub Secrets**:
   ```
   VERCEL_TOKEN=<your-vercel-token>
   PROJECT_ID=prj_oxTLTBxBX9XS3NRK9ldN06nnd5p1
   ORG_ID=<your-org-id>
   VERCEL_ORG_ID=<your-org-id>
   ```

3. **Environment Variables in Vercel**:
   ```
   DATABASE_URL=<neon-postgres-connection-string>
   NEXT_PUBLIC_API_URL=https://lentilsandmillets.vercel.app
   NODE_ENV=production
   ```

### Deployment Steps

#### 1. Code Changes and Testing

```bash
# Make your changes to frontend code in src/
# Test locally
pnpm dev

# Run linting and type checking
pnpm lint
pnpm run typecheck
```

#### 2. Commit and Push

```bash
# Add changes
git add src/ vercel.json package.json

# Commit with clear message
git commit -m "feat: add new feature

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to main branch
git push origin main
```

#### 3. Automatic Deployment

- GitHub Actions triggers automatically on push to `main`
- Vercel builds and deploys the frontend
- Deployment URL: https://lentilsandmillets.vercel.app/

#### 4. Verification

```bash
# Test production deployment
npx playwright test --config=playwright-production.config.ts

# Verify all pages work:
# ✅ Homepage: https://lentilsandmillets.vercel.app/
# ✅ Lentils: https://lentilsandmillets.vercel.app/lentils  
# ✅ Millets: https://lentilsandmillets.vercel.app/millets
# ✅ Recipes: https://lentilsandmillets.vercel.app/recipes
```

## Common Deployment Issues and Solutions

### Issue 1: `cd frontend` Command Fails

**Error**: `sh: line 1: cd: frontend: No such file or directory`

**Cause**: Incorrect vercel.json configuration trying to access `frontend/` subdirectory

**Solution**: Use root-level commands in vercel.json:
```json
{
  "buildCommand": "pnpm build",        // NOT "cd frontend && pnpm build"
  "outputDirectory": ".next",          // NOT "frontend/.next"
  "installCommand": "pnpm install --no-frozen-lockfile"
}
```

### Issue 2: ignoreCommand Path Errors

**Error**: `fatal: ambiguous argument 'frontend/': unknown revision or path not in the working tree`

**Cause**: ignoreCommand referencing non-existent paths

**Solution**: Remove ignoreCommand entirely or fix the path:
```json
{
  // Remove this line entirely:
  // "ignoreCommand": "git diff --quiet HEAD^ HEAD frontend/"
}
```

### Issue 3: API Routes Not Working

**Error**: API routes return 404 or 500 errors

**Cause**: Incorrect function configuration in vercel.json

**Solution**: Ensure correct API route mapping:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {          // Match actual file structure
      "runtime": "nodejs20.x",
      "maxDuration": 30
    }
  }
}
```

### Issue 4: Database Connection Errors During Build

**Error**: `No database configuration found` during Vercel build

**Cause**: Next.js tries to prerender API routes during build

**Solution**: Add CI environment detection in database config:
```typescript
const databaseConfig = () => {
  // Skip database connection during CI build
  if (process.env.GITHUB_ACTIONS || process.env.CI) {
    return null; // or mock config
  }
  return {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
};
```

## Local Development Setup

### Frontend Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000
```

### CMS Development

```bash
# Navigate to CMS directory
cd cms

# Install dependencies
pnpm install

# Start CMS development server
pnpm dev
# → http://localhost:3001/admin-panel
```

### AI Service Development

```bash
# Navigate to AI service directory
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Start AI service
python main.py
# → http://localhost:8000
```

## File Structure for Deployment

### Files Included in Vercel Deployment

```
✅ DEPLOYED TO VERCEL:
├── src/                    # Frontend application
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── next.config.mjs        # Next.js configuration
├── tailwind.config.js     # Styling configuration
├── tsconfig.json          # TypeScript configuration
└── vercel.json            # Deployment configuration

❌ NOT DEPLOYED (Local Only):
├── cms/                   # Content management system
├── ai-service/            # Python AI service
├── test-results/          # Playwright test results
├── node_modules/          # Dependencies (rebuilt on Vercel)
└── .env.local            # Local environment variables
```

### Environment Variables

#### Production (Vercel)
```env
DATABASE_URL=postgresql://username:password@hostname/database
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://lentilsandmillets.vercel.app
```

#### Development (Local)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Monitoring and Maintenance

### Deployment Health Checks

```bash
# Run after each deployment
npx playwright test --config=playwright-production.config.ts

# Check Core Web Vitals
npx lighthouse https://lentilsandmillets.vercel.app/ --view

# Monitor error rates in Vercel dashboard
# → https://vercel.com/dashboard
```

### Performance Optimization

1. **Build Optimization**:
   - Use `pnpm` for faster installs
   - Enable Next.js optimizations with `framework: "nextjs"`
   - Set appropriate function timeouts

2. **Content Delivery**:
   - Static assets served via Vercel Edge Network
   - API routes run on Vercel serverless functions
   - Database queries optimized for serverless environment

## Security Considerations

### What's Safe to Deploy

✅ **Safe for Vercel**:
- Frontend React components
- Public API routes (with rate limiting)
- Static content and images
- Client-side JavaScript

❌ **Keep Local Only**:
- Admin credentials and authentication
- Direct database administration
- AI service API keys
- Content management interfaces
- Development tools and scripts

### Best Practices

1. **Environment Variables**: Never commit secrets to repository
2. **API Security**: Implement rate limiting and authentication
3. **Database Access**: Use connection pooling and read replicas
4. **Error Handling**: Don't expose sensitive error details in production

## Rollback Procedure

### Quick Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

### Vercel Dashboard Rollback

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

## Contact and Support

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/cdkodi/lentilsandmillets
- **Production URL**: https://lentilsandmillets.vercel.app/

---

**Last Updated**: 2025-07-30  
**Next Review**: Monthly or after major infrastructure changes