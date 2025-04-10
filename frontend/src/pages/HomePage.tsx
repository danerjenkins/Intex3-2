import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MovieList } from '../components/MovieList';
import { fetchTopRatedMovies } from '../api/MoviesApi';
import { useEffect, useState } from 'react';
import { Recommendation } from '../api/ContentRecommender';
import { FaUserAlt, FaSignInAlt, FaRegStar } from 'react-icons/fa'; // Removed FaFilm and replaced FaPopcorn with FaPizzaSlice

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
  }, []);

  return (
    <div className="homepage bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <Header />

      <div className="welcome-section d-flex flex-column align-items-center mt-5 gap-3">
        <h1 className="display-4 fw-bold text-center">
          Welcome to <span className="brand-name">CineNiche 🎬🍿</span>
        </h1>
        <p className="lead text-center tagline">
          Discover your next favorite movie, dive into the world of cinema, and make every movie night special. 
        </p>
        <div className="auth-buttons d-flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="btn btn-danger px-4"
          >
            <FaSignInAlt className="icon" /> Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn btn-secondary px-4"
          >
            <FaUserAlt className="icon" /> Register
          </button>
        </div>
      </div>

      <div className="movie-list-container">
        <MovieList
          recommender="Our Most Popular Movies"
          movies={topRatedMovies}
        />
      </div>

      <div className="cinema-section d-flex flex-column align-items-center gap-3 mt-5">


        <p className="text-center cinema-subtext">
          Explore new genres, discover hidden gems, and enjoy a movie moment like never before.
        </p>
      </div>

      <div className="top-rated-section d-flex gap-3">
        <FaRegStar className="icon" />
        <span className="text-center">Top Rated Movies</span>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export { HomePage };