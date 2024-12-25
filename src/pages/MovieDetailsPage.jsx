import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { tmdb } from '../api/tmdb'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)
  const [similar, setSimilar] = useState(null)
  const [videos, setVideos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [watchProviders, setWatchProviders] = useState(null)
  const [keywords, setKeywords] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [collection, setCollection] = useState(null)
  const [showCount, setShowCount] = useState(10)

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true)
        const [movieRes,
          creditsRes, 
          similarRes, 
          videosRes, 
          watchProvidersRes,
          keywordsRes,
          recommendationsRes] = await Promise.all([
          tmdb.get(`/movie/${id}`),
          tmdb.get(`/movie/${id}/credits`),
          tmdb.get(`/movie/${id}/similar`),
          tmdb.get(`/movie/${id}/videos`),
          tmdb.get(`/movie/${id}/watch/providers`),
          tmdb.get(`/movie/${id}/keywords`),
          tmdb.get(`/movie/${id}/recommendations`)
        ])

        setMovie(movieRes.data)
        setCredits(creditsRes.data)
        setSimilar(similarRes.data.results)
        setVideos(videosRes.data.results)
        setWatchProviders(watchProvidersRes.data.results)
        setKeywords(keywordsRes.data.keywords)
        setRecommendations(recommendationsRes.data.results)

        // Fetch collection data if movie belongs to a collection
        if (movieRes.data.belongs_to_collection) {
          const collectionRes = await tmdb.get(
            `/collection/${movieRes.data.belongs_to_collection.id}`
          )
          setCollection(collectionRes.data)
        }
      } catch (error) {
        console.error('Error fetching movie data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovieData()
  }, [id])

  if (isLoading) return <div className="animate-shimmer min-h-screen" />
  if (!movie) return null

  const trailer = videos?.find(video => video.type === 'Trailer') || videos?.[0]
  const director = credits?.crew.find(person => person.job === 'Director')
  const cast = credits?.cast.slice(0, 6) || []

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="backdrop-overlay" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 z-50 glass-container p-4 rounded-full 
                    hover:bg-white/10 transition-all duration-300 group"
        >
          <svg className="w-6 h-6 text-white/70 group-hover:text-white" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <span className="rating-badge text-xl">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/80">
                {movie.release_date?.split('-')[0]}
              </span>
              <span className="text-white/80">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="glass-container p-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                {movie.overview}
              </p>
            </section>

            {/* Cast */}
            {cast.length > 0 && (
              <section className="glass-container p-8">
                <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {cast.map(person => (
                    <div key={person.id} className="text-center">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                        alt={person.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover mb-3"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200'
                        }}
                      />
                      <h3 className="font-medium">{person.name}</h3>
                      <p className="text-sm text-white/60">{person.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trailer */}
            {trailer && (
              <section className="glass-container p-8">
                <h2 className="text-2xl font-bold mb-6">Trailer</h2>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Movie Trailer"
                    className="w-full h-full rounded-xl"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Similar Movies - Full Width Section (Desktop) */}
            {similar?.length > 0 && (
              <section className="hidden lg:block mt-12 px-6">
                <div className="max-w-full mx-auto glass-container p-8">
                  <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {similar.slice(0, showCount).map(movie => (
                      <div
                        key={movie.id}
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                        />
                        <div className="p-2">
                          <h3 className="font-medium truncate">{movie.title}</h3>
                          <p className="text-sm text-white/60">
                            {movie.release_date?.split('-')[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {similar.length > showCount && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowCount(prev => prev + 10)}
                        className="glass-container px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300"
                      >
                        Show More
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Movie Details */}
            <section className="glass-container p-8">
              <h2 className="text-2xl font-bold mb-6">Details</h2>
              <div className="space-y-4">
                {director && (
                  <div>
                    <h3 className="text-white/60">Director</h3>
                    <p>{director.name}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-white/60">Status</h3>
                  <p>{movie.status}</p>
                </div>
                <div>
                  <h3 className="text-white/60">Budget</h3>
                  <p>${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <h3 className="text-white/60">Revenue</h3>
                  <p>${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <h3 className="text-white/60">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="rating-badge">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                {movie.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-white/60">Production</h3>
                    <p>{movie.production_companies.map(co => co.name).join(', ')}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Watch Providers */}
            {watchProviders?.US && (
              <section className="glass-container p-8">
                <h2 className="text-2xl font-bold mb-6">Where to Watch</h2>
                {watchProviders.US.flatrate && (
                  <div className="mb-4">
                    <h3 className="text-white/60 mb-2">Stream</h3>
                    <div className="flex flex-wrap gap-2">
                      {watchProviders.US.flatrate.map(provider => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-10 h-10 rounded-lg"
                          title={provider.provider_name}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {watchProviders.US.rent && (
                  <div className="mb-4">
                    <h3 className="text-white/60 mb-2">Rent</h3>
                    <div className="flex flex-wrap gap-2">
                      {watchProviders.US.rent.map(provider => (
                        <img
                          key={provider.provider_id}
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-10 h-10 rounded-lg"
                          title={provider.provider_name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Keywords */}
            {keywords?.length > 0 && (
              <section className="glass-container p-8">
                <h2 className="text-2xl font-bold mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(keyword => (
                    <span key={keyword.id} className="rating-badge text-sm">
                      {keyword.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Collection */}
            {collection && (
              <section className="glass-container p-8">
                <h2 className="text-2xl font-bold mb-4">Part of {collection.name}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                  alt={collection.name}
                  className="w-full rounded-xl mb-4"
                />
                <p className="text-white/80">{collection.overview}</p>
              </section>
            )}

            {/* Similar Movies - Full Width Section (Mobile) */}
            {similar?.length > 0 && (
              <section className="lg:hidden mt-12 px-6">
                <div className="max-w-full mx-auto glass-container p-8">
                  <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {similar.slice(0, showCount).map(movie => (
                      <div
                        key={movie.id}
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                        />
                        <div className="p-2">
                          <h3 className="font-medium truncate">{movie.title}</h3>
                          <p className="text-sm text-white/60">
                            {movie.release_date?.split('-')[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {similar.length > showCount && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowCount(prev => prev + 10)}
                        className="glass-container px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300"
                      >
                        Show More
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}