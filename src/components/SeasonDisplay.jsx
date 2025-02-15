import React, { useState, useEffect } from 'react';
import { tmdb, fetchTvShowSeasonEpisodes } from '../api/tmdb';
import LoadingSpinner from './LoadingSpinner';

const SeasonDisplay = ({ tvId, seasons }) => {
    const [selectedSeason, setSelectedSeason] = useState(seasons && seasons.length > 0 ? seasons[0].season_number : null);
    const [episodes, setEpisodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEpisodes = async () => {
            if (tvId && selectedSeason !== null) {
                setIsLoading(true);
                setError(null);
                try {
                    const episodeData = await fetchTvShowSeasonEpisodes(tvId, selectedSeason);
                    setEpisodes(episodeData.episodes || []); // Handle potential undefined episodes
                } catch (err) {
                    setError(err);
                    console.error("Error fetching episodes:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchEpisodes();
    }, [tvId, selectedSeason]);

    const handleSeasonChange = (event) => {
        setSelectedSeason(parseInt(event.target.value, 10));
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">Error loading episodes.</div>;
    }

    return (
        <div className="glass-container p-4">
            <h3 className="text-xl font-bold mb-2">Seasons</h3>
            <select
                value={selectedSeason}
                onChange={handleSeasonChange}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-white/90 appearance-none cursor-pointer focus:outline-none transition-all duration-300 mb-4"
            >
                {seasons.map((season) => (
                    <option key={season.season_number} value={season.season_number}>
                        {season.name}
                    </option>
                ))}
            </select>

            {/* Episode List - Scrollable with Fixed Height */}
            <div className="max-h-96 overflow-y-auto"> {/* Added max-h and overflow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Added sm:grid-cols-2 */}
                    {episodes.map((episode) => (
                        <div key={episode.id} className="bg-white/5 p-4 rounded-lg">
                            <h4 className="font-medium text-lg">{episode.episode_number}. {episode.name}</h4>
                            <p className="text-sm text-gray-400">{episode.air_date}</p>
                            <p className="text-white/80 mt-2">{episode.overview}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeasonDisplay;