import type { KhakApi } from './contracts'
import { request } from './http'

export const liveApi: KhakApi = {
  health: () => request('/api/health'),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/me'),
  updateMe: (body) => request('/api/me', { method: 'PUT', body: JSON.stringify(body) }),
  products: () => request('/api/products'),
  product: (id) => request(`/api/products/${id}`),
  experts: () => request('/api/experts'),
  expert: (id) => request(`/api/experts/${id}`),
  rateExpert: (id, body) => request(`/api/experts/${id}/rate`, { method: 'POST', body: JSON.stringify(body) }),
  detect: (file) => {
    const form = new FormData()
    form.append('image', file)
    return request('/api/detect', { method: 'POST', body: form })
  },
  history: () => request('/api/history'),
  deleteHistory: (id) => request(`/api/history/${id}`, { method: 'DELETE' }),
  requestConsult: (body) => request('/api/consultations', { method: 'POST', body: JSON.stringify(body) }),
  consultations: () => request('/api/consultations'),
  updateConsult: (id, status) =>
    request(`/api/consultations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  checkout: (items) => request('/api/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  orders: () => request('/api/orders'),
}
