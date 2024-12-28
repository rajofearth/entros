import React, { useEffect, useRef } from 'react';

const AdsenseAd = () => {
  const adInitialized = useRef(false); // Track if the ad has been initialized

  useEffect(() => {
    // Ensure the ad is only pushed once
    if (!adInitialized.current) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adInitialized.current = true; // Mark the ad as initialized
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7126360642599717"
        data-ad-slot="8519545504"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdsenseAd;