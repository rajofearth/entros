# 🎬 Entros - Movie & TV Show Discovery Platform

<div align="center">

![Entros Logo](https://img.shields.io/badge/Entros-Movie%20Discovery-blue?style=for-the-badge&logo=react)

**Discover your next favorite film or show**

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://your-demo-url.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

</div>

---

## 🌟 Overview

**Entros** is a modern, responsive web application that helps users discover movies, TV shows, and entertainment content. Built with React and powered by The Movie Database (TMDb) API, it provides a sleek interface for exploring trending content, searching across multiple media types, and accessing detailed information about movies, shows, actors, and collections.

### ✨ Key Features

- 🔍 **Advanced Search** - Search movies, TV shows, and people with advanced filtering
- 🎭 **Detailed Information** - Comprehensive details for movies, TV shows, actors, and collections
- 🏷️ **Genre Filtering** - Browse content by your favorite genres
- 📈 **Trending Content** - Stay updated with what's popular and trending
- ⭐ **Top Rated** - Discover critically acclaimed movies and TV shows
- 🎪 **Cast & Crew** - Explore detailed actor and director profiles
- 📺 **Season Details** - Episode-by-episode information for TV shows
- 🎬 **Watch Providers** - Find where to stream your favorite content
- 📱 **Responsive Design** - Perfect experience across all devices
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

---

## 🚀 What Problems Does Entros Solve?

### 🎯 Content Discovery Challenge
- **Problem**: With thousands of movies and shows across multiple platforms, finding quality content is overwhelming
- **Solution**: Entros provides intelligent content discovery with trending algorithms, genre filtering, and advanced search capabilities

### 📊 Information Fragmentation
- **Problem**: Entertainment information is scattered across different websites and platforms
- **Solution**: Centralized hub with comprehensive details, ratings, cast information, and streaming availability

### 🔍 Search Complexity
- **Problem**: Generic search engines don't understand entertainment-specific queries
- **Solution**: Specialized search with filters for year, rating, genre, and media type

### 📱 Poor Mobile Experience
- **Problem**: Many entertainment sites have poor mobile interfaces
- **Solution**: Mobile-first responsive design with touch-friendly interactions

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 18.3.1 |
| **Vite** | Build Tool & Dev Server | 6.0.5 |
| **Tailwind CSS** | Styling & UI | 3.4.17 |
| **React Router** | Client-side Routing | 7.1.1 |
| **Axios** | HTTP Client | 1.7.9 |
| **TMDb API** | Movie/TV Data Source | v3 |
| **Vercel Analytics** | Usage Analytics | 1.4.1 |
| **ESLint** | Code Quality | 9.17.0 |

---

## 🏗️ Project Structure

```
entros/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── SearchBar.jsx   # Advanced search functionality
│   │   ├── MovieCard.jsx   # Media item display
│   │   ├── MovieGrid.jsx   # Grid layout for media
│   │   ├── GenreFilter.jsx # Genre-based filtering
│   │   ├── DetailsSidebar.jsx # Content details panel
│   │   ├── TopCast.jsx     # Cast information display
│   │   ├── WatchProviders.jsx # Streaming availability
│   │   └── ...            # Additional components
│   ├── pages/             # Route components
│   │   ├── HomePage.jsx   # Main discovery page
│   │   ├── MovieDetailsPage.jsx # Movie information
│   │   ├── TvDetailsPage.jsx # TV show information
│   │   ├── PersonDetailsPage.jsx # Actor/Director profiles
│   │   └── CollectionDetailsPage.jsx # Movie collections
│   ├── api/
│   │   └── tmdb.js        # TMDb API integration
│   ├── utils/             # Utility functions
│   ├── Ads/               # Advertisement components
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite build configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Project dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **TMDb API Key** ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/entros.git
   cd entros
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🎯 Core Features Deep Dive

### 🔍 Search Functionality
- **Multi-type Search**: Movies, TV shows, and people in one search
- **Advanced Filters**: Year range, rating range, genre selection
- **Smart Scoring**: Algorithm prioritizes relevant, recent, and high-quality content
- **Real-time Results**: Instant search with debounced input

### 📱 Responsive Design
- **Mobile-First**: Optimized for small screens with touch interactions
- **Tablet Support**: Perfect layout for medium-sized devices
- **Desktop Experience**: Full-featured interface for large screens
- **Cross-Browser**: Compatible with all modern browsers

### 🎨 User Experience
- **Loading States**: Smooth loading spinners and skeletons
- **Error Handling**: Graceful error messages and fallbacks
- **Animations**: Subtle hover effects and transitions
- **Accessibility**: Keyboard navigation and screen reader support

---

## 🌐 API Integration

Entros integrates with **The Movie Database (TMDb) API** to provide:

- Movie and TV show search
- Detailed content information
- Cast and crew data
- Genre listings
- Trending content
- Top-rated content
- Watch provider information
- Collection details
- Person filmographies

---

## 📊 Performance & Analytics

- **Vercel Analytics**: Track user engagement and popular content
- **Optimized Images**: Lazy loading and responsive images from TMDb
- **Code Splitting**: Route-based code splitting for faster load times
- **Caching**: Smart caching of API responses

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed to any static hosting service:
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTORS.md) for details on how to get started.

---

## 🙏 Acknowledgments

- **The Movie Database (TMDb)** for providing the comprehensive movie and TV data API
- **React Team** for the amazing framework
- **Vercel** for hosting and analytics
- **Tailwind CSS** for the utility-first CSS framework

---

<div align="center">

**Made with ❤️ for movie and TV show enthusiasts**

[⭐ Star this repo](https://github.com/yourusername/entros) | [🐛 Report Bug](https://github.com/yourusername/entros/issues) | [💡 Request Feature](https://github.com/yourusername/entros/issues)

</div>