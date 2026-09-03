import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/Modal'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Input } from '../components/ui/Input'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Textarea } from '../components/ui/Textarea'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useToast } from '../state/ToastContext'
import type { Expert } from '../types'
import { hasErrors, validateConsult } from '../utils/validation'

export function Consult() {
  usePageTitle('Consultation')
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const [expert, setExpert] = useState<Expert | null>(null)
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [photoName, setPhotoName] = useState('')
  const [field, setField] = useState<Record<string, string | undefined>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    api.expert(id).then((e) => { setExpert(e); setTopic(e.specialty) }).catch((err: Error) => setError(err.message)).finally(() => setLoading(false))
  }, [id])

  async function send() {
    const next = validateConsult({ message })
    setField(next)
    if (hasErrors(next) || !id) return
    setSaving(true)
    try {
      await api.requestConsult({ expertId: id, topic, message: photoName ? `${message}\n\nAttached photo: ${photoName}` : message, preferredDate })
      toast.push('Consultation requested')
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSaving(false)
      setConfirm(false)
    }
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Link to={`/experts/${id}`} className="text-sm text-plant-700">← Profile</Link>
      <h1 className="text-2xl font-bold mt-3">Request consultation</h1>
      <p className="text-soil-600 mb-4">{expert ? `${expert.name} · $${expert.fee}` : ''}</p>
      {error && <ErrorBanner message={error} />}
      <Card className="p-6 space-y-3">
        <Input label="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Input label="Preferred time" type="datetime-local" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
        <Textarea label="Describe the problem" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} error={field.message} />
        <Input label="Optional photo" type="file" accept="image/*" onChange={(e) => setPhotoName(e.target.files?.[0]?.name || '')} />
        <Button disabled={saving || expert?.available === false} onClick={() => setConfirm(true)}>Review and send</Button>
      </Card>
      <ConfirmDialog
        open={confirm}
        title="Send consultation request?"
        message={`This books ${expert?.name || 'the expert'} for the details you entered.`}
        confirmLabel="Send"
        onCancel={() => setConfirm(false)}
        onConfirm={send}
      />
    </div>
  )
}
