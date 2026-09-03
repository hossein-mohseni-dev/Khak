import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { PageSkeleton } from '../components/ui/Skeleton'

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })))
const Detect = lazy(() => import('../pages/Detect').then((m) => ({ default: m.Detect })))
const Experts = lazy(() => import('../pages/Experts').then((m) => ({ default: m.Experts })))
const ExpertDetail = lazy(() => import('../pages/ExpertDetail').then((m) => ({ default: m.ExpertDetail })))
const Consult = lazy(() => import('../pages/Consult').then((m) => ({ default: m.Consult })))
const Store = lazy(() => import('../pages/Store').then((m) => ({ default: m.Store })))
const ProductDetail = lazy(() => import('../pages/ProductDetail').then((m) => ({ default: m.ProductDetail })))
const Cart = lazy(() => import('../pages/Cart').then((m) => ({ default: m.Cart })))
const Login = lazy(() => import('../pages/Login').then((m) => ({ default: m.Login })))
const Signup = lazy(() => import('../pages/Signup').then((m) => ({ default: m.Signup })))
const Profile = lazy(() => import('../pages/Profile').then((m) => ({ default: m.Profile })))
const Dashboard = lazy(() => import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const History = lazy(() => import('../pages/History').then((m) => ({ default: m.History })))
const Consultations = lazy(() => import('../pages/Consultations').then((m) => ({ default: m.Consultations })))
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })))

function wrap(el: ReactNode) {
  return <Suspense fallback={<PageSkeleton />}>{el}</Suspense>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={wrap(<Home />)} />
      <Route path="/detect" element={wrap(<Detect />)} />
      <Route path="/experts" element={wrap(<Experts />)} />
      <Route path="/experts/:id" element={wrap(<ExpertDetail />)} />
      <Route path="/experts/:id/consult" element={wrap(<ProtectedRoute>{<Consult />}</ProtectedRoute>)} />
      <Route path="/store" element={wrap(<Store />)} />
      <Route path="/store/:id" element={wrap(<ProductDetail />)} />
      <Route path="/cart" element={wrap(<Cart />)} />
      <Route path="/login" element={wrap(<Login />)} />
      <Route path="/signup" element={wrap(<Signup />)} />
      <Route path="/profile" element={wrap(<ProtectedRoute>{<Profile />}</ProtectedRoute>)} />
      <Route path="/dashboard" element={wrap(<ProtectedRoute>{<Dashboard />}</ProtectedRoute>)} />
      <Route path="/history" element={wrap(<ProtectedRoute>{<History />}</ProtectedRoute>)} />
      <Route path="/consultations" element={wrap(<ProtectedRoute>{<Consultations />}</ProtectedRoute>)} />
      <Route path="*" element={wrap(<NotFound />)} />
    </Routes>
  )
}
