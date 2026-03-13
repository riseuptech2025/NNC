import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaPlus, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa'
import useStore from '../../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdManagement = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const { token } = useStore()

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

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAds(response.data)
    } catch (error) {
      console.error('Error fetching ads:', error)
      toast.error('Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (key === 'pages' || key === 'categories') {
        formDataToSend.append(key, JSON.stringify(formData[key]))
      } else if (formData[key] !== null) {
        formDataToSend.append(key, formData[key])
      }
    })

    try {
      if (editingAd) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/ads/${editingAd._id}`,
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
      
      setShowForm(false)
      setEditingAd(null)
      resetForm()
      fetchAds()
    } catch (error) {
      toast.error('Failed to save ad')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/ads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Ad deleted successfully')
      fetchAds()
    } catch (error) {
      toast.error('Failed to delete ad')
    }
  }

  const resetForm = () => {
    setFormData({
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
  }

  const editAd = (ad) => {
    setEditingAd(ad)
    setFormData({
      ...ad,
      startDate: ad.startDate.split('T')[0],
      endDate: ad.endDate ? ad.endDate.split('T')[0] : ''
    })
    setShowForm(true)
  }

  return (
    <>
      <Helmet>
        <title>Ad Management - NNC Admin</title>
      </Helmet>

      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <button
            onClick={() => {
              setEditingAd(null)
              resetForm()
              setShowForm(!showForm)
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>{showForm ? 'Cancel' : 'Add New Ad'}</span>
          </button>
        </div>

        {/* Ad Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingAd ? 'Edit Ad' : 'Create New Ad'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Provider</label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="direct">Direct</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="google-adsense">Google AdSense</option>
                    <option value="adsterra">Adsterra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ad Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="banner">Banner</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="in-article">In Article</option>
                    <option value="popup">Popup</option>
                    <option value="native">Native</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  >
                    <option value="sidebar-top">Sidebar Top</option>
                    <option value="sidebar-middle">Sidebar Middle</option>
                    <option value="sidebar-bottom">Sidebar Bottom</option>
                    <option value="after-1">After 1st Article</option>
                    <option value="after-2">After 2nd Article</option>
                    <option value="after-3">After 3rd Article</option>
                    <option value="in-article">In Article</option>
                    <option value="popup">Popup</option>
                  </select>
                </div>

                {(formData.provider === 'direct' || formData.provider === 'sponsored') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Link URL</label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                      />
                    </div>
                  </>
                )}

                {formData.provider === 'google-adsense' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">AdSense Code</label>
                    <textarea
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono"
                      placeholder="<ins class='adsbygoogle' ...></ins>"
                    />
                  </div>
                )}

                {formData.provider === 'adsterra' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Adsterra Code</label>
                    <textarea
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 font-mono"
                    />
                  </div>
                )}

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
                  <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
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
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ads List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Impressions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {ads.map(ad => (
                  <tr key={ad._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{ad.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{ad.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{ad.provider}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ad.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ad.impressions?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{ad.clicks?.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ad.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editAd(ad)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => {/* View stats */}}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <FaChartBar />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdManagement