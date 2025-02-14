import React from 'react';
import { Link } from 'react-router-dom';

const TopCast = ({ cast }) => {
    if (!cast || cast.length === 0) return null;

    return (
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
                                e.target.src = 'https://placehold.co/200';
                            }}
                        />
                        <h3 className="font-medium">{person.name}</h3>
                        <p className="text-sm text-white/60">{person.character}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TopCast;