import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null)

  const handleSearch = (results) => {
    setSearchResults(results)
  }

  return (
    <div className="container mx-auto px-4">
      <SearchBar onSearch={handleSearch} />
      <h1 className="text-4xl font-bold text-center my-8">Discover Movies</h1>
      <MovieGrid initialMovies={searchResults} />
    </div>
  )
}