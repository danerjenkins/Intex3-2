import React, { useState, useEffect, useRef } from 'react';
import { MovieList } from '../components/MovieList';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { GenreFilter } from '../components/GenreFilter';
import {
  getCollaborativeRecommendations,
  getContentRecommendations,
  Recommendation,
  Recommendations,
} from '../api/ContentRecommender';
import { fetchUserRatedMovies, getAzureRecs, Rating } from '../api/MoviesApi';
import { idsInCollab, idsInContent } from './filters';

// Define types for the merged items.
type CollabRecMerged = { type: 'collab'; rec: Recommendations };
type ContentRecMerged = { type: 'content'; rec: { genre: string; movies: Recommendation[] } };
type MergedRec = CollabRecMerged | ContentRecMerged;

export const MoviesPage: React.FC = () => {
  const [listOfIds, setListOfIds] = useState<string[]>([]);
  const [azureMovieRecommendations, setAzureMovieRecommendations] = useState<Recommendation[]>([]);
  const [azureCalled, setAzureCalled] = useState(false);
  const userId = 1;
  const [allRecs, setAllRecs] = useState<Recommendations[]>([]);
  const [collabRecs, setCollabRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // For infinite scroll on the merged items:
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // Final randomized merged recommendations array.
  const [randomizedRecs, setRandomizedRecs] = useState<MergedRec[]>([]);

  // 1. Fetch user-rated movies.
  useEffect(() => {
    fetchUserRatedMovies(userId)
      .then((data) => {
        const showIds = data.map((r: Rating) => r.show_id);
        setListOfIds(showIds);
      })
      .catch((err) => console.error('Error fetching user rated movies:', err));
  }, [userId]);

  // 2. Fetch recommendations when listOfIds is updated.
  useEffect(() => {
    if (listOfIds.length > 0) {
      // Get Azure recommendations.
      getAzureRecs(userId)
        .then((data) => {
          setAzureMovieRecommendations(data);
          setAzureCalled(true);
          console.log('Azure movie recommendations:', data);
        })
        .catch((err) => console.error(err));

      // Get Content Recommendations.
      // const filteredIdsContent = listOfIds.filter((id) => idsInContent.includes(id));
      Promise.allSettled(listOfIds.map((id) => getContentRecommendations(id)))
        .then((results) => {
          const successResults = results
            .filter(
              (result): result is PromiseFulfilledResult<Recommendations> =>
                result.status === 'fulfilled'
            )
            .map((result) => result.value);
          console.log('Successfully fetched content recommendations:', successResults);
          setAllRecs(successResults);
        })
        .catch((error) =>
          console.error('Error fetching content recommendations:', error)
        );
        // const filteredIds = listOfIds.filter((id) => idsInCollab.includes(id));
      // Get Collaborative Recommendations.
      Promise.allSettled(listOfIds.map((id) => getCollaborativeRecommendations(id)))
        .then((results) => {
          const successResults = results
            .filter(
              (result): result is PromiseFulfilledResult<Recommendations> =>
                result.status === 'fulfilled'
            )
            .map((result) => result.value);
          console.log('Successfully fetched collaborative recommendations:', successResults);
          setCollabRecs(successResults);
        })
        .catch((error) =>
          console.error('Error fetching collaborative recommendations:', error)
        );
    }
  }, [listOfIds, userId]);

  // 3. Group the content recommendations by genre.
  // We assume that each Recommendations object has a property "recommendations"
  // which is an array of Recommendation objects. Each Recommendation has a 'genre'
  // property that can be a comma-separated list.
  const contentMovies: Recommendation[] = allRecs.flatMap((rec) => rec.recommendations);

  const moviesByGenre: { [genre: string]: Recommendation[] } = contentMovies.reduce((acc, movie) => {
    const rawGenre = movie.genre || 'Other';
    const genreList = rawGenre.split(',').map((g) => g.trim());
    genreList.forEach((genre) => {
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(movie);
    });
    return acc;
  }, {} as { [genre: string]: Recommendation[] });

  // Convert grouped object into an array of content items.
  const contentItems: ContentRecMerged[] = Object.entries(moviesByGenre).map(([genre, movies]) => ({
    type: 'content' as const,
    rec: { genre, movies },
  }));

  // Map collaborative recommendations into an array of collab items.
  const collabItems: CollabRecMerged[] = collabRecs.map((rec) => ({
    type: 'collab' as const,
    rec,
  }));

  // 4. Merge the two arrays, then shuffle and save to state.
  useEffect(() => {
    // Only merge if we have data in one or both arrays.
    if (collabItems.length === 0 && contentItems.length === 0) return;

    const merged: MergedRec[] = [...collabItems, ...contentItems];

    // Helper: Shuffle an array using Fisher-Yates.
    function shuffleArray<T>(array: T[]): T[] {
      const arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const shuffled = shuffleArray(merged);
    setRandomizedRecs(shuffled);
  }, [collabRecs, allRecs]);

  // 5. Infinite scroll: Increase visibleCount when the sentinel is in view.
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < randomizedRecs.length) {
          setVisibleCount((prev) => prev + 2);
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [visibleCount, randomizedRecs.length]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <br />
      <div className="container">
        <h3>Browse Movies</h3>
        <GenreFilter
          selectedGenres={selectedGenres}
          onGenreChange={setSelectedGenres}
        />

        {/* Render Azure recommendations at the top if available */}
        {azureCalled && (
          <MovieList 
            key={`azure-${userId}`}
            recommender="Movies For You"
            movies={azureMovieRecommendations}
          />
        )}

        {/* Render merged and randomized recommendations with infinite scroll */}
        {randomizedRecs.slice(0, visibleCount).map((item) => {
          if (item.type === 'collab') {
            return (
              <MovieList
                key={`collab-${item.rec.basedOffOf}`}
                recommender={`People who like ${item.rec.basedOffOf} also like`}
                movies={item.rec.recommendations}
              />
            );
          } else if (item.type === 'content') {
            return (
              <MovieList
                key={item.rec.genre}
                recommender={`${item.rec.genre} movies and shows you might like`}
                movies={item.rec.movies}
              />
            );
          }
          return null;
        })}

        {/* Sentinel element to trigger infinite scroll */}
        <div ref={sentinelRef} style={{ height: '1px' }}></div>
      </div>
      <br/>
      <br/>
      <br/>
      <Footer />
    </div>
  );
};
