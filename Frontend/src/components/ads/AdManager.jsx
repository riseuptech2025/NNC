import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdBanner from './AdBanner'
import SponsoredPost from './SponsoredPost'

const AdManager = ({ position, page, category, articleId }) => {
  const [ads, setAds] = useState([])
  const [sponsoredPosts, setSponsoredPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAds()
    fetchSponsoredPosts()
  }, [position, page, category])

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/ads`, {
        params: { position, page, category }
      })
      setAds(response.data)
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  const fetchSponsoredPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sponsored`, {
        params: { active: true, category }
      })
      setSponsoredPosts(response.data)
    } catch (error) {
      console.error('Error fetching sponsored posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Render different ad placements
  const renderAdPlacement = () => {
    switch (position) {
      case 'sidebar-top':
      case 'sidebar-middle':
      case 'sidebar-bottom':
        return (
          <div className="space-y-4">
            {ads.map(ad => (
              <div key={ad._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {ad.provider === 'sponsored' ? (
                  <SponsoredPost post={ad} isCompact />
                ) : (
                  <AdBanner 
                    type={ad.provider} 
                    position={position}
                    className="w-full"
                  />
                )}
              </div>
            ))}
            
            {/* Show sponsored posts in sidebar */}
            {sponsoredPosts.slice(0, 2).map(post => (
              <SponsoredPost key={post._id} post={post} isCompact />
            ))}
          </div>
        )

      case 'in-article':
        return (
          <div className="my-8 py-4 border-y border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 mb-2">Advertisement</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.slice(0, 2).map(ad => (
                <AdBanner 
                  key={ad._id}
                  type={ad.provider}
                  position={position}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )

      case 'after-1':
      case 'after-2':
      case 'after-3':
        return (
          <div className="my-6">
            {ads.map(ad => (
              <AdBanner 
                key={ad._id}
                type={ad.provider}
                position={position}
                className="w-full"
              />
            ))}
          </div>
        )

      default:
        return (
          <>
            {ads.map(ad => (
              <AdBanner 
                key={ad._id}
                type={ad.provider}
                position={position}
                className="w-full"
              />
            ))}
          </>
        )
    }
  }

  if (loading || (ads.length === 0 && sponsoredPosts.length === 0)) {
    return null
  }

  return renderAdPlacement()
}

export default AdManager