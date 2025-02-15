import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { fetchPopularMedia, searchMovies, searchTvShows, discoverMovies, discoverTvShows, tmdb } from '../api/tmdb';
import GenreFilter from '../components/GenreFilter';

const RECENCY_WEIGHT = 0.4;
const VOTE_AVERAGE_WEIGHT = 0.3;
const HOLLYWOOD_BOOST = 0.6;
const TIME_DECAY_HALF_LIFE_DAYS = 365;
const MOVIE_BOOST = 0.9;

const calculateMediaScore = (media) => {
    let score = 0;
    const dateString = media.release_date || media.first_air_date || '1900-01-01';
    const releaseDate = new Date(dateString);
    const now = new Date();
    const ageInDays = (now - releaseDate) / (1000 * 60 * 60 * 24);
    const recencyFactor = Math.exp(-ageInDays / TIME_DECAY_HALF_LIFE_DAYS);
    score += RECENCY_WEIGHT * recencyFactor;
    score += VOTE_AVERAGE_WEIGHT * ((media.vote_average || 0) * 10);

    if (media.media_type === 'tv' && media.origin_country && media.origin_country.includes('US')) {
        score += HOLLYWOOD_BOOST;
    } else if (media.media_type === 'movie' && media.production_companies) {
        const isHollywood = media.production_companies.some(company => company.origin_country === 'US');
        if (isHollywood) {
            score += HOLLYWOOD_BOOST;
        }
    }

    if (media.media_type === 'movie') {
        score += MOVIE_BOOST;
    }
    return score;
};

export default function HomePage() {
    const [searchResults, setSearchResults] = useState([]);
    const [popularMedia, setPopularMedia] = useState([]);
    const [trendingMedia, setTrendingMedia] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [topRatedTvShows, setTopRatedTvShows] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [genreFilteredMedia, setGenreFilteredMedia] = useState([]);

    const fetchInitialData = useCallback(async () => {
        try {
            const initialMedia = await fetchPopularMedia();
            initialMedia.sort((a, b) => calculateMediaScore(b) - calculateMediaScore(a));
            setPopularMedia(initialMedia);

            const trending = await Promise.all([
                tmdb.get('/trending/movie/week'), // Use tmdb here
                tmdb.get('/trending/tv/week')     // And here
            ]);
            const trendingCombined = [
                ...trending[0].data.results.map(movie => ({ ...movie, media_type: 'movie' })),
                ...trending[1].data.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }))
            ];
            trendingCombined.sort((a, b) => calculateMediaScore(b) - calculateMediaScore(a));
            setTrendingMedia(trendingCombined);

            const topRatedM = await tmdb.get('/movie/top_rated'); // And here
            setTopRatedMovies(topRatedM.data.results.map(movie => ({ ...movie, media_type: 'movie' })));

            const topRatedT = await tmdb.get('/tv/top_rated');   // And here
            setTopRatedTvShows(topRatedT.data.results.map(tv => ({ ...tv, media_type: 'tv' })));

        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    }, []);


      const handleSearch = useCallback(async (results, searchTerm, searchType) => {
        let searchResults = [];
        if(searchTerm.trim() === ""){
            setSearchResults([]);
            return;
        }

        if (searchType === 'movie' || searchType === 'multi') {
          const movieResults = await searchMovies(searchTerm);
          searchResults = searchResults.concat(movieResults.map(movie => ({ ...movie, media_type: 'movie' })));
        }
        if (searchType === 'tv' || searchType === 'multi') {
          const tvResults = await searchTvShows(searchTerm);
          searchResults = searchResults.concat(tvResults.map(tv => ({ ...tv, media_type: 'tv' })));
        }

        const sortedResults = [...searchResults].sort((a, b) => calculateMediaScore(b) - calculateMediaScore(a));
        setSearchResults(sortedResults);

    }, []);



    const handleGenreFilter = useCallback(async (genreId) => {
      setSelectedGenre(genreId);
      if (!genreId) {
          setGenreFilteredMedia([]);
          return;
      }

      try {
            const movieParams = { with_genres: genreId };
            const tvParams = { with_genres: genreId };

          const [movieData, tvData] = await Promise.all([
              discoverMovies(movieParams),
              discoverTvShows(tvParams)
          ]);

          const combined = [
              ...movieData.results.map(movie => ({ ...movie, media_type: 'movie' })),
              ...tvData.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }))
          ];

          combined.sort((a,b) => calculateMediaScore(b) - calculateMediaScore(a))
          setGenreFilteredMedia(combined);

      } catch (error) {
          console.error("Error fetching genre-filtered media:", error);
      }
  }, []);


  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

    let displayedMedia = popularMedia;

    if (searchResults.length > 0) {
        displayedMedia = searchResults;
    }
     else if(selectedGenre && genreFilteredMedia.length > 0){
        displayedMedia = genreFilteredMedia;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000212] to-[#111]">
        <div className="container mx-auto px-4 pt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
              Entros
            </h1>
            <p className="text-white/60">
              Discover your next favorite film or show
            </p>
          </div>

          <div className="flex justify-center items-center gap-3 mb-8 relative">
            {/* Responsive Container for GenreFilter and SearchBar */}
            <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-3xl">
              <GenreFilter onGenreChange={handleGenreFilter} />
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Displayed Media based on Search/Filters */}
          {(searchResults.length > 0 || genreFilteredMedia.length > 0) && (
            <MovieGrid initialMedia={displayedMedia} />
          )}

          {/* Trending Now Section */}
          {searchResults.length === 0 &&
            genreFilteredMedia.length === 0 &&
            trendingMedia.length > 0 && (
              <>
                <h2 className="text-3xl font-bold mt-12 mb-6 text-white">
                  Trending Now
                </h2>
                <MovieGrid initialMedia={trendingMedia} />
              </>
            )}

          {/* Top Rated Movies Section */}
          {searchResults.length === 0 &&
            genreFilteredMedia.length === 0 &&
            topRatedMovies.length > 0 && (
              <>
                <h2 className="text-3xl font-bold mt-12 mb-6 text-white">
                  Top Rated Movies
                </h2>
                <MovieGrid initialMedia={topRatedMovies} />
              </>
            )}

          {/* Top Rated TV Shows Section */}
          {searchResults.length === 0 &&
            genreFilteredMedia.length === 0 &&
            topRatedTvShows.length > 0 && (
              <>
                <h2 className="text-3xl font-bold mt-12 mb-6 text-white">
                  Top Rated TV Shows
                </h2>
                <MovieGrid initialMedia={topRatedTvShows} />
              </>
            )}

          {/* Popular Media Section (Only if no search/filters)*/}
          {searchResults.length === 0 &&
            genreFilteredMedia.length === 0 &&
            trendingMedia.length === 0 &&
            topRatedMovies.length === 0 &&
            topRatedTvShows.length === 0 && (
              <>
                <h2 className="text-3xl font-bold mt-12 mb-6 text-white">
                  Popular Media
                </h2>
                <MovieGrid initialMedia={popularMedia} />
              </>
            )}
        </div>
      </div>
    );
}