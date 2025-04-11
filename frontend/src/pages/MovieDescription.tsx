import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Movie } from '../types/Movie';
import { getMovieWithId } from '../api/MoviesApi';
import { useNavigate, useParams } from 'react-router-dom';
import { RatingCard } from '../components/RatingCard';
import {
  getContentRecommendations,
  Recommendation,
} from '../api/ContentRecommender';
import { MovieList } from '../components/MovieList';

export default function MovieDescription() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [contentRecs, setContentRecs] = useState<Recommendation[]>([]); // Adjust type as needed
  const { id } = useParams();
  const loadMovie = async () => {
    try {
      const fetchedMovie = await getMovieWithId(decodeURIComponent(id!));
      setMovie(fetchedMovie);
    } catch (error) {
      console.error('Failed to fetch movie:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return; // Don't run if id is missing
    setLoading(true);
    loadMovie();
    getContentRecommendations(id)
      .then((data) => setContentRecs(data.recommendations))
      .catch((err) => console.error(err));
  }, [id]);
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const normalized = movie ? movie.title.normalize('NFD') : '';
  const cleaned = normalized.replace(/[:!%.'--()&#’]/g, '');
  const posterUrl = `${imgUrl}${encodeURIComponent(cleaned)}.jpg`;
  // console.log('movie:', movie);
  // console.log('contentRecs:', contentRecs);
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container my-5">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-dark">Loading movie...</p>
          </div>
        ) : (
          movie && (
            <>
              <div className="backButtonSearch">
                <button
                  className="profileButton"
                  onClick={() => navigate('/movies')}
                >
                  Back to Movies
                </button>
              </div>
              <div className="descriptionBox shadow-lg p-3 mt-3">
                <div className="row g-4">
                  {/* Poster */}
                  <div className="col-md-3">
                    <img
                      src={posterUrl}
                      alt={`${movie.title} poster`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;

                        // Prevent infinite loop if the fallback image also fails
                        if (!target.src.includes('/defaultposter.png')) {
                          target.onerror = null;
                          target.src = '/defaultposter.png';
                        }
                      }}
                      className="img-fluid rounded"
                      style={{ maxHeight: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info and Description */}
                  <div className="col-md-6 d-flex flex-column justify-content-between">
                    <div className="d-flex flex-row flex-wrap">
                      <div className="me-5">
                        <h3 className="mb-3">{movie.title}</h3>
                        <p>
                          <strong>Director:</strong> {movie.director}
                        </p>
                        <p>
                          <strong>Type:</strong> {movie.type}
                        </p>
                        <p>
                          <strong>Released:</strong> {movie.release_year}
                        </p>
                        <p>
                          <strong>Rating:</strong> {movie.rating}
                        </p>
                        <p>
                          <strong>Duration:</strong> {movie.duration}
                        </p>
                        <p>
                          <strong>Cast:</strong> {movie.cast}
                        </p>
                        <p>
                          <strong>Genres:</strong> {movie.genre}
                        </p>
                      </div>

                      <div className="flex-grow-1">
                        <h5 className="mb-2">Description</h5>
                        <p className="mb-0">{movie.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="col-md-3 mt-4">
                    <RatingCard show_id={movie.show_id} />
                  </div>
                </div>
              </div>
              {contentRecs && (
                <div className="d-flex flex-column mt-5">
                  <MovieList
                    recommender={`Similar media to ${movie.title}`}
                    movies={contentRecs}
                  />
                </div>
              )}
            </>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}
