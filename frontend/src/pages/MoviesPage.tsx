// MoviesPage.tsx
import React, { useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { DummyMovie } from '../types/DummyMovie';

const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
const dummyDataMovies: DummyMovie[] = [
  {
    id: 's5983',
    title: '100 Days Of Solitude',
    posterUrl: `${imgUrl}100%20Days%20Of%20Solitude.jpg`,
  },
  {
    id: 's1434',
    title: '100 Halal',
    posterUrl: `${imgUrl}100%20Halal.jpg`,
  },
  {
    id: 's5985',
    title: '100 Hotter',
    posterUrl: `${imgUrl}100%20Hotter.jpg`,
  },
  {
    id: 's5578',
    title: '100 Meters',
    posterUrl: `${imgUrl}100%20Meters.jpg`,
  },
  {
    id: 's3315',
    title: '100 Things to do Before High School',
    posterUrl: `${imgUrl}100%20Things%20to%20do%20Before%20High%20School.jpg`,
  },
  {
    id: 's5984',
    title: '100 Years One Womans Fight for Justice',
    posterUrl: `${imgUrl}100%20Years%20One%20Womans%20Fight%20for%20Justice.jpg`,
  },
  {
    id: 's2444',
    title: '122',
    posterUrl: `${imgUrl}122.jpg`,
  },
  {
    id: 's5961',
    title: '187',
    posterUrl: `${imgUrl}187.jpg`,
  },
];

export const MoviesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleMovieClick = (id: string) => {
    console.log(`Navigate to movie detail with ID: ${id}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container">
        <h3>Browse Movies</h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />
        <MovieList
          recommender="Dummy Movies"
          movies={dummyDataMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieList
          recommender="More Dummy Movies"
          movies={dummyDataMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieList
          recommender="Some More Dummy Movies"
          movies={dummyDataMovies}
          onMovieClick={handleMovieClick}
        />
      </div>

      <Footer />
    </div>
  );
};
