import type {
  AuthResponse,
  Consultation,
  Diagnosis,
  Expert,
  Order,
  Product,
  User,
} from '../types'

export interface KhakApi {
  health: () => Promise<{ ok: boolean; hfConfigured?: boolean }>
  register: (body: { name: string; email: string; password: string }) => Promise<AuthResponse>
  login: (body: { email: string; password: string }) => Promise<AuthResponse>
  me: () => Promise<User>
  updateMe: (body: Partial<Pick<User, 'name' | 'city' | 'farm' | 'phone'>>) => Promise<User>
  products: () => Promise<Product[]>
  product: (id: string | number) => Promise<Product>
  experts: () => Promise<Expert[]>
  expert: (id: string | number) => Promise<Expert>
  rateExpert: (id: string | number, body: { score: number; comment: string }) => Promise<{ ok: boolean }>
  detect: (file: File, extra?: { plant?: string; symptoms?: string }) => Promise<Diagnosis>
  history: () => Promise<Diagnosis[]>
  deleteHistory: (id: string) => Promise<{ ok: boolean }>
  requestConsult: (body: {
    expertId: string | number
    topic?: string
    message: string
    preferredDate?: string
  }) => Promise<Consultation>
  consultations: () => Promise<Consultation[]>
  updateConsult: (id: string, status: string) => Promise<Consultation>
  checkout: (items: Array<{ id: number; qty: number }>) => Promise<Order>
  orders: () => Promise<Order[]>
}
