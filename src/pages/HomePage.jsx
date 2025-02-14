import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { fetchPopularMedia, searchMovies, searchTvShows } from '../api/tmdb'; 

// Configuration (Adjust these weights as needed)
const RECENCY_WEIGHT = 0.4;
const VOTE_AVERAGE_WEIGHT = 0.3;
const HOLLYWOOD_BOOST = 0.6;
const TIME_DECAY_HALF_LIFE_DAYS = 365; // Adjust for how quickly recency decays
const MOVIE_BOOST = 0.9;

// Function to calculate the combined media score (Recency & Rating)
const calculateMediaScore = (media) => {
    let score = 0;

    // 1. Recency (Time-Based Decay)
    const dateString = media.release_date || media.first_air_date || '1900-01-01';
    const releaseDate = new Date(dateString);
    const now = new Date();
    const ageInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);
    const recencyFactor = Math.exp(-ageInDays / TIME_DECAY_HALF_LIFE_DAYS);
    score += RECENCY_WEIGHT * recencyFactor;

    // 2. Vote Average (Scale vote average (out of 10))
    score += VOTE_AVERAGE_WEIGHT * ((media.vote_average || 0) * 10);

      // 3. Hollywood Boost
    if (media.media_type === 'tv' && media.origin_country && media.origin_country.includes('US')) {
      score += HOLLYWOOD_BOOST;
    } else if (media.media_type === 'movie' && media.production_companies) {
      const isHollywood = media.production_companies.some(company => company.origin_country === 'US');
      if (isHollywood) {
        score += HOLLYWOOD_BOOST;
      }
    }

     // 4. Movie Boost
    if (media.media_type === 'movie') {
      score += MOVIE_BOOST;
    }


    return score;
};

export default function HomePage() {
    const [searchResults, setSearchResults] = useState([]);
    const [popularMedia, setPopularMedia] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const initialMedia = await fetchPopularMedia()
                // Sort combined array by our combined score
                initialMedia.sort((a, b) => calculateMediaScore(b) - calculateMediaScore(a));

                setPopularMedia(initialMedia);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

      const handleSearch = async (results, searchTerm, searchType) => {
    let searchResults = [];

    if (searchType === 'movie' || searchType === 'multi') {
      const movieResults = await searchMovies(searchTerm);
      searchResults = searchResults.concat(movieResults.map(movie => ({ ...movie, media_type: 'movie' })));
    }

    if (searchType === 'tv' || searchType === 'multi') {
      const tvResults = await searchTvShows(searchTerm);
      searchResults = searchResults.concat(tvResults.map(tv => ({ ...tv, media_type: 'tv' })));
    }

    // Sort search results based on recency and rating
    const sortedResults = [...searchResults].sort((a, b) => calculateMediaScore(b) - calculateMediaScore(a));
    setSearchResults(sortedResults);
  };

    const displayedMedia = searchResults.length > 0 ? searchResults : popularMedia;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#000212] to-[#111]">
            <div className="container mx-auto px-4 pt-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                        Entros
                    </h1>
                    <p className="text-white/60">Discover your next favorite film or show</p>
                </div>

                <div className="flex justify-center items-center gap-3 mb-8 relative">
                    <div className="flex-1 max-w-2xl">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                </div>

                <MovieGrid initialMedia={displayedMedia} />
            </div>
        </div>
    );
}