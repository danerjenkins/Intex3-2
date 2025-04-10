import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MovieList } from '../components/MovieList';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import { useEffect, useState } from 'react';
import { Recommendation } from '../api/ContentRecommender';

function HomePage() {
  const navigate = useNavigate();
  const [topRatedMovies, setTopRatedMovies] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await fetchTopRatedMovies();
        setTopRatedMovies(movies);
      } catch (error) {
        console.error('Error fetching top-rated movies:', error);
      }
    };

    fetchMovies();
  });

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <Header />

      <div className="d-flex flex-column align-items-center mt-5 gap-3">
        <h1 className="display-4 fw-bold text-center">Welcome to CineNiche</h1>
        <div className="d-flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn btn-danger px-4"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-secondary px-4"
          >
            Register
          </button>
        </div>
      </div>
      <div className="d-flex flex-column min-vh-100">
        <MovieList
          recommender="Our Most Popular Movies"
          movies={topRatedMovies}
        />
      </div>

      <Footer />
    </div>
  );
}

export { HomePage };
