import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-soil-900 text-soil-300 py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-bold text-lg mb-3">Khak</p>
          <p className="text-sm leading-relaxed">Plant disease detection, expert advice and agrochemical products.</p>
        </div>
        <div>
          <h2 className="text-white font-medium mb-3">Product</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/detect" className="hover:text-white">Detect</Link></li>
            <li><Link to="/experts" className="hover:text-white">Experts</Link></li>
            <li><Link to="/store" className="hover:text-white">Store</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-white font-medium mb-3">Account</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/history" className="hover:text-white">History</Link></li>
            <li><Link to="/consultations" className="hover:text-white">Consultations</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-white font-medium mb-3">Contact</h2>
          <p className="text-sm">support@khak.app</p>
        </div>
      </div>
      <p className="text-center text-sm mt-10">© 2026 Khak. MIT License.</p>
    </footer>
  )
}
