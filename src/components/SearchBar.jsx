import { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tmdb, searchMovies, searchTvShows, searchPersons, discoverMovies, discoverTvShows } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('multi');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState(null);
    const debounceTimeout = useRef(null);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);
    // Advanced Filters State
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [ratingFrom, setRatingFrom] = useState('');
    const [ratingTo, setRatingTo] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            let combinedResults = [];

            if (searchType === 'movie' || searchType === 'multi') {
                const movieResults = await searchMovies(searchQuery);
                combinedResults = combinedResults.concat(movieResults.map(m => ({ ...m, media_type: 'movie', display: m.title, year: m.release_date?.split('-')[0] })));
            }
            if (searchType === 'tv' || searchType === 'multi') {
                const tvResults = await searchTvShows(searchQuery);
                combinedResults = combinedResults.concat(tvResults.map(tv => ({ ...tv, media_type: 'tv', display: tv.name })));
            }
            if (searchType === 'person' || searchType === 'multi') {
                const personResults = await searchPersons(searchQuery);
                combinedResults = combinedResults.concat(personResults.map(p => ({ ...p, media_type: 'person', display: p.name })));
            }

            setSuggestions(combinedResults.slice(0, 7));
        } catch (err) {
            setError("Failed to fetch suggestions.");
            console.error("Error fetching suggestions", err);
        } finally {
            setIsSearching(false);
        }
    }, [searchType]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        clearTimeout(debounceTimeout.current);

        if (value.trim().length > 0) {
          setIsFocused(true);
        }
        debounceTimeout.current = setTimeout(() => {
            fetchSuggestions(value.trim());
        }, 300);
    };

    const handleToggleChange = (e) => {
        setSearchType(e.target.value);
        setQuery("");
        setSuggestions([]);
        onSearch([], "", e.target.value, {}, true); // Pass empty filters and isAdvancedSearch=false
    };
    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.display);
        setSuggestions([]);
        setIsFocused(false);

        if (suggestion.media_type === 'movie') {
            navigate(`/movie/${suggestion.id}`);
        } else if (suggestion.media_type === 'tv') {
            navigate(`/tv/${suggestion.id}`);
        } else if (suggestion.media_type === 'person') {
            navigate(`/person/${suggestion.id}`);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (query.trim().length > 0) {
          fetchSuggestions(query.trim());
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsFocused(false);
        }, 100);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
          setIsFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const toggleAdvancedFilters = () => {
      setShowAdvancedFilters(!showAdvancedFilters);
    }
     const handleAdvancedSearch = () => {
        const filters = {
            yearFrom,
            yearTo,
            ratingFrom,
            ratingTo,
        };
         onSearch([], query, searchType, filters, true);
        setShowAdvancedFilters(false); // Hide on search
    };


    return (
        <div className="relative w-full">
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={`Search ${searchType === 'multi' ? 'movies, TV shows, and people' : searchType + 's'}...`}
                    className="search-input border-none outline-none mr-2 flex-grow"
                />
            </div>
            {/* Toggle Advanced Filters Button */}
            <button
                type="button"
                onClick={toggleAdvancedFilters}
                className="mt-2 text-sm text-gray-300 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-md px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
              >
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
            </button>

             {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Year From:</label>
                  <input
                    type="number"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Year To:</label>
                  <input
                    type="number"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Rating From:</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={ratingFrom}
                    onChange={(e) => setRatingFrom(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Rating To:</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={ratingTo}
                    onChange={(e) => setRatingTo(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-md px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                 <button
                    type="button"
                    onClick={handleAdvancedSearch}
                    className="col-span-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
                >
                    Apply Filters
                </button>
              </div>
            )}

            {isFocused && suggestions.length > 0 && (
                <ul ref={suggestionsRef} className="absolute z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl w-full mt-2 max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                        <li
                            key={`${item.media_type}-${item.id}`}
                            onClick={() => handleSuggestionClick(item)}
                            className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center justify-between"
                        >
                            <div className="flex items-center">
                                {item.media_type === 'person' ? (
                                    <>
                                        <img
                                            src={item.profile_path ? `https://image.tmdb.org/t/p/w92${item.profile_path}` : '/no-profile.svg'}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full inline-block mr-2"
                                        />
                                        <span className="text-sm">{item.display}</span>
                                        <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">Person</span>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={item.poster_path ? `https://image.tmdb.org/t/p/w45${item.poster_path}` : '/no-poster.svg'}
                                            alt={item.display}
                                            className="w-6 h-9 object-cover inline-block mr-2 rounded"
                                        />
                                        <span className="text-sm">{item.display}</span>
                                         {item.media_type === 'tv' && (
                                            <span className="ml-2 text-xs bg-green-700/50 text-green-300 px-2 py-0.5 rounded-full">TV</span>
                                         )}
                                         {item.media_type === 'movie' && (
                                            <span className="ml-2 text-xs bg-blue-700/50 text-blue-300 px-2 py-0.5 rounded-full">Movie</span>
                                         )}

                                    </>
                                )}
                            </div>

                            {item.media_type === 'movie' && item.year && (
                                <span className="text-gray-400 text-sm">{item.year}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {isSearching && <LoadingSpinner />}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};