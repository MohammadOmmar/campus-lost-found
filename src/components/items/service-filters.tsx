'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { itemCategories } from '@/lib/item-display'

const choices = {
  type: [['', 'Lost and found'], ['LOST', 'Lost'], ['FOUND', 'Found']],
  category: [['', 'All categories'], ...itemCategories.map(({ value, label }) => [value, label])],
  status: [['', 'All statuses'], ['OPEN', 'Open'], ['CLAIMED', 'Claimed'], ['RETURNED', 'Returned'], ['CLOSED', 'Closed']],
  sort: [['newest', 'Newest reports'], ['oldest', 'Oldest reports'], ['updated', 'Recently updated']],
}

export function ServiceFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()
  const active = ['q', 'type', 'category', 'status', 'location', 'date'].filter(key => params.get(key))

  return (
    <form key={params.toString()} role="search" aria-label="Search campus reports" aria-busy={pending}
      onSubmit={event => {
        event.preventDefault()
        const next = new URLSearchParams()
        new FormData(event.currentTarget).forEach((value, key) => { if (String(value).trim()) next.set(key, String(value).trim()) })
        startTransition(() => router.push(`/items?${next.toString()}`))
      }} className="border-y border-border-default bg-base-900 p-4 sm:p-5 space-y-4">
      <label htmlFor="report-search" className="block text-sm font-medium">Search campus reports</label>
      <div className="flex gap-2">
        <Input id="report-search" name="q" defaultValue={params.get('q') ?? ''} placeholder="Search by item, location or description..." className="h-12 min-w-0" />
        <Button type="submit" size="lg" className="h-12" disabled={pending}>{pending ? 'Searching...' : 'Search'}</Button>
      </div>
      <button type="button" aria-expanded={expanded} aria-controls="report-filters" onClick={() => setExpanded(!expanded)} className="md:hidden min-h-11 text-sm underline underline-offset-4">{expanded ? 'Hide filters' : `Filters${active.length ? ` (${active.length} active)` : ''}`}</button>
      <div id="report-filters" className={`${expanded ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`}>
        {Object.entries(choices).map(([key, options]) => (
          <label key={key} className="text-sm space-y-2"><span className="block">{{ type: 'Report type', category: 'Category', status: 'Status', sort: 'Sort by' }[key]}</span>
            <select name={key} defaultValue={params.get(key) ?? (key === 'sort' ? 'newest' : '')} className="w-full min-h-11 border border-border-strong rounded-sm bg-base-950 px-3">
              {options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        ))}
        <label className="text-sm space-y-2"><span className="block">Campus location</span><Input name="location" defaultValue={params.get('location') ?? ''} placeholder="Building or area" className="h-11" /></label>
        <label className="text-sm space-y-2"><span className="block">Lost / found on or after</span><Input type="date" name="date" defaultValue={params.get('date') ?? ''} className="h-11" /></label>
        <div className="flex items-end"><Button type="submit" variant="outline" size="lg" disabled={pending}>Apply filters</Button></div>
      </div>
      {active.length > 0 && <div className="flex flex-wrap items-center gap-3 text-xs"><p className="text-text-secondary break-words">Active: {active.map(key => `${key}: ${params.get(key)}`).join(' - ')}</p><Button type="button" variant="ghost" onClick={() => startTransition(() => router.push('/items'))}>Clear all</Button></div>}
      <p role="status" className="sr-only">{pending ? 'Updating results' : 'Search ready'}</p>
    </form>
  )
}
