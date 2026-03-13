import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const RelatedNews = ({ category, currentNewsId }) => {
  const [related, setRelated] = useState([])

  useEffect(() => {
    fetchRelated()
  }, [category, currentNewsId])

  const fetchRelated = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: { category, limit: 4 }
      })
      // Filter out current news
      const filtered = response.data.news.filter(news => news._id !== currentNewsId)
      setRelated(filtered.slice(0, 3))
    } catch (error) {
      console.error('Error fetching related news:', error)
    }
  }

  if (related.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related News</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((item) => (
          <Link
            key={item._id}
            to={`/news/${item._id}`}
            className="group"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary-600">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedNews