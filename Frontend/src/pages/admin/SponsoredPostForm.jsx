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
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiTag,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUploadCloud,
  FiInfo,
  FiGlobe,
  FiTrendingUp,
  FiStar,
  FiActivity
} from 'react-icons/fi'

const SponsoredPostForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [imagePreview, setImagePreview] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    sponsorName: '',
    sponsorWebsite: '',
    category: 'Sponsored',
    tags: '',
    image: null,
    sponsorLogo: null,
    targetUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: '',
    paymentStatus: 'pending',
    isActive: true
  })

  const categories = [
    { id: 'politics', name: 'Politics', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { id: 'international', name: 'International', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    { id: 'shares', name: 'Shares', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'technology', name: 'Technology', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    { id: 'sports', name: 'Sports', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    { id: 'business', name: 'Business', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
    { id: 'entertainment', name: 'Entertainment', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
    { id: 'health', name: 'Health', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
    { id: 'sponsored', name: 'Sponsored', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
  ]

  const paymentStatuses = [
    { id: 'pending', name: 'Pending', icon: FiClock, color: 'yellow' },
    { id: 'paid', name: 'Paid', icon: FiCheckCircle, color: 'green' },
    { id: 'cancelled', name: 'Cancelled', icon: FiX, color: 'red' }
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (id) {
      fetchPost()
    }
  }, [id, isAuthenticated])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sponsored/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const post = response.data
      setFormData({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
        startDate: post.startDate?.split('T')[0],
        endDate: post.endDate?.split('T')[0],
        image: null,
        sponsorLogo: null
      })
      if (post.image) setImagePreview(post.image)
      if (post.sponsorLogo) setLogoPreview(post.sponsorLogo)
    } catch (error) {
      toast.error('Failed to load sponsored post')
      navigate('/admin')
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

  const handleImageChange = (e, field, previewSetter) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB')
        return
      }
      setFormData(prev => ({ ...prev, [field]: file }))
      previewSetter(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formDataToSend.append('image', formData[key])
      } else if (key === 'sponsorLogo' && formData[key]) {
        formDataToSend.append('sponsorLogo', formData[key])
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/sponsored/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('Sponsored post updated successfully')
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/sponsored`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('Sponsored post created successfully')
      }
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save sponsored post')
    } finally {
      setSaving(false)
    }
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[status] || colors.pending
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sponsored post...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit Sponsored Post' : 'Create Sponsored Post'} - Admin Dashboard - NNC</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {id ? 'Edit Sponsored Post' : 'Create Sponsored Post'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {id ? 'Update your sponsored content details' : 'Create a new sponsored article for your client'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  form="sponsored-form"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 mr-2" />
                      {id ? 'Update Post' : 'Publish Post'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-4">
              {[
                { id: 'content', name: 'Article Content', icon: FiFileText },
                { id: 'sponsor', name: 'Sponsor Info', icon: FiBriefcase },
                { id: 'campaign', name: 'Campaign Settings', icon: FiTrendingUp }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
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
          <form id="sponsored-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Article Content Tab */}
                {activeTab === 'content' && (
                  <>
                    {/* Title Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <FiStar className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Article Title</h2>
                        </div>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter an engaging sponsored post title..."
                        />
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FiInfo className="w-4 h-4 mr-1" />
                          <span>Include [Sponsored] in title if required by guidelines</span>
                        </div>
                      </div>
                    </div>

                    {/* Description Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Short Description</h2>
                        </div>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                          placeholder="Write a compelling summary of the sponsored content..."
                        />
                      </div>
                    </div>

                    {/* Full Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <FiActivity className="w-5 h-5 text-green-600 dark:text-green-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Full Article Content</h2>
                        </div>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          required
                          rows="12"
                          className="w-full px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Write the full sponsored article content here..."
                        />
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.content.length} characters
                          </span>
                          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                            Sponsored Content
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Sponsor Information Tab */}
                {activeTab === 'sponsor' && (
                  <>
                    {/* Sponsor Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <FiBriefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sponsor Information</h2>
                        </div>

                        <div className="space-y-6">
                          {/* Sponsor Name & Website */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Sponsor Name *</label>
                              <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  name="sponsorName"
                                  value={formData.sponsorName}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="Company/Brand name"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Sponsor Website</label>
                              <div className="relative">
                                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="url"
                                  name="sponsorWebsite"
                                  value={formData.sponsorWebsite}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="https://example.com"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Target URL */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Target URL</label>
                            <div className="relative">
                              <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="url"
                                name="targetUrl"
                                value={formData.targetUrl}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="https://example.com/offer"
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Where users will be redirected (CTA destination)
                            </p>
                          </div>

                          {/* Sponsor Logo Upload */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Sponsor Logo</label>
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                              {logoPreview ? (
                                <div className="space-y-4">
                                  <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="max-h-20 mx-auto rounded-lg object-contain"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLogoPreview('')
                                      setFormData(prev => ({ ...prev, sponsorLogo: null }))
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                  >
                                    Remove logo
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <FiUploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    Upload sponsor logo
                                  </p>
                                  <label className="relative cursor-pointer">
                                    <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                      Choose Logo
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageChange(e, 'sponsorLogo', setLogoPreview)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                  </label>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Campaign Settings Tab */}
                {activeTab === 'campaign' && (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-6">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                            <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                          </div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Settings</h2>
                        </div>

                        <div className="space-y-6">
                          {/* Category & Tags */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Category</label>
                              <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Tags</label>
                              <div className="relative">
                                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  name="tags"
                                  value={formData.tags}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="tech, business, sponsored"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Featured Image */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Featured Image *</label>
                            <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                              {imagePreview ? (
                                <div className="space-y-4">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-40 mx-auto rounded-lg object-cover"
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
                                    Upload featured image
                                  </p>
                                  <label className="relative cursor-pointer">
                                    <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                      Choose Image
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageChange(e, 'image', setImagePreview)}
                                      required={!id && !imagePreview}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                  </label>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Campaign Dates */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Start Date *</label>
                              <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="date"
                                  name="startDate"
                                  value={formData.startDate}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">End Date *</label>
                              <div className="relative">
                                <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="date"
                                  name="endDate"
                                  value={formData.endDate}
                                  onChange={handleChange}
                                  required
                                  min={formData.startDate}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Payment Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Amount ($)</label>
                              <div className="relative">
                                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="number"
                                  name="amount"
                                  value={formData.amount}
                                  onChange={handleChange}
                                  min="0"
                                  step="0.01"
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Payment Status</label>
                              <div className="relative">
                                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <select
                                  name="paymentStatus"
                                  value={formData.paymentStatus}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                  {paymentStatuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Active Status */}
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <input
                              type="checkbox"
                              name="isActive"
                              id="isActive"
                              checked={formData.isActive}
                              onChange={handleChange}
                              className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="isActive" className="flex-1">
                              <span className="block font-medium text-gray-700 dark:text-gray-300">Active Campaign</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Post will be published immediately if start date is today
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Campaign Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Summary</h3>
                    
                    <div className="space-y-4">
                      {/* Sponsor Info */}
                      {formData.sponsorName && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                              <FiBriefcase className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sponsor</p>
                            <p className="font-medium text-gray-900 dark:text-white">{formData.sponsorName}</p>
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          categories.find(c => c.name === formData.category)?.color || 'bg-gray-100'
                        }`}>
                          {formData.category}
                        </span>
                      </div>

                      {/* Campaign Duration */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Campaign Duration</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 dark:text-white">
                            {new Date(formData.startDate).toLocaleDateString()}
                          </span>
                          <FiArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                          <span className="text-gray-900 dark:text-white">
                            {new Date(formData.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(formData.paymentStatus)}`}>
                          {formData.paymentStatus}
                        </span>
                      </div>

                      {/* Amount */}
                      {formData.amount && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            ${parseFloat(formData.amount).toFixed(2)}
                          </span>
                        </div>
                      )}

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

                      {/* Tags Preview */}
                      {formData.tags && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                          <div className="flex flex-wrap gap-1">
                            {formData.tags.split(',').map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-white dark:bg-gray-600 rounded-full text-xs">
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guidelines Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Sponsored Post Guidelines</h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Clearly mark content as "Sponsored"</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ensure sponsor disclosure is visible</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Follow FTC guidelines for sponsored content</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <FiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Verify all links are working</span>
                      </li>
                    </ul>
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

export default SponsoredPostForm