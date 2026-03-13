import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  FaNewspaper, 
  FaComments, 
  FaHeart, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaAd,
  FaDollarSign,
  FaChartLine,
  FaEye,
  FaMousePointer,
  FaCalendarAlt,
  FaUsers,
  FaShare
} from 'react-icons/fa'
import useStore from '../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalNews: 0,
    totalComments: 0,
    totalLikes: 0,
    totalAds: 0,
    totalSponsored: 0,
    totalAdImpressions: 0,
    totalAdClicks: 0,
    latestNews: []
  })
  const [comments, setComments] = useState([])
  const [recentAds, setRecentAds] = useState([])
  const [recentSponsored, setRecentSponsored] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { isAuthenticated, token } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchDashboardData()
    fetchPendingComments()
    fetchRecentAds()
    fetchRecentSponsored()
  }, [isAuthenticated])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load dashboard data')
    }
  }

  const fetchPendingComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/comments/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const fetchRecentAds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5 }
      })
      setRecentAds(response.data)
      
      // Calculate total impressions and clicks
      const totalImpressions = response.data.reduce((sum, ad) => sum + (ad.impressions || 0), 0)
      const totalClicks = response.data.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
      
      setStats(prev => ({
        ...prev,
        totalAds: response.data.length,
        totalAdImpressions: totalImpressions,
        totalAdClicks: totalClicks
      }))
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  const fetchRecentSponsored = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sponsored`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 5 }
      })
      setRecentSponsored(response.data)
      setStats(prev => ({ ...prev, totalSponsored: response.data.length }))
    } catch (error) {
      console.error('Error fetching sponsored posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerateComment = async (commentId, approve) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}/moderate`,
        { approve },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Comment ${approve ? 'approved' : 'rejected'}`)
      fetchPendingComments()
    } catch (error) {
      toast.error('Failed to moderate comment')
    }
  }

  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('News deleted successfully')
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete news')
    }
  }

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/ads/${adId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Ad deleted successfully')
      fetchRecentAds()
    } catch (error) {
      toast.error('Failed to delete ad')
    }
  }

  const handleDeleteSponsored = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this sponsored post?')) return
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/sponsored/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Sponsored post deleted successfully')
      fetchRecentSponsored()
    } catch (error) {
      toast.error('Failed to delete sponsored post')
    }
  }

  const toggleAdStatus = async (adId, currentStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/ads/${adId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Ad ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchRecentAds()
    } catch (error) {
      toast.error('Failed to update ad status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - NNC</title>
      </Helmet>

      <div className="container-custom py-8">
        {/* Header with Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link to="/admin/news/new" className="btn-primary flex items-center space-x-2">
              <FaPlus />
              <span>Add News</span>
            </Link>
            <Link to="/admin/ads/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <FaAd />
              <span>Add Ad</span>
            </Link>
            <Link to="/admin/sponsored/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2">
              <FaDollarSign />
              <span>Add Sponsored</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total News</p>
                <p className="text-3xl font-bold">{stats.totalNews}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <FaNewspaper className="text-blue-600 dark:text-blue-300 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Comments</p>
                <p className="text-3xl font-bold">{stats.totalComments}</p>
                <p className="text-xs text-yellow-600 mt-1">{comments.length} pending</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <FaComments className="text-green-600 dark:text-green-300 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Reactions</p>
                <p className="text-3xl font-bold">{stats.totalLikes}</p>
                <p className="text-xs text-blue-600 mt-1">Avg. 15 per article</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
                <FaHeart className="text-red-600 dark:text-red-300 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Ad Performance</p>
                <p className="text-3xl font-bold">{stats.totalAdImpressions}</p>
                <p className="text-xs text-purple-600 mt-1">{stats.totalAdClicks} clicks</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <FaChartLine className="text-purple-600 dark:text-purple-300 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ads'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Ads Management
            </button>
            <button
              onClick={() => setActiveTab('sponsored')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sponsored'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sponsored Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Comments ({comments.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Latest News */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Latest News</h2>
                  <Link to="/admin/news" className="text-primary-600 hover:underline text-sm">
                    View All
                  </Link>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {stats.latestNews?.map((news) => (
                    <div key={news._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 line-clamp-1">{news.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center space-x-1">
                            <FaEye size={12} />
                            <span>{news.views || 0}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FaHeart size={12} />
                            <span>{Object.values(news.reactions || {}).reduce((a, b) => a + b, 0)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          to={`/admin/news/edit/${news._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteNews(news._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Ads */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Recent Ads</h2>
                  <Link to="/admin/ads" className="text-primary-600 hover:underline text-sm">
                    Manage Ads
                  </Link>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {recentAds.map((ad) => (
                    <div key={ad._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${ad.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <h3 className="font-medium">{ad.name}</h3>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {ad.provider}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleAdStatus(ad._id, ad.isActive)}
                            className={`p-1 text-xs ${
                              ad.isActive ? 'text-yellow-600' : 'text-green-600'
                            }`}
                          >
                            {ad.isActive ? 'Pause' : 'Activate'}
                          </button>
                          <Link
                            to={`/admin/ads/edit/${ad._id}`}
                            className="p-1 text-blue-600"
                          >
                            <FaEdit />
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <FaEye size={12} />
                          <span>{ad.impressions?.toLocaleString() || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaMousePointer size={12} />
                          <span>{ad.clicks?.toLocaleString() || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FaCalendarAlt size={12} />
                          <span>Ends: {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'Never'}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sponsored Posts */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Active Sponsored Posts</h2>
                  <Link to="/admin/sponsored/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                    + New Sponsored
                  </Link>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {recentSponsored.map((post) => (
                    <div key={post._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                              SPONSORED
                            </span>
                            <span className="text-sm text-gray-500">{post.sponsorName}</span>
                          </div>
                          <h3 className="font-medium mb-1">{post.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <FaEye size={12} />
                              <span>{post.impressions?.toLocaleString() || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FaMousePointer size={12} />
                              <span>{post.clicks?.toLocaleString() || 0}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FaCalendarAlt size={12} />
                              <span>Until: {new Date(post.endDate).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/sponsored/edit/${post._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteSponsored(post._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ads Management Tab */}
          {activeTab === 'ads' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">All Ads</h2>
                <Link to="/admin/ads/new" className="btn-primary flex items-center space-x-2">
                  <FaPlus />
                  <span>Create New Ad</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Provider</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Schedule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {recentAds.map(ad => (
                      <tr key={ad._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{ad.name}</div>
                            <div className="text-sm text-gray-500">{ad.type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 capitalize">{ad.provider}</td>
                        <td className="px-6 py-4">{ad.position}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <FaEye className="text-gray-400" size={12} />
                              <span>{ad.impressions?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <FaMousePointer className="text-gray-400" size={12} />
                              <span>{ad.clicks?.toLocaleString() || 0}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              CTR: {ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>Start: {new Date(ad.startDate).toLocaleDateString()}</div>
                            <div>End: {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'Never'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ad.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {ad.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/ads/edit/${ad._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDeleteAd(ad._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <FaTrash />
                            </button>
                            <button
                              onClick={() => toggleAdStatus(ad._id, ad.isActive)}
                              className={`p-2 ${
                                ad.isActive 
                                  ? 'text-yellow-600 hover:bg-yellow-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              } rounded`}
                            >
                              {ad.isActive ? <FaTimes /> : <FaCheck />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sponsored Posts Tab */}
          {activeTab === 'sponsored' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Sponsored Posts</h2>
                <Link to="/admin/sponsored/new" className="btn-primary flex items-center space-x-2">
                  <FaPlus />
                  <span>Create Sponsored Post</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {recentSponsored.map(post => (
                  <div key={post._id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                          SPONSORED
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.isActive && new Date(post.endDate) > new Date()
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.isActive && new Date(post.endDate) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <FaUsers />
                          <span>{post.sponsorName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaEye />
                          <span>{post.impressions?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaMousePointer />
                          <span>{post.clicks?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <div className="text-gray-500">Valid until:</div>
                          <div className="font-medium">{new Date(post.endDate).toLocaleDateString()}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/sponsored/edit/${post._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteSponsored(post._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold">Pending Comments ({comments.length})</h2>
              </div>
              <div className="divide-y dark:divide-gray-700">
                {comments.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <FaComments className="mx-auto text-4xl mb-3 opacity-50" />
                    <p>No pending comments to moderate</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{comment.userName}</span>
                            <span className="text-sm text-gray-500">
                              on {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                          {comment.newsId && (
                            <Link 
                              to={`/news/${comment.newsId._id}`}
                              className="text-sm text-primary-600 hover:underline mt-2 inline-block"
                              target="_blank"
                            >
                              View Article: {comment.newsId.title}
                            </Link>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleModerateComment(comment._id, true)}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <FaCheck size={12} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleModerateComment(comment._id, false)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <FaTimes size={12} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard