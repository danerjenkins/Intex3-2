// MoviesPage.tsx
import React, { useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';

const allMovies = [
  {
    id: '1',
    title: 'Movie One',
    posterUrl: '/images/movie1.jpg',
    genres: ['Action', 'Comedy'],
  },
  {
    id: '2',
    title: 'Movie Two',
    posterUrl: '/images/movie2.jpg',
    genres: ['Drama'],
  },
  // Add more dummy data
];

export const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const filteredMovies = selectedGenres.length
    ? allMovies.filter((movie) =>
        movie.genres.some((genre) => selectedGenres.includes(genre))
      )
    : allMovies;

  const handleMovieClick = (id: string) => {
    console.log(`Navigate to movie detail with ID: ${id}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Header />

      <div className="container py-4">
        <h1 className="h4 fw-bold mb-4">Browse Movies</h1>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />
        <MovieList movies={filteredMovies} onMovieClick={handleMovieClick} />
      </div>

      <Footer />
    </div>
  );
};
