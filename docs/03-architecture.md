# Application Architecture — Campus Lost & Found

## High-Level Architecture

Next.js 14 App Router with Supabase backend, deployed to Vercel.

## Layer Breakdown

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Frontend | Next.js App Router, React Server Components | UI rendering, routing, data fetching |
| Styling | Tailwind CSS, shadcn/ui | Consistent, accessible UI components |
| State | React hooks, URL search params | Client-side state, server state via Supabase |
| Validation | Zod | Input validation on client and server |
| Backend | Next.js Server Actions | Mutations, business logic |
| Database | Supabase PostgreSQL | Data persistence, RLS |
| Auth | Supabase Auth (direct via @supabase/ssr) | Authentication, session management |
| Storage | Supabase Storage | Image uploads |
| Deployment | Vercel | Hosting, CI/CD, edge functions |

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Server Components by default | Less JS, better performance, direct DB access |
| Server Actions for mutations | Type-safe, validated, no separate API layer |
| Supabase client for queries | Simple, no ORM overhead for this scale |
| Middleware for auth | Centralized route protection |
| No Prisma | Supabase client sufficient, less abstraction |
| No Redis | Not needed at MVP scale |
| No microservices | Solo developer, single codebase |
| Isolated matching module | Testable, replaceable if AI added later |
| Direct Supabase Auth usage | Simple, no custom provider abstraction needed |

## Authentication Approach

Use Supabase Auth directly through `@supabase/ssr` utilities. No custom AuthProvider abstraction. Google OAuth can be added in the future through Supabase's built-in OAuth support without restructuring.

## Server vs Client Component Strategy

| Scenario | Component Type | Reason |
|----------|---------------|--------|
| Display data from DB | Server | Direct DB query, no JS bundle |
| Static UI elements | Server | No interactivity needed |
| Forms | Client | State, validation, submission |
| Search/filters | Client | URL state management |
| Navigation menu | Client | Mobile toggle, auth state |
| Image upload | Client | File handling, preview |
| Modals/dialogs | Client | Open/close state |

## File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── items/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── edit/page.tsx
│   │       ├── claim/page.tsx
│   │       └── matches/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── items/page.tsx
│   │   ├── claims/page.tsx
│   │   └── received/page.tsx
│   └── auth/
│       ├── login/page.tsx
│       ├── register/page.tsx
│       ├── forgot-password/page.tsx
│       └── callback/route.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── items/
│   ├── claims/
│   ├── matching/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── validations/
│   │   ├── item.ts
│   │   ├── claim.ts
│   │   └── auth.ts
│   ├── matching/
│   │   ├── engine.ts
│   │   ├── scoring.ts
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── tests/
│   │       └── scoring.test.ts
│   └── utils.ts
├── actions/
│   ├── items.ts
│   ├── claims.ts
│   └── auth.ts
└── middleware.ts
```
