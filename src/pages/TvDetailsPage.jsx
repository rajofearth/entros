import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tmdb, fetchTvShowDetails, fetchTvShowSeasonEpisodes, fetchPopularTvShows } from '../api/tmdb';
import { Link } from 'react-router-dom';

export default function TvDetailsPage() {
  const { tv_id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [credits, setCredits] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [videos, setVideos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [watchProviders, setWatchProviders] = useState(null);
    const [keywords, setKeywords] = useState(null);
    const [recommendations, setRecommendations] = useState(null)
    const [showCount, setShowCount] = useState(10);
    

  useEffect(() => {
    const fetchTvData = async () => {
      try {
        setIsLoading(true);
        const [
          tvRes,
          creditsRes,
          similarRes,
            videosRes,
          watchProvidersRes,
            keywordsRes,
          recommendationsRes
        ] = await Promise.all([
          fetchTvShowDetails(tv_id),
          tmdb.get(`/tv/${tv_id}/credits`),
          tmdb.get(`/tv/${tv_id}/similar`),
            tmdb.get(`/tv/${tv_id}/videos`),
          tmdb.get(`/tv/${tv_id}/watch/providers`),
           tmdb.get(`/tv/${tv_id}/keywords`),
          tmdb.get(`/tv/${tv_id}/recommendations`)
        ]);

        setTvShow(tvRes.data);
        setCredits(creditsRes.data);
        setSimilar(similarRes.data.results);
            setVideos(videosRes.data.results);
        setWatchProviders(watchProvidersRes.data.results);
        setKeywords(keywordsRes.data.keywords)
          setRecommendations(recommendationsRes.data.results)

      } catch (error) {
        console.error('Error fetching tv show data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTvData();
  }, [tv_id]);


    if (isLoading) return <div className="animate-shimmer min-h-screen" />;
    if (!tvShow) return null;

  const trailer = videos?.find((video) => video.type === 'Trailer') || videos?.[0];
    const creator = credits?.crew.find(person => person.job === 'Executive Producer')
  const cast = credits?.cast.slice(0, 6) || [];

  return (
    <div className="min-h-screen pb-12">
          <div className="relative h-[70vh]">
             <img
                src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
                alt={tvShow.name}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                </button>

            {/* Movie Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-7xl mx-auto">
                     <h1 className="text-5xl font-bold text-white mb-4">{tvShow.name}</h1>
                   <div className="flex flex-wrap items-center gap-4 text-lg">
                     <span className="rating-badge text-xl">
                         {tvShow.vote_average.toFixed(1)}
                      </span>
                    <span className="text-white/80">{tvShow.first_air_date?.split('-')[0]}</span>
                 <span className="text-white/80">
                    {tvShow.episode_run_time?.[0]}m
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
                    {tvShow.overview}
                    </p>
               </section>


                 {/* Cast */}
                 {cast.length > 0 && (
                  <section className="glass-container p-8">
                    <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {cast.map((person) => (
                        <Link to={`/person/${person.id}`} key={person.id} className="text-center hover:scale-105 transition-transform duration-300">
                          <img
                           src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                           alt={person.name}
                            className="w-32 h-32 rounded-full mx-auto object-cover mb-3"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200';
                            }}
                          />
                            <h3 className="font-medium">{person.name}</h3>
                           <p className="text-sm text-white/60">{person.character}</p>
                         </Link>
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
                
                 {/* Similar TV Shows - Full Width Section (Desktop) */}
                    {similar?.length > 0 && (
                      <section className="hidden lg:block mt-12 px-6">
                        <div className="max-w-full mx-auto glass-container p-8">
                            <h2 className="text-2xl font-bold mb-6">Similar TV Shows</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {similar.slice(0, showCount).map(tv => (
                                <div
                                  key={tv.id}
                                  onClick={() => navigate(`/tv/${tv.id}`)}
                                  className="cursor-pointer hover:scale-105 transition-all duration-300"
                                >
                                  <img
                                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                                    alt={tv.name}
                                    className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                                  />
                                  <div className="p-2">
                                      <h3 className="font-medium truncate">{tv.name}</h3>
                                     <div className="flex items-center gap-3">
                                        <span className="rating-badge">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                            {tv.vote_average.toFixed(1)}
                                        </span>
                                      <span className="text-white/80 text-sm truncate">
                                            {tv.first_air_date.split('-')[0]}
                                      </span>
                                      </div>
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
                  {creator && (
                    <div>
                        <h3 className="text-white/60">Creator</h3>
                        <p>{creator.name}</p>
                      </div>
                   )}
                <div>
                  <h3 className="text-white/60">Status</h3>
                  <p>{tvShow.status}</p>
                </div>

               {tvShow.seasons && tvShow.seasons.length > 0 && (
                     <div>
                         <h3 className="text-white/60">Seasons</h3>
                            <p>{tvShow.seasons.length}</p>
                     </div>
                  )}
                <div>
                  <h3 className="text-white/60">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {tvShow.genres.map(genre => (
                        <span key={genre.id} className="rating-badge">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                 </div>
                   {tvShow.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-white/60">Production</h3>
                     <p>{tvShow.production_companies.map(co => co.name).join(', ')}</p>
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

           {/* Similar Movies - Full Width Section (Mobile) */}
             {similar?.length > 0 && (
              <section className="lg:hidden mt-12 px-6">
                 <div className="max-w-full mx-auto glass-container p-8">
                     <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                      <div className="grid grid-cols-3 gap-6">
                         {similar.slice(0, showCount).map(tv => (
                          <div
                              key={tv.id}
                                onClick={() => navigate(`/tv/${tv.id}`)}
                               className="cursor-pointer hover:scale-105 transition-all duration-300"
                                >
                             <img
                                 src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                                 alt={tv.name}
                                  className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                              />
                               <div className="p-2">
                                 <h3 className="font-medium truncate">{tv.name}</h3>
                                 <div className="flex items-center gap-3">
                                     <span className="rating-badge">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                     </svg>
                                      {tv.vote_average.toFixed(1)}
                                      </span>
                                <span className="text-white/80 text-sm truncate">
                                 {tv.first_air_date.split('-')[0]}
                                  </span>
                             </div>
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
  );
}