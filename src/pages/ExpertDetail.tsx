import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Textarea } from '../components/ui/Textarea'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'
import type { Expert } from '../types'

export function ExpertDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const toast = useToast()
  const [expert, setExpert] = useState<Expert | null>(null)
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageTitle(expert?.name || 'Expert')

  const load = () => {
    if (!id) return
    setLoading(true)
    api.expert(id).then(setExpert).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [id])

  if (loading) return <PageSkeleton />
  if (error) return <div className="max-w-3xl mx-auto px-4 py-10"><ErrorBanner message={error} onRetry={load} /></div>
  if (!expert) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/experts" className="text-sm text-plant-700">← Experts</Link>
      <Card className="p-6 mt-4">
        <h1 className="text-2xl font-bold">{expert.name}</h1>
        <p className="text-plant-700">{expert.specialty}</p>
        <p className="text-sm text-soil-500">{expert.location} · {expert.experience} · ★ {expert.rating}</p>
        <p className="mt-4">{expert.bio}</p>
        <p className="text-sm mt-3">{expert.education}</p>
        {expert.available ? (
          <Link to={`/experts/${expert.id}/consult`} className="inline-block mt-4"><Button>Request consult · ${expert.fee}</Button></Link>
        ) : (
          <p className="mt-4 text-sm">Currently unavailable</p>
        )}
      </Card>
      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!user) return toast.push('Sign in to rate', 'error')
          await api.rateExpert(expert.id, { score, comment })
          toast.push('Rating saved')
          setComment('')
          load()
        }}
      >
        <h2 className="font-bold">Rate this expert</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setScore(n)} className={`w-10 h-10 rounded-lg border ${score >= n ? 'bg-amber-400' : ''}`}>{n}</button>
          ))}
        </div>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment" />
        <Button type="submit">Submit rating</Button>
      </form>
    </div>
  )
}
