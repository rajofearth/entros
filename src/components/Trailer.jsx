import React from 'react';

const Trailer = ({ trailer }) => {
    if (!trailer) return null;

    return (
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
    );
};
export default Trailer;