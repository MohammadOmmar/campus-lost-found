import { createClient } from './server'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StorageError'
  }
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed.'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be less than 5MB.'
  }
  return null
}

export async function uploadItemImage(
  file: File,
  userId: string
): Promise<string> {
  const supabase = await createClient()

  const validationError = validateImageFile(file)
  if (validationError) {
    throw new StorageError(validationError)
  }

  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${randomUUID()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    throw new StorageError('Failed to upload image. Please try again.')
  }

  const { data: urlData } = supabase.storage
    .from('item-images')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function deleteItemImage(imageUrl: string): Promise<void> {
  const supabase = await createClient()

  try {
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.indexOf('item-images')
    if (bucketIndex === -1) return

    const filePath = pathParts.slice(bucketIndex + 1).join('/')
    if (!filePath) return

    await supabase.storage.from('item-images').remove([filePath])
  } catch {
    // Silently fail - image may already be deleted
  }
}
