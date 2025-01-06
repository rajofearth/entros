 import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tmdb } from '../api/tmdb';
import MovieCard from './MovieCard';
import HorizontalAd from '../Ads/HorizontalAd';

export default function MovieGrid({ initialMovies }) {
const [movies, setMovies] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
if (initialMovies) {
setMovies(initialMovies);
setIsLoading(false);
return;
}

const fetchMovies = async () => {
    try {
    setIsLoading(true);
    const response = await tmdb.get('/movie/popular');
    setMovies(response.data.results);
    } catch (error) {
    console.error('Error fetching movies:', error);
    } finally {
    setIsLoading(false);
    }
  };

  fetchMovies();
}, [initialMovies]);

useEffect(() => {
  const debouncedHandleResize = debounce(() => setWindowWidth(window.innerWidth), 100);
  window.addEventListener('resize', debouncedHandleResize);
  return () => window.removeEventListener('resize', debouncedHandleResize);
}, []);

function getColumns(width) {
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    if (width >= 640) return 2;
    return 1;
}

const cols = getColumns(windowWidth);
const insertionIndex = cols * 2;

const firstPart = movies.slice(0, insertionIndex);
const secondPart = movies.slice(insertionIndex);

if (isLoading) {
    return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-pulse space-y-8 w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-2xl aspect-[2/3]"></div>
          ))}
        </div>
      </div>
    </div>
    );
}
  
 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
     {firstPart.map(movie => (
     <div
     key={movie.id}
     className="transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1"
     >
       <MovieCard movie={movie} />
     </div>
     ))}
     {insertionIndex < movies.length && (
     <div className="col-span-full">
         <HorizontalAd />
     </div>
      )}
      {secondPart.map(movie => (
          <div
            key={movie.id}
            className="transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
     </div>
     {movies.length === 0 && (
       <div className="text-center py-12">
         <p className="text-xl text-gray-600">No movies found</p>
       </div>
     )}
  </div>
);
}

MovieGrid.propTypes = {
initialMovies: PropTypes.array,
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}