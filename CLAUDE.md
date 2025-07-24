# CLAUDE.md - Lentils & Millets Project Context

## Project Overview
**lentilsandmillets.com** - A comprehensive web platform for lentils and millets education, recipes, and e-commerce.

### Business Strategy
- **Dual Product Line Approach**: Separate branding for lentils (practical, protein-focused) vs millets (premium, ancient superfood)
- **Phased Development**: Content authority → E-commerce → Mobile app
- **Target Audience**: Health-conscious consumers, vegans, gluten-free lifestyle adopters

## Technical Architecture

### Current Stack
- **Frontend**: React + TypeScript (existing components in `/Front-End/`)
- **Backend**: Payload CMS 3.0 + Next.js 14
- **Database**: Neon PostgreSQL
- **Hosting**: Vercel Pro
- **Styling**: Tailwind CSS + shadcn/ui components

### Key Design Principles
- **Dual Brand Theming**: Warm earth tones for lentils, golden/amber for millets
- **Mobile-First**: Progressive web app approach
- **Performance**: <2s load times, perfect Core Web Vitals
- **SEO-Optimized**: Content-first strategy for organic growth

## Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled, comprehensive type coverage
- **Component Architecture**: Functional components with hooks
- **State Management**: To be chosen (Zustand/Redux Toolkit/Jotai)
- **Testing**: Jest + React Testing Library + Playwright E2E
- **Accessibility**: WCAG 2.1 compliance required

### File Structure
```
/Front-End/                 # Existing React components
  /components/              # UI components
    /ui/                    # shadcn/ui component library
  /styles/globals.css       # Custom CSS with brand variables
/Project Docs/              # Business requirements and planning
  /Claude PRD.md           # Complete product requirements
  /Development-Tasks-Roadmap.md  # Technical implementation plan
```

### Branch Strategy
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Individual features
- **hotfix/***: Critical fixes
- **release/***: Release preparation

### Content Strategy
- **Lentils Content**: Practical, family-oriented, quick cooking
- **Millets Content**: Premium, health-focused, educational
- **SEO Focus**: "how to cook lentils", "gluten-free grains", "ancient grains nutrition"

## Current Development Phase
**Phase 1: Foundation & Setup** (Weeks 1-2)
- Setting up Payload CMS + Next.js integration
- Implementing state management
- Establishing CI/CD pipeline

## Key Business Context

### Success Metrics
- Email conversion rate >15%
- Page load time <2 seconds
- Top 10 rankings for target keywords
- 25% month-over-month organic traffic growth

### Content Requirements
- 50+ recipe articles (dual product line focus)
- 25+ educational articles
- Professional food photography
- Nutritional comparison tools

### E-commerce Planning (Phase 2)
- Shopify integration for "Founder's Kit" launch
- Dual product line pricing strategies
- Cross-selling between lentils and millets

## Testing Requirements
- **Unit Tests**: >80% coverage for core features
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user journeys, mobile responsiveness
- **Accessibility Tests**: Screen reader compatibility, keyboard navigation
- **Performance Tests**: Load testing, Core Web Vitals validation

## Deployment Strategy
- **Staging**: Vercel preview deployments
- **Production**: Vercel Pro with custom domain
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Error tracking (Sentry), performance monitoring

## API Design
- **RESTful endpoints** for content management
- **GraphQL consideration** for flexible data fetching
- **API documentation** with OpenAPI/Swagger
- **Rate limiting** and caching strategies
- **Mobile app preparation** for Phase 3

## Authentication Strategy
- Evaluate: Auth0, Supabase, NextAuth.js
- Social logins: Google, Facebook, Apple
- Role-based access: Admin, Editor, User
- Secure session management

## Internationalization (i18n)
- Framework: next-i18next or similar
- Initial languages: English (primary)
- Future expansion: Spanish, French
- RTL language support planning

## Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # ESLint checking
npm run typecheck    # TypeScript validation

# Content Management
npm run payload      # Access Payload admin panel
npm run migrate      # Run database migrations
npm run seed         # Seed initial data
```

## Important Files to Reference
- `/Project Docs/Claude PRD.md` - Complete business requirements
- `/Project Docs/Development-Tasks-Roadmap.md` - Technical roadmap
- `/Front-End/App.tsx` - Main application component
- `/Front-End/styles/globals.css` - Brand styling and CSS variables

## Task Completion Tracking
**IMPORTANT**: Always update the Development-Tasks-Roadmap.md when completing tasks:

### Process for Task Completion
1. **When starting a task**: Change `- [ ]` to `- [🔄]` (in progress)
2. **When completing a task**: Change `- [🔄]` to `- [✅]` (completed)
3. **Add completion details**: Include date and brief notes when marking complete

### Example Task Updates
```markdown
// Before starting
- [ ] Set up Neon PostgreSQL database

// When starting work
- [🔄] Set up Neon PostgreSQL database

// When completed
- [✅] Set up Neon PostgreSQL database (Completed 2025-01-24: Database configured with dual product line schemas)
```

### Roadmap File Location
`/Users/cdkm2/Lentils and Millets/Project Docs/Development-Tasks-Roadmap.md`

**Always update this file immediately after completing any development task.**

## Context for AI Assistance
When working on this project:
1. **Always consider dual product line strategy** - every feature should work for both lentils and millets
2. **Prioritize performance and SEO** - this is a content-first business
3. **Follow accessibility best practices** - inclusive design is required
4. **Consider mobile experience** - majority of users will be on mobile
5. **Maintain brand consistency** - use established color schemes and typography
6. **Think long-term** - architecture should scale to e-commerce and mobile phases
7. **Update task completion** - Mark tasks as completed in Development-Tasks-Roadmap.md immediately

## Quick Reference
- **Primary Colors**: Lentils (#c7511f), Millets (#f39c12)
- **Typography**: Inter (body), Playfair Display (headings)
- **Target Load Time**: <2 seconds
- **Mobile Breakpoint**: 768px
- **Database**: PostgreSQL on Neon
- **CDN**: Vercel Blob Storage

---

*This file should be updated as the project evolves. Always reference the latest PRD and roadmap documents for detailed requirements.*