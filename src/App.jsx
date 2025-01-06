import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import TvDetailsPage from './pages/TvDetailsPage';
import CollectionDetailsPage from './pages/CollectionDetailsPage';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
         <Route path="/person/:person_id" element={<PersonDetailsPage />} />
         <Route path="/tv/:tv_id" element={<TvDetailsPage />} />
          <Route path="/collection/:collection_id" element={<CollectionDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;