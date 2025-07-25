# Manual GitHub Project Board Setup Guide
**Alternative to GitHub CLI - Web Interface Instructions**

## Step 1: Create Labels

Go to: https://github.com/cdkodi/lentilsandmillets/labels

Click **"New label"** and create these labels:

### Phase Labels:
| Name | Color | Description |
|------|-------|-------------|
| `phase-1-foundation` | `#0052cc` (blue) | Phase 1: Foundation & Setup |
| `phase-2-core` | `#fbca04` (yellow) | Phase 2: Core Features |
| `phase-3-advanced` | `#0e8a16` (green) | Phase 3: Advanced Features |
| `phase-4-ecommerce` | `#5319e7` (purple) | Phase 4: E-commerce Prep |
| `phase-5-testing` | `#d93f0b` (red) | Phase 5: Testing & QA |
| `phase-6-deployment` | `#f9d0c4` (orange) | Phase 6: Deployment & Launch |
| `phase-7-optimization` | `#006b75` (teal) | Phase 7: Post-Launch Optimization |

### Type Labels:
| Name | Color | Description |
|------|-------|-------------|
| `frontend` | `#1d76db` (light blue) | Frontend development tasks |
| `backend` | `#0052cc` (dark blue) | Backend development tasks |
| `devops` | `#5a6c7d` (gray) | DevOps and infrastructure tasks |
| `testing` | `#d93f0b` (red) | Testing and QA tasks |

### Product Line Labels:
| Name | Color | Description |
|------|-------|-------------|
| `lentils` | `#c7511f` (orange) | Lentils product line |
| `millets` | `#f39c12` (yellow) | Millets product line |

### Priority Labels:
| Name | Color | Description |
|------|-------|-------------|
| `high-priority` | `#d93f0b` (red) | High priority tasks |
| `medium-priority` | `#fbca04` (yellow) | Medium priority tasks |
| `low-priority` | `#0e8a16` (green) | Low priority tasks |

---

## Step 2: Create Milestones

Go to: https://github.com/cdkodi/lentilsandmillets/milestones

Click **"New milestone"** and create:

1. **Phase 1 Complete**
   - Description: "Foundation & Setup completion"
   - Due date: 2 weeks from today

2. **Phase 2 Complete**
   - Description: "Core Features completion" 
   - Due date: 6 weeks from today

3. **Phase 3 Complete**
   - Description: "Advanced Features completion"
   - Due date: 10 weeks from today

---

## Step 3: Create Project Board

Go to: https://github.com/cdkodi/lentilsandmillets/projects

1. Click **"New project"**
2. Select **"Board"** template
3. Name: **"Lentils & Millets Development Roadmap"**
4. Description: "Task tracking for lentilsandmillets.com development"
5. Click **"Create project"**

### Configure Columns:
Replace default columns with:
- **📋 Backlog** - All planned tasks from roadmap
- **🔄 In Progress** - Currently active tasks  
- **👀 Review** - Tasks awaiting review/testing
- **✅ Done** - Completed tasks
- **🔄 Deferred** - Tasks postponed for later phases

---

## Step 4: Create First Phase Issues

Go to: https://github.com/cdkodi/lentilsandmillets/issues

Click **"New issue"** and create these issues:

### Issue 1: Development Environment Setup
```
Title: [TASK 1.2] Development Environment Setup

Labels: phase-1-foundation, devops, high-priority, task
Milestone: Phase 1 Complete

Description:
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

### Issue 2: Payload CMS + Next.js Integration
```
Title: [TASK 2.1] Payload CMS + Next.js Integration

Labels: phase-1-foundation, backend, high-priority, task
Milestone: Phase 1 Complete

Description:
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

### Issue 3: Database Configuration
```
Title: [TASK 2.2] Database Configuration - Neon PostgreSQL Setup

Labels: phase-1-foundation, backend, high-priority, task
Milestone: Phase 1 Complete

Description:
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

## Step 5: Add Issues to Project Board

1. Go to your newly created project board
2. Click **"Add items"** 
3. Search for the issues you just created
4. Add them to the **📋 Backlog** column
5. Assign them to yourself
6. Set any additional fields you configured

---

## Step 6: Configure Automation (Optional)

In your project board settings:
1. Go to **"Workflows"**
2. Set up these automations:
   - **Item added to project** → Move to "Backlog"
   - **Item reopened** → Move to "Backlog"  
   - **Pull request merged** → Move to "Done"

---

This manual setup will give you the same professional project board without needing GitHub CLI. You can create additional issues as needed using the templates provided!