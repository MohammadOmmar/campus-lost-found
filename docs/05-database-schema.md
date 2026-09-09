# Database Schema — Campus Lost & Found

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   campuses   │     │   profiles   │     │    items     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ campus_id(FK)│     │ id (PK)      │
│ name         │     │ id (PK, FK)  │────►│ user_id (FK) │
│ slug         │     │ email        │     │ campus_id(FK)│◄──┐
│ created_at   │     │ full_name    │     │ title        │   │
└──────────────┘     │ avatar_url   │     │ description  │   │
                     │ created_at   │     │ category     │   │
                     │ updated_at   │     │ type         │   │
                     └──────────────┘     │ status       │   │
                                          │ location     │   │
┌──────────────┐                          │ date_lost_   │   │
│  categories  │                          │   found      │   │
├──────────────┤                          │ image_url    │   │
│ id (PK)      │                          │ private_     │   │
│ name         │                          │   verification│  │
│ slug         │                          │ created_at   │   │
└──────────────┘                          │ updated_at   │   │
                                          └──────────────┘   │
                                                               │
┌──────────────┐                                               │
│   claims     │                                               │
├──────────────┤                                               │
│ id (PK)      │                                               │
│ item_id (FK) │                                               │
│ user_id (FK) │                                               │
│ proof        │                                               │
│ status       │                                               │
│ created_at   │                                               │
│ updated_at   │                                               │
└──────────────┘                                               │
                                                               │
         ┌─────────────────────────────────────────────────────┘
         │
         ▼
   campuses.id (items.campus_id → campuses.id)
```

## Table Definitions

### campuses

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | e.g., "University of Example" |
| slug | text | NOT NULL, UNIQUE | e.g., "university-of-example" |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |

**Seed data:** Exactly one campus for MVP.
### items

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| user_id | uuid | NOT NULL, FK → profiles.id | Reporter |
| campus_id | uuid | NOT NULL, FK → campuses.id | Item's campus |
| title | text | NOT NULL, 3-100 chars | Short description |
| description | text | NOT NULL, 10-1000 chars | Detailed description |
| category | text | NOT NULL | Category slug |
| type | text | NOT NULL | LOST or FOUND |
| status | text | NOT NULL, DEFAULT 'OPEN' | OPEN, CLAIMED, RETURNED, CLOSED |
| location | text | NOT NULL, 2-200 chars | Where item was lost/found |
| date_lost_found | date | NOT NULL | When item was lost/found |
| image_url | text | nullable | Primary image (optional) |
| private_verification | text | nullable, max 500 chars | Private detail for owner verification |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

### claims

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| item_id | uuid | NOT NULL, FK → items.id | Item being claimed |
| user_id | uuid | NOT NULL, FK → profiles.id | Claimant |
| proof | text | NOT NULL, 20-500 chars | Proof of ownership |
| status | text | NOT NULL, DEFAULT 'pending' | pending, approved, rejected |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

### categories

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | serial | PK | |
| name | text | NOT NULL, UNIQUE | Display name |
| slug | text | NOT NULL, UNIQUE | URL-friendly identifier |

**Seed data:**
- Electronics (electronics)
- Keys (keys)
- ID Cards (id-cards)
- Bags & Backpacks (bags)
- Clothing (clothing)
- Books & Notebooks (books)
- Jewelry & Watches (jewelry)
- Other (other)

## Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| profiles | idx_profiles_campus | campus_id | Filter by campus |
| items | idx_items_campus | campus_id | Filter by campus |
| items | idx_items_status | status | Filter active items |
| items | idx_items_type | type | Filter LOST vs FOUND |
| items | idx_items_category | category | Filter by category |
| items | idx_items_user | user_id | User's items |
| items | idx_items_created | created_at DESC | Sort by newest |
| items | idx_items_type_status | type, status | Common query pattern |
| claims | idx_claims_item | item_id | Claims on an item |
| claims | idx_claims_user | user_id | User's claims |
| claims | idx_claims_status | status | Filter by status |
| claims | idx_claims_item_user | item_id, user_id | Prevent duplicate claims |

## Profile Auto-Creation Trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_campus_id uuid;
BEGIN
  SELECT id INTO default_campus_id FROM public.campuses LIMIT 1;
  
  INSERT INTO public.profiles (id, email, full_name, campus_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    default_campus_id
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### profiles

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | uuid | PK, FK → auth.users.id | Cascade delete |
| email | text | NOT NULL | Denormalized from auth |
| full_name | text | NOT NULL | Display name |
| avatar_url | text | nullable | Profile photo |
| campus_id | uuid | NOT NULL, FK → campuses.id | User's campus |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

**Privacy:** No public SELECT policy. Users can only access/update their own profile. Profile information is only exposed through specific server-side operations for authorized claim workflows.
