import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb } from '../api/tmdb';
import Backdrop from '../components/Backdrop'; 
import Overview from '../components/Overview'; 
import TopCast from '../components/TopCast';
import Trailer from '../components/Trailer';
import SimilarItems from '../components/SimilarItems'; 
import DetailsSidebar from '../components/DetailsSidebar'; 
import WatchProviders from '../components/WatchProviders'; 
import CollectionSection from '../components/CollectionSection'; 
import LoadingSpinner from '../components/LoadingSpinner';


const MovieDetailsPage = () => {
     const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [videos, setVideos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [collection, setCollection] = useState(null);

      useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setIsLoading(true);
                const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
                    tmdb.get(`/movie/${id}`),
                    tmdb.get(`/movie/${id}/credits`),
                    tmdb.get(`/movie/${id}/similar`),
                    tmdb.get(`/movie/${id}/videos`),
                ]);

                setMovie(movieRes.data);
                setCredits(creditsRes.data);
                setSimilar(similarRes.data.results);
                setVideos(videosRes.data.results);


                // Fetch collection data (keep this here, as it's specific to the movie)
                if (movieRes.data.belongs_to_collection) {
                    const collectionRes = await tmdb.get(`/collection/${movieRes.data.belongs_to_collection.id}`);
                    setCollection(collectionRes.data);
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);  // Only depend on id

    if (isLoading) return <LoadingSpinner />;
    if (!movie) return null;

    const trailer = videos?.find((video) => video.type === 'Trailer') || videos?.[0];
     const cast = credits?.cast.slice(0, 6) || [];
    const mediaType = 'movie'; // Important:  Pass 'movie' or 'tv'

    return (
        <div className="min-h-screen pb-12">
            <Backdrop item={movie} navigate={navigate} mediaType={mediaType} />

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Overview item={movie} />
                        <TopCast cast={cast} />
                        <Trailer trailer={trailer} />
                         <SimilarItems similar={similar} navigate={navigate} mediaType={mediaType} />
                    </div>
                    <div className="space-y-8">
                       <DetailsSidebar item={movie} credits={credits} mediaType={mediaType} />
                         <WatchProviders itemId={id} mediaType={mediaType} />
                         <CollectionSection collection={collection} />
                        <SimilarItems similar={similar} navigate={navigate} mediaType={mediaType} isMobile={true} />

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailsPage;