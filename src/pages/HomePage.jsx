import { useState, useEffect, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import TvGrid from '../components/TvGrid';
import TvGenreFilter from '../components/TvGenreFilter';
import { tmdb, discoverTvShows } from '../api/tmdb';

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null);
    const [searchType, setSearchType] = useState("movie")
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
    const [tvShows, setTvShows] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await tmdb.get('/genre/movie/list');
        setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  const handleSearch = (results) => {
    setSearchResults(results);
    setTvShows(null);
  };
    const handleTvSearch = (results) => {
        setTvShows(results)
      setSearchResults(null)
  }
      const handleToggleChange = (e) => {
      setSearchType(e.target.value)
      setSearchResults(null);
      setTvShows(null);
  }
    const handleTvGenreChange = async (genreId) => {
      setSelectedGenre(genreId);
        if (!genreId) {
          setTvShows(null);
          return;
      }
      try {
            const response = await discoverTvShows({ with_genres: genreId });
            setTvShows(response.results);
        } catch (error) {
          console.error("Error fetching tv shows", error);
        }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000212] to-[#111]">
      <div className="container mx-auto px-4 pt-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
            Entros
          </h1>
          <p className="text-white/60">Discover your next favorite film or show</p>
        </div>
      
           {/* Search and Filter Section */}
        <div className="flex justify-center items-center gap-3 mb-8 relative">
          <div className="flex-1 max-w-2xl">
              <SearchBar onSearch={searchType === "movie" ? handleSearch : handleTvSearch }/>
          </div>
           <select
                value={searchType}
                onChange={handleToggleChange}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300 min-w-[120px]"
            >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
            </select>

        {searchType === 'tv' &&
          <div className="flex-shrink-0 md:block">
          <TvGenreFilter onGenreChange={handleTvGenreChange} />
            </div>
            }

          </div>
      
        {searchType === 'movie' &&  <MovieGrid initialMovies={searchResults} />}
        {searchType === 'tv' &&  <TvGrid initialShows={tvShows} />}
      </div>
    </div>
  );
}