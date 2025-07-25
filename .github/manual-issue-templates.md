# Manual Issue Creation Templates

## Issue 1: Development Environment Setup

**Title:** `[TASK 1.2] Development Environment Setup`

**Labels:** Select: `phase-1-foundation`, `devops`, `high-priority`, `task`

**Milestone:** Select: `Phase 1 Complete`

**Description:**
```
## Task Reference
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
- [ ] Task marked as completed in Development-Tasks-Roadmap.md
```

---

## Issue 2: Payload CMS Integration

**Title:** `[TASK 2.1] Payload CMS + Next.js Integration`

**Labels:** Select: `phase-1-foundation`, `backend`, `high-priority`, `task`, `lentils`, `millets`

**Milestone:** Select: `Phase 1 Complete`

**Description:**
```
## Task Reference
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
- [ ] Task marked as completed in Development-Tasks-Roadmap.md
```

---

## Issue 3: Database Configuration

**Title:** `[TASK 2.2] Database Configuration - Neon PostgreSQL Setup`

**Labels:** Select: `phase-1-foundation`, `backend`, `high-priority`, `task`

**Milestone:** Select: `Phase 1 Complete`

**Description:**
```
## Task Reference
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
- [ ] Task marked as completed in Development-Tasks-Roadmap.md
```

---

## Instructions:
1. Go to https://github.com/cdkodi/lentilsandmillets/issues
2. Click "New issue" for each template above
3. Copy the title, select the labels/milestone, and paste the description
4. Click "Submit new issue"
5. Repeat for all 3 issues

Once all 3 issues are created, you can add them to your project board!