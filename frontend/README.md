# Frontend - Lentils & Millets

Public-facing website for lentilsandmillets.com built with Next.js 15, React 19, and TypeScript.

## Features

- **Dual Brand Theming**: Separate visual identity for lentils vs millets
- **SEO Optimized**: Meta tags, structured data, performance optimization
- **Mobile-First**: Responsive design with perfect mobile experience
- **Performance**: <2s load times, perfect Core Web Vitals
- **Accessibility**: WCAG 2.1 compliant

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev  # http://localhost:3000

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Deployment

- **Platform**: Vercel Pro
- **Domain**: lentilsandmillets.com
- **Auto-deployment**: Enabled for main branch
- **Environment**: Production variables configured in Vercel

## Architecture

- **App Router**: Next.js 15 with server components
- **Styling**: Tailwind CSS with brand variables
- **Components**: shadcn/ui component library
- **State**: React hooks and context
- **Images**: Next.js Image optimization

## Key Pages

- **Homepage**: `/` - Dual product showcase
- **Lentils**: `/lentils` - Lentils product line
- **Millets**: `/millets` - Millets product line
- **Articles**: `/articles` - SEO content
- **Recipes**: `/recipes` - Recipe collection