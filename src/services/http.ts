const TOKEN_KEY = 'khak_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const base = import.meta.env.VITE_API_URL || ''
  let res: Response
  try {
    res = await fetch(`${base}${path}`, { ...options, headers })
  } catch {
    const err = new Error('Cannot reach the Khak API. Start it with npm run dev, or enable mock mode.')
    throw err
  }
  const data = (await res.json().catch(() => ({}))) as T & { message?: string }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`)
  }
  return data
}
