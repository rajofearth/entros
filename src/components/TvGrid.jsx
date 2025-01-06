import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { tmdb, fetchPopularTvShows } from '../api/tmdb';
import TvCard from './TvCard';
import HorizontalAd from '../Ads/HorizontalAd';

export default function TvGrid({ initialShows }) {
    const [tvShows, setTvShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
      useEffect(() => {
        if (initialShows) {
            setTvShows(initialShows);
          setIsLoading(false);
            return;
        }
    
        const fetchTvShows = async () => {
          try {
              setIsLoading(true);
              const response = await fetchPopularTvShows();
              setTvShows(response.results);
          } catch (error) {
            console.error('Error fetching tv shows:', error);
          } finally {
              setIsLoading(false);
          }
        };
    
        fetchTvShows();
    }, [initialShows]);

    useEffect(() => {
        const debouncedHandleResize = debounce(() => setWindowWidth(window.innerWidth), 100);
        window.addEventListener('resize', debouncedHandleResize);
        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, []);

    function getColumns(width) {
        if (width >= 1024) return 4;
        if (width >= 768) return 3;
        if (width >= 640) return 2;
        return 1;
    }

    const cols = getColumns(windowWidth);
    const insertionIndex = cols * 2;

    const firstPart = tvShows.slice(0, insertionIndex);
    const secondPart = tvShows.slice(insertionIndex);

    if (isLoading) {
      return (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse space-y-8 w-full max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-2xl aspect-[2/3]"></div>
                ))}
              </div>
            </div>
          </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {firstPart.map(tvShow => (
              <div
                key={tvShow.id}
                className="transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1"
              >
                <TvCard tvShow={tvShow} />
              </div>
            ))}
            {insertionIndex < tvShows.length && (
              <div className="col-span-full">
                  <HorizontalAd />
              </div>
             )}
              {secondPart.map(tvShow => (
                 <div
                 key={tvShow.id}
                    className="transform transition duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <TvCard tvShow={tvShow} />
                </div>
              ))}
            </div>
              {tvShows.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No TV Shows found</p>
              </div>
            )}
        </div>
      );
    }

TvGrid.propTypes = {
  initialShows: PropTypes.array,
};

function debounce(func, wait) {
    let timeout;
    return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
    };
}