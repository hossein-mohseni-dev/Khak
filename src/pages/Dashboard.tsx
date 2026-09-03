import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { PageSkeleton } from '../components/ui/Skeleton'
import { usePageTitle } from '../hooks/usePageTitle'
import { api } from '../services'
import { useAuth } from '../state/AuthContext'
import type { Consultation, Diagnosis, Order } from '../types'

export function Dashboard() {
  usePageTitle('Dashboard')
  const { user } = useAuth()
  const [history, setHistory] = useState<Diagnosis[]>([])
  const [consults, setConsults] = useState<Consultation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([api.history(), api.consultations(), api.orders()])
      .then(([h, c, o]) => {
        setHistory(h)
        setConsults(c)
        setOrders(o)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-soil-600">Hello {user?.name}</p>
        </div>
        <Link to="/profile"><Button variant="secondary" size="sm">Edit profile</Button></Link>
      </div>
      {error && <ErrorBanner message={error} onRetry={load} />}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><p className="text-sm text-soil-500">Detections</p><p className="text-2xl font-bold">{history.length}</p></Card>
        <Card className="p-5"><p className="text-sm text-soil-500">Consultations</p><p className="text-2xl font-bold">{consults.length}</p></Card>
        <Card className="p-5"><p className="text-sm text-soil-500">Orders</p><p className="text-2xl font-bold">{orders.length}</p></Card>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/detect"><Button>New detection</Button></Link>
        <Link to="/history"><Button variant="secondary">History</Button></Link>
        <Link to="/consultations"><Button variant="secondary">Consultations</Button></Link>
        <Link to="/store"><Button variant="secondary">Store</Button></Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="font-bold mb-3">Recent diagnoses</h2>
          {history.slice(0, 5).map((h) => (
            <p key={h.id} className="text-sm py-1">{h.name} · {h.confidence}%</p>
          ))}
        </Card>
        <Card className="p-5">
          <h2 className="font-bold mb-3">Consultation status</h2>
          {consults.slice(0, 5).map((c) => (
            <p key={c.id} className="text-sm py-1">{c.expertName} · {c.status}</p>
          ))}
          <Link to="/consultations" className="text-sm text-plant-700 mt-2 inline-block">Manage statuses</Link>
        </Card>
      </div>
    </div>
  )
}
