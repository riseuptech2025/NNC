import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaSearch, 
  FaUser, 
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCog,
  FaAd,
  FaDollarSign,
  FaChartLine
} from 'react-icons/fa'
import useStore from '../store/useStore'

const categories = [
  'Politics',
  'International',
  'Shares',
  'Technology',
  'Sports',
  'Business',
  'Entertainment',
  'Health'
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { darkMode, setDarkMode, isAuthenticated, logout, setSearchQuery } = useStore()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm)
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
      setIsOpen(false)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">NNC</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
              Nepali News Center
            </span>
          </Link>

          {/* Mobile Search Bar - Only visible on mobile */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs mx-2 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 pr-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <FaSearch className="absolute left-2.5 top-2 text-gray-400 text-sm" />
            </div>
          </form>

          {/* Desktop Search - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <FaUser />
                  <span>Admin</span>
                </button>
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border dark:border-gray-700">
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/news/new"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      Add News
                    </Link>
                    <Link
                      to="/admin/ads/new"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FaAd className="text-blue-500" />
                        <span>Add Ad</span>
                      </div>
                    </Link>
                    <Link
                      to="/admin/sponsored/new"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FaDollarSign className="text-green-500" />
                        <span>Add Sponsored</span>
                      </div>
                    </Link>
                    <Link
                      to="/admin/seo"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FaCog className="text-gray-500" />
                        <span>SEO Settings</span>
                      </div>
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        logout()
                        setShowAdminMenu(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center space-x-2">
                <FaUser />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Empty div for mobile layout balance - no menu button */}
          <div className="md:hidden w-8"></div>
        </div>

        {/* Categories - Hidden on mobile */}
        <div className="hidden md:flex space-x-6 py-2 border-t dark:border-gray-700">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar