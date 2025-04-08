import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie'; // Adjust path and interface name
import { deleteMovie, fetchMovies } from '../api/MoviesAPI'; // Replace with your actual API file
import Pagination from '../components/Pagination';
import NewMovieForm from '../components/NewMovieForm';
import EditMovieForm from '../components/EditMovieForm';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(pageSize, pageNum, 'asc', []);
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [pageSize, pageNum]);

  const handleDelete = async (movieId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;
    try {
      await deleteMovie(movieId);
      setMovies(movies.filter((m) => m.show_id !== movieId));
    } catch (error) {
      alert(`Failed to delete the movie. Please try again.\n${error}`);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Movies</h1>

      {!showForm && (
        <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
          Add Movie
        </button>
      )}

      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, 'asc', []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(pageSize, pageNum, 'asc', []).then((data) =>
              setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Director</th>
            <th>Type</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Country</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.title}</td>
              <td>{m.director}</td>
              <td>{m.type}</td>
              <td>{m.release_year}</td>
              <td>{m.rating}</td>
              <td>{m.country}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingMovie(m)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminMoviesPage;
