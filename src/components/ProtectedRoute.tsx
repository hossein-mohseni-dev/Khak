import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { PageSkeleton } from './ui/Skeleton'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <PageSkeleton />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
