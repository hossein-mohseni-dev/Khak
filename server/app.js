import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import swaggerUi from 'swagger-ui-express'
import { env } from './env.js'
import { prisma } from './lib/prisma.js'
import { openapi } from './openapi.js'
import { parseBody, registerSchema, loginSchema, profileSchema, rateSchema, consultSchema, consultStatusSchema, orderSchema } from './lib/validate.js'
import { classifyLocal, classifyWithHuggingFace, buildDiagnosisPayload } from './lib/diagnosis.js'
import { products, experts } from '../src/data/catalog.js'

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    city: u.city,
    farm: u.farm,
    phone: u.phone,
    createdAt: u.createdAt,
  }
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' })
}

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Please sign in.' })
  try {
    req.user = jwt.verify(token, env.jwtSecret)
    next()
  } catch {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' })
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) cb(new Error('Only image files are allowed.'))
    else cb(null, true)
  },
})

export async function ensureSeed() {
  const existing = await prisma.user.findUnique({ where: { email: 'demo@khak.app' } })
  if (existing) return
  await prisma.user.create({
    data: {
      name: 'Demo Farmer',
      email: 'demo@khak.app',
      passwordHash: bcrypt.hashSync('Demo123!', 10),
      city: 'Tehran',
      farm: 'Greenhouse #2',
      phone: '+98 900 000 0000',
    },
  })
}

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || env.corsOrigins.includes(origin) || env.nodeEnv !== 'production') cb(null, true)
        else cb(new Error('Origin not allowed by CORS'))
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  const generalLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false })
  const authLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })
  const detectLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false })
  app.use('/api', generalLimit)

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      service: 'khak-api',
      hfConfigured: Boolean(env.hfToken),
      time: new Date().toISOString(),
    })
  })

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'Khak API docs' }))
  app.get('/api/openapi.json', (_req, res) => res.json(openapi))

  app.get('/api/products', (req, res) => {
    const { q = '', category = 'All' } = req.query
    const list = products.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const s = String(q).toLowerCase()
      const matchQ = !s || p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      return matchCat && matchQ
    })
    res.json(list)
  })

  app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => String(p.id) === String(req.params.id))
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json(product)
  })

  app.get('/api/experts', async (_req, res, next) => {
    try {
      const ratings = await prisma.rating.findMany()
      const byExpert = {}
      for (const r of ratings) {
        if (!byExpert[r.expertId]) byExpert[r.expertId] = []
        byExpert[r.expertId].push(r)
      }
      const enriched = experts.map((e) => {
        const extra = byExpert[e.id] || []
        if (!extra.length) return e
        const avg = extra.reduce((s, r) => s + r.score, 0) / extra.length
        const blended = Number(((e.rating * e.reviews + avg * extra.length) / (e.reviews + extra.length)).toFixed(2))
        return { ...e, rating: blended, reviews: e.reviews + extra.length, userRatings: extra.length }
      })
      res.json(enriched)
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/experts/:id', async (req, res, next) => {
    try {
      const expert = experts.find((e) => String(e.id) === String(req.params.id))
      if (!expert) return res.status(404).json({ message: 'Expert not found.' })
      const extra = await prisma.rating.findMany({
        where: { expertId: expert.id },
        orderBy: { createdAt: 'desc' },
        take: 8,
      })
      res.json({ ...expert, recentRatings: extra })
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/auth/register', authLimit, async (req, res, next) => {
    try {
      const body = parseBody(registerSchema, req.body)
      const exists = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
      if (exists) return res.status(409).json({ message: 'An account with this email already exists.' })
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email.toLowerCase(),
          passwordHash: bcrypt.hashSync(body.password, 10),
        },
      })
      res.status(201).json({ token: signToken(user), user: publicUser(user) })
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/auth/login', authLimit, async (req, res, next) => {
    try {
      const body = parseBody(loginSchema, req.body)
      const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } })
      if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }
      res.json({ token: signToken(user), user: publicUser(user) })
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/me', auth, async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } })
      if (!user) return res.status(404).json({ message: 'User not found.' })
      res.json(publicUser(user))
    } catch (err) {
      next(err)
    }
  })

  app.put('/api/me', auth, async (req, res, next) => {
    try {
      const body = parseBody(profileSchema, req.body)
      const user = await prisma.user.update({ where: { id: req.user.id }, data: body })
      res.json(publicUser(user))
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/detect', auth, detectLimit, upload.single('image'), async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Please upload an image.' })
      let classified
      let warning = null
      try {
        classified = await classifyWithHuggingFace(req.file.buffer, {
          token: env.hfToken,
          model: env.hfModel,
          timeoutMs: env.hfTimeoutMs,
        })
      } catch (err) {
        warning = err.message
      }
      if (!classified) classified = classifyLocal(req.file.buffer, req.file.originalname)

      const { disease, confidence, source } = buildDiagnosisPayload(classified)
      const recs = products.filter((p) => (disease.productIds || []).includes(p.id))
      const expert = experts.find((e) => e.specialty === disease.expertSpecialty) || experts[5]

      const record = await prisma.diagnosis.create({
        data: {
          userId: req.user.id,
          filename: req.file.originalname,
          source,
          name: disease.name,
          plant: disease.plant,
          severity: disease.severity,
          confidence,
          description: disease.description,
          treatment: disease.treatment,
          productIds: (disease.productIds || []).join(','),
          expertId: expert.id,
        },
      })

      res.json({
        ...record,
        productIds: disease.productIds,
        products: recs,
        expert,
        warning,
        note:
          source === 'huggingface'
            ? 'Classified with Hugging Face plant-disease model.'
            : env.hfToken
              ? 'Hugging Face unavailable, used Khak local engine.'
              : 'Set HF_TOKEN to use the Hugging Face plant-disease model. Local engine used.',
      })
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/history', auth, async (req, res, next) => {
    try {
      const rows = await prisma.diagnosis.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } })
      res.json(rows)
    } catch (err) {
      next(err)
    }
  })

  app.delete('/api/history/:id', auth, async (req, res, next) => {
    try {
      await prisma.diagnosis.deleteMany({ where: { id: req.params.id, userId: req.user.id } })
      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/experts/:id/rate', auth, async (req, res, next) => {
    try {
      const expert = experts.find((e) => String(e.id) === String(req.params.id))
      if (!expert) return res.status(404).json({ message: 'Expert not found.' })
      const body = parseBody(rateSchema, { score: Number(req.body.score), comment: req.body.comment || '' })
      await prisma.rating.upsert({
        where: { userId_expertId: { userId: req.user.id, expertId: expert.id } },
        update: { score: body.score, comment: body.comment },
        create: { userId: req.user.id, expertId: expert.id, score: body.score, comment: body.comment },
      })
      res.json({ ok: true })
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/consultations', auth, async (req, res, next) => {
    try {
      const body = parseBody(consultSchema, req.body)
      const expert = experts.find((e) => String(e.id) === String(body.expertId))
      if (!expert) return res.status(404).json({ message: 'Expert not found.' })
      if (!expert.available) return res.status(409).json({ message: 'This expert is currently unavailable.' })
      const item = await prisma.consultation.create({
        data: {
          userId: req.user.id,
          expertId: expert.id,
          expertName: expert.name,
          topic: body.topic || expert.specialty,
          message: body.message,
          preferredDate: body.preferredDate || '',
        },
      })
      res.status(201).json(item)
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/consultations', auth, async (req, res, next) => {
    try {
      const rows = await prisma.consultation.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } })
      res.json(rows)
    } catch (err) {
      next(err)
    }
  })

  app.patch('/api/consultations/:id', auth, async (req, res, next) => {
    try {
      const body = parseBody(consultStatusSchema, req.body)
      const current = await prisma.consultation.findFirst({ where: { id: req.params.id, userId: req.user.id } })
      if (!current) return res.status(404).json({ message: 'Consultation not found.' })
      const allowed = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      }
      if (!allowed[current.status]?.includes(body.status)) {
        return res.status(409).json({ message: `Cannot change ${current.status} to ${body.status}.` })
      }
      const row = await prisma.consultation.update({ where: { id: current.id }, data: { status: body.status } })
      res.json(row)
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/orders', auth, async (req, res, next) => {
    try {
      const body = parseBody(orderSchema, req.body)
      const mapped = body.items.map((i) => {
        const product = products.find((p) => p.id === Number(i.id))
        if (!product) {
          const err = new Error('Invalid product')
          err.status = 400
          throw err
        }
        return { id: product.id, name: product.name, price: product.price, qty: i.qty }
      })
      const subtotal = mapped.reduce((s, i) => s + i.price * i.qty, 0)
      const shipping = subtotal >= 50 ? 0 : 4.5
      const order = await prisma.order.create({
        data: {
          userId: req.user.id,
          items: JSON.stringify(mapped),
          subtotal,
          shipping,
          total: subtotal + shipping,
        },
      })
      res.status(201).json({ ...order, items: mapped })
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/orders', auth, async (req, res, next) => {
    try {
      const rows = await prisma.order.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } })
      res.json(rows.map((o) => ({ ...o, items: JSON.parse(o.items || '[]') })))
    } catch (err) {
      next(err)
    }
  })

  app.use((err, _req, res, _next) => {
    const status = err.status || (err.message?.includes('Only image') ? 400 : 500)
    if (status >= 500) console.error(err)
    res.status(status).json({ message: err.message || 'Request failed.' })
  })

  return app
}
