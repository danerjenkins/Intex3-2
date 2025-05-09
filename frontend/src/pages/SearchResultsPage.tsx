import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import { Header } from '../components/Header';
import { MovieSearchCard } from '../components/MovieSearchCard';
import { GenreFilter } from '../components/GenreFilter';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get parameters: q for text search and genre for filtering by genre.
  const unfilteredQuery = searchParams.get('q');
  const query = decodeURIComponent(unfilteredQuery || '');
  const genreParam = searchParams.get('genre');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // You could change the fetchMovies call to pass parameters if your API supports filtering.
        const all = await fetchMovies(1, 10000); // fetch a large set for demo purposes
        let filtered = all.movies;

        // Filter by text query if provided
        if (query) {
          filtered = filtered.filter((m) =>
            m.title.toLowerCase().includes(query.toLowerCase())
          );
        }
        // Filter by genre if provided.
        // Assuming each movie has a genre property or genres array; adjust this as needed.
        if (genreParam) {
          filtered = filtered.filter((m) =>
            m.genre?.toLowerCase().includes(genreParam.toLowerCase())
          );
        }
        setResults(filtered);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query, genreParam]);

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        {/* Render the GenreFilter on the search page so users can refine further */}
        <div className="backButtonSearch container align-items-center mt-3">
          <button className="profileButton" onClick={() => navigate(-1)}>
            Back
          </button>
          <GenreFilter />
        </div>
        <div className="container mb-5 text-center">
          <h2>
            Search Results{query ? ` for: "${query}"` : ''}{' '}
            {genreParam ? `(Genre: ${genreParam})` : ''}
          </h2>
          {loading ? (
            <div className="text-center">
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading movies...</p>
            </div>
          ) : results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4 mt-4">
              {results.map((movie) => (
                <div className="col d-flex" key={movie.show_id}>
                  <MovieSearchCard
                    id={movie.show_id}
                    title={movie.title}
                    director={movie.director}
                    info={movie.description}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <br />
        <br />
        <br />
        <Footer />
      </div>
    </>
  );
}
