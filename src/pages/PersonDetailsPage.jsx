import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tmdb, fetchPersonDetails, fetchPersonMovieCredits, fetchPersonTvCredits } from '../api/tmdb';

export default function PersonDetailsPage() {
    const { person_id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [movieCredits, setMovieCredits] = useState(null);
    const [tvCredits, setTvCredits] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    function removeDuplicates(arr, key) {
        const seen = new Set();
        return arr.filter(item => {
            const keyValue = item[key];
            return seen.has(keyValue) ? false : seen.add(keyValue);
        });
    }

    useEffect(() => {
        const fetchPersonData = async () => {
            try {
                setIsLoading(true);

                const [personData, movieCreditsData, tvCreditsData] =
                    await Promise.all([
                        fetchPersonDetails(person_id),
                        fetchPersonMovieCredits(person_id),
                        fetchPersonTvCredits(person_id)
                    ]);

                setPerson(personData);
                setMovieCredits(movieCreditsData);
                setTvCredits(removeDuplicates(tvCreditsData, "id"));
            } catch (error) {
                console.error('Error fetching person data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersonData();
    }, [person_id]);


    if (isLoading) return <div className="animate-shimmer min-h-screen" />;
    if (!person) return null;

    const imageUrl = person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : 'https://placehold.co/400';

    return (
        <div className="min-h-screen pb-12">
            <div className="relative h-[70vh]">
                <img
                    src={imageUrl}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/400';
                    }}
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

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-5xl font-bold text-white mb-2">{person.name}</h1>
                        {/* Movie and TV Show Counts */}
                        <div className="flex flex-wrap items-center gap-4 text-lg text-gray-300">
                            {movieCredits && <span>{movieCredits.length} Movies</span>}
                            {tvCredits && <span>{tvCredits.length} TV Shows</span>}
                        </div>
                    </div>
                </div>

            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Biography */}
                        <section className="glass-container p-8">
                            <h2 className="text-2xl font-bold mb-4">Biography</h2>
                            <p className="text-lg text-white/80 leading-relaxed">
                                {person.biography}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Details */}
                        <section className="glass-container p-8">
                            <h2 className="text-2xl font-bold mb-4">Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-white/60">Gender</h3>
                                    <p>{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "N/A"}</p>
                                </div>
                                {person.birthday && (
                                    <div>
                                        <h3 className="text-white/60">Birthday</h3>
                                        <p>{person.birthday}</p>
                                    </div>
                                )}
                                {person.place_of_birth && (
                                    <div>
                                        <h3 className="text-white/60">Place of Birth</h3>
                                        <p>{person.place_of_birth}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Credits Section (Side-by-Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12"> {/* ADDED THIS */}
                    {/* Movie Credits */}
                    {movieCredits && movieCredits.length > 0 && (
                        <section className="glass-container p-8">
                            <h2 className="text-2xl font-bold mb-6">Movie Credits</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {movieCredits.map((movie, index) => (
                                    <Link to={`/movie/${movie.id}`} key={`movie-${movie.id}-${index}`} className="hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/400';
                                            }}
                                        />
                                        <h3 className="font-medium truncate">{movie.title}</h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* TV Show Credits */}
                    {tvCredits && tvCredits.length > 0 && (
                        <section className="glass-container p-8">
                            <h2 className="text-2xl font-bold mb-6">TV Show Credits</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {tvCredits.map((tv, index) => (
                                    <Link to={`/tv/${tv.id}`} key={`tv-${tv.id}-${index}`} className="hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${tv.poster_path}`}
                                            alt={tv.name}
                                            className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/400';
                                            }}
                                        />
                                        <h3 className="font-medium truncate">{tv.name}</h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>

    );
}