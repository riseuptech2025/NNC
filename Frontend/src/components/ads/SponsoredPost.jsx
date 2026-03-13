import React from 'react'
import { Link } from 'react-router-dom'
import { FaExternalLinkAlt, FaAd } from 'react-icons/fa'

const SponsoredPost = ({ post, isCompact = false }) => {
  const handleClick = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sponsored/${post._id}/click`)
      if (post.targetUrl) {
        window.open(post.targetUrl, '_blank')
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  if (isCompact) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          {post.sponsorLogo ? (
            <img 
              src={post.sponsorLogo} 
              alt={post.sponsorName}
              className="w-10 h-10 object-contain rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded flex items-center justify-center">
              <FaAd className="text-yellow-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold text-yellow-600 uppercase">
                {post.sponsoredLabel}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{post.sponsorName}</span>
            </div>
            <Link 
              to={`/news/${post._id}`}
              onClick={handleClick}
              className="font-medium hover:text-primary-600 line-clamp-2"
            >
              {post.title}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-400 dark:border-yellow-600">
      <div className="relative">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
          {post.sponsoredLabel}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {post.sponsorLogo && (
            <img 
              src={post.sponsorLogo} 
              alt={post.sponsorName}
              className="w-6 h-6 object-contain rounded"
            />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            By {post.sponsorName}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Link
            to={`/news/${post._id}`}
            onClick={handleClick}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Read More</span>
            <FaExternalLinkAlt size={12} />
          </Link>
          
          {post.sponsorWebsite && (
            <a 
              href={post.sponsorWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-primary-600"
            >
              Visit Sponsor
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default SponsoredPost