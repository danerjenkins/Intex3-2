import React from 'react';
import { MovieCard } from './MovieCard';
import { DummyMovie } from '../types/DummyMovie';
import '../index.css';

interface MovieListProps {
  recommender: string;
  movies: DummyMovie[];
  onMovieClick: (id: string) => void;
}

export const MovieList: React.FC<MovieListProps> = ({
  recommender,
  movies,
  onMovieClick,
}) => (
  <>
    <h5>{recommender}</h5>
    <div
      className="d-flex flex-row overflow-auto px-3 py-4 gap-3"
      style={{ whiteSpace: 'nowrap' }}
    >
      <br />
      {movies.map((movie) => (
        <div key={movie.id} style={{ display: 'inline-block' }}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            onClick={() => onMovieClick(movie.id)}
          />
        </div>
      ))}
    </div>
  </>
);
