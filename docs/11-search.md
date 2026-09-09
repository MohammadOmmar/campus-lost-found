# Search & Filtering — Campus Lost & Found

## Overview

Server-side search and filtering using URL query parameters with pagination.

## URL Parameter Schema

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| q | string | q=earbuds | Keyword search |
| type | string | type=lost | Filter by type (LOST/FOUND) |
| category | string | category=electronics | Filter by category |
| status | string | status=open | Filter by status |
| date_from | string | date_from=2024-01-01 | Start date |
| date_to | string | date_to=2024-12-31 | End date |
| page | number | page=2 | Page number |
| limit | number | limit=12 | Items per page |

## Example URLs

```
/items                                    → All items, page 1
/items?q=earbuds                          → Search for "earbuds"
/items?type=lost&category=electronics     → Lost electronics
/items?type=found&status=open&page=2      → Open found items, page 2
/items?date_from=2024-01-01&date_to=2024-06-30 → Items from first half of 2024
```

## Search Implementation

Uses PostgreSQL ILIKE for case-insensitive pattern matching:

```typescript
// Server-side search in Server Component
const { data: items, count } = await supabase
  .from('items')
  .select('*', { count: 'exact' })
  .eq('type', type)
  .eq('category', category)
  .ilike('title', `%${q}%`)
  .or(`description.ilike.%${q}%,location.ilike.%${q}%`)
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1);
```

## Empty Parameter Handling

- Empty or missing parameters are safely ignored
- ILIKE with empty string returns all rows (no filtering)
- Invalid enum values are ignored (fall back to no filter)
- Invalid dates are ignored

## Pagination

- Server-side pagination with LIMIT and OFFSET
- Default: 12 items per page
- Maximum: 50 items per page
- Response includes: data, page, limit, total, totalPages

## Filters

| Filter | Type | Options |
|--------|------|---------|
| Type | Select | All, LOST, FOUND |
| Category | Select | All categories |
| Status | Select | All, OPEN, CLAIMED, RETURNED, CLOSED |
| Date range | Date picker | From/To dates |

## Search Fields

Keyword search (q parameter) searches across:
- title
- location

Description is not searched by default to keep results relevant. This may be adjusted based on user feedback.
