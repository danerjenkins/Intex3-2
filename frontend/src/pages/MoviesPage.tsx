// MoviesPage.tsx
import React, { useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { Movie } from '../types/Movie';

const dummyDataMovies: Movie[] = [
  {
    id: 's5983',
    title: '100 Days Of Solitude',
    posterUrl: '100 Days Of Solitude.jpg',
  },
  {
    id: 's1434',
    title: '100 Halal',
    posterUrl: '100 Halal.jpg',
  },
  {
    id: 's5985',
    title: '100 Hotter',
    posterUrl: '100 Hotter.jpg',
  },
  {
    id: 's5578',
    title: '100 Meters',
    posterUrl: '100 Meters.jpg',
  },
  {
    id: 's3315',
    title: '100 Things to do Before High School',
    posterUrl: '100 Things to do Before High School.jpg',
  },
  {
    id: 's5984',
    title: '100 Years One Womans Fight for Justice',
    posterUrl: '100 Years One Womans Fight for Justice.jpg',
  },
  {
    id: 's2444',
    title: '122',
    posterUrl: '122.jpg',
  },
  {
    id: 's5961',
    title: '187',
    posterUrl: '187.jpg',
  },
];

export const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

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
        <MovieList movies={dummyDataMovies} onMovieClick={handleMovieClick} />
      </div>

      <Footer />
    </div>
  );
};
