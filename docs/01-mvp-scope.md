# MVP Scope — Campus Lost & Found

## Core Workflow

```
Report lost/found item → Browse/Search → Discover possible match → Submit claim → Verify → Mark returned/resolved
```

## In Scope for MVP

### Authentication
- User registration with email/password
- User login with email/password
- Google OAuth login
- Password reset via email
- Session management with route protection

### Items
- Report a lost item (title, description, category, location, date, photo)
- Report a found item (title, description, category, location, date, photo)
- Browse all items in a searchable, filterable grid
- View item detail page with full information
- Edit your own reported items
- Delete your own reported items
- Image upload (single image per item, max 5MB)

### Claims
- Submit a claim on a found item (with proof of ownership description)
- View claims on items you reported
- Approve or reject claims on your found items
- Mark an item as returned/resolved

### User Experience
- Responsive design (mobile-first)
- Dashboard with overview of user's items and claims
- Search items by keyword
- Filter items by type (lost/found), category, and status
- Status badges and visual indicators
- Loading states and empty states
- Success/error toast notifications

### Technical
- Next.js 14 App Router with TypeScript
- Tailwind CSS + shadcn/ui for styling
- Supabase PostgreSQL for data persistence
- Supabase Auth for authentication
- Supabase Storage for image uploads
- Zod for input validation (client + server)
- Row Level Security (RLS) for data protection
- Server Actions for mutations
- Vercel for deployment

## Out of Scope

See [11-excluded-features.md](./11-excluded-features.md) for the complete list of features explicitly excluded from MVP.

## Success Criteria

- A user can register, report a lost item, and another user can find it, submit a claim, and get it returned — all without developer intervention
- The application is fully functional on mobile devices
- All user inputs are validated on both client and server
- Unauthorized users cannot access protected routes or perform actions on others' data
- The application loads in under 3 seconds on a standard connection
