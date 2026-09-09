# Authorization & RLS — Campus Lost & Found

## RLS Policies

### campuses

| Policy | Operation | Rule |
|--------|-----------|------|
| Public read | SELECT | Anyone can read campuses |

### profiles

| Policy | Operation | Rule |
|--------|-----------|------|
| Owner read | SELECT | Users can only read their own profile |
| Owner update | UPDATE | Users can only update their own profile |

**No public SELECT policy.** Profile data is private. Information is only exposed through specific server-side operations for authorized claim workflows (e.g., showing limited claimant info to item owner after claim approval).

### items

| Policy | Operation | Rule |
|--------|-----------|------|
| Public read | SELECT | Anyone can read items |
| Owner insert | INSERT | Authenticated users can create items |
| Owner update | UPDATE | Only the item owner can update |
| Owner delete | DELETE | Only the item owner can delete |

### claims

| Policy | Operation | Rule |
|--------|-----------|------|
| Owner read | SELECT | Claimant can read their own claims |
| Item owner read | SELECT | Item owner can read claims on their items |
| Authenticated insert | INSERT | Authenticated users can create claims |
| Owner update | UPDATE | Claimant can update their own pending claim |
| Item owner update | UPDATE | Item owner can update claim status (approve/reject) |

**Claims are never publicly readable.** Only the claimant and the item owner can see claim details.

### categories

| Policy | Operation | Rule |
|--------|-----------|------|
| Public read | SELECT | Anyone can read categories |

## Authorization Matrix

| Action | Public | Authenticated | Item Owner | Claim Owner |
|--------|--------|---------------|------------|-------------|
| Browse items | Yes | Yes | Yes | Yes |
| View item detail | Yes | Yes | Yes | Yes |
| View private verification | No | No | Yes | No |
| Create item | No | Yes | Yes | Yes |
| Edit item | No | No | Yes | No |
| Delete item | No | No | Yes | No |
| View matches | No | No | Yes | No |
| Submit claim | No | Yes* | No** | Yes* |
| View own claims | No | No | No | Yes |
| View claims on own items | No | No | Yes | No |
| View claim proof | No | No | Yes*** | Yes**** |
| Approve/reject claim | No | No | Yes | No |

\* Cannot claim own item, cannot claim RETURNED/CLOSED items, one claim per user per item
\** Item owner cannot claim their own item
\*** Item owner can see proof on claims against their items
\**** Claimant can see their own proof

## Claim Rules

| Rule | Enforcement |
|------|-------------|
| Only FOUND items can be claimed | UI (hide claim button on LOST items), Server Action check, DB constraint |
| Cannot claim own item | UI (hide claim button for owner), Server Action check |
| One claim per user per item | UI (disable if already claimed), Server Action check, DB unique constraint |
| RETURNED/CLOSED items cannot receive claims | UI (hide claim button), Server Action check |

## Claim State Transitions

When finder approves a claim:
1. Approved claim → status = APPROVED
2. All other pending claims for that item → status = REJECTED
3. Item → status = CLAIMED

Item only becomes RETURNED when finder explicitly confirms the item has been physically returned.

## Server Action Authorization

Every Server Action must:
1. Verify the user is authenticated
2. Verify the user is authorized to perform the action
3. Validate input with Zod
4. Perform the operation
5. Return a typed result

Example pattern:
```typescript
export async function updateItem(itemId: string, data: UpdateItemInput) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Unauthorized' };
  
  const item = await getItem(itemId);
  if (!item || item.user_id !== user.id) return { error: 'Forbidden' };
  
  const validated = updateItemSchema.safeParse(data);
  if (!validated.success) return { error: 'Invalid input' };
  
  const updated = await updateItemInDb(itemId, validated.data);
  return { data: updated };
}
```

## Database Constraints

| Constraint | Table | Description |
|------------|-------|-------------|
| Unique claim | claims | (item_id, user_id) - prevents duplicate claims |
| Valid item type | items | type IN ('LOST', 'FOUND') |
| Valid item status | items | status IN ('OPEN', 'CLAIMED', 'RETURNED', 'CLOSED') |
| Valid claim status | claims | status IN ('pending', 'approved', 'rejected') |
