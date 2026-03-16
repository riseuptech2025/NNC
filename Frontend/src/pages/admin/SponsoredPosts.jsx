import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaPlus, FaEdit, FaTrash, FaChartLine } from 'react-icons/fa'
import useStore from '../../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const SponsoredPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const { token } = useStore()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    sponsorName: '',
    sponsorWebsite: '',
    image: null,
    sponsorLogo: null,
    category: 'Sponsored',
    tags: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    amount: '',
    paymentStatus: 'pending',
    isActive: true
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sponsored`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load sponsored posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      if (editingPost) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/sponsored/${editingPost._id}`,
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
      
      setShowForm(false)
      setEditingPost(null)
      resetForm()
      fetchPosts()
    } catch (error) {
      toast.error('Failed to save sponsored post')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      sponsorName: '',
      sponsorWebsite: '',
      image: null,
      sponsorLogo: null,
      category: 'Sponsored',
      tags: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      amount: '',
      paymentStatus: 'pending',
      isActive: true
    })
  }

  return (
    <>
      <Helmet>
        <title>Sponsored Posts - NNC Admin</title>
      </Helmet>

      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sponsored Posts</h1>
          <button
            onClick={() => {
              setEditingPost(null)
              resetForm()
              setShowForm(!showForm)
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>{showForm ? 'Cancel' : 'Create Sponsored Post'}</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingPost ? 'Edit Sponsored Post' : 'Create New Sponsored Post'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sponsor Name</label>
                  <input
                    type="text"
                    value={formData.sponsorName}
                    onChange={(e) => setFormData({...formData, sponsorName: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sponsor Website</label>
                  <input
                    type="url"
                    value={formData.sponsorWebsite}
                    onChange={(e) => setFormData({...formData, sponsorWebsite: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="Sponsored">Sponsored</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Politics">Politics</option>
                    <option value="International">International</option>
                    <option value="Shares">Shares</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sponsor Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, sponsorLogo: e.target.files[0]})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount (Rs.)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows="10"
                  required
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  placeholder="technology, 5G, telecom"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  {editingPost ? 'Update' : 'Create'} Sponsored Post
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Sponsor</th>
                <th className="px-6 py-3 text-left">Dates</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Performance</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id}>
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">{post.sponsorName}</td>
                  <td className="px-6 py-4">
                    {new Date(post.startDate).toLocaleDateString()} - <br />
                    {new Date(post.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      post.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      post.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {post.paymentStatus}
                    </span>
                    <br />
                    Rs. {post.amount}
                  </td>
                  <td className="px-6 py-4">
                    <div>Views: {post.impressions}</div>
                    <div>Clicks: {post.clicks}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <FaEdit />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <FaTrash />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <FaChartLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SponsoredPosts