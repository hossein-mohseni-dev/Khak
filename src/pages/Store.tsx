import { memo, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Input } from '../components/ui/Input'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Tabs } from '../components/ui/Tabs'
import { categories } from '../data/catalog.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useCart } from '../state/CartContext'
import { useToast } from '../state/ToastContext'
import type { Product } from '../types'
import { filterProducts } from '../utils/filters'

const ProductCard = memo(function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <Link to={`/store/${p.id}`} className="h-32 bg-plant-50 dark:bg-soil-700 flex items-center justify-center text-4xl" aria-label={p.name}>🧴</Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/store/${p.id}`} className="font-bold text-sm mb-2">{p.name}</Link>
        <p className="text-sm text-soil-500 flex-1 line-clamp-2">{p.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-plant-700">${p.price.toFixed(2)}</span>
          <Button size="sm" onClick={() => onAdd(p)}>Add</Button>
        </div>
      </div>
    </Card>
  )
})

export function Store() {
  usePageTitle('Store')
  const { add, count } = useCart()
  const toast = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const debounced = useDebouncedValue(search)

  const load = () => {
    setLoading(true)
    api.products().then(setProducts).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = useMemo(
    () => filterProducts(products, { search: debounced, category, sort, minPrice, maxPrice }),
    [products, debounced, category, sort, minPrice, maxPrice],
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Store</h1>
        <Link to="/cart"><Button variant="secondary">Cart ({count})</Button></Link>
      </div>
      <div className="space-y-3 mb-6">
        <Input placeholder="Search products or diseases" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Tabs tabs={(categories as string[]).map((c) => ({ id: c, label: c }))} value={category} onChange={setCategory} />
        <div className="flex gap-2">
          <Input placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <select className="rounded-xl border px-3" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      {loading && <PageSkeleton />}
      {error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && !error && filtered.length === 0 && <EmptyState title="No products" message="Try another search." />}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={(item) => { add(item); toast.push(`${item.name} added`) }} />
        ))}
      </div>
    </div>
  )
}
