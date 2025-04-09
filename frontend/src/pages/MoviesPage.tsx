// MoviesPage.tsx
import React, { useEffect, useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { loadRecommender, Recommendations } from '../api/ContentRecommender';

export const MoviesPage: React.FC = () => {
  const [recs, setRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const newDummyMovies: string[] = ['s1'];

  const loadRecs = async () => {
    try {
      const data = await loadRecommender(newDummyMovies);
      setRecs(data);
    } catch (error) {
      console.error('Failed w loadRecs() in page:', error);
    }
  };

  useEffect(() => {
    loadRecs();
  }, [newDummyMovies]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <div className="container">
        <h3>Browse Movies</h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />
        {recs.map((r) => (
          <MovieList
            recommender={`Because You Watched Movie: ${r.basedOffOf}`}
            movies={r.recommendations}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};
