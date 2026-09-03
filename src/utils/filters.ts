import type { CartItem, Expert, Product } from '../types'

export function filterProducts(
  list: Product[],
  {
    search = '',
    category = 'All',
    minPrice,
    maxPrice,
    sort = 'featured',
  }: {
    search?: string
    category?: string
    minPrice?: number | string
    maxPrice?: number | string
    sort?: string
  } = {},
): Product[] {
  const q = search.trim().toLowerCase()
  let result = list.filter((p) => {
    const matchCat = category === 'All' || p.category === category
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.suitable.some((s) => s.toLowerCase().includes(q)) ||
      (p.treats || []).some((s) => s.toLowerCase().includes(q))
    const matchMin = minPrice == null || minPrice === '' || p.price >= Number(minPrice)
    const matchMax = maxPrice == null || maxPrice === '' || p.price <= Number(maxPrice)
    return matchCat && matchSearch && matchMin && matchMax
  })
  if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
  if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
  if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
  return result
}

export function filterExperts(
  list: Expert[],
  { search = '', specialty = 'All' }: { search?: string; specialty?: string } = {},
): Expert[] {
  const q = search.trim().toLowerCase()
  return list.filter((e) => {
    const matchSpecialty = specialty === 'All' || e.specialty === specialty
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.specialty.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    return matchSpecialty && matchSearch
  })
}

export function cartTotals(items: CartItem[]): {
  count: number
  subtotal: number
  shipping: number
  total: number
} {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const shipping = items.length === 0 ? 0 : subtotal >= 50 ? 0 : 4.5
  return {
    count: items.reduce((sum, i) => sum + i.qty, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
  }
}

export function filterHistory<T extends { name: string; plant: string; severity: string; createdAt: string }>(
  list: T[],
  { search = '', severity = 'All', sort = 'newest' }: { search?: string; severity?: string; sort?: string } = {},
): T[] {
  const q = search.trim().toLowerCase()
  let result = list.filter((h) => {
    const matchSev = severity === 'All' || h.severity === severity
    const matchQ = !q || h.name.toLowerCase().includes(q) || h.plant.toLowerCase().includes(q)
    return matchSev && matchQ
  })
  if (sort === 'newest') result = [...result].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  if (sort === 'oldest') result = [...result].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
  if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
  return result
}
