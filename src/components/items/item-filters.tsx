'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'keys', label: 'Keys' },
  { value: 'id-cards', label: 'ID Cards' },
  { value: 'bags', label: 'Bags & Backpacks' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books & Notebooks' },
  { value: 'jewelry', label: 'Jewelry & Watches' },
  { value: 'other', label: 'Other' },
]

const types = [
  { value: '', label: 'All Types' },
  { value: 'LOST', label: 'Lost' },
  { value: 'FOUND', label: 'Found' },
]

const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CLAIMED', label: 'Claimed' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'CLOSED', label: 'Closed' },
]

export function ItemFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete('page')
      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string
    router.push(`/items?${createQueryString('q', query)}`)
  }

  const handleFilterChange = (name: string, value: string) => {
    router.push(`/items?${createQueryString(name, value)}`)
  }

  const clearFilters = () => {
    router.push('/items')
  }

  const hasFilters =
    searchParams.has('q') ||
    searchParams.has('type') ||
    searchParams.has('category') ||
    searchParams.has('status')

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search items..."
            defaultValue={searchParams.get('q') || ''}
            className="pl-11"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={searchParams.get('type') || ''}
          onValueChange={(value) => handleFilterChange('type', value || '')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('category') || ''}
          onValueChange={(value) => handleFilterChange('category', value || '')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('status') || ''}
          onValueChange={(value) => handleFilterChange('status', value || '')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 w-3 h-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
