import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'
import { useCart } from '../../state/CartContext'
import { useTheme } from '../../state/ThemeContext'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/detect', label: 'Detect' },
  { to: '/experts', label: 'Experts' },
  { to: '/store', label: 'Store' },
]

export function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { mode, setMode } = useTheme()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('block px-3 py-2 rounded-lg text-sm font-medium', isActive ? 'text-plant-600 bg-plant-50 dark:bg-soil-700' : 'text-soil-700 dark:text-soil-200')

  return (
    <header className="bg-white/90 dark:bg-soil-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-soil-200 dark:border-soil-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="w-10 h-10 bg-plant-600 rounded-xl flex items-center justify-center text-white font-bold">K</div>
          <span className="text-xl font-bold">Khak</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="theme">
            Theme
          </label>
          <select
            id="theme"
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="hidden sm:block text-xs border border-soil-200 dark:border-soil-600 rounded-lg px-2 py-2 bg-transparent"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <Link to="/cart" className="relative border border-soil-200 dark:border-soil-600 rounded-lg px-3 py-2 text-sm">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-plant-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/dashboard" className="text-sm font-medium">
                {user.name.split(' ')[0]}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="text-sm">
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          <Button variant="secondary" size="sm" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav">
            Menu
          </Button>
        </div>
      </div>
      {open && (
        <div id="mobile-nav" className="md:hidden border-t border-soil-200 dark:border-soil-700 px-4 py-3 space-y-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/history" className={linkClass} onClick={() => setOpen(false)}>
                History
              </NavLink>
              <NavLink to="/consultations" className={linkClass} onClick={() => setOpen(false)}>
                Consultations
              </NavLink>
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClass} onClick={() => setOpen(false)}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
