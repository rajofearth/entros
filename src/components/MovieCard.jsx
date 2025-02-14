import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function MediaCard({ media }) {
  // Check for missing media or essential properties
  if (!media || (!media.title && !media.name) || !media.poster_path || !media.media_type) {
    console.warn("MediaCard: Missing data for media item:", media);
    return null;
  }

  const isMovie = media.media_type === 'movie';
  const linkPath = isMovie ? `/movie/${media.id}` : `/tv/${media.id}`;
  const title = media.title || media.name;
  const imageUrl = `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  const releaseDate = media.release_date || media.first_air_date;

  return (
    <Link to={linkPath} className="block group">
      <article className="movie-card">
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={imageUrl}
            alt={`${title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 p-6 space-y-2">
              <h2 className="text-white text-xl font-medium">{title}</h2>
              <div className="flex items-center gap-3">
                <span className="rating-badge">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {media.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="text-white/80 text-sm">
                  {releaseDate?.split('-')[0] || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

MediaCard.propTypes = {
  media: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    poster_path: PropTypes.string.isRequired, // Make poster_path required
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    media_type: PropTypes.oneOf(['movie', 'tv']).isRequired, // Make media_type required
  }).isRequired,
};