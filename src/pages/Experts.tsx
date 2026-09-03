import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { Input } from '../components/ui/Input'
import { PageSkeleton } from '../components/ui/Skeleton'
import { specialties } from '../data/catalog.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import type { Expert } from '../types'
import { filterExperts } from '../utils/filters'

export function Experts() {
  usePageTitle('Experts')
  const [list, setList] = useState<Expert[]>([])
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const debounced = useDebouncedValue(search)
  const load = () => {
    setLoading(true)
    api.experts().then(setList).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }
  useEffect(load, [])
  const filtered = useMemo(() => filterExperts(list, { search: debounced, specialty }), [list, debounced, specialty])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Experts</h1>
      <Input className="mb-3" placeholder="Search name, city, specialty" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex flex-wrap gap-2 mb-6">
        {(specialties as string[]).map((s) => (
          <button key={s} onClick={() => setSpecialty(s)} className={`px-3 py-1.5 rounded-full text-sm ${specialty === s ? 'bg-plant-600 text-white' : 'bg-soil-100'}`}>{s}</button>
        ))}
      </div>
      {loading && <PageSkeleton />}
      {error && <ErrorBanner message={error} onRetry={load} />}
      {!loading && filtered.length === 0 && <EmptyState title="No experts" message="Try another filter." />}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <Card key={e.id} className="p-5 flex flex-col">
            <div className="flex justify-between">
              <h2 className="font-bold">{e.name}</h2>
              <Badge tone={e.available ? 'ok' : 'neutral'}>{e.available ? 'Available' : 'Busy'}</Badge>
            </div>
            <p className="text-sm text-plant-700">{e.specialty}</p>
            <p className="text-sm my-2 flex-1">{e.bio}</p>
            <p className="text-xs text-soil-500 mb-3">★ {e.rating} · {e.location}</p>
            <div className="flex gap-2">
              <Link to={`/experts/${e.id}`} className="flex-1"><Button variant="secondary" className="w-full">Profile</Button></Link>
              <Link to={e.available ? `/experts/${e.id}/consult` : '#'} className="flex-1"><Button className="w-full" disabled={!e.available}>Consult</Button></Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
