import React from 'react';

const DetailsSidebar = ({ item, credits, mediaType }) => {
    const director = credits?.crew.find((person) => person.job === 'Director');
    const creator = credits?.crew.find((person) => person.job === 'Executive Producer');

    // Helper function to determine "so far" text AND total episodes
    const getEpisodesText = (item) => {
        if (!item) return '';
        const totalEpisodes = item.number_of_episodes; // Get total episodes
        if (item.status === "Ended" || item.status === "Canceled") {
            return `${totalEpisodes} episodes`;
        } else {
            return `${totalEpisodes} episodes so far`;
        }
    };

    return (
        <section className="glass-container p-8">
            <h2 className="text-2xl font-bold mb-6">Details</h2>
            <div className="space-y-4">
                {mediaType === 'movie' && director && (
                    <div>
                        <h3 className="text-white/60">Director</h3>
                        <p>{director.name}</p>
                    </div>
                )}
                {mediaType === 'tv' && creator && (
                    <div>
                        <h3 className="text-white/60">Creator</h3>
                        <p>{creator.name}</p>
                    </div>
                )}
                <div>
                    <h3 className="text-white/60">Status</h3>
                    <p>{item.status}</p>
                </div>
                {mediaType === 'movie' && (
                    <>
                        <div>
                            <h3 className="text-white/60">Budget</h3>
                            <p>${(item.budget / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                            <h3 className="text-white/60">Revenue</h3>
                            <p>${(item.revenue / 1000000).toFixed(1)}M</p>
                        </div>
                    </>
                )}
                {mediaType === 'tv' && item.seasons && item.seasons.length > 0 && (
                    <div>
                        <h3 className="text-white/60">Seasons</h3>
                        <p>{item.number_of_seasons}</p>
                    </div>
                )}
                {/* Display total episodes for TV shows */}
                {mediaType === 'tv' && (
                    <div>
                        <h3 className="text-white/60">Total Episodes</h3>
                        <p>{getEpisodesText(item)}</p>
                    </div>
                )}
                <div>
                    <h3 className="text-white/60">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {item.genres.map((genre) => (
                            <span key={genre.id} className="rating-badge">{genre.name}</span>
                        ))}
                    </div>
                </div>
                {item.production_companies?.length > 0 && (
                    <div>
                        <h3 className="text-white/60">Production</h3>
                        <p>{item.production_companies.map((co) => co.name).join(', ')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DetailsSidebar;