import { describe, expect, it } from 'vitest'
import { cartTotals, filterExperts, filterHistory, filterProducts } from './filters'
import { validateLogin, validateRegister } from './validation'

const products = [
  { id: 1, name: 'Neem Oil', category: 'Organic', price: 15.9, rating: 4.9, description: 'natural spray', suitable: ['All plants'], treats: ['Aphids'], unit: '1', reviews: 1, stock: 1, usage: '' },
  { id: 2, name: 'Copper Spray', category: 'Fungicide', price: 18.5, rating: 4.8, description: 'blight control', suitable: ['Tomato'], treats: ['Early Blight'], unit: '1', reviews: 1, stock: 1, usage: '' },
]

describe('filters', () => {
  it('filters products by disease keyword', () => {
    expect(filterProducts(products, { search: 'blight' }).map((p) => p.id)).toEqual([2])
  })
  it('filters experts by city', () => {
    expect(
      filterExperts(
        [
          { id: 1, name: 'Sara', specialty: 'Fungal Diseases', location: 'Tehran', experience: '', rating: 5, reviews: 1, available: true, languages: [], fee: 1, bio: '', education: '' },
          { id: 2, name: 'Ali', specialty: 'Fruit Trees & Orchards', location: 'Mashhad', experience: '', rating: 5, reviews: 1, available: true, languages: [], fee: 1, bio: '', education: '' },
        ],
        { search: 'mashhad' },
      ),
    ).toHaveLength(1)
  })
  it('computes cart totals', () => {
    expect(cartTotals([{ id: 1, name: 'x', price: 10, unit: '', qty: 2 }]).total).toBe(24.5)
  })
  it('sorts history', () => {
    const list = [
      { name: 'B', plant: 'Tomato', severity: 'Mild', createdAt: '2026-01-02' },
      { name: 'A', plant: 'Pepper', severity: 'Severe', createdAt: '2026-01-01' },
    ]
    expect(filterHistory(list, { sort: 'name' })[0].name).toBe('A')
  })
})

describe('validation', () => {
  it('rejects bad login', () => {
    expect(validateLogin('nope', '')).toHaveProperty('email')
  })
  it('accepts register payload', () => {
    expect(validateRegister({ name: 'Hossein', email: 'a@b.com', password: 'secret1', confirm: 'secret1' })).toEqual({})
  })
})
