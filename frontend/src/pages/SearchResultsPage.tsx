import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../api/MoviesApi';
import { Movie } from '../types/Movie';
import { Header } from '../components/Header';
import { MovieSearchCard } from '../components/MovieSearchCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');


  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchMovies(1, 10000); // Fetch a lot
        const filtered = all.movies.filter((m) =>
          m.title.toLowerCase().includes(query?.toLowerCase() ?? '')
        );
        setResults(filtered);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };
    if (query) load();
  }, [query]);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2>Search Results for: "{query}"</h2>
        {loading ? (
          <p>Loading...</p>
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
    </>
  );
}
