import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import { hasErrors, validateProfile } from '../utils/validation'

export function Profile() {
  usePageTitle('Profile')
  const { user, refresh } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || '',
    farm: user?.farm || '',
    phone: user?.phone || '',
  })
  const [field, setField] = useState<Record<string, string | undefined>>({})
  const [saving, setSaving] = useState(false)

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Card className="p-6">
        <p className="text-sm text-soil-500 mb-4">{user?.email}</p>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            const next = validateProfile(form)
            setField(next)
            if (hasErrors(next)) return
            setSaving(true)
            await api.updateMe(form)
            await refresh()
            toast.push('Profile updated')
            setSaving(false)
          }}
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={field.name} />
          <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <Input label="Farm" value={form.farm} onChange={(e) => setForm({ ...form, farm: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </form>
      </Card>
    </div>
  )
}
