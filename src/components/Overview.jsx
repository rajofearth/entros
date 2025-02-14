import React from 'react';

const Overview = ({ item }) => (
    <section className="glass-container p-8">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-lg text-white/80 leading-relaxed">{item.overview}</p>
    </section>
);

export default Overview;