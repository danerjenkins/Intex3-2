import React, { useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { getContentRecommendations, Recommendation, Recommendations } from "../api/ContentRecommender";

export const MoviesPage: React.FC = () => {
  // A list of movie IDs for which you want recommendations.
  const [listOfIds, setListOfIds] = useState<string[]>(["s2", "s3", "s6","s10"]);
  
  // The state now holds an array of Recommendations objects.
  const [allRecs, setAllRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleMovieClick = (id: string) => {
    console.log(`Navigate to movie detail with ID: ${id}`);
  };

  React.useEffect(() => {
    if (listOfIds.length > 0) {
      Promise.allSettled(listOfIds.map(id => getContentRecommendations(id)))
        .then(results => {
          // Only keep fulfilled recommendations.
          const successResults = results
            .filter((result): result is PromiseFulfilledResult<Recommendations> =>
              result.status === 'fulfilled'
            )
            .map((result) => result.value);
          console.log("Successfully fetched recommendations:", successResults);
          setAllRecs(successResults);
        })
        .catch((error) => console.error("Error fetching recommendations:", error));
    }
  }, [listOfIds]);
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container">
        <h3>Browse Movies</h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />
        {/* Map through the recommendations for each movie ID and create a separate MovieList */}
        {allRecs.map((rec) => (
          <MovieList
            key={rec.basedOffOf}
            recommender={`Recommendations based on ${rec.basedOffOf}`}
            movies={rec.recommendations}
            onMovieClick={handleMovieClick}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};
