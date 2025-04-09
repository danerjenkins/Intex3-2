import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { PolicyPage } from './pages/PolicyPage';
import { ProfilePage } from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MovieDescription from './pages/MovieDescription';
import AuthorizeView from './components/AuthorizeView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PolicyPage />} />
        {/* Protected Routes */}
        <Route
          path="/movies"
          element={
            <AuthorizeView>
              <MoviesPage />
            </AuthorizeView>
          }
        />
        <Route
          path="/movieDescription"
          element={
            <AuthorizeView>
              <MovieDescription />
            </AuthorizeView>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthorizeView>
              <ProfilePage />
            </AuthorizeView>
          }
        />
        <Route
          path="/admin"
          element={
            <AuthorizeView>
              <ProtectedRoute allowedRoles={['Administrator']}>
                <AdminPage />
              </ProtectedRoute>
            </AuthorizeView>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
