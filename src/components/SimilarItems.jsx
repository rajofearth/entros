import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RatingBadge from './RatingBadge'; 

const SimilarItems = ({ similar, navigate, mediaType, isMobile = false }) => {
    const [showCount, setShowCount] = useState(10);

    if (!similar || similar.length === 0) return null;

    const gridCols = isMobile ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
     const navigateToItem = (id) => {
        navigate(`/${mediaType}/${id}`);
    };


    return (
       <section className={`${isMobile ? 'lg:hidden' : 'hidden lg:block'} mt-12 px-6`}>
            <div className="max-w-full mx-auto glass-container p-8">
                <h2 className="text-2xl font-bold mb-6">Similar {mediaType === 'movie' ? 'Movies' : 'TV Shows'}</h2>
                <div className={`grid ${gridCols} gap-6`}>
                    {similar.slice(0, showCount).map(item => {
                        const title = item.title || item.name;
                        const releaseYear = (item.release_date || item.first_air_date)?.split('-')[0];

                       return ( <div
                            key={item.id}
                             onClick={() => navigateToItem(item.id)}
                            className="cursor-pointer hover:scale-105 transition-all duration-300"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                alt={title}
                                className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                            />
                            <div className="p-2">
                                <h3 className="font-medium truncate">{title}</h3>
                                <div className="flex items-center gap-3">
                                    <RatingBadge rating={item.vote_average} />
                                    <span className="text-white/80 text-sm truncate">{releaseYear}</span>
                                </div>
                            </div>
                        </div>
                      );
                    })}
                </div>
                {similar.length > showCount && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => setShowCount(prev => prev + 10)}
                            className="glass-container px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            Show More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SimilarItems;