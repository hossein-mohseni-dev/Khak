import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import { cartTotals } from '../utils/filters'

const KEY = 'khak_cart'

interface CartCtx {
  items: CartItem[]
  count: number
  subtotal: number
  shipping: number
  total: number
  add: (product: Product, qty?: number) => void
  update: (id: number, qty: number) => void
  remove: (id: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartCtx>(() => {
    const totals = cartTotals(items)
    return {
      items,
      ...totals,
      add(product, qty = 1) {
        setItems((prev) => {
          const found = prev.find((i) => i.id === product.id)
          if (found) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
          return [...prev, { id: product.id, name: product.name, price: product.price, unit: product.unit, qty }]
        })
      },
      update(id, qty) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)))
      },
      remove(id) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      },
      clear() {
        setItems([])
      },
    }
  }, [items])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
