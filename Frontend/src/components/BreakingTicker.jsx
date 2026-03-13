import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaExclamationCircle } from 'react-icons/fa'

const BreakingTicker = () => {
  const [breakingNews, setBreakingNews] = useState([])

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
          params: { limit: 10 }
        })
        // Filter breaking news (you can add a field for this)
        const breaking = response.data.news.filter(news => news.isBreaking)
        setBreakingNews(breaking)
      } catch (error) {
        console.error('Error fetching breaking news:', error)
      }
    }

    fetchBreakingNews()
  }, [])

  if (breakingNews.length === 0) return null

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container-custom flex items-center">
        <div className="flex items-center space-x-2 bg-red-700 px-3 py-1 rounded-full mr-4">
          <FaExclamationCircle className="animate-pulse" />
          <span className="font-bold text-sm">BREAKING</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            {breakingNews.map((news, index) => (
              <span key={news._id}>
                <Link to={`/news/${news._id}`} className="hover:underline mx-4">
                  {news.title}
                </Link>
                {index < breakingNews.length - 1 && <span className="mx-2">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreakingTicker