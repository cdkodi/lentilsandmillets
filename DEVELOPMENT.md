# Development Environment Setup Guide
**Lentils & Millets Project Development Environment**

## 🎯 Overview
This guide will help you set up the complete development environment for the lentilsandmillets.com project, including Next.js 14, Payload CMS 3.0, and all required tools.

## 📋 System Requirements

### **Required Software**
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Cursor**: Latest version (VS Code fork - recommended IDE)

### **Current System Status**
✅ **Node.js**: v23.11.0 (Installed)  
✅ **npm**: v11.3.0 (Installed)  
✅ **Git**: Available  

## 🚀 Project Setup

### **1. Clone and Navigate**
```bash
# If not already cloned
git clone https://github.com/cdkodi/lentilsandmillets.git
cd lentilsandmillets

# Or navigate to existing project
cd "/Users/cdkm2/Lentils and Millets"
```

### **2. Environment Variables Setup**
```bash
# Copy the environment template
cp .env.example .env.local

# Edit the environment file with your specific values
cursor .env.local
```

**Required Environment Variables:**
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lentilsandmillets"
POSTGRES_URL="postgresql://username:password@localhost:5432/lentilsandmillets"

# Payload CMS Configuration
PAYLOAD_SECRET="your-super-secret-key-here"
PAYLOAD_CONFIG_PATH="src/payload.config.ts"

# Next.js Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# GitHub Personal Access Token (for MCP)
GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token_here"
```

### **3. Install Dependencies**
```bash
# Install project dependencies
npm install

# Install global development tools (if needed)
npm install -g @next/codemod
npm install -g @payloadcms/cli
```

## 🏗️ Tech Stack

### **Core Framework**
- **Frontend**: Next.js 14 with App Router
- **Backend**: Payload CMS 3.0
- **Database**: PostgreSQL (Neon)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui

### **Development Tools**
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions
- **Project Management**: GitHub Projects

## 🛠️ Development Workflow

### **Daily Development Commands**
```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm run test

# Build for production
npm run build
```

### **Code Quality Tools**
```bash
# Format code with Prettier
npm run format

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## 🎨 Dual Product Line Development

### **Brand Theme Development**
The project uses a dual product line strategy:

**Lentils Theme:**
- Primary Color: `#c7511f` (warm earth tones)
- Typography: Practical, family-oriented
- Content Focus: Quick cooking, protein benefits

**Millets Theme:** 
- Primary Color: `#f39c12` (golden/amber)
- Typography: Premium, health-focused
- Content Focus: Ancient superfood, gluten-free

### **Component Development Guidelines**
```typescript
// Always consider dual product line compatibility
interface ComponentProps {
  productLine?: 'lentils' | 'millets' | 'both';
  theme?: 'lentils' | 'millets' | 'neutral';
}
```

## 🗄️ Database Setup

### **Local PostgreSQL (Alternative to Neon)**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb lentilsandmillets

# Connect to database
psql lentilsandmillets
```

### **Neon PostgreSQL (Recommended)**
1. Sign up at: https://neon.tech
2. Create new project: "lentilsandmillets"
3. Copy connection string to `.env.local`
4. Test connection: `npm run db:test` (when available)

## 📦 Project Structure

```
lentilsandmillets/
├── Front-End/                 # Existing React components
│   ├── components/           # UI components
│   │   ├── ui/              # shadcn/ui components
│   │   └── figma/           # Design system components
│   └── styles/              # Global styles and CSS variables
├── src/                      # Next.js app (to be created)
│   ├── app/                 # App Router pages
│   ├── components/          # Shared components
│   ├── lib/                 # Utilities and configurations  
│   └── payload/             # Payload CMS configuration
├── .github/                  # GitHub workflows and templates
├── Project Docs/            # Business requirements and planning
├── CLAUDE.md               # AI assistant context
├── DEVELOPMENT.md          # This file
└── README.md               # Project overview
```

## 🧪 Testing Setup

### **Test Configuration**
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (when configured)
npm run test:e2e
```

### **Testing Strategy**
- **Unit Tests**: Components, utilities, API functions
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user journeys, dual product line flows
- **Accessibility Tests**: Screen reader compatibility, keyboard navigation

## 🚨 Troubleshooting

### **Common Issues**

**Node.js Version Conflicts:**
```bash
# Check Node.js version
node --version

# Use Node Version Manager if needed
nvm use 20
```

**Permission Issues:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Environment Variables Not Loading:**
```bash
# Ensure .env.local exists and has correct format
cat .env.local

# Restart development server after changes
```

## 🔧 IDE Configuration

### **Cursor Extensions (Recommended)**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens
- Auto Rename Tag
- Bracket Pair Colorizer

### **Cursor Settings**
Will be configured in Task 1.2.2 - Cursor workspace settings.

## 📊 Performance Monitoring

### **Development Metrics**
- **Build Time**: Target <30 seconds
- **Hot Reload**: Target <1 second
- **Type Checking**: Target <5 seconds
- **Linting**: Target <3 seconds

### **Production Targets**
- **Page Load Time**: <2 seconds
- **Core Web Vitals**: All green
- **Lighthouse Score**: >90 for all categories
- **Bundle Size**: <500KB initial load

## 🌐 Deployment Pipeline

### **Development → Staging → Production**
```bash
# Development
git push origin feature/branch-name
# → Triggers PR preview deployment

# Staging  
git push origin develop
# → Deploys to staging environment

# Production
git push origin main
# → Deploys to production (lentilsandmillets.com)
```

## 📚 Additional Resources

### **Documentation**
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Payload CMS 3.0 Documentation](https://payloadcms.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### **Project-Specific Resources**
- **PRD**: `Project Docs/Claude PRD.md` - Complete business requirements
- **Roadmap**: `Project Docs/Development-Tasks-Roadmap.md` - Technical roadmap
- **Context**: `CLAUDE.md` - AI development context and guidelines

---

**🌾 Ready to build the future of lentils & millets education and commerce!**

*Last updated: 2025-01-24*
*Next: Task 1.2.2 - VS Code workspace configuration*