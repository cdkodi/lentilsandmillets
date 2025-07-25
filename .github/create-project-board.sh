#!/bin/bash

# GitHub Project Board Creation Script for Lentils & Millets
# This script helps create issues and milestones for the project board

echo "🌾 Lentils & Millets - GitHub Project Board Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository details
REPO_OWNER="cdkodi"
REPO_NAME="lentilsandmillets"

echo -e "${BLUE}Repository:${NC} https://github.com/$REPO_OWNER/$REPO_NAME"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error:${NC} GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Please login to GitHub CLI:${NC}"
    gh auth login
fi

echo -e "${GREEN}✅ GitHub CLI is ready${NC}"
echo ""

# Create labels
echo -e "${BLUE}📋 Creating labels...${NC}"

# Phase labels
gh label create "phase-1-foundation" --color "0052cc" --description "Phase 1: Foundation & Setup" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-1-foundation already exists"
gh label create "phase-2-core" --color "fbca04" --description "Phase 2: Core Features" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-2-core already exists"
gh label create "phase-3-advanced" --color "0e8a16" --description "Phase 3: Advanced Features" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-3-advanced already exists"
gh label create "phase-4-ecommerce" --color "5319e7" --description "Phase 4: E-commerce Prep" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-4-ecommerce already exists"
gh label create "phase-5-testing" --color "d93f0b" --description "Phase 5: Testing & QA" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-5-testing already exists"
gh label create "phase-6-deployment" --color "f9d0c4" --description "Phase 6: Deployment & Launch" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-6-deployment already exists"
gh label create "phase-7-optimization" --color "006b75" --description "Phase 7: Post-Launch Optimization" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label phase-7-optimization already exists"

# Type labels
gh label create "frontend" --color "1d76db" --description "Frontend development tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label frontend already exists"
gh label create "backend" --color "0052cc" --description "Backend development tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label backend already exists"
gh label create "devops" --color "5a6c7d" --description "DevOps and infrastructure tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label devops already exists"
gh label create "testing" --color "d93f0b" --description "Testing and QA tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label testing already exists"

# Product line labels
gh label create "lentils" --color "c7511f" --description "Lentils product line" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label lentils already exists"
gh label create "millets" --color "f39c12" --description "Millets product line" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label millets already exists"

# Priority labels
gh label create "high-priority" --color "d93f0b" --description "High priority tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label high-priority already exists"
gh label create "medium-priority" --color "fbca04" --description "Medium priority tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label medium-priority already exists"
gh label create "low-priority" --color "0e8a16" --description "Low priority tasks" --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null || echo "Label low-priority already exists"

echo -e "${GREEN}✅ Labels created${NC}"
echo ""

# Create milestones
echo -e "${BLUE}🎯 Creating milestones...${NC}"

gh api repos/$REPO_OWNER/$REPO_NAME/milestones -X POST -f title="Phase 1 Complete" -f description="Foundation & Setup completion" -f due_on="$(date -d '+2 weeks' -Iseconds)" 2>/dev/null || echo "Milestone Phase 1 Complete may already exist"
gh api repos/$REPO_OWNER/$REPO_NAME/milestones -X POST -f title="Phase 2 Complete" -f description="Core Features completion" -f due_on="$(date -d '+6 weeks' -Iseconds)" 2>/dev/null || echo "Milestone Phase 2 Complete may already exist"
gh api repos/$REPO_OWNER/$REPO_NAME/milestones -X POST -f title="Phase 3 Complete" -f description="Advanced Features completion" -f due_on="$(date -d '+10 weeks' -Iseconds)" 2>/dev/null || echo "Milestone Phase 3 Complete may already exist"

echo -e "${GREEN}✅ Milestones created${NC}"
echo ""

# Instructions for manual steps
echo -e "${YELLOW}📋 Next Steps (Manual):${NC}"
echo ""
echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/projects"
echo "2. Click 'New project'"
echo "3. Select 'Board' template"
echo "4. Name: 'Lentils & Millets Development Roadmap'"
echo "5. Add columns: 📋 Backlog, 🔄 In Progress, 👀 Review, ✅ Done, 🔄 Deferred"
echo ""
echo "6. Create issues using the templates in .github/project-templates/phase-1-issues.md"
echo ""
echo -e "${GREEN}✅ Setup script completed!${NC}"
echo ""
echo -e "${BLUE}📁 Generated files:${NC}"
echo "  - .github/project-board-setup.md (detailed setup guide)"
echo "  - .github/project-templates/phase-1-issues.md (ready-to-create issues)"
echo "  - .github/create-project-board.sh (this script)"
echo ""
echo -e "${YELLOW}⚡ Pro tip:${NC} Use the issue templates in .github/ISSUE_TEMPLATE/ when creating new issues"