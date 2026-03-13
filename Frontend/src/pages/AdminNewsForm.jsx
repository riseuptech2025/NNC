import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import useStore from '../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const categories = [
  'Politics',
  'Technology',
  'Sports',
  'Business',
  'Entertainment',
  'Health'
]

const AdminNewsForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, token } = useStore()
  const [loading, setLoading] = useState(false)
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
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataToSend = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
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
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{id ? 'Edit News' : 'Add News'} - Admin - NNC</title>
      </Helmet>

      <div className="container-custom py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          {id ? 'Edit News' : 'Add New News'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter news title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter short description"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="10"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono"
                placeholder="Enter full news content"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g., politics, election, nepal"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isBreaking"
                  checked={formData.isBreaking}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Breaking News</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Trending News</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Saving...' : id ? 'Update News' : 'Create News'}
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

export default AdminNewsForm