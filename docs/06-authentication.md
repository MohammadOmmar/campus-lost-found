# Authentication Design — Campus Lost & Found

## Auth Methods

| Method | Status | Notes |
|--------|--------|------- |
| Email/Password | Implemented | Primary and only method for MVP |
| Google OAuth | Future | Can be added through Supabase without restructuring |

## Auth Flow

```
User → /auth/login → Supabase Auth API → JWT Token + Session → Middleware validates
```

## Session Management

- Supabase handles session via HTTP-only cookies (using @supabase/ssr)
- Session automatically refreshes via Supabase SDK
- Middleware runs on every request to validate session
- Protected routes redirect to /auth/login if unauthenticated

## Registration Flow

1. User submits email, password, full name
2. Supabase sends confirmation email
3. User confirms email → account activated
4. Profile record auto-created via database trigger (with seeded campus_id)
5. User redirected to /dashboard

## Auth Implementation

Use Supabase Auth directly through @supabase/ssr utilities:

```
lib/supabase/
  client.ts      # Browser client
  server.ts      # Server client
  middleware.ts  # Middleware client
```

No custom AuthProvider abstraction. All auth operations go through the Supabase client directly.

## Protected Routes

| Route Pattern | Auth Required |
|---------------|---------------|
| / | No |
| /items | No |
| /items/[id] | No |
| /items/new | Yes |
| /items/[id]/edit | Yes (owner) |
| /items/[id]/claim | Yes (eligible) |
| /items/[id]/matches | Yes (owner) |
| /dashboard | Yes |
| /dashboard/* | Yes |
| /auth/* | No (redirect if authenticated) |

## Middleware

The middleware file at src/middleware.ts:
- Runs on every request
- Validates the Supabase session
- Redirects unauthenticated users away from protected routes
- Redirects authenticated users away from auth pages
