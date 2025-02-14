import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RatingBadge from './RatingBadge';
import MediaTypeBadge from './MediaTypeBadge';

const MovieCard = ({ media }) => {
    if (!media || !media.id || !media.media_type) {
        console.error("MediaCard: Missing essential media data:", media);
        return null;
    }

    const linkPath = `/${media.media_type}/${media.id}`;
    const title = media.title || media.name || 'Title N/A';
    const imageUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
        : 'https://placehold.co/500x750?text=No+Poster';
    const releaseDate = media.release_date || media.first_air_date;
    const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

    return (
        <Link to={linkPath} className="block group">
            <article className="movie-card">
                <div className="relative overflow-hidden aspect-[2/3]">
                    <img
                        src={imageUrl}
                        alt={`${title} poster`}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://placehold.co/500x750?text=No+Poster'; }}
                    />
                    {/* Pass genres to MediaTypeBadge */}
                    <MediaTypeBadge mediaType={media.media_type} genres={media.genre_ids ? media.genre_ids.map(id => ({id, name: genreIdToName(id)})) : media.genres} />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 p-6 space-y-2">
                            <h2 className="text-white text-xl font-medium">{title}</h2>
                            <div className="flex items-center gap-3">
                                <RatingBadge rating={media.vote_average || 0} />
                                <span className="text-white/80 text-sm">{releaseYear}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
};

MovieCard.propTypes = {
    media: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        poster_path: PropTypes.string,
        vote_average: PropTypes.number,
        release_date: PropTypes.string,
        first_air_date: PropTypes.string,
        media_type: PropTypes.oneOf(['movie', 'tv']).isRequired,
        genre_ids: PropTypes.arrayOf(PropTypes.number), // For discover/search results
        genres: PropTypes.arrayOf(PropTypes.shape({ // For detail page results
            id: PropTypes.number,
            name: PropTypes.string,
        })),
    }).isRequired,
};

export default MovieCard;

// --- Helper function to get the name ---
//put this in a utility function, so it can be used every where
const genreIdToName = (id) => {
    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
        10759: 'Action & Adventure',
        10762: 'Kids',
        10763: 'News',
        10764: 'Reality',
        10765: 'Sci-Fi & Fantasy',
        10766: 'Soap',
        10767: 'Talk',
        10768: 'War & Politics',
    };
    return genreMap[id] || 'Unknown'; // Default to 'Unknown' if not found
};