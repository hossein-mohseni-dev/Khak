import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFound() {
  usePageTitle('Not found')
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-5xl font-bold text-plant-600 mb-3">404</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-soil-600 mb-6">That route does not exist in Khak.</p>
      <Link to="/"><Button>Back home</Button></Link>
    </div>
  )
}
