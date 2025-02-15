import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdb, fetchTvShowDetails } from '../api/tmdb';
import Backdrop from '../components/Backdrop';
import Overview from '../components/Overview';
import TopCast from '../components/TopCast';
import Trailer from '../components/Trailer';
import SimilarItems from '../components/SimilarItems';
import DetailsSidebar from '../components/DetailsSidebar';
import WatchProviders from '../components/WatchProviders';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import CollectionSection from '../components/CollectionSection';

const TvDetailsPage = () => {
    const { tv_id } = useParams();
    const navigate = useNavigate();
    const [tvShow, setTvShow] = useState(null);
    const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [videos, setVideos] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Start with isLoading true
    const [error, setError] = useState(null);
    const [collection, setCollection] = useState(null);
    const [allSeasons, setAllSeasons] = useState([]);
    const [number_of_episodes, setNumberOfEpisodes] = useState(null);

    useEffect(() => {
        const fetchTvData = async () => {
            setIsLoading(true); // Set loading to true before fetching
            setError(null);
            try {
                const [tvRes, creditsRes, similarRes, videosRes] = await Promise.all([
                    fetchTvShowDetails(tv_id),
                    tmdb.get(`/tv/${tv_id}/credits`),
                    tmdb.get(`/tv/${tv_id}/similar`),
                    tmdb.get(`/tv/${tv_id}/videos`),
                ]);
                setTvShow(tvRes);
                setCredits(creditsRes.data);
                setSimilar(similarRes.data.results);
                setVideos(videosRes.data.results);
               if (tvRes.belongs_to_collection) {
                  const collectionRes = await tmdb.get(`/collection/${tvRes.belongs_to_collection.id}`);
                   setCollection(collectionRes.data);
               }
            } catch (err) {
                console.error('Error fetching TV show data:', err);
                setError(err);
            } finally {
                setIsLoading(false); // Set loading to false after fetching (success or error)
            }
        };
        fetchTvData();
    }, [tv_id]);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const seasons = tvShow?.seasons
                if (seasons?.length > 0) {
                    setAllSeasons(seasons)
                }
            } catch (error) {
                console.error('Error fetching TV show data:', error);
            }
        };
        fetchSeasons();
    }, [tvShow]);

    useEffect(() => {
        if (allSeasons && allSeasons.length > 0) {
            const totalEpisodes = allSeasons.reduce((sum, season) => sum + season.episode_count, 0);
            setNumberOfEpisodes(totalEpisodes);
        }
    }, [allSeasons]);

    // Display LoadingSpinner while isLoading is true
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Handle error state (if you have an error)
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Error: {error.message || "Failed to load TV show details."}</p>
            </div>
        );
    }

    // Handle the case where tvShow is still null (shouldn't happen after isLoading is false, but good practice)
    if (!tvShow) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">TV Show not found.</p>
            </div>
        );
    }
    const trailer = videos?.find((video) => video.type === 'Trailer') || videos?.[0];
    const cast = credits?.cast.slice(0, 6) || [];
    const mediaType = 'tv';

    return (
        // ... (rest of your JSX for TvDetailsPage) ...
         <div className="min-h-screen pb-12">
            <Backdrop item={tvShow} navigate={navigate} mediaType={mediaType} number_of_episodes={number_of_episodes} />
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Overview item={tvShow} />
                        <TopCast cast={cast} />
                        <Trailer trailer={trailer} />
                        <SimilarItems similar={similar} navigate={navigate} mediaType={mediaType} />
                          <CollectionSection collection={collection} />
                    </div>
                    <div className="space-y-8">
                        <DetailsSidebar item={tvShow} credits={credits} mediaType={mediaType} />
                        <WatchProviders itemId={tv_id} mediaType={mediaType} />
                        <SimilarItems similar={similar} navigate={navigate} mediaType={mediaType} isMobile={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TvDetailsPage;