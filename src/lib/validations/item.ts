import { z } from 'zod'

export const itemSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be 1000 characters or less'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['LOST', 'FOUND']),
  location: z
    .string()
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must be 200 characters or less'),
  date_lost_found: z
    .string()
    .min(1, 'Date is required')
    .refine((date) => {
      const d = new Date(date)
      const now = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return d <= now && d >= oneYearAgo
    }, 'Date must be within the last year and not in the future'),
  private_verification: z
    .string()
    .max(500, 'Private verification must be 500 characters or less')
    .optional()
    .or(z.literal('')),
})

export type ItemInput = z.infer<typeof itemSchema>

export const updateItemSchema = itemSchema.extend({
  status: z.enum(['OPEN', 'CLAIMED', 'RETURNED', 'CLOSED']).optional(),
})

export type UpdateItemInput = z.infer<typeof updateItemSchema>
