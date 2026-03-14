import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { format, formatDistanceToNow } from 'date-fns'
import { 
  FaUser, 
  FaCalendar, 
  FaClock,
  FaFacebook, 
  FaTwitter, 
  FaLink,
  FaThumbsUp,
  FaHeart,
  FaLaugh,
  FaSadTear,
  FaAngry,
  FaShare,
  FaBookmark,
  FaPrint
} from 'react-icons/fa'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'
import axios from 'axios'
import toast from 'react-hot-toast'
import Comments from '../components/Comments'
import RelatedNews from '../components/RelatedNews'
import TrendingSidebar from '../components/TrendingSidebar'
import AdManager from '../components/ads/AdManager'

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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
}

const SingleNews = () => {
  const { id } = useParams()
  const [news, setNews] = useState(null)
  const [reactions, setReactions] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addReaction } = useStore()

  useEffect(() => {
    fetchNews()
    window.scrollTo(0, 0)
  }, [id])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/${id}`)
      setNews(response.data)
      setReactions(response.data.reactions)
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const handleReaction = async (type) => {
    const updatedReactions = await addReaction(id, type)
    if (updatedReactions) {
      setReactions(updatedReactions)
      // Animate reaction
      toast.success(`Added ${type} reaction!`, {
        icon: '👍',
        duration: 2000
      })
    }
  }

  const handleShare = (platform) => {
    const url = window.location.href
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
      case 'print':
        window.print()
        break
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved' : 'Saved for later')
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-12"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></motion.div>
      </motion.div>
    )
  }

  if (!news) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container-custom px-4 md:px-6 lg:px-8 py-12 text-center"
      >
        <h1 className="text-2xl font-bold text-red-600">News not found</h1>
      </motion.div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{news.title} - NNC</title>
        <meta name="description" content={news.description} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.description} />
        <meta property="og:image" content={news.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1800" />
      </Helmet>

      <motion.article 
        className="container-custom px-4 md:px-6 lg:px-8 py-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-8">
            {/* Header */}
        <motion.header 
          className="mb-8"
          variants={fadeInUp}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="bg-primary-100 dark:bg-primary-900 text-primary-600 px-3 py-1 rounded-full cursor-pointer"
            >
              {news.category}
            </motion.span>
            {news.isBreaking && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="bg-red-100 dark:bg-red-900 text-red-600 px-3 py-1 rounded-full"
              >
                BREAKING
              </motion.span>
            )}
          </div>
          
          <motion.h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-red-600 dark:text-red-500"
            variants={fadeInUp}
          >
            {news.title}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 mb-4"
            variants={fadeInUp}
          >
            {news.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap items-center gap-4 text-gray-500"
            variants={fadeInUp}
          >
            <div className="flex items-center space-x-1">
              <FaUser className="text-primary-500" />
              <span className="font-medium">{news.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaCalendar className="text-primary-500" />
              <span>{format(new Date(news.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaClock className="text-primary-500" />
              <span>{format(new Date(news.createdAt), 'hh:mm a')}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              <span>{formatDistanceToNow(new Date(news.createdAt))} ago</span>
            </div>
          </motion.div>
        </motion.header>

        {/* Featured Image with Print Size */}
        <motion.div 
          className="mb-8 relative overflow-hidden rounded-lg"
          variants={scaleIn}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          )}
          <img
            src={news.image}
            alt={news.title}
            className={`w-full h-auto max-h-[600px] object-cover rounded-lg transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ aspectRatio: '1200/1800' }} // 4:6 ratio (1200x1800 pixels)
            onLoad={handleImageLoad}
            loading="lazy"
          />
          {/* Print size indicator */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1"
          >
            <FaPrint />
            <span>1200×1800 (4×6" print)</span>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="prose dark:prose-invert max-w-none mb-8"
          variants={fadeInUp}
        >
          {news.content.split('\n').map((paragraph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="mb-4 text-lg leading-relaxed">
                {paragraph}
              </p>
              {/* Insert ad after every 3 paragraphs */}
              {(index + 1) % 3 === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AdManager position="in-article" page="article" articleId={id} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <motion.div 
            className="mb-8"
            variants={fadeInUp}
          >
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interactions */}
        <motion.div 
          className="border-t border-b dark:border-gray-700 py-6 mb-8"
          variants={fadeInUp}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Reactions */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(reactionIcons).map(([type, Icon]) => (
                <motion.button
                  key={type}
                  onClick={() => handleReaction(type)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Icon className={`text-xl ${reactionColors[type]}`} />
                  <motion.span
                    key={reactions[type]}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                  >
                    {reactions[type] || 0}
                  </motion.span>
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <FaBookmark />
              </motion.button>
              
              <motion.button
                onClick={() => handleShare('facebook')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <FaFacebook />
              </motion.button>
              
              <motion.button
                onClick={() => handleShare('twitter')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors"
              >
                <FaTwitter />
              </motion.button>
              
              <motion.button
                onClick={() => handleShare('copy')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                <FaLink />
              </motion.button>
              
              <motion.button
                onClick={() => handleShare('print')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <FaPrint />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div 
          id="comments" 
          className="mb-8"
          variants={fadeInUp}
        >
          <Comments newsId={id} />
        </motion.div>
      </main>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-8">
        <TrendingSidebar />
        <RelatedNews category={news.category} currentNewsId={id} />
      </aside>
    </div>
  </motion.article>
</>
  )
}

export default SingleNews