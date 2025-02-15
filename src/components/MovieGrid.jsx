import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const MovieGrid = ({ initialMedia, isLoading }) => {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!initialMedia || initialMedia.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600">No movies or TV shows found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {initialMedia.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} media={item} />
            ))}
        </div>
    );
};

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
            media_type: PropTypes.oneOf(['movie', 'tv']).isRequired,
        })
    ),
    isLoading: PropTypes.bool,
};


export default MovieGrid;