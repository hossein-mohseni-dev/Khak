import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import { hasErrors, validateRegister } from '../utils/validation'

export function Signup() {
  usePageTitle('Sign up')
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [field, setField] = useState<Record<string, string | undefined>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validateRegister(form)
    setField(next)
    if (hasErrors(next)) return
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.push('Account created.')
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-3" noValidate>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={field.name} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={field.email} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={field.password} />
          <Input label="Confirm password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={field.confirm} />
          <Button className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
        </form>
        <p className="text-sm mt-4">Have an account? <Link className="text-plant-700" to="/login">Sign in</Link></p>
      </Card>
    </div>
  )
}
