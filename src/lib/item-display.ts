export const itemCategories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'keys', label: 'Keys' },
  { value: 'id-cards', label: 'ID cards' },
  { value: 'bags', label: 'Bags & backpacks' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books & notebooks' },
  { value: 'jewelry', label: 'Jewelry & watches' },
  { value: 'other', label: 'Other' },
]

export function categoryLabel(value: string) {
  return itemCategories.find((category) => category.value === value)?.label ?? value
}

export function reportDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}
