import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import InfiniteScroll from 'react-infinite-scroll-component'
import NewsCard from '../components/NewsCard'
import BreakingTicker from '../components/BreakingTicker'
import TrendingSidebar from '../components/TrendingSidebar'
import AdManager from '../components/ads/AdManager'
import useStore from '../store/useStore'

import axios from 'axios'

const Home = () => {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { news, fetchNews, loading } = useStore()

  useEffect(() => {
    fetchNews('', 1)
  }, [])

  const fetchMoreNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: { page: page + 1 }
      })
      if (response.data.news.length === 0) {
        setHasMore(false)
      } else {
        setPage(page + 1)
        // Append news to existing list (you'll need to add this to your store)
      }
    } catch (error) {
      console.error('Error fetching more news:', error)
      setHasMore(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>NNC - Nepali News Center | Latest News from Nepal</title>
        <meta name="description" content="Get the latest news from Nepal including politics, International, Shares, technology, sports, business, entertainment and health." />
      </Helmet>

      <BreakingTicker />

      <div className="container-custom px-4 md:px-6 lg:px-8 py-8"> {/* Added responsive padding */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <h1 className="text-2xl font-bold mb-6">Latest News</h1>
            
            {/* Ad after first few articles */}
            {news.length > 2 && (
              <div className="mb-6">
                <AdManager position="after-2" page="home" />
              </div>
            )}
            
            {loading && page === 1 ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={news.length}
                next={fetchMoreNews}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                }
                endMessage={
                  <p className="text-center text-gray-500 py-4">
                    No more news to load
                  </p>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {news.map((item) => (
                    <NewsCard key={item._id} news={item} />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <AdManager position="sidebar-top" page="home" />
            <TrendingSidebar />
            <div className="mt-6">
              <AdManager position="sidebar-middle" page="home" />
            </div>
            <div className="mt-6">
              <AdManager position="sidebar-bottom" page="home" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home