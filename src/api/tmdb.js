import axios from 'axios';

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});

export const searchMovies = async (query) => {
  try {
    const response = await tmdb.get('/search/movie', {
      params: { query }
    });
    return response.data.results.map(movie => ({ ...movie, media_type: 'movie' }));
  } catch (error) {
    console.error("Error searching movies", error);
    throw error;
  }
};

export const searchTvShows = async (query) => {
  try {
    const response = await tmdb.get('/search/tv', {
      params: { query }
    });
    return response.data.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }));
  } catch (error) {
    console.error("Error searching TV Shows", error);
    throw error;
  }
};

export const searchPersons = async (query) => {
  try {
    const response = await tmdb.get('/search/person', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching people", error);
    throw error;
  }
};

export const fetchPersonDetails = async (personId) => {
  try {
    const response = await tmdb.get(`/person/${personId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching person details", error);
    throw error;
  }
};

export const fetchPersonMovieCredits = async (personId) => {
    try {
        const response = await tmdb.get(`/person/${personId}/movie_credits`);
        return response.data.cast.map(movie => ({ ...movie, media_type: 'movie' }));
    } catch (error) {
        console.error("Error fetching person movie credits", error);
        throw error;
    }
};

export const fetchPersonTvCredits = async (personId) => {
    try {
        const response = await tmdb.get(`/person/${personId}/tv_credits`);
        return response.data.cast.map(tv => ({ ...tv, media_type: 'tv' }));
    } catch (error) {
        console.error("Error fetching person TV credits", error);
        throw error;
    }
};

export const fetchTvShowDetails = async (tvId) => {
  if (!tvId) {
    console.error("fetchTvShowDetails: tvId is missing!");
    throw new Error("fetchTvShowDetails: tvId is required");
  }
  try {
    const response = await tmdb.get(`/tv/${tvId}`,{
        params: {
          append_to_response: 'belongs_to_collection',
        },
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
      if (error.response && error.response.status === 404) {
          return null;
        }
    throw error;
  }
};

export const fetchTvShowSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching TV Show Season Episodes:", error);
    throw error;
  }
};

// Combined fetch for both TV and Movie genres
export const fetchGenres = async () => {
    try {
      const [tvGenresRes, movieGenresRes] = await Promise.all([
        tmdb.get('/genre/tv/list'),
        tmdb.get('/genre/movie/list'),
      ]);

      const combinedGenres = [...tvGenresRes.data.genres, ...movieGenresRes.data.genres];
      //Remove Duplicate
      const uniqueGenres = Array.from(new Set(combinedGenres.map(genre => genre.id)))
      .map(id => {
        return combinedGenres.find(genre => genre.id === id);
      });
      return uniqueGenres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      throw error;
    }
  };

export const discoverTvShows = async (params) => {
  try {
    const response = await tmdb.get('/discover/tv', { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching discover TV shows", error);
    throw error;
  }
}

export const fetchMovieReviews = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie reviews", error)
    throw error;
  }
}

export const searchByKeyword = async (query) => {
  try {
    const response = await tmdb.get('/search/keyword', {
      params: { query }
    });
    return response.data
  } catch (error) {
    console.error("Error searching keywords", error);
    throw error;
  }
}

export const discoverMovies = async (params) => {
  try {
    const response = await tmdb.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error("Error discovering movies", error);
    throw error;
  }
}

export const fetchMovieRecommendations = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie recommendations", error);
    throw error
  }
};

export const fetchCollectionDetails = async (collectionId) => {
  try {
    const response = await tmdb.get(`/collection/${collectionId}`);
    return response.data
  } catch (error) {
    console.error("Error fetching collection details", error);
    throw error;
  }
}

// Function to fetch movie content ratings
export const fetchMovieContentRatings = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}/release_dates`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movie content ratings", error);
    return [];
  }
};

// Function to fetch TV show content ratings
export const fetchTvContentRatings = async (tvId) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/content_ratings`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching tv content ratings", error);
    return [];
  }
};
export const fetchPopularMedia = async () => {
  try {
    const [moviesResponse, tvShowsResponse] = await Promise.all([
      tmdb.get('/movie/popular'),
      tmdb.get('/tv/popular')
    ]);

    const movies = moviesResponse.data.results.map(movie => ({ ...movie, media_type: 'movie' }));
    const tvShows = tvShowsResponse.data.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }));

    const combined = [...movies, ...tvShows];
    return combined;

  } catch (error) {
    console.error("Error fetching popular movies and TV shows:", error);
    throw error;
  }
};