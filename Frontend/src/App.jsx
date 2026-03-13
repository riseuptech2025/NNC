import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useStore from './store/useStore'

// Layout Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import SingleNews from './pages/SingleNews'
import CategoryPage from './pages/CategoryPage'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminNewsForm from './pages/AdminNewsForm'
import AdManagementForm from './pages/admin/AdManagementForm'
import SponsoredPostForm from './pages/admin/SponsoredPostForm'
import SEOSettings from './pages/admin/SEOSettings'
import SearchResults from './pages/SearchResults'
import ProfilePage from './pages/ProfilePage'
import NotFound from './pages/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { darkMode } = useStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/news/:id" element={<SingleNews />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/news/new" 
            element={
              <ProtectedRoute>
                <AdminNewsForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/news/edit/:id" 
            element={
              <ProtectedRoute>
                <AdminNewsForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/ads/new" 
            element={
              <ProtectedRoute>
                <AdManagementForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/ads/edit/:id" 
            element={
              <ProtectedRoute>
                <AdManagementForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/sponsored/new" 
            element={
              <ProtectedRoute>
                <SponsoredPostForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/sponsored/edit/:id" 
            element={
              <ProtectedRoute>
                <SponsoredPostForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/seo" 
            element={
              <ProtectedRoute>
                <SEOSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#fff' : '#1f2937',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App