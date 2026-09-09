# Claims System — Campus Lost & Found

## Overview

The claims system allows users to claim found items and finders to verify ownership before returning items.

## Claim Rules

| Rule | Enforcement |
|------|-------------|
| Only FOUND items can be claimed | UI, Server Action, DB constraint |
| Cannot claim own item | UI, Server Action |
| One claim per user per item | UI, Server Action, DB unique constraint |
| RETURNED/CLOSED items cannot receive claims | UI, Server Action |

## Claim States

```
pending → approved → (item returned) → item status: RETURNED
   ↓
rejected
```

## Claim State Transitions

### Submitting a Claim
- Claim created with status: pending
- Item status remains: OPEN

### Approving a Claim
1. Approved claim → status: APPROVED
2. All other pending claims for that item → status: REJECTED
3. Item → status: CLAIMED

### Rejecting a Claim
1. Rejected claim → status: REJECTED
2. Item status remains: OPEN (if no other approved claims)

### Marking Item as Returned
1. Item → status: RETURNED
2. Only available after a claim has been approved
3. Explicit action by finder confirming physical return

## Privacy Rules

| Data | Visibility |
|------|------------|
| Claim existence | Item owner only |
| Claim proof | Claimant + item owner only |
| Claimant identity | Item owner only (after claim submitted) |
| Item owner identity | Claimant only (after claim approved) |

## Claim Lifecycle

```
1. User finds a FOUND item that matches their lost item
2. User submits a claim with proof of ownership
3. Finder reviews the claim
4. Finder approves or rejects the claim
5. If approved, finder arranges return
6. Finder marks item as RETURNED
```

## Database Constraints

| Constraint | Description |
|------------|-------------|
| Unique (item_id, user_id) | Prevents duplicate claims |
| Foreign key on item_id | Ensures item exists |
| Foreign key on user_id | Ensures user exists |
| Status validation | Only pending, approved, rejected |

## Server Action Authorization

| Action | Authorization |
|--------|---------------|
| submitClaim | Authenticated, not item owner, item is FOUND and OPEN, no existing claim |
| updateClaim | Claimant owner, claim is pending |
| approveClaim | Item owner |
| rejectClaim | Item owner |
| markReturned | Item owner, item has approved claim |
