import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import { hasErrors, validateLogin } from '../utils/validation'

export function Login() {
  usePageTitle('Login')
  const { login, user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/dashboard'
  const [email, setEmail] = useState('demo@khak.app')
  const [password, setPassword] = useState('Demo123!')
  const [error, setError] = useState('')
  const [field, setField] = useState<Record<string, string | undefined>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, from, navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validateLogin(email, password)
    setField(next)
    if (hasErrors(next)) return
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      toast.push('Welcome back.')
      navigate(from)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-soil-500 mb-6">Sign in to Khak</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={field.email} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={field.password} />
          <Button className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <p className="text-xs text-soil-500 mt-4">Demo: demo@khak.app / Demo123!</p>
        <p className="text-sm mt-4">No account? <Link className="text-plant-700" to="/signup">Sign up</Link></p>
      </Card>
    </div>
  )
}
