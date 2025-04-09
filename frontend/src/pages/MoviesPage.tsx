// MoviesPage.tsx
import React, { useEffect, useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { DummyMovie } from '../types/DummyMovie';
import {
  getContentRecommendation,
  Recommendation,
} from '../api/ContentRecommender';

export const MoviesPage: React.FC = () => {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const handleMovieClick = (id: string) => {
    console.log(`Navigate to movie detail with ID: ${id}`);
  };
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const newDummyMovie = 's1';

  // this is just so i dont get a bunch of errors rn
  const dummyDataMovies: DummyMovie[] = [
    {
      id: 's5983',
      title: '100 Days Of Solitude',
      posterUrl: `${imgUrl}100%20Days%20Of%20Solitude.jpg`,
    },
  ];

  //back to realish stuff(just figuring stuff out):

  useEffect(() => {
    const loadRecommender = async () => {
      try {
        const data = await getContentRecommendation(newDummyMovie);
        setRecs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadRecommender();
  }, []);

  //This is the export so it needs to stay as is kinda:

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
          <div>
            <p>recommended titles: {r.title}</p>
            <p>recommended ids: {r.showId}</p>
          </div>
        ))}
        <MovieList
          recommender="Dummy Movies"
          movies={dummyDataMovies}
          onMovieClick={handleMovieClick}
        />
        <MovieList
          recommender="Because You Watched Movie: s5983"
          movies={dummyDataMovies}
          onMovieClick={handleMovieClick}
        />
      </div>
      <Footer />
    </div>
  );
};
