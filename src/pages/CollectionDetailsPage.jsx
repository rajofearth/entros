import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCollectionDetails } from '../api/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import MediaCard from '../components/MovieCard'; // Assuming you renamed MovieCard
import Backdrop from '../components/Backdrop'; // Reuse Backdrop
import Overview from '../components/Overview';  // Reuse Overview

const CollectionDetailsPage = () => {
    const { collection_id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollectionData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const collectionData = await fetchCollectionDetails(collection_id);
                setCollection(collectionData);
            } catch (error) {
                console.error('Error fetching collection data:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectionData();
    }, [collection_id]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Error: {error.message || "Failed to load collection details."}</p>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Collection not found.</p>
            </div>
        );
    }

    // Calculate average rating and total votes
    let totalRating = 0;
    let totalVotes = 0;

    if (collection.parts) {
      collection.parts.forEach((media) => {
          if(media.vote_average && media.vote_count){
            totalRating += media.vote_average;
            totalVotes += media.vote_count;
          }

      });
    }
    const averageRating = totalVotes > 0 ? (totalRating / collection.parts.length).toFixed(1) : "N/A";


    return (
        <div className="min-h-screen pb-12">
            <Backdrop item={collection} navigate={navigate} mediaType='collection' />

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Overview item={collection} />

                        {/* Media Grid (using MediaCard) */}
                         {collection.parts && collection.parts.length > 0 && (
                            <section className="glass-container p-8">
                                <h2 className="text-2xl font-bold mb-6">Movies/TV Shows in this Collection</h2>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {collection.parts.map((media) => {
                                        const mediaWithMediaType = { ...media, media_type: media.media_type || (media.title ? 'movie' : 'tv') };
                                          return(
                                            <MediaCard key={`${mediaWithMediaType.media_type}-${mediaWithMediaType.id}`} media={mediaWithMediaType} />
                                        )})}
                                </div>
                            </section>
                        )}
                         {!collection.parts || collection.parts.length === 0 &&(
                            <section className="glass-container p-8">
                                <h2 className="text-2xl font-bold mb-6">Movies/TV Shows in this Collection</h2>
                                <div>No Items Found.</div>
                             </section>
                         )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <section className="glass-container p-8">
                            <h2 className="text-2xl font-bold mb-6">Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-white/60">Collection Size</h3>
                                     <p>{collection.parts?.length || "N/A"}</p>
                                </div>
                                 <div>
                                      <h3 className="text-white/60">Average Rating</h3>
                                      <p>{averageRating}</p>
                                </div>
                                {/* Add more details as needed, mirroring movie details structure */}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailsPage;