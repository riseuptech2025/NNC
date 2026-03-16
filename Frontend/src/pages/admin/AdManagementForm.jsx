import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import useStore from '../../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiImage,
  FiLink,
  FiCalendar,
  FiTarget,
  FiLayers,
  FiToggleLeft,
  FiCode,
  FiActivity,
  FiGlobe,
  FiFileText,
  FiTag,
  FiMapPin,
  FiClock,
  FiAward,
  FiUploadCloud,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'

const AdManagementForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [imagePreview, setImagePreview] = useState('')
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

  const adTypes = [
    { id: 'banner', name: 'Banner', icon: FiImage, description: 'Standard banner advertisement' },
    { id: 'sidebar', name: 'Sidebar', icon: FiLayers, description: 'Sidebar widget ad' },
    { id: 'in-article', name: 'In-Article', icon: FiFileText, description: 'Ad within article content' },
    { id: 'popup', name: 'Popup', icon: FiActivity, description: 'Pop-up advertisement' },
    { id: 'native', name: 'Native', icon: FiGlobe, description: 'Native/content ad' }
  ]

  const providers = [
    { id: 'direct', name: 'Direct', icon: FiLink, color: 'blue' },
    { id: 'sponsored', name: 'Sponsored', icon: FiAward, color: 'purple' },
    { id: 'google-adsense', name: 'Google AdSense', icon: FiCode, color: 'yellow' },
    { id: 'adsterra', name: 'Adsterra', icon: FiGlobe, color: 'green' }
  ]

  const positions = [
    { id: 'sidebar-top', name: 'Sidebar Top', category: 'sidebar', description: 'Top of sidebar' },
    { id: 'sidebar-middle', name: 'Sidebar Middle', category: 'sidebar', description: 'Middle of sidebar' },
    { id: 'sidebar-bottom', name: 'Sidebar Bottom', category: 'sidebar', description: 'Bottom of sidebar' },
    { id: 'after-1', name: 'After Paragraph 1', category: 'in-article', description: 'After first paragraph' },
    { id: 'after-2', name: 'After Paragraph 2', category: 'in-article', description: 'After second paragraph' },
    { id: 'after-3', name: 'After Paragraph 3', category: 'in-article', description: 'After third paragraph' },
    { id: 'in-article', name: 'In Article', category: 'in-article', description: 'Within article content' },
    { id: 'top-banner', name: 'Top Banner', category: 'banner', description: 'Top of page banner' },
    { id: 'bottom-banner', name: 'Bottom Banner', category: 'banner', description: 'Bottom of page banner' },
    { id: 'popup', name: 'Popup', category: 'popup', description: 'Popup overlay' }
  ]

  const pages = [
    { id: 'all', name: 'All Pages', icon: FiGlobe },
    { id: 'home', name: 'Homepage', icon: FiActivity },
    { id: 'category', name: 'Category Pages', icon: FiLayers },
    { id: 'article', name: 'Article Pages', icon: FiFileText },
    { id: 'search', name: 'Search Results', icon: FiTarget }
  ]

  const categories = [
    'Politics', 'International', 'Shares', 'Technology', 
    'Sports', 'Business', 'Entertainment', 'Health'
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
    setLoading(true)
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
      if (ad.image) {
        setImagePreview(ad.image)
      }
    } catch (error) {
      toast.error('Failed to load ad')
      navigate('/admin/ads')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key === 'pages' || key === 'categories') {
        formDataToSend.append(key, JSON.stringify(formData[key]))
      } else if (key === 'image' && formData[key]) {
        formDataToSend.append('image', formData[key])
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
      navigate('/admin/ads')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save ad')
    } finally {
      setSaving(false)
    }
  }

  const getProviderColor = (providerId) => {
    const provider = providers.find(p => p.id === providerId)
    const colors = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[provider?.color] || colors.blue
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading advertisement...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit Ad' : 'Create Ad'} - Admin Dashboard - NNC</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin/ads')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {id ? 'Edit Advertisement' : 'Create New Advertisement'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {id ? 'Update your ad settings and targeting' : 'Configure a new advertisement campaign'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  form="ad-form"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 mr-2" />
                      {id ? 'Update Ad' : 'Create Ad'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/admin/ads')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              {[
                { id: 'basic', name: 'Basic Info', icon: FiInfo },
                { id: 'content', name: 'Ad Content', icon: FiImage },
                { id: 'targeting', name: 'Targeting', icon: FiTarget },
                { id: 'schedule', name: 'Schedule', icon: FiCalendar }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="ad-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <>
                    {/* Ad Name Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad Name</h2>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Homepage Banner Ad - Q1 2024"
                        />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Give your ad a descriptive name for easy identification
                        </p>
                      </div>
                    </div>

                    {/* Provider Selection */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <FiLayers className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad Provider</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {providers.map(provider => (
                            <label
                              key={provider.id}
                              className={`
                                relative flex items-center p-4 border rounded-lg cursor-pointer transition-all
                                ${formData.provider === provider.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="provider"
                                value={provider.id}
                                checked={formData.provider === provider.id}
                                onChange={handleChange}
                                className="sr-only"
                                required
                              />
                              <provider.icon className={`w-5 h-5 mr-3 text-${provider.color}-500`} />
                              <div>
                                <span className="block font-medium text-gray-900 dark:text-white">
                                  {provider.name}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ad Type & Position */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <FiActivity className="w-5 h-5 text-green-600 dark:text-green-300" />
                              </div>
                              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad Type</h2>
                            </div>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              {adTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {adTypes.find(t => t.id === formData.type)?.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <FiMapPin className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                              </div>
                              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Position</h2>
                            </div>
                            <select
                              name="position"
                              value={formData.position}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                              {positions.map(pos => (
                                <option key={pos.id} value={pos.id}>{pos.name}</option>
                              ))}
                            </select>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {positions.find(p => p.id === formData.position)?.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <>
                    {formData.provider === 'google-adsense' || formData.provider === 'adsterra' ? (
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                              <FiCode className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad Code</h2>
                          </div>
                          <textarea
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            rows="8"
                            className="w-full px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder={`Paste your ${formData.provider} code here...`}
                          />
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-start space-x-3">
                              <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div className="text-sm text-blue-800 dark:text-blue-200">
                                <p className="font-medium mb-1">Important:</p>
                                <p>Make sure to paste the complete ad code including all script tags and formatting.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                                <FiImage className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                              </div>
                              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad Creative</h2>
                            </div>
                            
                            {/* Image Upload */}
                            <div className="mb-6">
                              <label className="block text-sm font-medium mb-2">Ad Image</label>
                              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                {imagePreview ? (
                                  <div className="space-y-4">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="max-h-40 mx-auto rounded-lg object-contain"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setImagePreview('')
                                        setFormData(prev => ({ ...prev, image: null }))
                                      }}
                                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                      Remove image
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      Drag and drop your ad image here, or
                                    </p>
                                    <label className="relative cursor-pointer">
                                      <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Browse files
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!id && !imagePreview}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      />
                                    </label>
                                  </>
                                )}
                              </div>
                              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Recommended: 728x90 for banners, 300x250 for sidebars. Max size: 2MB
                              </p>
                            </div>

                            {/* Destination URL */}
                            <div>
                              <label className="block text-sm font-medium mb-2">Destination URL</label>
                              <div className="relative">
                                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="url"
                                  name="link"
                                  value={formData.link}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="https://example.com"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Targeting Tab */}
                {activeTab === 'targeting' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                          <FiTarget className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Targeting Options</h2>
                      </div>

                      {/* Pages */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Target Pages</label>
                        <div className="grid grid-cols-2 gap-3">
                          {pages.map(page => (
                            <label
                              key={page.id}
                              className={`
                                flex items-center p-3 border rounded-lg cursor-pointer transition-all
                                ${formData.pages.includes(page.id)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={formData.pages.includes(page.id)}
                                onChange={() => handleMultiSelect('pages', page.id)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-3"
                              />
                              <page.icon className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{page.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Target Categories</label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map(category => (
                            <label
                              key={category}
                              className={`
                                flex items-center p-2 border rounded-lg cursor-pointer transition-all
                                ${formData.categories.includes(category)
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={formData.categories.includes(category)}
                                onChange={() => handleMultiSelect('categories', category)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                              />
                              <FiTag className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                          <FiCalendar className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule & Settings</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Start Date</label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              required
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-sm font-medium mb-2">End Date</label>
                          <div className="relative">
                            <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              min={formData.startDate}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Leave empty for unlimited</p>
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="block text-sm font-medium mb-2">Priority (1-10)</label>
                          <div className="relative">
                            <FiAward className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="number"
                              name="priority"
                              value={formData.priority}
                              onChange={handleChange}
                              min="1"
                              max="10"
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              name="isActive"
                              checked={formData.isActive}
                              onChange={handleChange}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <div>
                              <span className="block font-medium text-gray-700 dark:text-gray-300">Active</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Ad will start immediately if start date is today
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ad Summary</h3>
                    
                    <div className="space-y-4">
                      {/* Provider Badge */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Provider</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(formData.provider)}`}>
                          {providers.find(p => p.id === formData.provider)?.name || formData.provider}
                        </span>
                      </div>

                      {/* Type & Position */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {formData.type}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Position</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {positions.find(p => p.id === formData.position)?.name || formData.position}
                          </p>
                        </div>
                      </div>

                      {/* Schedule Info */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(formData.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        {formData.endDate && (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">End Date</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(formData.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                        <div className="flex items-center">
                          {formData.isActive ? (
                            <>
                              <FiCheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <FiAlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-yellow-600 dark:text-yellow-400 font-medium">Inactive</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Targeting Summary */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Targeting</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.pages.map(page => (
                            <span key={page} className="px-2 py-1 bg-white dark:bg-gray-600 rounded-full text-xs">
                              {pages.find(p => p.id === page)?.name || page}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdManagementForm