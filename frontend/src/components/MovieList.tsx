import React from 'react';
import { MovieCard } from './MovieCard';
import { DummyMovie } from '../types/DummyMovie';
import '../index.css';

interface MovieListProps {
  recommender: string;
  movies: DummyMovie[];
  onMovieClick: (id: string) => void;
}

const scrollList = (direction: string, container: HTMLElement) => {
  const list = container.querySelector('.movie-list'); // Find the movie list in this container
  if (!list) {
    console.error('Movie list element not found');
    return;
  }

  const card = list.querySelector('.card-body') as HTMLElement; // Ensure it targets card-body elements
  if (!card) {
    console.error('Card body element not found');
    return;
  }

  const cardWidth =
    card.offsetWidth + parseInt(getComputedStyle(list).gap || '0', 10);
  const scrollAmount = cardWidth * 6;

  if (direction === 'left') {
    list.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

export const MovieList: React.FC<MovieListProps> = ({
  recommender,
  movies,
  onMovieClick,
}) => (
  <>
    <h5 style={{ marginLeft: '6rem' }}>{recommender}</h5>
    <div className="position-relative">
      <button
        className="chevron left"
        onClick={(e) => {
          const container = (e.target as HTMLElement).closest(
            '.position-relative'
          ) as HTMLElement | null;
          if (container) scrollList('left', container);
        }}
      >
        ‹
      </button>
      <div className=" movie-list d-flex flex-row overflow-auto px-3 py-4 gap-3">
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
      <button
        className="chevron right"
        onClick={(e) => {
          const container = (e.target as HTMLElement).closest(
            '.position-relative'
          ) as HTMLElement | null;
          if (container) scrollList('right', container);
        }}
      >
        ›
      </button>
    </div>
  </>
);
