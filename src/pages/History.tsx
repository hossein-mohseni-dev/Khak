import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Input } from '../components/ui/Input'
import { PageSkeleton } from '../components/ui/Skeleton'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import type { Diagnosis } from '../types'
import { filterHistory } from '../utils/filters'

export function History() {
  usePageTitle('Diagnosis history')
  const [rows, setRows] = useState<Diagnosis[]>([])
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState('All')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const debounced = useDebouncedValue(search)

  const load = () => {
    setLoading(true)
    api.history().then(setRows).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = useMemo(() => filterHistory(rows, { search: debounced, severity, sort }), [rows, debounced, severity, sort])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Diagnosis history</h1>
      {error && <ErrorBanner message={error} onRetry={load} />}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Input placeholder="Search disease or plant" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-xl border px-3" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option>All</option>
          <option>Mild</option>
          <option>Moderate</option>
          <option>Severe</option>
        </select>
        <select className="rounded-xl border px-3" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No diagnoses yet" message="Run a detection to fill this list." actionTo="/detect" actionLabel="Detect now" />
      ) : (
        <div className="space-y-3">
          {filtered.map((h) => (
            <Card key={h.id} className="p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium">{h.name}</p>
                  <p className="text-xs text-soil-500">{h.plant} · {new Date(h.createdAt).toLocaleString()} · {h.confidence}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{h.severity}</Badge>
                  <button className="text-xs text-red-600" onClick={() => setPendingId(h.id)}>Delete</button>
                </div>
              </div>
              <p className="text-sm mt-2">{h.treatment}</p>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={Boolean(pendingId)}
        title="Delete diagnosis?"
        message="This removes the record from your history."
        confirmLabel="Delete"
        onCancel={() => setPendingId(null)}
        onConfirm={async () => {
          if (pendingId) {
            await api.deleteHistory(pendingId)
            setRows((list) => list.filter((x) => x.id !== pendingId))
          }
          setPendingId(null)
        }}
      />
    </div>
  )
}
