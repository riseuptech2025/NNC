import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { 
  FaThumbsUp, 
  FaHeart, 
  FaLaugh, 
  FaSadTear, 
  FaAngry,
  FaComment,
  FaShare,
  FaFacebook,
  FaTwitter,
  FaLink
} from 'react-icons/fa'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

const reactionIcons = {
  like: FaThumbsUp,
  love: FaHeart,
  wow: FaLaugh,
  sad: FaSadTear,
  angry: FaAngry
}

const reactionColors = {
  like: 'text-blue-500',
  love: 'text-red-500',
  wow: 'text-yellow-500',
  sad: 'text-blue-400',
  angry: 'text-orange-600'
}

const NewsCard = ({ news }) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [reactions, setReactions] = useState(news.reactions)
  const { addReaction } = useStore()

  const handleReaction = async (type) => {
    const updatedReactions = await addReaction(news._id, type)
    if (updatedReactions) {
      setReactions(updatedReactions)
    }
  }

  const handleShare = (platform) => {
    const url = `${window.location.origin}/news/${news._id}`
    const title = encodeURIComponent(news.title)
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
        break
    }
    setShowShareMenu(false)
  }

  return (
    <div className="news-card group">
      <Link to={`/news/${news._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={news.image || 'https://via.placeholder.com/400x200'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {news.isBreaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
              BREAKING
            </span>
          )}
          <span className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 text-xs rounded">
            {news.category}
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/news/${news._id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {news.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {news.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{news.author}</span>
          <span>{formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })}</span>
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {Object.entries(reactionIcons).map(([type, Icon]) => {
              const count = reactions[type] || 0
              return (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className={`${reactionColors[type]}`} />
                  {count > 0 && <span className="text-xs">{count}</span>}
                </button>
              )
            })}
          </div>

          <div className="flex items-center space-x-3">
            <Link to={`/news/${news._id}#comments`} className="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
              <FaComment />
              <span className="text-xs">{news.commentCount || 0}</span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="text-gray-500 hover:text-primary-600"
              >
                <FaShare />
              </button>

              {showShareMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <FaFacebook className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <FaTwitter className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <FaLink className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard