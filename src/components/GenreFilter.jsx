import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchGenres } from '../api/tmdb';

const GenreFilter = ({ onGenreChange }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const fetchedGenres = await fetchGenres();
                setGenres(fetchedGenres);
            } catch (error) {
                console.error("Error loading genres:", error);
            }
        };
        loadGenres();

        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleGenreSelect = (genreId) => {
        setSelectedGenre(genreId);
        onGenreChange(genreId);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    }

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center items-center gap-2 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10  px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2  transition-all duration-300 w-full"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedGenre
            ? genres.find((g) => g.id.toString() === selectedGenre)?.name ||
              "All Genres"
            : "All Genres"}
          {/* Mobile Icon */}
          <svg
            className="h-5 w-5 text-white/70 md:hidden"
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
          {/* Desktop Icon */}
          <svg
            className="-mr-1 ml-2 h-5 w-5 hidden md:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Mobile Dropdown */}
        {isDropdownOpen && (
          <div
            className="absolute z-50 mt-2 w-full rounded-md shadow-lg bg-black/90 backdrop-blur-xl ring-1 ring-white/10 md:w-56 md:origin-top-left md:left-0"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1" role="none">
              <button
                onClick={() => handleGenreSelect("")}
                className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 w-full text-left"
                role="menuitem"
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id.toString())}
                  className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 w-full text-left"
                  role="menuitem"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

GenreFilter.propTypes = {
    onGenreChange: PropTypes.func.isRequired,
};

export default GenreFilter;