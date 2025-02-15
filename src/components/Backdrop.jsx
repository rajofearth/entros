import React from 'react';

const Backdrop = ({ item, navigate, mediaType }) => {
    const title = item.title || item.name;
    const startYear = (item.release_date || item.first_air_date)?.split('-')[0];
    const endYear = item.status === "Ended" || item.status === "Canceled"
        ? item.last_air_date?.split('-')[0]
        : '';
    const releaseYear = endYear ? `${startYear} - ${endYear}` : `${startYear} - ongoing`;
    const runtime = item.runtime
        ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`
        : item.episode_run_time?.[0]
            ? `${item.episode_run_time[0]}m`
            : '';
    const imageUrl = item.backdrop_path //Prioritize backdrop
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : item.poster_path
            ? `https://image.tmdb.org/t/p/original${item.poster_path}`
            : 'https://placehold.co/1280x720?text=No+Image';
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
    return (
        <div className="relative h-[70vh]">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/1280x720?text=No+Image'; }} 
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
                    {}
                    {mediaType === 'collection' && (
                        <div className="flex flex-wrap items-center gap-4 text-lg text-gray-300">
                            <span>{item.parts?.length || 0} Items</span>
                            <span>Average Rating: {averageRating}</span>
                        </div>
                    )}
                    {}
                    {mediaType !== 'collection' && (
                        <div className="flex flex-wrap items-center gap-4 text-lg">
                            <span className="rating-badge text-xl">{item.vote_average.toFixed(1)}</span>
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