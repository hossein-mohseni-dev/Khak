import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useAuth } from '../state/AuthContext'
import { useCart } from '../state/CartContext'
import { useToast } from '../state/ToastContext'
import type { Order } from '../types'

export function Cart() {
  usePageTitle('Cart')
  const { items, update, remove, clear, subtotal, shipping, total } = useCart()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function checkout() {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    setLoading(true)
    try {
      const created = await api.checkout(items.map((i) => ({ id: i.id, qty: i.qty })))
      setOrder(created)
      clear()
      toast.push('Order confirmed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Order confirmed</h1>
        <p className="mb-4">{order.id} · ${order.total.toFixed(2)}</p>
        <Link to="/dashboard"><Button>Dashboard</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {items.length === 0 ? (
        <EmptyState title="Cart is empty" message="Add a product from the store." actionTo="/store" actionLabel="Browse store" />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="p-4 flex justify-between gap-3 items-center">
                <div>
                  <Link to={`/store/${item.id}`} className="font-medium">{item.name}</Link>
                  <p className="text-sm text-soil-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Decrease" onClick={() => update(item.id, item.qty - 1)}>-</button>
                  <input className="w-14 border rounded-lg px-2 py-1" type="number" min={1} value={item.qty} onChange={(e) => update(item.id, Number(e.target.value))} />
                  <button aria-label="Increase" onClick={() => update(item.id, item.qty + 1)}>+</button>
                  <button className="text-sm text-red-600" onClick={() => remove(item.id)}>Remove</button>
                </div>
              </Card>
            ))}
            <Button variant="ghost" onClick={() => setConfirmClear(true)}>Clear cart</Button>
          </div>
          <Card className="p-5 h-fit">
            <p className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p>
            <p className="flex justify-between text-sm"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></p>
            <p className="flex justify-between font-bold mt-3"><span>Total</span><span>${total.toFixed(2)}</span></p>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <Button className="w-full mt-4" disabled={loading} onClick={checkout}>{loading ? 'Placing...' : 'Checkout'}</Button>
          </Card>
        </div>
      )}
      <ConfirmDialog open={confirmClear} title="Clear cart?" message="All items will be removed." onCancel={() => setConfirmClear(false)} onConfirm={() => { clear(); setConfirmClear(false) }} />
    </div>
  )
}
