'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { itemSchema, updateItemSchema } from '@/lib/validations/item'
import { uploadItemImage, deleteItemImage, validateImageFile } from '@/lib/supabase/storage'

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createItem(
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to report an item.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('campus_id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { success: false, error: 'Profile not found.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    type: formData.get('type') as string,
    location: formData.get('location') as string,
    date_lost_found: formData.get('date_lost_found') as string,
    private_verification: (formData.get('private_verification') as string) || undefined,
  }

  const validated = itemSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: 'Please check the form for errors.' }
  }

  // Handle optional image upload
  let imageUrl: string | null = null
  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const fileError = validateImageFile(imageFile)
    if (fileError) {
      return { success: false, error: fileError }
    }
    try {
      imageUrl = await uploadItemImage(imageFile, user.id)
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, error: err.message }
      }
      return { success: false, error: 'Failed to upload image.' }
    }
  }

  const { error } = await supabase.from('items').insert({
    user_id: user.id,
    campus_id: profile.campus_id,
    title: validated.data.title,
    description: validated.data.description,
    category: validated.data.category,
    type: validated.data.type,
    location: validated.data.location,
    date_lost_found: validated.data.date_lost_found,
    private_verification: validated.data.private_verification || null,
    image_url: imageUrl,
    status: 'OPEN',
  })

  if (error) {
    if (imageUrl) {
      await deleteItemImage(imageUrl)
    }
    return { success: false, error: 'Failed to create item. Please try again.' }
  }

  revalidatePath('/items')
  revalidatePath('/dashboard/items')
  redirect('/dashboard/items?created=true')
}

export async function updateItem(
  itemId: string,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  const { data: item } = await supabase
    .from('items')
    .select('user_id, status, image_url')
    .eq('id', itemId)
    .single()

  if (!item) {
    return { success: false, error: 'Item not found.' }
  }

  if (item.user_id !== user.id) {
    return { success: false, error: 'You can only edit your own items.' }
  }

  if (item.status === 'RETURNED' || item.status === 'CLOSED') {
    return { success: false, error: 'Cannot edit returned or closed items.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    type: formData.get('type') as string,
    location: formData.get('location') as string,
    date_lost_found: formData.get('date_lost_found') as string,
    private_verification: (formData.get('private_verification') as string) || undefined,
  }

  const validated = updateItemSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: 'Please check the form for errors.' }
  }

  // Handle image changes
  let imageUrl: string | null = item.image_url
  const imageFile = formData.get('image') as File | null
  const removeImage = formData.get('remove_image') === 'true'

  if (removeImage) {
    // User removed the existing image
    if (item.image_url) {
      await deleteItemImage(item.image_url)
    }
    imageUrl = null
  } else if (imageFile && imageFile.size > 0) {
    const fileError = validateImageFile(imageFile)
    if (fileError) {
      return { success: false, error: fileError }
    }
    try {
      imageUrl = await uploadItemImage(imageFile, user.id)
      // Clean up old image
      if (item.image_url) {
        await deleteItemImage(item.image_url)
      }
    } catch (err) {
      if (err instanceof Error) {
        return { success: false, error: err.message }
      }
      return { success: false, error: 'Failed to upload image.' }
    }
  }

  const { error } = await supabase
    .from('items')
    .update({
      title: validated.data.title,
      description: validated.data.description,
      category: validated.data.category,
      type: validated.data.type,
      location: validated.data.location,
      date_lost_found: validated.data.date_lost_found,
      private_verification: validated.data.private_verification || null,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)

  if (error) {
    return { success: false, error: 'Failed to update item. Please try again.' }
  }

  revalidatePath('/items')
  revalidatePath(`/items/${itemId}`)
  revalidatePath('/dashboard/items')
  redirect(`/items/${itemId}?updated=true`)
}

export async function deleteItem(itemId: string): Promise<ActionResponse> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  const { data: item } = await supabase
    .from('items')
    .select('user_id, status, image_url')
    .eq('id', itemId)
    .single()

  if (!item) {
    return { success: false, error: 'Item not found.' }
  }

  if (item.user_id !== user.id) {
    return { success: false, error: 'You can only delete your own items.' }
  }

  if (item.status === 'RETURNED' || item.status === 'CLOSED') {
    return { success: false, error: 'Cannot delete returned or closed items.' }
  }

  if (item.image_url) {
    const url = new URL(item.image_url)
    const pathParts = url.pathname.split('/')
    const filePath = pathParts.slice(pathParts.indexOf('item-images') + 1).join('/')
    if (filePath) {
      await supabase.storage.from('item-images').remove([filePath])
    }
  }

  const { error } = await supabase.from('items').delete().eq('id', itemId)

  if (error) {
    return { success: false, error: 'Failed to delete item. Please try again.' }
  }

  revalidatePath('/items')
  revalidatePath('/dashboard/items')
  redirect('/dashboard/items?deleted=true')
}
