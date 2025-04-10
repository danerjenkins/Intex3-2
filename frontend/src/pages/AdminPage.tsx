import { useEffect, useState } from 'react';
import { deleteMovie, fetchAllMovies, fetchMovies } from '../api/MoviesApi';
import { MovieDataCard } from '../components/MovieDataCard';
import { Header } from '../components/Header';
import Pagination from '../components/Pagination';
import EditMovieForm from '../components/EditMovieForm';
import { Movie } from '../types/Movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const allGenres = [
    'Action',
    'Adventure',
    'Anime Series International TV Show',
    'British TV Shows Docuseries International TV Show',
    'Children',
    'Comedy',
    'Comedy Drama International',
    'Docuseries',
    'Comedy Romance',
    'Crime TV Show Docuseries',
    'Documentary',
    'Documentary International',
    'Drama',
    'Drama International',
    'Drama Romance',
    'Family',
    'Fantasy',
    'Horror',
    'International Thriller',
    'International TV Show Romantic TV Show',
    'Kids TV Show',
    'Language TV Show',
    'Musical',
    'Nature TV Show',
    'Reality TV Show',
    'Spirituality',
    'TV Show Action',
    'TV Show Comedy',
    'Talk Shows TV Comedy',
    'Thriller',
  ];
  const [newMovie, setNewMovie] = useState<Movie>({
    show_id: '',
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: new Date().getFullYear(),
    rating: '',
    duration: '',
    description: '',
    genre: '',
  });
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [movieBeingEdited, setMovieBeingEdited] = useState<Movie | null>(null);

  const loadMovies = async () => {
    try {
      const data = await fetchMovies(currentPage, pageSize, selectedGenres); // Add genre/rating filtering if needed
      setMovies(data.movies);
      setTotalPages(
        data.totalNumberItems ? Math.ceil(data.totalNumberItems / pageSize) : 1
      );
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMovies();
  }, [currentPage, pageSize, selectedGenres]);

  const handleEdit = (id: string) => {
    const movie = movies.find((m) => m.show_id === id);
    if (movie) {
      setMovieBeingEdited(movie);
    }
  };
  const handleEditCancel = () => {
    setMovieBeingEdited(null);
  };

  const handleEditSuccess = () => {
    setMovieBeingEdited(null);
    loadMovies(); // refresh updated data
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this movie?'
    );
    if (!confirmed) return;

    try {
      await deleteMovie(id);
      await loadMovies(); // refresh the list
      console.log(`Movie ${id} deleted successfully.`);
    } catch (error) {
      alert('Failed to delete movie. See console for details.');
    }
  };
  const getNextShowId = async (): Promise<string> => {
    const allMovies = await fetchAllMovies();

    const numericIds = allMovies
      .map((m) => m.show_id)
      .filter((id) => /^s\d+$/.test(id)) // match pattern like s123
      .map((id) => parseInt(id.slice(1)));

    const maxId = Math.max(...numericIds, 0);
    return `s${maxId + 1}`;
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Admin Movies</h2>
        <h2>Total Pages: {totalPages}</h2>
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-success"
            onClick={async () => {
              const nextId = await getNextShowId();
              alert(`The next Show ID will be: ${nextId}`);
              setIsAddingMovie(true);
              setNewMovie({
                show_id: nextId,
                title: '',
                type: '',
                director: '',
                cast: '',
                country: '',
                release_year: new Date().getFullYear(),
                rating: '',
                duration: '',
                description: '',
                genre: '',
              });
            }}
          >
            + Add New Movie
          </button>
        </div>

        <div className="mb-3">
          <label htmlFor="genre-select" className="form-label">
            Select Genres:
          </label>
          <div className="row">
            <div className="col-md-3">
              <div
                className="card p-3 mb-4"
                style={{ position: 'sticky', top: '90px' }}
              >
                <h5 className="mb-3">Filter by Genre</h5>
                <button
                  className="btn btn-sm btn-outline-secondary mb-3"
                  onClick={() => setSelectedGenres([])}
                >
                  Clear Filters
                </button>
                {allGenres.map((genre) => (
                  <div className="form-check" key={genre}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`genre-${genre}`}
                      value={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedGenres((prev) =>
                          prev.includes(value)
                            ? prev.filter((g) => g !== value)
                            : [...prev, value]
                        );
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`genre-${genre}`}
                    >
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-9">
              {isAddingMovie && (
                <EditMovieForm
                  movie={newMovie}
                  onSuccess={() => {
                    setIsAddingMovie(false);
                    loadMovies();
                  }}
                  onCancel={() => setIsAddingMovie(false)}
                  isNew={true}
                />
              )}
              {/* Movie Grid and Pagination Here */}
              {movieBeingEdited && (
                <EditMovieForm
                  movie={movieBeingEdited}
                  onSuccess={handleEditSuccess}
                  onCancel={handleEditCancel}
                />
              )}
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p>Loading movies...</p>
                </div>
              ) : (
                <>
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {movies.map((movie) => (
                      <div className="col d-flex" key={movie.show_id}>
                        <MovieDataCard
                          id={movie.show_id}
                          title={movie.title}
                          director={movie.director}
                          info={movie.description}
                          onEdit={() => handleEdit(movie.show_id)}
                          onDelete={() => handleDelete(movie.show_id)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-center mt-5">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      onPageChange={(newPage) => setCurrentPage(newPage)}
                      onPageSizeChange={(newSize) => setPageSize(newSize)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoviesPage;
