import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCollectionDetails } from '../api/tmdb';
import LoadingSpinner from '../components/LoadingSpinner';
import MediaCard from '../components/MovieCard';
import Backdrop from '../components/Backdrop';
import Overview from '../components/Overview';
import MovieGrid from '../components/MovieGrid';

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

    let totalRating = 0;
    let totalVotes = 0;
    //Now outside the first if condition
    if (collection.parts) {
        collection.parts.forEach((media) => {
            if(media.vote_average && media.vote_count){
                totalRating += media.vote_average;
                totalVotes += media.vote_count;
            }
        });
    }

    const averageRating = collection.parts?.length > 0 ? (totalRating / collection.parts.length).toFixed(1) : "N/A";

    return (
        <div className="min-h-screen pb-12">
            <Backdrop item={collection} navigate={navigate} mediaType='collection' />
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Overview item={collection} />

                         {collection.parts && collection.parts.length > 0 && (
                            <section className="glass-container p-8">
                                <h2 className="text-2xl font-bold mb-6">Movies/TV Shows in this Collection</h2>
                                <MovieGrid initialMedia={collection.parts.map(media => ({ ...media, media_type: media.media_type || (media.title ? 'movie' : 'tv') }))} isLoading={false} />
                            </section>
                        )}

                         {!collection.parts || collection.parts.length === 0 &&(
                            <section className="glass-container p-8">
                                <h2 className="text-2xl font-bold mb-6">Movies/TV Shows in this Collection</h2>
                                <div>No Items Found.</div>
                             </section>
                         )}
                    </div>

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
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailsPage;