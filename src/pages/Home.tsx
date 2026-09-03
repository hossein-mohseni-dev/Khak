import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export function Home() {
  usePageTitle('Home')
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <p className="text-plant-700 font-medium mb-3">Plant health platform</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Detect your plant’s disease <span className="text-plant-600">smartly</span>
          </h1>
          <p className="text-soil-600 dark:text-soil-300 text-lg mb-8 max-w-lg">
            Upload a leaf photo, add symptoms, get a diagnosis, then talk to an expert or order a product.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/detect"><Button>Start Free Detection</Button></Link>
            <Link to="/experts"><Button variant="secondary">View Experts</Button></Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-72 h-72 rounded-full bg-plant-50 dark:bg-soil-800 flex items-center justify-center text-6xl" aria-hidden>
            🌿
          </div>
        </div>
      </section>
    </>
  )
}
