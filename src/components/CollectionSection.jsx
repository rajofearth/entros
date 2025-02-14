import React from 'react';
import { Link } from 'react-router-dom';

const CollectionSection = ({ collection }) => {
  if (!collection) return null;

  return (
    <Link to={`/collection/${collection.id}`} className="block hover:scale-105 transition-transform duration-300">
      <section className="glass-container p-8">
        <h2 className="text-2xl font-bold mb-4">
          Part of {collection.name}
        </h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
          alt={collection.name}
          className="w-full rounded-xl mb-4 object-cover aspect-[16/9]" // Make it responsive aspect ratio, and object cover to handle different sizes
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x338?text=No+Image'; // Keep the same aspect ratio
          }}
        />
        <p className="text-white/80">{collection.overview}</p>
      </section>
    </Link>
  );
};

export default CollectionSection;