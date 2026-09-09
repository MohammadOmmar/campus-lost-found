# Security & Privacy — Campus Lost & Found

## Security Measures

| Concern | Mitigation |
|---------|-----------|
| SQL Injection | Supabase parameterized queries + RLS |
| XSS | React auto-escapes; sanitize user content |
| CSRF | Supabase session tokens + SameSite cookies |
| Unauthorized access | RLS + Server Action authorization |
| Image upload abuse | File type validation, size limits (5MB), server-side checks |
| Brute force auth | Supabase built-in rate limiting |
| Sensitive data exposure | Minimal profile fields; email only visible in claim context |

## Privacy Considerations

| Concern | Approach |
|---------|----------|
| Profile privacy | No public SELECT policy; users only see own profile |
| Email visibility | Only shown to item owner when claim is approved |
| Private verification | Never exposed publicly; only item owner can see/edit |
| Claim proof privacy | Only visible to claim owner and item owner |
| Data retention | Users can delete their own items (cascades) |
| Account deletion | Provide deletion option (cascades to all data) |
| Image metadata | Strip EXIF data or warn users |

## Input Validation

| Field | Validation Rule |
|-------|----------------|
| title | Required, 3-100 characters |
| description | Required, 10-1000 characters |
| location | Required, 2-200 characters |
| date_lost_found | Required, not in future, not older than 1 year |
| category | Must exist in categories table |
| private_verification | Optional, max 500 characters |
| proof (claim) | Required, 20-500 characters |
| image | Optional, max 5MB, JPEG/PNG/WebP only |
| email | Valid email format |
| password | Min 8 characters |
| full_name | Required, 2-100 characters |

## Image Upload Security

- File type: JPEG, PNG, WebP only
- Max size: 5MB
- Stored in Supabase Storage with RLS
- File name randomized to prevent path traversal
- Upload happens through Server Action with validation

## Rate Limiting

- Supabase Auth: Built-in rate limiting on auth endpoints
- Server Actions: Consider adding rate limiting via Upstash Redis (post-MVP)
- Image uploads: Limit to 1 per item, 5MB per image
