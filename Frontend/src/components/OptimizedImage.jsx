// components/OptimizedImage.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const OptimizedImage = ({ src, alt, className, onLoad }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setLoading(false)
      onLoad?.()
    }
    img.onerror = () => {
      setError(true)
      setLoading(false)
    }
  }, [src])

  if (error) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-500">Failed to load image</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {loading && (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`} />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${loading ? 'hidden' : 'block'}`}
          loading="lazy"
        />
      )}
    </motion.div>
  )
}

export default OptimizedImage