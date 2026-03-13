import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NewsCard from '../components/NewsCard'
import useStore from '../store/useStore'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { searchNews, news, loading } = useStore()
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query) {
      searchNews(query).then(data => setResults(data || []))
    }
  }, [query])

  return (
    <>
      <Helmet>
        <title>Search results for "{query}" - NNC</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {results.length} results found for "{query}"
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </>
  )
}

export default SearchResults