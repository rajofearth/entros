import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { tmdb, searchMovies, searchTvShows, searchPersons } from '../api/tmdb';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('multi'); // 'multi', 'movie', 'tv', 'person'
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);

  const searchItems = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      onSearch([], "", searchType);
      return;
    }
      onSearch([],searchQuery, searchType)
  }, [onSearch, searchType]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      searchItems(value.trim());
    }, 300);
  };

  const handleToggleChange = (e) => {
    setSearchType(e.target.value);
    setQuery("");
    onSearch([], "", e.target.value);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        <select
          value={searchType}
          onChange={handleToggleChange}
          className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300 min-w-[120px]"
        >
          <option value="multi">All</option>
          <option value="movie">Movie</option>
          <option value="tv">TV Show</option>
          <option value="person">Person</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={`Search ${searchType === 'multi' ? 'movies, TV shows, and people' : searchType + 's'}...`}
          className="search-input border-none outline-none mr-2 flex-grow"
        />
      </div>
      {isSearching && <div className="spinner">Loading...</div>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};