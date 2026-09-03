import { describe, expect, it } from 'vitest'
import { loginSchema, parseBody, registerSchema } from './validate.js'

describe('request validation', () => {
  it('accepts a valid register body', () => {
    const data = parseBody(registerSchema, {
      name: 'Hossein',
      email: 'farmer@khak.app',
      password: 'secret1',
    })
    expect(data.email).toBe('farmer@khak.app')
  })

  it('rejects a short password', () => {
    expect(() => parseBody(registerSchema, { name: 'A', email: 'x', password: '1' })).toThrow()
  })

  it('rejects an invalid login email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' })
    expect(result.success).toBe(false)
  })
})
