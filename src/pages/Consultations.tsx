import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageSkeleton } from '../components/ui/Skeleton'
import { Tabs } from '../components/ui/Tabs'
import { useAsync } from '../hooks/useAsync'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useToast } from '../state/ToastContext'
import type { Consultation, ConsultStatus } from '../types'
import { canTransition, CONSULT_STATUSES, nextStatuses, statusLabel, statusTone } from '../utils/consultStatus'

export function Consultations() {
  usePageTitle('Consultations')
  const toast = useToast()
  const loader = useCallback(() => api.consultations(), [])
  const { data, error, loading, reload, setData } = useAsync<Consultation[]>(loader)
  const [filter, setFilter] = useState<'all' | ConsultStatus>('all')
  const [pending, setPending] = useState<{ id: string; status: ConsultStatus } | null>(null)

  const rows = data || []
  const visible = useMemo(
    () => (filter === 'all' ? rows : rows.filter((c) => c.status === filter)),
    [rows, filter],
  )

  async function applyStatus(id: string, status: ConsultStatus) {
    const current = rows.find((c) => c.id === id)
    if (!current || !canTransition(current.status, status)) return
    const updated = await api.updateConsult(id, status)
    setData((list) => (list || []).map((c) => (c.id === id ? updated : c)))
    toast.push(`Marked as ${statusLabel(status)}`)
    setPending(null)
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Consultations</h1>
      <p className="text-soil-600 dark:text-soil-300 mb-6">Track pending, confirmed, completed and cancelled requests.</p>
      {error && <ErrorBanner message={error} onRetry={reload} />}
      <Tabs
        tabs={[{ id: 'all', label: 'All' }, ...CONSULT_STATUSES.map((s) => ({ id: s, label: statusLabel(s) }))]}
        value={filter}
        onChange={(id) => setFilter(id as typeof filter)}
      />
      {visible.length === 0 ? (
        <EmptyState title="No consultations" message="Book an expert to see statuses here." actionTo="/experts" actionLabel="Find an expert" />
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((c) => (
            <li key={c.id}>
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="font-medium">{c.expertName}</p>
                    <p className="text-sm text-soil-600">{c.topic}</p>
                    <p className="text-sm mt-2">{c.message}</p>
                    <p className="text-xs text-soil-500 mt-2">
                      {new Date(c.createdAt).toLocaleString()}
                      {c.preferredDate ? ` · preferred ${c.preferredDate}` : ''}
                    </p>
                  </div>
                  <Badge tone={statusTone(c.status)}>{statusLabel(c.status)}</Badge>
                </div>
                {nextStatuses(c.status).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {nextStatuses(c.status).map((status) => (
                      <Button key={status} size="sm" variant={status === 'cancelled' ? 'danger' : 'secondary'} onClick={() => setPending({ id: c.id, status })}>
                        Mark {statusLabel(status)}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm mt-6">
        <Link to="/experts" className="text-plant-700">Request another consult</Link>
      </p>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Change consultation status?"
        message={pending ? `This will set the request to ${statusLabel(pending.status)}.` : ''}
        confirmLabel="Update"
        onCancel={() => setPending(null)}
        onConfirm={() => pending && applyStatus(pending.id, pending.status)}
      />
    </div>
  )
}
