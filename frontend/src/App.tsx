import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// New CineNiche pages
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { PolicyPage } from './pages/PolicyPage';
import { ProfilePage } from './pages/ProfilePage';

// Existing login/register pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MovieDescription from './pages/MovieDescription';
// import AdminMoviesPage from './pages/AdminMoviesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/privacy" element={<PolicyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* large security risk!!! take this out after it works */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/movieDescription" element={<MovieDescription />} />
      </Routes>
    </Router>
  );
}

export default App;
