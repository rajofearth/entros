export const getProviderLogo = (provider) => {
    if (!provider || !provider.logo_path) {
        return 'https://placehold.co/48x48?text=No+Logo'; // Smaller placeholder
    }
    return `https://image.tmdb.org/t/p/original${provider.logo_path}`;
};