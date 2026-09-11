'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { itemSchema, type ItemInput } from '@/lib/validations/item'
import { createItem } from '@/actions/items'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ImageUpload } from './image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, MapPin, Shield } from 'lucide-react'

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'keys', label: 'Keys' },
  { value: 'id-cards', label: 'ID Cards' },
  { value: 'bags', label: 'Bags & Backpacks' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books & Notebooks' },
  { value: 'jewelry', label: 'Jewelry & Watches' },
  { value: 'other', label: 'Other' },
]

export function ItemForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: { type: 'LOST', title: '', description: '', category: '', location: '', date_lost_found: new Date().toISOString().split('T')[0], private_verification: '' },
  })

  const selectedType = watch('type')
  const selectedCategory = watch('category')

  const onSubmit = async (data: ItemInput) => {
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
      const result = await createItem(formData)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center"><Package className="w-4 h-4 text-foreground/70" /></div>
          <div><h3 className="text-[15px] font-medium text-foreground">What is it?</h3><p className="text-[12px] text-muted-foreground">Tell us about the item</p></div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Item name</Label>
            <Input id="title" placeholder="e.g., Black wireless earbuds" {...register('title')} disabled={isPending} />
            {errors.title && <p className="text-[12px] text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the item in detail..." rows={3} {...register('description')} disabled={isPending} />
            {errors.description && <p className="text-[12px] text-destructive">{errors.description.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setValue('type', 'LOST')} className={`flex-1 h-10 rounded-lg text-[13px] font-medium border transition-all duration-200 ${selectedType === 'LOST' ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-border/60'}`}>Lost</button>
                <button type="button" onClick={() => setValue('type', 'FOUND')} className={`flex-1 h-10 rounded-lg text-[13px] font-medium border transition-all duration-200 ${selectedType === 'FOUND' ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-border/60'}`}>Found</button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={(v) => setValue('category', v || '')}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
              </Select>
              <input type="hidden" {...register('category')} />
              {errors.category && <p className="text-[12px] text-destructive">{errors.category.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            <ImageUpload onImageSelected={setImageFile} onImageRemoved={() => setImageFile(null)} disabled={isPending} />
          </div>
        </div>
      </section>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center"><MapPin className="w-4 h-4 text-foreground/70" /></div>
          <div><h3 className="text-[15px] font-medium text-foreground">Where and when?</h3><p className="text-[12px] text-muted-foreground">Help narrow down the search</p></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Main Library, 2nd floor" {...register('location')} disabled={isPending} />
            {errors.location && <p className="text-[12px] text-destructive">{errors.location.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_lost_found">{selectedType === 'LOST' ? 'Date Lost' : 'Date Found'}</Label>
            <Input id="date_lost_found" type="date" {...register('date_lost_found')} disabled={isPending} />
            {errors.date_lost_found && <p className="text-[12px] text-destructive">{errors.date_lost_found.message}</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-secondary/80 flex items-center justify-center"><Shield className="w-4 h-4 text-foreground/70" /></div>
          <div><h3 className="text-[15px] font-medium text-foreground">Help verify ownership</h3><p className="text-[12px] text-muted-foreground">Optional —" used only during claim review</p></div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="private_verification">Private verification detail</Label>
          <Textarea id="private_verification" placeholder="e.g., Small tear on the right shoulder strap" rows={3} {...register('private_verification')} disabled={isPending} />
          <p className="text-[11px] text-muted-foreground">This information is private and is used to help verify a claim. It won&apos;t be displayed publicly.</p>
          {errors.private_verification && <p className="text-[12px] text-destructive">{errors.private_verification.message}</p>}
        </div>
      </section>

      <div className="flex gap-3 pt-2">
        <Button type="submit" size="lg" disabled={isPending} className="flex-1 sm:flex-none h-11">
          {isPending ? 'Submitting...' : `Report ${selectedType === 'LOST' ? 'Lost' : 'Found'} Item`}
        </Button>
        <Button type="button" variant="outline" size="lg" asChild disabled={isPending} className="h-11">
          <Link href="/items">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
