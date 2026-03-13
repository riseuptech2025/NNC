import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import useStore from '../../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdManagementForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'banner',
    provider: 'direct',
    code: '',
    image: null,
    link: '',
    position: 'sidebar-top',
    pages: ['all'],
    categories: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    priority: 1
  })

  const adTypes = ['banner', 'sidebar', 'in-article', 'popup', 'native']
  const providers = ['direct', 'sponsored', 'google-adsense', 'adsterra']
  const positions = [
    'sidebar-top', 'sidebar-middle', 'sidebar-bottom',
    'after-1', 'after-2', 'after-3', 'in-article',
    'top-banner', 'bottom-banner', 'popup'
  ]
  const pages = ['all', 'home', 'category', 'article', 'search']
  const categories = [
    'Politics', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health'
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (id) {
      fetchAd()
    }
  }, [id, isAuthenticated])

  const fetchAd = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const ad = response.data
      setFormData({
        ...ad,
        startDate: ad.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: ad.endDate?.split('T')[0] || '',
        image: null
      })
    } catch (error) {
      toast.error('Failed to load ad')
      navigate('/admin/ads')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleMultiSelect = (e, field) => {
    const options = e.target.options
    const selected = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value)
      }
    }
    setFormData(prev => ({ ...prev, [field]: selected }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataToSend = new FormData()
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'pages' || key === 'categories') {
        formDataToSend.append(key, JSON.stringify(formData[key]))
      } else if (key === 'image' && formData[key]) {
        formDataToSend.append('images', formData[key])
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/ads/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('Ad updated successfully')
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/ads`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('Ad created successfully')
      }
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save ad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit Ad' : 'Create Ad'} - NNC Admin</title>
      </Helmet>

      <div className="container-custom py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          {id ? 'Edit Advertisement' : 'Create New Advertisement'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ad Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="e.g., Homepage Banner Ad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Provider *</label>
                <select
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {providers.map(p => (
                    <option key={p} value={p}>{p.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ad Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {adTypes.map(type => (
                    <option key={type} value={type}>{type.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ad Code (for AdSense/Adsterra) */}
            {(formData.provider === 'google-adsense' || formData.provider === 'adsterra') && (
              <div>
                <label className="block text-sm font-medium mb-1">Ad Code *</label>
                <textarea
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                  placeholder="Paste your ad code here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the complete ad code provided by {formData.provider}
                </p>
              </div>
            )}

            {/* Direct/Sponsored Ad Content */}
            {(formData.provider === 'direct' || formData.provider === 'sponsored') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ad Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!id}
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 728x90 for banners, 300x250 for sidebars
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Destination URL *</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Targeting Options */}
            <div>
              <label className="block text-sm font-medium mb-1">Target Pages</label>
              <select
                multiple
                value={formData.pages}
                onChange={(e) => handleMultiSelect(e, 'pages')}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-32"
              >
                {pages.map(page => (
                  <option key={page} value={page}>{page.toUpperCase()}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Target Categories</label>
              <select
                multiple
                value={formData.categories}
                onChange={(e) => handleMultiSelect(e, 'categories')}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 h-32"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active immediately
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Saving...' : id ? 'Update Ad' : 'Create Ad'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default AdManagementForm