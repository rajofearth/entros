import { useState } from 'react'
import PropTypes from 'prop-types'
import { tmdb } from '../api/tmdb'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsSearching(true)
      const response = await tmdb.get('/search/movie', {
        params: { query: query.trim() }
      })
      onSearch(response.data.results)
    } catch (error) {
      console.error('Error searching movies:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="glass-container">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
            disabled={isSearching}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-white/50" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
}