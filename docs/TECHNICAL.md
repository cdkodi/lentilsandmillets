# Technical Documentation
## Lentils & Millets Platform - Card-Based CMS

---

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Next.js API Routes  
- **Database**: Neon PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel Pro

### Key Design Decisions

#### 1. Card-Based Content System
**Decision**: Use fixed card positions (H0-H19, L1-L8, M1-M8) instead of flexible content blocks
**Rationale**: 
- Ensures consistent layout across pages
- Prevents content placement errors
- Simplifies content management workflows
- Enables precise content strategy control

#### 2. Separate Tables for Articles vs Recipes  
**Decision**: Create distinct `articles` and `recipes` tables instead of unified content table
**Rationale**:
- Different data structures (recipes need ingredients, cooking times, etc.)
- Different admin interfaces and validation rules
- Better type safety and data integrity
- Easier to optimize queries for each content type

#### 3. PostgreSQL JSON Fields for Complex Data
**Decision**: Use JSONB for ingredients, instructions, and factoid data
**Rationale**:
- Flexible structure for recipe steps and ingredient lists
- Maintains relational benefits while allowing schema flexibility  
- Native PostgreSQL JSON support with indexing capabilities
- Easier to evolve data structures without migrations

#### 4. Direct PostgreSQL Integration (No CMS)
**Decision**: Replace Payload CMS with direct database queries
**Rationale**:
- 600x performance improvement observed in testing
- Full control over data structure and queries
- Reduced complexity and dependencies
- Custom admin interface tailored to card-based system

---

## System Components

### Database Layer
- **articles**: Educational content with factoid display options
- **recipes**: Cooking instructions with ingredients and nutrition data
- **Content validation**: Database constraints prevent invalid card assignments

### API Layer  
- **RESTful endpoints**: Content CRUD operations
- **Card position API**: Fetch content by card position and page
- **Validation middleware**: Enforce card assignment rules

### Frontend Components
- **Card Components**: Reusable card displays for different content types
- **Admin Interface**: Grid-based content management
- **Content Display**: Dynamic rendering based on card assignments

### Admin Interface
- **Simple Grid View**: Visual representation of all 36 card positions
- **Smart Dropdowns**: Filtered by content type and category rules
- **Real-time Validation**: Prevent invalid content assignments

---

## Performance Considerations

### Database Optimization
- **Indexed fields**: card_position, category, status, published_at
- **Query optimization**: Fetch only required fields for card displays
- **Connection pooling**: Neon PostgreSQL with connection limits

### Caching Strategy
- **Static content**: Cache published articles and recipes
- **Card content**: Cache card position queries for fast page loads
- **Image optimization**: Use Vercel Image Optimization

### Loading Strategy
- **Incremental loading**: Load above-the-fold cards first
- **Lazy loading**: Load remaining cards as user scrolls
- **Prefetching**: Preload linked article/recipe content

---

## Development Workflow

### Code Organization
```
/src
  /components
    /admin         # Admin interface components
    /cards         # Card display components
    /ui            # shadcn/ui components
  /pages/api       # API endpoints
  /utils           # Utility functions
  /types           # TypeScript type definitions
/docs              # Technical documentation
```

### Database Migrations
- Use raw SQL files for schema changes
- Version controlled migration scripts
- Rollback procedures documented

### Testing Strategy
- **Unit tests**: Card validation logic, API endpoints
- **Integration tests**: Database operations, content assignment
- **E2E tests**: Admin interface workflows, content display

---

## Security Considerations

### Data Validation
- **Input sanitization**: All user inputs sanitized
- **Content validation**: Enforce card assignment rules at API level
- **SQL injection protection**: Use parameterized queries

### Access Control
- **Admin authentication**: Secure admin interface access
- **Role-based permissions**: Content creators vs administrators
- **API security**: Rate limiting and authentication

---

## Deployment Strategy

### Environment Configuration
- **Development**: Local PostgreSQL + Next.js dev server
- **Staging**: Neon PostgreSQL + Vercel preview deployments  
- **Production**: Neon PostgreSQL + Vercel Pro

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Database migrations**: Run automatically on deployment
- **Environment variables**: Secure secret management

---

## Monitoring & Analytics

### Application Monitoring
- **Error tracking**: Monitor API errors and validation failures
- **Performance monitoring**: Track page load times and database query performance
- **User analytics**: Track content engagement and card click-through rates

### Content Analytics
- **Card performance**: Track which card positions get most engagement
- **Content effectiveness**: Monitor article vs recipe performance
- **A/B testing**: Test different content in same card positions

---

## Future Enhancements

### Phase 2: Enhanced Admin Interface
- **Drag-and-drop**: Visual card reordering
- **Bulk operations**: Multi-card content assignment
- **Live preview**: Real-time website preview during content management

### Phase 3: Advanced Features
- **Content scheduling**: Auto-publish at specified times
- **Version control**: Track content changes and rollback capability
- **Workflow management**: Editorial review process

### Phase 4: Analytics Integration
- **Content recommendations**: AI-suggested content for card positions
- **Performance optimization**: Auto-optimize card assignments based on engagement
- **User personalization**: Dynamic content based on user behavior

---

*Last updated: January 2025*