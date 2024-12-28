import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null)

  const handleSearch = (results) => {
    setSearchResults(results)
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <SearchBar onSearch={handleSearch} />
      <MovieGrid initialMovies={searchResults} />
    </div>
  )
}