import { Link } from 'react-router-dom'
import { Target } from 'lucide-react'

function Header() {
  return (
    <header className="bg-dark border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center space-x-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <span className="text-white text-xl font-semibold">FitFinder</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
