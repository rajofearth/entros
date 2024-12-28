import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { tmdb } from '../api/tmdb';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);

  const searchMovies = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      onSearch(null);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await tmdb.get('/search/movie', {
        params: { query: searchQuery },
      });
      onSearch(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setError('Error fetching results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [onSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      searchMovies(value.trim());
    }, 300);
  };

  return (
    <div className="search-bar flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search movies..."
        className="search-input border-none outline-none mr-2"
        // Removed disabled prop to prevent losing focus
      />
      {isSearching && <div className="spinner">Loading...</div>} {/* Add a spinner or loading indicator */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};