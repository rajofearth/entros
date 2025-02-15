import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, fetchMovieReviews } from '../api/tmdb'; // Import fetchMovieReviews
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
    const [reviews, setReviews] = useState([]); // State for reviews

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setIsLoading(true);
                const [movieRes, creditsRes, similarRes, videosRes, reviewsRes] = await Promise.all([
                    tmdb.get(`/movie/${id}`),
                    tmdb.get(`/movie/${id}/credits`),
                    tmdb.get(`/movie/${id}/similar`),
                    tmdb.get(`/movie/${id}/videos`),
                    fetchMovieReviews(id), // Fetch reviews
                ]);
                setMovie(movieRes.data);
                setCredits(creditsRes.data);
                setSimilar(similarRes.data.results);
                setVideos(videosRes.data.results);
                setReviews(reviewsRes.results); // Set reviews
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
    }, [id]);

    if (isLoading) return <LoadingSpinner />;
    if (!movie) return null;

    const trailer = videos?.find((video) => video.type === 'Trailer') || videos?.[0];
    const cast = credits?.cast.slice(0, 6) || [];
    const mediaType = 'movie';

    return (
        <div className="min-h-screen pb-12">
            <Backdrop item={movie} navigate={navigate} mediaType={mediaType} />
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Overview item={movie} />
                        <TopCast cast={cast} />
                        <Trailer trailer={trailer} />

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <section className="glass-container p-8">
                                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                                {reviews.slice(0, 3).map((review) => ( // Show first 3 reviews
                                    <div key={review.id} className="mb-4">
                                        <h4 className="font-medium">{review.author}</h4>
                                        <p className="text-white/80">{review.content.substring(0, 200)}...</p> {/* Show snippet */}
                                        {/*  You could add a link to read the full review if available  */}
                                    </div>
                                ))}
                                {reviews.length > 3 && (
                                  <button className='bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300'>
                                    Show More Reviews
                                  </button>
                                )}
                            </section>
                        )}
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