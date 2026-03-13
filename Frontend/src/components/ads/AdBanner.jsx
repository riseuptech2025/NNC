import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import useStore from '../../store/useStore'

const AdBanner = ({ position, type, className = '' }) => {
  const adRef = useRef(null)
  const { seoSettings } = useStore()

  useEffect(() => {
    // Load Google AdSense if available
    if (seoSettings?.googleAdSenseId && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }

    // Track impression
    trackImpression()
  }, [])

  const trackImpression = async () => {
    try {
      // You can implement impression tracking here
      await axios.post(`${import.meta.env.VITE_API_URL}/ads/track-impression`, {
        position,
        type
      })
    } catch (error) {
      console.error('Error tracking impression:', error)
    }
  }

  const handleClick = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/ads/track-click`, {
        position,
        type
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  // Different ad formats based on type
  const renderAd = () => {
    switch (type) {
      case 'google-adsense':
        return (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={seoSettings?.googleAdSenseId}
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )

      case 'adsterra':
        return (
          <div dangerouslySetInnerHTML={{ 
            __html: seoSettings?.adsterraCode || '' 
          }} />
        )

      case 'direct':
      case 'sponsored':
        // Will be handled by AdManager
        return null

      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center text-gray-500">
            <p>Advertisement</p>
            <p className="text-sm">Your ad could be here</p>
          </div>
        )
    }
  }

  return (
    <div 
      ref={adRef}
      onClick={handleClick}
      className={`ad-container ${className}`}
    >
      {renderAd()}
    </div>
  )
}

export default AdBanner