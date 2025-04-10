import React, { useState } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import { getContentRecommendations, Recommendation, Recommendations } from "../api/ContentRecommender";
import { fetchUserRatedMovies, getAzureRecs, getMovieWithId, Rating } from '../api/MoviesApi';
import { AzureRec } from '../types/AzureRec';

export const MoviesPage: React.FC = () => {
  // A list of movie IDs for which you want recommendations.
  const [listOfIds, setListOfIds] = useState<string[]>(["s2", "s3", "s6","s10"]);
  const [azureIds, setAzureIds] = useState<string[]>([]);
  const [azureCalled, setAzureCalled] = useState(false);
  const [azureMovieRecommendations, setAzureMovieRecommendations] = useState<Recommendation[]>([]);
  const userId = 1
  
  // The state now holds an array of Recommendations objects.
  const [allRecs, setAllRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [ratings, setRatings] = useState<Rating[]>([]);
  // const [error, setError] = useState<string | null>(null);


  React.useEffect(() => {
    getAzureRecs(userId)
      .then(data => {
      let idList = data.map((r: AzureRec) => r.show_id);
      setAzureIds(idList);
      setAzureMovieRecommendations(data);
      setAzureCalled(true);
console.log("Azure movie recommendations:", data);
      })
      .catch(err => console.error(err));
  

    fetchUserRatedMovies(userId)
      .then(data => {
        // setRatings(data)
        // Extract just the show_id values
        const showIds = data.map((r: Rating) => r.show_id);
        setListOfIds(showIds);})
      // .catch(err => setError(err.message));
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
  }, [userId]);
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
        {azureCalled && <MovieList 
          key={userId}
          recommender={`Movies For You`}
          movies={azureMovieRecommendations}
         />}

        {allRecs.map((rec) => (
          <MovieList
            key={rec.basedOffOf}
            recommender={`Recommendations based on ${rec.basedOffOf}`}
            movies={rec.recommendations}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};
