import React, { useState, useEffect } from 'react';
import { fetchMovieContentRatings, fetchTvContentRatings } from '../api/tmdb';

const Backdrop = ({ item, navigate, mediaType }) => {
    const title = item.title || item.name;
    const startYear = (item.release_date || item.first_air_date)?.split('-')[0];
    const endYear = item.status === "Ended" || item.status === "Canceled"
        ? item.last_air_date?.split('-')[0]
        : '';
    const releaseYear = (mediaType === 'tv')
        ? (endYear ? `${startYear} - ${endYear}` : `${startYear} - ongoing`)
        : (endYear ? `${startYear} - ${endYear}` : startYear);

    const runtime = item.runtime
        ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
        : item.episode_run_time?.[0]
            ? `${item.episode_run_time[0]}m`
            : '';
    const imageUrl = item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : item.poster_path
            ? `https://image.tmdb.org/t/p/original${item.poster_path}`
            : '/no-backdrop.svg';
    let totalRating = 0;
    let totalVotes = 0;
    if (mediaType === 'collection' && item.parts) {
        item.parts.forEach((media) => {
            if (media.vote_average && media.vote_count) {
                totalRating += media.vote_average;
                totalVotes += media.vote_count;
            }
        });
    }
    const averageRating = totalVotes > 0 ? (totalRating / item.parts.length).toFixed(1) : "N/A";

    const [contentRating, setContentRating] = useState(null);

    useEffect(() => {
        const fetchContentRating = async () => {
            try {
                let ratingsData = [];
                if (mediaType === 'movie') {
                    ratingsData = await fetchMovieContentRatings(item.id);
                    if (ratingsData && ratingsData.length > 0) {
                        const usRating = ratingsData.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification;
                        setContentRating(usRating || (ratingsData[0]?.release_dates[0]?.certification || null));
                    }
                } else if (mediaType === 'tv') {
                    ratingsData = await fetchTvContentRatings(item.id);
                    if (ratingsData && ratingsData.length > 0) {
                        const usRating = ratingsData.find(r => r.iso_3166_1 === 'US')?.rating;
                        setContentRating(usRating || (ratingsData[0]?.rating || null));
                    }
                } else {
                    setContentRating(null)
                }
            } catch (error) {
                console.error("Error fetching content rating:", error);
                setContentRating(null);
            }
        };

        fetchContentRating();
    }, [item, mediaType]);

    const getContentRatingColor = (rating) => {
        switch (rating) {
            case 'R':
                return 'bg-red-600/80 text-white';
            case 'PG-13':
                return 'bg-yellow-500/80 text-gray-800';
            case 'PG':
                return 'bg-green-500/80 text-white';
            case 'G':
                return 'bg-green-400/80 text-white';
            case 'TV-MA':
                return 'bg-red-600/80 text-white';
            case 'TV-14':
                return 'bg-yellow-500/80 text-gray-800';
            case 'TV-PG':
                return 'bg-yellow-400/80 text-gray-800';
            default:
                return 'bg-gray-500/80 text-white';
        }
    };

    const ratingColorClass = getContentRatingColor(contentRating);

    return (
        <div className="relative h-[70vh]">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/no-backdrop.svg'; }}
            />
            <div className="backdrop-overlay" />
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-50 glass-container p-4 rounded-full hover:bg-white/10 transition-all duration-300 group"
            >
                <svg className="w-6 h-6 text-white/70 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold text-white mb-2">{title}</h1>
                    {mediaType === 'collection' && (
                        <div className="flex flex-wrap items-center gap-4 text-lg text-gray-300">
                            <span>{item.parts?.length || 0} Items</span>
                            <span>Average Rating: {averageRating}</span>
                        </div>
                    )}
                    {mediaType !== 'collection' && (
                        <div className="flex flex-wrap items-center gap-4 text-lg">
                            <span className="rating-badge text-xl">{item.vote_average.toFixed(1)}</span>
                            {contentRating && (
                                <span className={`rating-badge text-sm uppercase ${ratingColorClass}`}> 
                                    {contentRating}
                                </span>
                            )}
                            <span className="text-white/80">{releaseYear}</span>
                            <span className="text-white/80">{runtime}</span>
                            {mediaType === 'tv' && item.number_of_seasons && (
                                <span className="text-white/80">{item.number_of_seasons} Season{item.number_of_seasons > 1 ? 's' : ''}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Backdrop;