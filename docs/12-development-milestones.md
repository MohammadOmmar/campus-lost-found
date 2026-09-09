# Development Milestones — Campus Lost & Found

## Development Discipline

Implement one milestone at a time. After each milestone:
1. Inspect existing code
2. Implement only that milestone
3. Run lint
4. Run TypeScript checks
5. Run tests
6. Run production build
7. Fix failures
8. Summarize changes
9. STOP

Do not proceed to the next milestone automatically.

## Phase 1: Foundation

**Goal:** Project setup, auth, database, layout

### Tasks
- Initialize Next.js project with TypeScript + Tailwind
- Install and configure shadcn/ui
- Set up Supabase project
- Create Supabase clients (browser, server, middleware)
- Create database schema (all tables, indexes, RLS)
- Seed categories and one campus
- Implement auth (login, register, logout, password reset)
- Create middleware for route protection
- Build layout (Navbar, Footer)
- Create auth pages (login, register, forgot password)

### Deliverable
Working auth flow, protected routes, empty pages

## Phase 2: Items CRUD

**Goal:** Item management

### Tasks
- Build item creation form with image upload
- Build item detail page
- Build item grid with server-side search/filter/pagination
- Build item edit form
- Build item deletion with confirmation
- Implement private verification detail field
- Build home page with recent items

### Deliverable
Users can report, browse, search, and manage items

## Phase 3: Matching Engine

**Goal:** Deterministic matching

### Tasks
- Build matching module (scoring functions)
- Build matching engine (orchestration)
- Write unit tests for scoring
- Build matches page (item detail to view matches)
- Build match card and score display
- Integrate matching into item detail page

### Deliverable
Users can see potential matches with scores

## Phase 4: Claims System

**Goal:** Claims workflow

### Tasks
- Build claim submission form
- Build claims list on item detail (owner view)
- Build Received Claims dashboard page
- Implement approve/reject claim action
- Implement mark item as returned
- Add claim privacy controls

### Deliverable
Full claims workflow functional

## Phase 5: Dashboard and Polish

**Goal:** User dashboard, UX improvements

### Tasks
- Build dashboard overview page
- Build My Items page
- Build My Claims page
- Add loading states (skeletons)
- Add empty states
- Add success/error toasts
- Responsive design pass
- Accessibility audit

### Deliverable
Polished, complete user experience

## Phase 6: Testing and Deployment

**Goal:** Quality assurance and launch

### Tasks
- Write critical path tests
- Manual testing on mobile devices
- Performance optimization
- SEO meta tags
- Deploy to Vercel
- Set up environment variables
- Final end-to-end testing

### Deliverable
Production-ready application
