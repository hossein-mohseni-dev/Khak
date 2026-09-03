import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageSkeleton } from '../components/ui/Skeleton'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useCart } from '../state/CartContext'
import { useToast } from '../state/ToastContext'
import type { Product } from '../types'

const fallbackReviews = [
  { author: 'Reza', score: 5, text: 'Worked on tomato blight within a week.' },
  { author: 'Sara', score: 4, text: 'Good coverage. Follow the label.' },
]

export function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const toast = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  usePageTitle(product?.name || 'Product')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.product(id).then(setProduct).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageSkeleton />
  if (error) return <div className="max-w-3xl mx-auto px-4 py-10"><ErrorBanner message={error} /></div>
  if (!product) return null
  const reviews = product.customerReviews?.length ? product.customerReviews : fallbackReviews

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/store" className="text-sm text-plant-700">← Store</Link>
      <Card className="mt-4 grid md:grid-cols-2 overflow-hidden">
        <div className="h-64 bg-plant-50 dark:bg-soil-700 flex items-center justify-center text-7xl" aria-hidden>🧴</div>
        <div className="p-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-sm text-soil-500 mb-3">{product.unit} · ★ {product.rating} ({product.reviews})</p>
          <p className="text-3xl font-bold text-plant-700 mb-3">${product.price.toFixed(2)}</p>
          <p className="text-sm mb-3">{product.description}</p>
          <p className="text-sm mb-3">{product.usage}</p>
          <div className="flex gap-2 items-center">
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-20 border rounded-lg px-2 py-2" aria-label="Quantity" />
            <Button onClick={() => { add(product, qty); toast.push('Added to cart') }}>Add to cart</Button>
          </div>
        </div>
      </Card>
      <section className="mt-6">
        <h2 className="font-bold mb-3">Reviews</h2>
        {reviews.map((r) => (
          <Card key={r.author + r.text} className="p-3 mb-2 text-sm">
            <p className="font-medium">{r.author} · ★ {r.score}</p>
            <p>{r.text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
