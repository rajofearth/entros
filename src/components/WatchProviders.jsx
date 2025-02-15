import React, { useState, useEffect } from 'react';
import { tmdb } from '../api/tmdb';
import { getProviderLogo } from '../utils/imageUtils';

const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' },
];

const WatchProviders = ({ itemId, mediaType }) => {
    const [watchProviders, setWatchProviders] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProviders = async () => {
            if (!itemId) return;
             setIsLoading(true);
            try {
                const res = await tmdb.get(`/${mediaType}/${itemId}/watch/providers`, {
                    params: { watch_region: selectedCountry },
                });
                setWatchProviders(res.data.results);
            } catch (error) {
                console.error('Error fetching watch providers:', error);
                 setWatchProviders({});
            } finally {
                 setIsLoading(false);
            }
        };
        fetchProviders();
    }, [itemId, selectedCountry, mediaType]);

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

     if (isLoading) {
      return (<div className='glass-container p-8'>
        <p>Loading providers...</p>
      </div>);
    }


    if (!watchProviders || !watchProviders[selectedCountry]) {
        return (
          <section className="glass-container p-8">
            <h2 className="text-2xl font-bold mb-6">Where to Watch</h2>
            <div className="mb-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-300">
                Select Country:
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-white/80">
              Watch provider information is currently unavailable for {selectedCountry}. We are working to expand
              our provider coverage.
            </p>
          </section>
        );
      }

    const providers = watchProviders[selectedCountry];

    return (
        <section className="glass-container p-8">
            <h2 className="text-2xl font-bold mb-4">Where to Watch</h2>
            <div className="mb-4">
                <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10
                                rounded-xl px-4 py-3 text-white/90 appearance-none cursor-pointer focus:outline-none
                                transition-all duration-300 min-w-[150px]"
                >
                    {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            {(!providers.flatrate && !providers.rent && !providers.buy) && (
                <p className="text-white/80">No watch providers available in {selectedCountry}.</p>
            )}

            {providers.flatrate && providers.flatrate.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-white/60 mb-2">Stream</h3>
                    <div className="flex flex-wrap gap-4">
                        {providers.flatrate.map((provider) => (
                            <a
                                key={provider.provider_id}
                                href={providers.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={getProviderLogo(provider)}
                                    alt={provider.provider_name}
                                    className="w-12 h-12 rounded-lg"
                                    title={provider.provider_name}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {providers.rent && providers.rent.length>0 &&(
                <div className="mb-4">
                    <h3 className="text-white/60 mb-2">Rent</h3>
                    <div className="flex flex-wrap gap-4">
                        {providers.rent.map((provider) => (
                            <a
                                key={provider.provider_id}
                                href={providers.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={getProviderLogo(provider)}
                                    alt={provider.provider_name}
                                    className="w-12 h-12 rounded-lg"
                                    title={provider.provider_name}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
            {}
             {providers.buy && providers.buy.length>0 &&(
                <div className="mb-4">
                    <h3 className="text-white/60 mb-2">Buy</h3>
                    <div className="flex flex-wrap gap-4">
                        {providers.buy.map((provider) => (
                            <a
                                key={provider.provider_id}
                                href={providers.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={getProviderLogo(provider)}
                                    alt={provider.provider_name}
                                    className="w-12 h-12 rounded-lg"
                                    title={provider.provider_name}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default WatchProviders;