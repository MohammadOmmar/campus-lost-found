'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateItemSchema, type UpdateItemInput } from '@/lib/validations/item'
import { updateItem, deleteItem } from '@/actions/items'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package, MapPin, Shield, Trash2 } from 'lucide-react'

const CATEGORIES = [
  ['electronics', 'Electronics'],
  ['keys', 'Keys'],
  ['id-cards', 'ID Cards'],
  ['bags', 'Bags & Backpacks'],
  ['clothing', 'Clothing'],
  ['books', 'Books & Notebooks'],
  ['jewelry', 'Jewelry & Watches'],
  ['other', 'Other'],
] as const

interface EditItemFormProps {
  item: {
    id: string
    type: 'LOST' | 'FOUND'
    title: string
    description: string
    category: string
    location: string
    date_lost_found: string
    private_verification: string | null
    image_url: string | null
  }
}

export function EditItemForm({ item }: EditItemFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      type: item.type,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date_lost_found: item.date_lost_found,
      private_verification: item.private_verification || '',
    },
  })

  const selectedType = watch('type')
  const selectedCategory = watch('category')

  const onSubmit = async (data: UpdateItemInput) => {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('category', data.category)
      formData.append('type', data.type)
      formData.append('location', data.location)
      formData.append('date_lost_found', data.date_lost_found)
      if (data.private_verification) formData.append('private_verification', data.private_verification)
      if (imageFile) formData.append('image', imageFile)
      if (!imageFile && imageRemoved) formData.append('remove_image', 'true')
      const result = await updateItem(item.id, formData)
      if (!result.success) setError(result.error)
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteItem(item.id)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Section: What is it? */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Package className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-h3">What is it?</h3>
            <p className="text-small text-muted-foreground">Tell us about the item</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} disabled={isPending} />
            {errors.title && <p className="text-small text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...register('description')} disabled={isPending} />
            {errors.description && <p className="text-small text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue('category', value || '')} disabled={isPending}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat[0]} value={cat[0]}>{cat[1]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('category')} />
            {errors.category && <p className="text-small text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-3">
            <Label>Photo (optional)</Label>
            <ImageUpload
              onImageSelected={(file) => { setImageFile(file); setImageRemoved(false) }}
              onImageRemoved={() => { setImageFile(null); setImageRemoved(true) }}
              currentImageUrl={item.image_url}
              disabled={isPending}
            />
          </div>
        </div>
      </section>
{/* Section: Where and When? */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-h3">Where and when?</h3>
            <p className="text-small text-muted-foreground">Help narrow down the search</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} disabled={isPending} />
            {errors.location && <p className="text-small text-destructive">{errors.location.message}</p>}
          </div>
          <div className="space-y-3">
            <Label htmlFor="date_lost_found">
              {selectedType === 'LOST' ? 'Date Lost' : 'Date Found'}
            </Label>
            <Input id="date_lost_found" type="date" {...register('date_lost_found')} disabled={isPending} />
            {errors.date_lost_found && <p className="text-small text-destructive">{errors.date_lost_found.message}</p>}
          </div>
        </div>
      </section>

      {/* Section: Help Verify Ownership */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Shield className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="text-h3">Help verify ownership</h3>
            <p className="text-small text-muted-foreground">Optional —" used only during claim review</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="private_verification">Private verification detail</Label>
          <Textarea id="private_verification" rows={3} {...register('private_verification')} disabled={isPending} />
          <p className="text-caption text-muted-foreground">This information is private and is used to help verify a claim.</p>
          {errors.private_verification && <p className="text-small text-destructive">{errors.private_verification.message}</p>}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button type="submit" size="lg" disabled={isPending} className="flex-1 sm:flex-none">
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" size="lg" onClick={() => setShowDeleteDialog(true)} disabled={isPending}>
          <Trash2 className="mr-2 w-4 h-4" />
          Delete
        </Button>
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this item?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The item and any associated claims will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
</form>
  )
}