import React from 'react';
import { MovieCard } from './MovieCard';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
}

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (id: string) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  onMovieClick,
}) => (
  <div
    className="d-flex flex-row overflow-auto px-3 py-4 gap-3"
    style={{ whiteSpace: 'nowrap' }}
  >
    {movies.map((movie) => (
      <div key={movie.id} style={{ display: 'inline-block' }}>
        <MovieCard
          title={movie.title}
          posterUrl={movie.posterUrl}
          onClick={() => onMovieClick(movie.id)}
        />
      </div>
    ))}
  </div>
);
