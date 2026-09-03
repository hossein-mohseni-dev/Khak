import { products, experts, getDiseaseByName, diseases } from '../data/catalog.js'
import type {
  AuthResponse,
  Consultation,
  ConsultStatus,
  Diagnosis,
  Expert,
  Order,
  Product,
  User,
} from '../types'
import type { KhakApi } from './contracts'

const USERS = 'khak_mock_users'
const SESSION = 'khak_mock_session'
const HISTORY = 'khak_mock_history'
const CONSULTS = 'khak_mock_consults'
const ORDERS = 'khak_mock_orders'
const RATINGS = 'khak_mock_ratings'

function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || '') as T
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function delay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

function currentUser(): User {
  const id = localStorage.getItem(SESSION)
  const users = read<User[]>(USERS, [])
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error('Please sign in.')
  return user
}

function seed() {
  const users = read<User[]>(USERS, [])
  if (!users.some((u) => u.email === 'demo@khak.app')) {
    users.push({
      id: 'u_demo',
      name: 'Demo Farmer',
      email: 'demo@khak.app',
      city: 'Tehran',
      farm: 'Greenhouse #2',
      phone: '+98 900 000 0000',
      createdAt: new Date().toISOString(),
    })
    write(USERS, users)
  }
}

seed()

export const mockApi: KhakApi = {
  health: () => delay({ ok: true, hfConfigured: false }),
  async register({ name, email, password }) {
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')
    const users = read<User[]>(USERS, [])
    if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists.')
    const user: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      city: '',
      farm: '',
      phone: '',
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    write(USERS, users)
    localStorage.setItem(SESSION, user.id)
    return delay({ token: `mock.${user.id}`, user })
  },
  async login({ email, password }) {
    if (email === 'demo@khak.app' && password !== 'Demo123!') throw new Error('Invalid email or password.')
    const users = read<User[]>(USERS, [])
    const user = users.find((u) => u.email === email)
    if (!user) throw new Error('Invalid email or password.')
    localStorage.setItem(SESSION, user.id)
    return delay({ token: `mock.${user.id}`, user } satisfies AuthResponse)
  },
  async me() {
    return delay(currentUser())
  },
  async updateMe(body) {
    const users = read<User[]>(USERS, [])
    const cur = currentUser()
    const next = { ...cur, ...body }
    write(
      USERS,
      users.map((u) => (u.id === cur.id ? next : u)),
    )
    return delay(next)
  },
  products: () => delay(products as Product[]),
  product: (id) => {
    const product = (products as Product[]).find((p) => String(p.id) === String(id))
    if (!product) return Promise.reject(new Error('Product not found.'))
    return delay(product)
  },
  experts: () => delay(experts as Expert[]),
  expert: (id) => {
    const expert = (experts as Expert[]).find((e) => String(e.id) === String(id))
    if (!expert) return Promise.reject(new Error('Expert not found.'))
    return delay(expert)
  },
  async rateExpert() {
    currentUser()
    return delay({ ok: true })
  },
  async detect(file, extra) {
    currentUser()
    const name = file.name.toLowerCase()
    const hit = diseases.find((d) => d.keywords.some((k) => name.includes(k))) || diseases[0]
    const disease = getDiseaseByName(hit.name)
    const rec: Diagnosis = {
      id: `h_${Date.now()}`,
      createdAt: new Date().toISOString(),
      filename: file.name,
      source: 'mock-engine',
      name: disease.name,
      plant: extra?.plant || disease.plant,
      severity: disease.severity,
      confidence: disease.confidenceBase,
      description: disease.description,
      treatment: disease.treatment,
      productIds: disease.productIds,
      products: (products as Product[]).filter((p) => disease.productIds.includes(p.id)),
      expert: (experts as Expert[]).find((e) => e.specialty === disease.expertSpecialty),
      symptoms: extra?.symptoms,
      note: 'Mock diagnosis adapter. Swap VITE_USE_MOCK=false to use the live API.',
    }
    const history = read<Diagnosis[]>(HISTORY, [])
    write(HISTORY, [rec, ...history])
    return delay(rec, 500)
  },
  history: () => delay(read<Diagnosis[]>(HISTORY, []).filter(() => true)),
  async deleteHistory(id) {
    write(
      HISTORY,
      read<Diagnosis[]>(HISTORY, []).filter((h) => h.id !== id),
    )
    return delay({ ok: true })
  },
  async requestConsult(body) {
    const expert = (experts as Expert[]).find((e) => String(e.id) === String(body.expertId))
    if (!expert) throw new Error('Expert not found.')
    const item: Consultation = {
      id: `c_${Date.now()}`,
      expertId: expert.id,
      expertName: expert.name,
      topic: body.topic || expert.specialty,
      message: body.message,
      preferredDate: body.preferredDate || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const list = read<Consultation[]>(CONSULTS, [])
    write(CONSULTS, [item, ...list])
    return delay(item)
  },
  consultations: () => delay(read<Consultation[]>(CONSULTS, [])),
  async updateConsult(id, status) {
    const list = read<Consultation[]>(CONSULTS, [])
    const current = list.find((c) => c.id === id)
    if (!current) throw new Error('Consultation not found.')
    const allowed: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    }
    if (!allowed[current.status]?.includes(status)) {
      throw new Error(`Cannot change ${current.status} to ${status}.`)
    }
    const next = list.map((c) => (c.id === id ? { ...c, status: status as ConsultStatus } : c))
    write(CONSULTS, next)
    return delay(next.find((c) => c.id === id) as Consultation)
  },
  async checkout(items) {
    const mapped = items.map((i) => {
      const product = (products as Product[]).find((p) => p.id === i.id)
      if (!product) throw new Error('Invalid product')
      return { id: product.id, name: product.name, price: product.price, unit: product.unit, qty: i.qty }
    })
    const subtotal = mapped.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal >= 50 ? 0 : 4.5
    const order: Order = {
      id: `o_${Date.now()}`,
      items: mapped,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    write(ORDERS, [order, ...read<Order[]>(ORDERS, [])])
    return delay(order)
  },
  orders: () => delay(read<Order[]>(ORDERS, [])),
}

void RATINGS
