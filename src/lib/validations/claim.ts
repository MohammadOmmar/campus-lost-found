import { z } from 'zod'

export const ITEM_ID_SCHEMA = z.string().uuid('Invalid item ID')

export const claimSchema = z.object({
  item_id: ITEM_ID_SCHEMA,
  proof: z
    .string()
    .trim()
    .min(20, 'Please describe your proof in at least 20 characters')
    .max(500, 'Proof must be 500 characters or less'),
})

export type ClaimInput = z.infer<typeof claimSchema>

export const claimActionSchema = z.object({
  claim_id: z.string().uuid('Invalid claim ID'),
  action: z.enum(['approve', 'reject']),
})

export type ClaimActionInput = z.infer<typeof claimActionSchema>

export const returnActionSchema = z.object({
  item_id: ITEM_ID_SCHEMA,
})

export type ReturnActionInput = z.infer<typeof returnActionSchema>

export const closeActionSchema = z.object({
  item_id: ITEM_ID_SCHEMA,
})

export type CloseActionInput = z.infer<typeof closeActionSchema>

