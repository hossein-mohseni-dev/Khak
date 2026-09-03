import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  password: z.string().min(6).max(72),
})

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
})

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  city: z.string().trim().max(80).optional(),
  farm: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(40).optional(),
})

export const rateSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().trim().max(280).optional().default(''),
})

export const consultSchema = z.object({
  expertId: z.union([z.number(), z.string()]),
  topic: z.string().trim().max(120).optional(),
  message: z.string().trim().min(8).max(2000),
  preferredDate: z.string().trim().max(40).optional(),
})

export const consultStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
})

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number(),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(50),
})

export function parseBody(schema, payload) {
  const result = schema.safeParse(payload)
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(' ')
    const err = new Error(message || 'Invalid request body.')
    err.status = 400
    throw err
  }
  return result.data
}
