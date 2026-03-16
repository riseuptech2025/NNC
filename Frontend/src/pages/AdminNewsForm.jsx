import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import useStore from '../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  FiArrowLeft,
  FiSave,
  FiX,
  FiImage,
  FiTag,
  FiType,
  FiAlignLeft,
  FiList,
  FiAlertCircle,
  FiTrendingUp,
  FiUploadCloud
} from 'react-icons/fi'

const categories = [
  { id: 'politics', name: 'Politics', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { id: 'international', name: 'International', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'shares', name: 'Shares', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'technology', name: 'Technology', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 'sports', name: 'Sports', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { id: 'business', name: 'Business', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  { id: 'entertainment', name: 'Entertainment', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  { id: 'health', name: 'Health', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' }
]

const AdminNewsForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Politics',
    tags: '',
    image: null,
    isBreaking: false,
    isTrending: false
  })
  const [imagePreview, setImagePreview] = useState('')
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (id) {
      fetchNews()
    }
  }, [id, isAuthenticated])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/${id}`)
      const news = response.data
      setFormData({
        title: news.title,
        description: news.description,
        content: news.content,
        category: news.category,
        tags: news.tags?.join(', ') || '',
        image: null,
        isBreaking: news.isBreaking,
        isTrending: news.isTrending
      })
      setImagePreview(news.image)
    } catch (error) {
      toast.error('Failed to load news')
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    } else {
      toast.error('Please upload an image file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const formDataToSend = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/news/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('News updated successfully')
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/news`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        )
        toast.success('News created successfully')
      }
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save news')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit News' : 'Add News'} - Admin Dashboard - NNC</title>
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
                    {id ? 'Edit News Article' : 'Create New News Article'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {id ? 'Update the news article details below' : 'Fill in the details to create a new news article'}
                  </p>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  form="news-form"
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
                      {id ? 'Update Article' : 'Publish Article'}
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
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form id="news-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FiType className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Article Title</h2>
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-shadow"
                      placeholder="Enter an engaging title..."
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Tip: Keep it concise and attention-grabbing (max 100 characters)
                    </p>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <FiAlignLeft className="w-5 h-5 text-green-600 dark:text-green-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Short Description</h2>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                      placeholder="Write a brief summary of the article..."
                    />
                  </div>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <FiList className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Full Content</h2>
                    </div>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows="12"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                      placeholder="Write your article content here..."
                    />
                    <div className="mt-2 flex justify-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.content.length} characters
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Category Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <FiList className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Category</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <label
                          key={cat.id}
                          className={`
                            relative flex items-center justify-center px-3 py-2 rounded-lg border cursor-pointer
                            ${formData.category === cat.name 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={cat.name}
                            checked={formData.category === cat.name}
                            onChange={handleChange}
                            className="sr-only"
                            required
                          />
                          <span className={`text-sm font-medium ${cat.color.split(' ')[0]} ${cat.color.split(' ')[1]}`}>
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Upload Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                        <FiImage className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Image</h2>
                    </div>
                    
                    {/* Drag & Drop Area */}
                    <div
                      className={`
                        relative border-2 border-dashed rounded-lg p-4 text-center
                        ${dragActive 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                        transition-colors
                      `}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg object-cover"
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
                            Drag and drop your image here, or
                          </p>
                          <label className="relative cursor-pointer">
                            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Browse files
                            </span>
                            <input
                              type="file"
                              name="image"
                              onChange={handleImageChange}
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </label>
                          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags & Flags Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6">
                    {/* Tags */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                          <FiTag className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h2>
                      </div>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="politics, election, nepal"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Separate tags with commas
                      </p>
                    </div>

                    {/* Flags */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Article Flags</h3>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            name="isBreaking"
                            checked={formData.isBreaking}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <div className="ml-3 flex items-center">
                            <FiAlertCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breaking News</span>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            name="isTrending"
                            checked={formData.isTrending}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <div className="ml-3 flex items-center">
                            <FiTrendingUp className="w-4 h-4 text-orange-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trending News</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Card (Optional) */}
                {formData.title && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Live Preview</h3>
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {formData.title || 'Article Title'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {formData.description || 'Article description will appear here...'}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${categories.find(c => c.name === formData.category)?.color || 'bg-gray-100'}`}>
                            {formData.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdminNewsForm