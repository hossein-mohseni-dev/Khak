import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { AppRoutes } from './app/routes'
import { AuthProvider } from './state/AuthContext'
import { CartProvider } from './state/CartContext'
import { ThemeProvider } from './state/ThemeContext'
import { ToastProvider } from './state/ToastContext'
import './index.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-soil-50 text-soil-900 dark:bg-soil-900 dark:text-soil-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded-lg">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
