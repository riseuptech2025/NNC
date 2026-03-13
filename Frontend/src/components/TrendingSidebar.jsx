import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFire } from 'react-icons/fa'
import useStore from '../store/useStore'

const TrendingSidebar = () => {
  const { trendingNews, fetchTrendingNews } = useStore()

  useEffect(() => {
    fetchTrendingNews()
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-20">
      <div className="flex items-center space-x-2 mb-4">
        <FaFire className="text-orange-500 text-xl" />
        <h2 className="text-xl font-bold">Trending News</h2>
      </div>

      <div className="space-y-4">
        {trendingNews.map((news, index) => (
          <Link
            key={news._id}
            to={`/news/${news._id}`}
            className="flex items-start space-x-3 group"
          >
            <span className="text-2xl font-bold text-gray-300 group-hover:text-primary-600">
              {index + 1}
            </span>
            <div className="flex-1">
              <h3 className="font-medium group-hover:text-primary-600 line-clamp-2">
                {news.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(news.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TrendingSidebar