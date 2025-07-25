#!/bin/bash

# GitHub Issues Creation via REST API
# For Lentils & Millets Project

echo "🌾 Creating GitHub Issues via REST API"
echo "======================================"

REPO_OWNER="cdkodi"
REPO_NAME="lentilsandmillets"
API_BASE="https://api.github.com/repos/$REPO_OWNER/$REPO_NAME"

# Check if token is available
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ GITHUB_PERSONAL_ACCESS_TOKEN is not set"
    exit 1
fi

echo "✅ Using GitHub token for authentication"

# Function to create labels
create_label() {
    local name=$1
    local color=$2
    local description=$3
    
    echo "Creating label: $name"
    curl -s -X POST "$API_BASE/labels" \
        -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{\"name\":\"$name\",\"color\":\"$color\",\"description\":\"$description\"}" > /dev/null
}

# Function to create milestones
create_milestone() {
    local title=$1
    local description=$2
    local due_date=$3
    
    echo "Creating milestone: $title"
    curl -s -X POST "$API_BASE/milestones" \
        -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{\"title\":\"$title\",\"description\":\"$description\",\"due_on\":\"$due_date\"}" > /dev/null
}

# Function to create issues
create_issue() {
    local title=$1
    local body=$2
    local labels=$3
    local milestone=$4
    
    echo "Creating issue: $title"
    curl -s -X POST "$API_BASE/issues" \
        -H "Authorization: token $GITHUB_PERSONAL_ACCESS_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -d "{\"title\":\"$title\",\"body\":\"$body\",\"labels\":[$labels],\"milestone\":$milestone}" > /dev/null
}

echo "🏷️  Creating labels..."

# Phase labels
create_label "phase-1-foundation" "0052cc" "Phase 1: Foundation & Setup"
create_label "phase-2-core" "fbca04" "Phase 2: Core Features"
create_label "phase-3-advanced" "0e8a16" "Phase 3: Advanced Features"

# Type labels
create_label "frontend" "1d76db" "Frontend development tasks"
create_label "backend" "0052cc" "Backend development tasks"
create_label "devops" "5a6c7d" "DevOps and infrastructure tasks"
create_label "task" "7057ff" "Development task from roadmap"

# Product line labels
create_label "lentils" "c7511f" "Lentils product line"
create_label "millets" "f39c12" "Millets product line"

# Priority labels
create_label "high-priority" "d93f0b" "High priority tasks"
create_label "medium-priority" "fbca04" "Medium priority tasks"

echo "🎯 Creating milestones..."

# Calculate due dates (2 weeks from now for Phase 1)
DUE_DATE_PHASE1=$(date -d "+2 weeks" -Iseconds)

create_milestone "Phase 1 Complete" "Foundation & Setup completion" "$DUE_DATE_PHASE1"

echo "📋 Creating Phase 1 issues..."

# Issue 1: Development Environment Setup
ISSUE1_BODY="## Task Reference
- **Phase**: Phase 1: Foundation & Setup
- **Section**: 1. Project Infrastructure  
- **Task**: 1.2 Development Environment

## Acceptance Criteria
- [ ] 1.2.1 Set up local development environment documentation
- [ ] 1.2.2 Configure VS Code workspace settings
- [ ] 1.2.3 Set up environment variables template (COMPLETED - .env.example created)
- [ ] 1.2.4 Create Docker development containers (optional)

## Definition of Done
- [ ] Documentation created for local setup
- [ ] VS Code workspace configured with recommended extensions
- [ ] Environment setup tested and verified
- [ ] Task marked as completed in Development-Tasks-Roadmap.md"

create_issue "[TASK 1.2] Development Environment Setup" "$ISSUE1_BODY" "\"phase-1-foundation\",\"devops\",\"high-priority\",\"task\"" 1

# Issue 2: Payload CMS Integration
ISSUE2_BODY="## Task Reference
- **Phase**: Phase 1: Foundation & Setup
- **Section**: 2. Backend Architecture Setup
- **Task**: 2.1 Payload CMS + Next.js Integration

## Acceptance Criteria
- [ ] 2.1.1 Initialize Next.js 14 project with Payload 3.0
- [ ] 2.1.2 Configure Payload admin panel
- [ ] 2.1.3 Set up dual product line content models (lentils/millets)
- [ ] 2.1.4 Configure TypeScript types for content structures
- [ ] 2.1.5 Set up authentication and permissions

## Dependencies
- Development Environment Setup (1.2)
- Database Configuration (2.2)

## Definition of Done
- [ ] Next.js 14 + Payload 3.0 successfully integrated
- [ ] Admin panel accessible and functional
- [ ] Content models support dual product line strategy
- [ ] TypeScript types generated and working
- [ ] Basic authentication implemented
- [ ] Task marked as completed in Development-Tasks-Roadmap.md"

create_issue "[TASK 2.1] Payload CMS + Next.js Integration" "$ISSUE2_BODY" "\"phase-1-foundation\",\"backend\",\"high-priority\",\"task\",\"lentils\",\"millets\"" 1

# Issue 3: Database Configuration
ISSUE3_BODY="## Task Reference
- **Phase**: Phase 1: Foundation & Setup
- **Section**: 2. Backend Architecture Setup
- **Task**: 2.2 Database Configuration

## Acceptance Criteria
- [ ] 2.2.1 Set up Neon PostgreSQL database
- [ ] 2.2.2 Configure database schemas for dual product lines
- [ ] 2.2.3 Set up migrations and seeding scripts
- [ ] 2.2.4 Implement backup and recovery procedures

## Technical Requirements
- PostgreSQL database on Neon platform
- Dual product line schema design (lentils/millets)
- Migration scripts for schema updates
- Initial seed data for testing

## Definition of Done
- [ ] Neon PostgreSQL database created and accessible
- [ ] Database schemas designed for dual product lines
- [ ] Migration system configured and tested
- [ ] Backup procedures documented and tested
- [ ] Connection from Next.js/Payload verified
- [ ] Task marked as completed in Development-Tasks-Roadmap.md"

create_issue "[TASK 2.2] Database Configuration - Neon PostgreSQL Setup" "$ISSUE3_BODY" "\"phase-1-foundation\",\"backend\",\"high-priority\",\"task\"" 1

echo ""
echo "✅ GitHub Issues Creation Complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://github.com/$REPO_OWNER/$REPO_NAME/issues to see your new issues"
echo "2. Go to https://github.com/$REPO_OWNER/$REPO_NAME/projects to create your project board"
echo "3. Add the issues to your project board columns"
echo ""
echo "📊 Created:"
echo "  - 9 labels (phases, types, priorities)"
echo "  - 1 milestone (Phase 1 Complete)"
echo "  - 3 issues (Development Environment, Payload CMS, Database)"