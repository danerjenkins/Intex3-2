import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/MoviesApi';
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
    "Action", "Adventure", "Anime Series International TV Show", "British TV Shows Docuseries International TV Show", 
    "Children", "Comedy", "Comedy Drama International", "Docuseries", "Comedy Romance", "Crime TV Show Docuseries", "Documentary", 
    "Documentary International", "Drama", "Drama International", "Drama Romance", "Family", "Fantasy", "Horror", 
    "International Thriller", "International TV Show Romantic TV Show", "Kids TV Show", "Language TV Show", "Musical", 
    "Nature TV Show", "Reality TV Show", "Spirituality", "TV Show Action", "TV Show Comedy", "Talk Shows TV Comedy", "Thriller"
  ];
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

  const handleDelete = (id: string) => {
    console.log(`Delete movie with id: ${id}`);
  };

  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="text-center mb-4">Admin Movies</h2>
        <h2>Total Pages: {totalPages}</h2>
        <select
          multiple
          value={selectedGenres}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions);
            const values = options.map((option) => option.value);
            setSelectedGenres(values);
          }}
          className="form-select mb-4"
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
          
        </select>
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
                <div className="col" key={movie.show_id}>
                  <MovieDataCard
                    title={movie.title}
                    director={movie.director}
                    info={movie.description}
                    posterUrl={`${imgUrl}${encodeURIComponent(movie.title)}.jpg`}
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
    </>
  );
};

export default MoviesPage;
