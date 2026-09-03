export type Severity = 'Mild' | 'Moderate' | 'Severe' | 'Unknown'

export type ConsultStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface User {
  id: string
  name: string
  email: string
  city: string
  farm: string
  phone: string
  createdAt: string
}

export interface ProductReview {
  author: string
  score: number
  text: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  unit: string
  rating: number
  reviews: number
  stock: number
  description: string
  suitable: string[]
  treats: string[]
  usage: string
  customerReviews?: ProductReview[]
}

export interface Expert {
  id: number
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  location: string
  available: boolean
  languages: string[]
  fee: number
  bio: string
  education: string
  recentRatings?: Array<{ score: number; comment: string; createdAt?: string }>
}

export interface Diagnosis {
  id: string
  createdAt: string
  filename: string
  source: string
  name: string
  plant: string
  severity: string
  confidence: number
  description: string
  treatment: string
  productIds?: number[] | string
  products?: Product[]
  expert?: Expert
  note?: string
  warning?: string
  symptoms?: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  unit: string
  qty: number
}

export interface Consultation {
  id: string
  expertId: number
  expertName: string
  topic: string
  message: string
  preferredDate: string
  status: ConsultStatus | string
  createdAt: string
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: string
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export type ThemeMode = 'light' | 'dark' | 'system'
