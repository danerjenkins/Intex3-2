import { useEffect, useState } from 'react';
import { fetchMovies } from '../api/MoviesApi';
import { MovieDataCard } from '../components/MovieDataCard';
import { Header } from '../components/Header';
import Pagination from '../components/Pagination';

interface Movie {
  show_id: string;
  title: string;
  director: string;
  description: string;
  posterUrl?: string;
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovies = async () => {
    try {
      const data = await fetchMovies(currentPage, pageSize); // Add genre/rating filtering if needed
      setMovies(data.movies);
      setTotalPages(data.totalNumberItems ? Math.ceil(data.totalNumberItems / pageSize) : 1);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMovies();
  }, [currentPage, pageSize]);

  const handleEdit = (id: string) => {
    console.log(`Edit movie with id: ${id}`);
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
