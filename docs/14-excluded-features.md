# Excluded Features — Campus Lost & Found

## Features Explicitly Excluded from MVP

| Feature | Reason | Future Priority |
|---------|--------|-----------------|
| Google OAuth | Email/password sufficient for MVP; can be added through Supabase later | Medium |
| AI/ML matching | Deterministic matching is sufficient and explainable | Low |
| Real-time chat | Adds significant complexity; not core to workflow | Medium |
| Notifications | Email/push infrastructure not needed at MVP scale | Medium |
| Mobile application | Responsive web is sufficient | Low |
| GPS tracking | Privacy concerns; not needed for MVP | Low |
| Maps integration | Not needed for text-based location | Low |
| University ERP integration | Out of scope for portfolio project | Low |
| Payments | Not part of the core workflow | Low |
| Social features | Not part of the core workflow | Low |
| Admin dashboard | Manual DB access sufficient at small scale | Low |

## Principles

- Keep the architecture appropriate for a solo developer
- Do not add features just because they sound impressive
- Prioritize correctness, security, clear UX, and maintainable code
- Do not optimize for number of files, dependencies, or feature count
