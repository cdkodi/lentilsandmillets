# Lentils & Millets 🌾

**Premium organic lentils and ancient millets for modern healthy living**

[![CI/CD Pipeline](https://github.com/cdkodi/lentilsandmillets/actions/workflows/ci.yml/badge.svg)](https://github.com/cdkodi/lentilsandmillets/actions/workflows/ci.yml)
[![Deploy to Production](https://github.com/cdkodi/lentilsandmillets/actions/workflows/deploy.yml/badge.svg)](https://github.com/cdkodi/lentilsandmillets/actions/workflows/deploy.yml)

## 🎯 Project Overview

A comprehensive web platform dedicated to lentils and millets education, recipes, and e-commerce. Built with a dual product line strategy:

- **Lentils**: Practical, protein-focused, family-oriented content
- **Millets**: Premium ancient superfood, health-conscious positioning

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Next.js 14
- **Backend**: Payload CMS 3.0
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS + shadcn/ui
- **Hosting**: Vercel Pro
- **State Management**: TBD (Zustand/Redux Toolkit)

## 📁 Project Structure

```
├── Front-End/                 # React components and frontend code
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui component library
│   │   └── figma/           # Design system components
│   └── styles/              # Global styles and CSS variables
├── Project Docs/            # Business requirements and planning
│   ├── Claude PRD.md       # Product Requirements Document
│   └── Development-Tasks-Roadmap.md  # Technical roadmap
├── .github/                 # GitHub configuration
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── workflows/          # CI/CD workflows
├── CLAUDE.md               # AI assistant context file
└── README.md               # This file
```

## 🎨 Design System

### Brand Colors
- **Lentils**: `#c7511f` (warm earth tones)
- **Millets**: `#f39c12` (golden/amber palette)

### Typography
- **Body**: Inter (system font)
- **Headings**: Playfair Display (serif)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/cdkodi/lentilsandmillets.git
cd lentilsandmillets

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript checks
npm run test        # Run test suite
```

## 📋 Development Phases

### Phase 1: Foundation & Setup (Weeks 1-2)
- [🔄] Repository setup and GitHub configuration
- [ ] Payload CMS + Next.js integration
- [ ] State management implementation

### Phase 2: Core Features (Weeks 3-6)
- [ ] API design and documentation
- [ ] Authentication system
- [ ] Content management features
- [ ] Search and discovery

### Phase 3: Advanced Features (Weeks 7-10)
- [ ] Email marketing integration
- [ ] Analytics and SEO optimization
- [ ] Internationalization setup

*See [Development-Tasks-Roadmap.md](Project%20Docs/Development-Tasks-Roadmap.md) for complete roadmap*

## 🌟 Key Features

### Dual Product Line Strategy
- Separate branding and positioning for lentils vs millets
- Cross-product recommendations
- Unified user experience with distinct themes

### Content Management
- Recipe database with nutritional information
- Educational articles and guides
- SEO-optimized content structure
- Multi-media support

### Performance & Accessibility
- <2 second load times
- Perfect Core Web Vitals
- WCAG 2.1 accessibility compliance
- Mobile-first responsive design

## 🚦 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Update task status in Development-Tasks-Roadmap.md
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Individual features
- `hotfix/*`: Critical fixes
- `release/*`: Release preparation

## 📊 Success Metrics

- **Performance**: Page load time <2s, Core Web Vitals green
- **SEO**: Top 10 rankings for target keywords
- **Engagement**: >2 pages per session, >2 minute session duration
- **Conversion**: >15% email signup rate

## 🔗 Links

- **Production**: TBD (will be updated on first deployment)
- **Staging**: TBD (Vercel preview deployments)
- **Project Board**: [GitHub Issues](https://github.com/cdkodi/lentilsandmillets/issues)
- **Documentation**: [Project Docs](Project%20Docs/)

## 📞 Support

For questions, issues, or contributions:
- Create an [issue](https://github.com/cdkodi/lentilsandmillets/issues)
- Reference the [CLAUDE.md](CLAUDE.md) file for AI development context
- Check [Development-Tasks-Roadmap.md](Project%20Docs/Development-Tasks-Roadmap.md) for current priorities

---

**Made with ❤️ for healthy living and sustainable nutrition**
