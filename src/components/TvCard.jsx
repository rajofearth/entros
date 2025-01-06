import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function TvCard({ tvShow }) {
  const imageUrl = tvShow.poster_path
    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
    : 'https://via.placeholder.com/500'; 
  return (
    <Link to={`/tv/${tvShow.id}`} className="block group">
      <article className="movie-card">
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={imageUrl}
            alt={`${tvShow.name} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 p-6 space-y-2">
              <h2 className="text-white text-xl font-medium">{tvShow.name}</h2>
              <div className="flex items-center gap-3">
                <span className="rating-badge">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {tvShow.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="text-white/80 text-sm">
                    {tvShow.first_air_date?.split('-')[0] || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

TvCard.propTypes = {
  tvShow: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
      vote_average: PropTypes.number,
      first_air_date: PropTypes.string
    }).isRequired
};