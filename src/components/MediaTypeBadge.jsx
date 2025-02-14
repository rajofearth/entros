// 1. components/MediaTypeBadge.js (REVISED LOGIC)
import React from 'react';

const MediaTypeBadge = ({ mediaType, genres }) => {
  let badgeText = '';
  let badgeColor = '';
  let textColor = 'text-white'; // Default

  // Helper function for readability
  const setBadge = (text, bgColor, txtColor = 'text-white') => {
    badgeText = text;
    badgeColor = bgColor;
    textColor = txtColor;
  };

  if (genres && Array.isArray(genres)) {
    // 1. Highest Priority: Documentary
    if (genres.some((genre) => genre.name === 'Documentary')) {
      setBadge('Documentary', 'bg-yellow-500/20', 'text-yellow-300');
      return (
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor} ${textColor}`}>
            {badgeText}
        </span>
    );
    }

    // 2.  Animation
    if (genres.some((genre) => genre.name === 'Animation')) {
      setBadge('Animation', 'bg-purple-500/20', 'text-purple-300');
      return (
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor} ${textColor}`}>
            {badgeText}
        </span>
    );
    }
  }

  // 3. Lowest Priority: mediaType (fallback)
  switch (mediaType) {
    case 'movie':
      setBadge('Movie', 'bg-blue-500/20', 'text-blue-300');
      break;
    case 'tv':
      setBadge('TV Show', 'bg-green-500/20', 'text-green-300');
      break;
    default:
      return null; // No badge for unknown types
  }

  return (
    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor} ${textColor}`}>
      {badgeText}
    </span>
  );
};

export default MediaTypeBadge;