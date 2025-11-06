import { Link } from 'react-router-dom'


function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex justify-between items-center py-5 px-6">
          <Link 
            to="/" 
            className="text-2xl font-extrabold text-gray-900 tracking-tight hover:text-blue-600 transition-all duration-300 group"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              Salefni
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              to="/" 
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
            >
              Accueil
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/simulation" 
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
            >
              Simulation
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/admin" 
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
            >
              Administration
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60 mt-auto">
        <div className="container mx-auto text-center py-10">
          <p className="text-xs text-gray-500 font-semibold tracking-wide">&copy; 2025 Salefni. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

