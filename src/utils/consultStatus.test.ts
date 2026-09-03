import { describe, expect, it } from 'vitest'
import { canTransition, nextStatuses, statusLabel } from './consultStatus'
import { cartTotals, filterProducts } from './filters'
import { validateConsult, validateDiagnosis, validateLogin } from './validation'

describe('consultation status flow', () => {
  it('allows pending to confirmed or cancelled', () => {
    expect(nextStatuses('pending')).toEqual(['confirmed', 'cancelled'])
    expect(canTransition('pending', 'completed')).toBe(false)
  })

  it('allows confirmed to completed or cancelled only', () => {
    expect(canTransition('confirmed', 'completed')).toBe(true)
    expect(canTransition('confirmed', 'pending')).toBe(false)
  })

  it('locks completed and cancelled', () => {
    expect(nextStatuses('completed')).toEqual([])
    expect(nextStatuses('cancelled')).toEqual([])
  })

  it('labels statuses', () => {
    expect(statusLabel('pending')).toBe('Pending')
  })
})

describe('user flows', () => {
  it('login rejects empty password', () => {
    expect(validateLogin('a@b.com', '')).toHaveProperty('password')
  })

  it('diagnosis requires photo plant and symptoms', () => {
    const errors = validateDiagnosis({ file: null, plant: '', symptoms: '' })
    expect(errors.file).toBeTruthy()
    expect(errors.plant).toBeTruthy()
    expect(errors.symptoms).toBeTruthy()
  })

  it('consult requires a real message', () => {
    expect(validateConsult({ message: 'hi' }).message).toBeTruthy()
    expect(validateConsult({ message: 'Yellow spots on tomato leaves' })).toEqual({})
  })

  it('store search then cart total', () => {
    const products = [
      { id: 1, name: 'Neem Oil', category: 'Organic', price: 15, rating: 5, description: 'oil', suitable: [], treats: [], unit: '', reviews: 1, stock: 1, usage: '' },
      { id: 2, name: 'Copper', category: 'Fungicide', price: 20, rating: 5, description: 'blight', suitable: [], treats: ['Early Blight'], unit: '', reviews: 1, stock: 1, usage: '' },
    ]
    const found = filterProducts(products, { search: 'blight' })
    expect(found).toHaveLength(1)
    const totals = cartTotals([{ id: found[0].id, name: found[0].name, price: found[0].price, unit: '', qty: 2 }])
    expect(totals.subtotal).toBe(40)
    expect(totals.shipping).toBe(4.5)
  })
})
