import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaExclamationCircle } from 'react-icons/fa'

const BreakingTicker = () => {
  const [breakingNews, setBreakingNews] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const marqueeRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
          params: { limit: 10 }
        })
        // Filter breaking news
        const breaking = response.data.news.filter(news => news.isBreaking)
        setBreakingNews(breaking)
      } catch (error) {
        console.error('Error fetching breaking news:', error)
      }
    }

    fetchBreakingNews()
  }, [])

  // Duplicate the news items for seamless scrolling
  const duplicatedNews = [...breakingNews, ...breakingNews]

  if (breakingNews.length === 0) return null

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container-custom flex items-center">
        {/* Breaking News Label */}
        <div className="flex items-center space-x-2 bg-red-700 px-4 py-1.5 rounded-full mr-6 z-10 whitespace-nowrap">
          <FaExclamationCircle className="animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wider">Breaking</span>
        </div>

        {/* Marquee Container */}
        <div 
          ref={containerRef}
          className="overflow-hidden flex-1 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-600 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-600 to-transparent z-10"></div>
          
          {/* Marquee Content */}
          <div
            ref={marqueeRef}
            className="inline-flex items-center whitespace-nowrap"
            style={{
              animation: `marquee ${breakingNews.length * 3}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          >
            {duplicatedNews.map((news, index) => (
              <React.Fragment key={`${news._id}-${index}`}>
                <Link
                  to={`/news/${news._id}`}
                  className="hover:underline mx-4 text-sm md:text-base font-medium transition-colors hover:text-red-200"
                >
                  {news.title}
                </Link>
                {index < duplicatedNews.length - 1 && (
                  <span className="text-red-300 mx-2">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Add keyframe animation to global styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-10%);
          }
        }
      `}</style>
    </div>
  )
}

export default BreakingTicker