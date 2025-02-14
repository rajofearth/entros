import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';

export default function MovieGrid({ initialMedia }) {
  const [media, setMedia] = useState(initialMedia || []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialMedia && initialMedia.length > 0) {
      setMedia(initialMedia);
      setIsLoading(false);
      return;
    }

    setIsLoading(false); // If no initial media, just set loading to false
  }, [initialMedia]);

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
        {media.map(item => (
          <div key={item.id} className="transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <MovieCard media={item} />
          </div>
        ))}
      </div>
      {media.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No movies or TV shows found</p>
        </div>
      )}
    </div>
  );
}

MovieGrid.propTypes = {
  initialMedia: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      name: PropTypes.string,
      poster_path: PropTypes.string,
      vote_average: PropTypes.number,
      release_date: PropTypes.string,
      first_air_date: PropTypes.string,
      media_type: PropTypes.oneOf(['movie', 'tv']), // Add media_type prop
    })
  ),
};