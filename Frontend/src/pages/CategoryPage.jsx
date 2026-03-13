import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NewsCard from '../components/NewsCard'
import axios from 'axios'

const CategoryPage = () => {
  const { category } = useParams()
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  useEffect(() => {
    fetchNews()
  }, [category])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: { category: categoryName, page }
      })
      setNews(response.data.news)
      setHasMore(response.data.news.length === 10)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: { category: categoryName, page: page + 1 }
      })
      if (response.data.news.length > 0) {
        setNews([...news, ...response.data.news])
        setPage(page + 1)
        setHasMore(response.data.news.length === 10)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more news:', error)
    }
  }

  return (
    <>
      <Helmet>
        <title>{categoryName} News - NNC</title>
        <meta name="description" content={`Latest ${categoryName} news from Nepal`} />
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">{categoryName} News</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="btn-primary"
                >
                  Load More
                </button>
              </div>
            )}

            {news.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No news found in this category</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default CategoryPage