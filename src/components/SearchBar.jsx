import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { tmdb, searchByKeyword, discoverMovies, searchPersons, searchTvShows } from '../api/tmdb';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie'); // 'movie', 'tv', 'person'
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);
  const [actorName, setActorName] = useState("");
    const [year, setYear] = useState("");

    const searchItems = useCallback(async (searchQuery, type) => {
        if (!searchQuery.trim()) {
            onSearch(null);
            return;
        }
        try {
            setIsSearching(true);
            setError(null);
            let response;
            if (type === "movie"){
                if(actorName){
                  response = await discoverMovies({
                    with_cast: actorName,
                      query: searchQuery,
                    primary_release_year: year || undefined
                  })
                }
                else if (year){
                    response = await discoverMovies({
                        primary_release_year: year,
                    })
                } else if (searchQuery){
                  response = await tmdb.get('/search/movie', {
                    params: { query: searchQuery },
                   });
               } else{
                  response = await discoverMovies({
                      query: searchQuery,
                    primary_release_year: year || undefined
                  })
                }
           
             
            } else if (type === 'tv'){
               response = await searchTvShows(searchQuery);
            } else if(type === "person"){
               response = await searchPersons(searchQuery);
            }

          onSearch(response.results);
        } catch (error) {
          console.error('Error searching items:', error);
          setError('Error fetching results. Please try again.');
        } finally {
          setIsSearching(false);
        }
      }, [onSearch, actorName, year]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
           searchItems(value.trim(), searchType);
    }, 300);
  };
    const handleActorChange = (e) => {
        setActorName(e.target.value);
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        searchItems(query.trim(), searchType);
      }, 300);
    }
    const handleYearChange = (e) => {
          setYear(e.target.value)
           clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => {
                searchItems(query.trim(), searchType);
            }, 300);
    }

  const handleToggleChange = (e) => {
      setSearchType(e.target.value);
      setQuery("")
      setActorName("")
      setYear("")
    onSearch(null);
  }
    return (
      <div className="relative">
        <div className="flex gap-2 items-center">
          <select
            value={searchType}
              onChange={handleToggleChange}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300 min-w-[120px]"
          >
            <option value="movie">Movie</option>
            <option value="tv">TV Show</option>
            <option value="person">Person</option>
          </select>
          <input
                type="text"
                value={query}
                onChange={handleInputChange}
              placeholder={`Search ${searchType}s...`}
              className="search-input border-none outline-none mr-2 flex-grow"
            />
            {searchType === 'movie' && (
              <>
                <input
                type="text"
                value={actorName}
                onChange={handleActorChange}
                placeholder="Actor Name"
                className="search-input border-none outline-none mr-2"
                />
              <input
                  type="text"
                  value={year}
                    onChange={handleYearChange}
                  placeholder="Year"
                 className="search-input border-none outline-none mr-2 max-w-[100px]"
                  />
             </>
          )}
        </div>
        {isSearching && <div className="spinner">Loading...</div>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};