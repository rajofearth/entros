import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { tmdb } from '../api/tmdb';

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await tmdb.get('/genre/movie/list');
      setGenres(response.data.genres);
    };
    fetchGenres();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    setIsGenreDropdownOpen(false);
    
    if (!genreId) {
      setSearchResults(null);
      return;
    }

    try {
      const response = await tmdb.get("/discover/movie", {
        params: { with_genres: genreId },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const toggleGenreDropdown = () => {
    setIsGenreDropdownOpen(!isGenreDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000212] to-[#111]">
      <div className="container mx-auto px-4 pt-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
            Entros
          </h1>
          <p className="text-white/60">Discover your next favorite film</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex justify-center items-center gap-3 mb-8 relative">
          <div className="flex-1 max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Mobile Menu Button */}
          <div ref={dropdownRef} className="relative md:hidden">
            <button
              onClick={toggleGenreDropdown}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-3 transition-all duration-300"
              aria-label="Toggle genre menu"
            >
              <svg
                className="w-5 h-5 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M3 8h18M3 12h18M3 16h18"
                />
              </svg>
            </button>

            {/* Mobile Dropdown */}
            {isGenreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl transform transition-all duration-300 ease-in-out z-50">
                <select
                  value={selectedGenre}
                  onChange={handleGenreChange}
                  className="w-full bg-transparent text-white/90 py-2 px-3 appearance-none cursor-pointer focus:outline-none"
                >
                  <option value="" className="bg-black/90">All Genres</option>
                  {genres.map(genre => (
                    <option 
                      key={genre.id} 
                      value={genre.id}
                      className="bg-black/90 hover:bg-white/10"
                    >
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Desktop Genre Select */}
          <div className="hidden md:block">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300 min-w-[150px]"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option 
                  key={genre.id} 
                  value={genre.id}
                  className="bg-black/90"
                >
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Movie Grid */}
        <MovieGrid initialMovies={searchResults} />
      </div>
    </div>
  );
}