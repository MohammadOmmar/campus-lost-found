'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  claimSchema,
  claimActionSchema,
  returnActionSchema,
  closeActionSchema,
} from '@/lib/validations/claim'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

type ClaimStatus = 'pending' | 'approved' | 'rejected'
type ItemStatus = 'OPEN' | 'CLAIMED' | 'RETURNED' | 'CLOSED'

interface ClaimRow {
  id: string
  item_id: string
  user_id: string
  status: string
}

interface ItemRow {
  id: string
  user_id: string
  type: string
  status: ItemStatus
}

export async function submitClaim(
  itemId: string,
  formData: FormData
): Promise<ActionResponse<{ claimId: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in to submit a claim.' }
  }

  const validated = claimSchema.safeParse({
    item_id: itemId,
    proof: formData.get('proof') as string,
  })
  if (!validated.success) {
    const msg = validated.error.issues[0]?.message
    return { success: false, error: msg ?? 'Please check your proof and try again.' }
  }

  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, type, status')
    .eq('id', itemId)
    .single()
  if (!item) {
    return { success: false, error: 'Item not found.' }
  }
  const typedItem = item as ItemRow

  if (typedItem.type !== 'FOUND') {
    return { success: false, error: 'Only found items can be claimed.' }
  }
  if (typedItem.status === 'RETURNED' || typedItem.status === 'CLOSED') {
    return { success: false, error: 'This item is no longer accepting claims.' }
  }
  if (typedItem.status !== 'OPEN') {
    return { success: false, error: 'This item is not currently accepting claims.' }
  }
  if (typedItem.user_id === user.id) {
    return { success: false, error: 'You cannot claim your own item.' }
  }

  const { data: existing } = await supabase
    .from('claims')
    .select('id')
    .eq('item_id', itemId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (existing) {
    return { success: false, error: 'You have already submitted a claim for this item.' }
  }

  const { data: created, error } = await supabase
    .from('claims')
    .insert({ item_id: itemId, user_id: user.id, proof: validated.data.proof, status: 'pending' as ClaimStatus })
    .select('id')
    .single()
  if (error || !created) {
    if (error?.code === '23505') {
      return { success: false, error: 'You have already submitted a claim for this item.' }
    }
    return { success: false, error: 'Failed to submit claim. Please try again.' }
  }

  revalidatePath(`/items/${itemId}`)
  revalidatePath(`/items/${itemId}/claim`)
  revalidatePath('/dashboard/claims')
  revalidatePath('/dashboard/received')
  redirect(`/items/${itemId}?claim=submitted`)
}
export async function reviewClaim(
  claimId: string,
  action: 'approve' | 'reject'
): Promise<ActionResponse> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }
  const validated = claimActionSchema.safeParse({ claim_id: claimId, action })
  if (!validated.success) {
    return { success: false, error: 'Invalid request.' }
  }
  const { data: claim } = await supabase
    .from('claims')
    .select('id, item_id, user_id, status')
    .eq('id', claimId)
    .single()
  if (!claim) {
    return { success: false, error: 'Claim not found or you do not have access.' }
  }
  const typedClaim = claim as ClaimRow
  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, type, status')
    .eq('id', typedClaim.item_id)
    .single()
  if (!item) {
    return { success: false, error: 'Item not found.' }
  }
  const typedItem = item as ItemRow
  if (typedItem.user_id !== user.id) {
    return { success: false, error: 'Only the finder can review claims on this item.' }
  }
  if (typedClaim.status !== 'pending') {
    return { success: false, error: 'This claim has already been reviewed.' }
  }
  if (validated.data.action === 'reject') {
    const { error } = await supabase
      .from('claims')
      .update({ status: 'rejected' as ClaimStatus })
      .eq('id', claimId)
      .eq('status', 'pending')
    if (error) {
      return { success: false, error: 'Failed to reject claim. Please try again.' }
    }
  } else {
    if (typedItem.status !== 'OPEN') {
      return { success: false, error: 'This item can no longer accept an approval.' }
    }
    const { error: approveError } = await supabase
      .from('claims')
      .update({ status: 'approved' as ClaimStatus })
      .eq('id', claimId)
      .eq('status', 'pending')
    if (approveError) {
      return { success: false, error: 'Failed to approve claim. Please try again.' }
    }
    await supabase
      .from('claims')
      .update({ status: 'rejected' as ClaimStatus })
      .eq('item_id', typedClaim.item_id)
      .eq('status', 'pending')
      .neq('id', claimId)
    const { error: itemError } = await supabase
      .from('items')
      .update({ status: 'CLAIMED' as ItemStatus })
      .eq('id', typedClaim.item_id)
      .eq('status', 'OPEN')
    if (itemError) {
      return { success: false, error: 'Failed to update item status. Please try again.' }
    }
  }
  revalidatePath(`/items/${typedClaim.item_id}`)
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/items')
  revalidatePath('/dashboard/claims')
  revalidatePath('/dashboard/received')
  return { success: true, data: undefined }
}
export async function markReturned(itemId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }
  const validated = returnActionSchema.safeParse({ item_id: itemId })
  if (!validated.success) {
    return { success: false, error: 'Invalid request.' }
  }
  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, status')
    .eq('id', itemId)
    .single()
  if (!item) {
    return { success: false, error: 'Item not found.' }
  }
  const typedItem = item as ItemRow
  if (typedItem.user_id !== user.id) {
    return { success: false, error: 'Only the finder can mark this item as returned.' }
  }
  if (typedItem.status !== 'CLAIMED') {
    return { success: false, error: 'Only claimed items can be marked as returned.' }
  }
  const { data: approved } = await supabase
    .from('claims')
    .select('id')
    .eq('item_id', itemId)
    .eq('status', 'approved')
    .limit(1)
  if (!approved || approved.length === 0) {
    return { success: false, error: 'A claim must be approved before marking as returned.' }
  }
  const { error } = await supabase
    .from('items')
    .update({ status: 'RETURNED' as ItemStatus })
    .eq('id', itemId)
    .eq('status', 'CLAIMED')
  if (error) {
    return { success: false, error: 'Failed to mark item as returned. Please try again.' }
  }
  revalidatePath(`/items/${itemId}`)
  revalidatePath('/items')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/items')
  revalidatePath('/dashboard/claims')
  revalidatePath('/dashboard/received')
  return { success: true, data: undefined }
}

export async function closeItem(itemId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }
  const validated = closeActionSchema.safeParse({ item_id: itemId })
  if (!validated.success) {
    return { success: false, error: 'Invalid request.' }
  }
  const { data: item } = await supabase
    .from('items')
    .select('id, user_id, status')
    .eq('id', itemId)
    .single()
  if (!item) {
    return { success: false, error: 'Item not found.' }
  }
  const typedItem = item as ItemRow
  if (typedItem.user_id !== user.id) {
    return { success: false, error: 'Only the owner can close this item.' }
  }
  if (typedItem.status !== 'OPEN') {
    return { success: false, error: 'Only open items can be closed.' }
  }
  const { error } = await supabase
    .from('items')
    .update({ status: 'CLOSED' as ItemStatus })
    .eq('id', itemId)
    .eq('status', 'OPEN')
  if (error) {
    return { success: false, error: 'Failed to close item. Please try again.' }
  }
  revalidatePath(`/items/${itemId}`)
  revalidatePath('/items')
  revalidatePath('/dashboard/items')
  return { success: true, data: undefined }
}
