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
import { AzureRec } from '../types/AzureRec';

type MergedRec = { type: 'collab' | 'content'; rec: Recommendations };

export const MoviesPage: React.FC = () => {
  const [listOfIds, setListOfIds] = useState<string[]>([]);
  const [azureMovieRecommendations, setAzureMovieRecommendations] = useState<Recommendation[]>([]);
  const [azureCalled, setAzureCalled] = useState(false);
  const userId = 1;
  const [allRecs, setAllRecs] = useState<Recommendations[]>([]);
  const [collabRecs, setCollabRecs] = useState<Recommendations[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // State to store the fixed randomized recommendation list.
  const [randomizedRecs, setRandomizedRecs] = useState<MergedRec[]>([]);
  // State to control how many rec lists to show.
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch user-rated movies.
  useEffect(() => {
    fetchUserRatedMovies(userId)
      .then((data) => {
        const showIds = data.map((r: Rating) => r.show_id);
        setListOfIds(showIds);
      })
      .catch((err) =>
        console.error('Error fetching user rated movies:', err)
      );
  }, [userId]);

  // 2. Fetch recommendations when listOfIds is updated.
  useEffect(() => {
    if (listOfIds.length > 0) {
      // Azure recommendations
      getAzureRecs(userId)
        .then((data) => {
          setAzureMovieRecommendations(data);
          setAzureCalled(true);
          console.log('Azure movie recommendations:', data);
        })
        .catch((err) => console.error(err));

      // Content recommendations
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

      // Collaborative recommendations
      Promise.allSettled(
        listOfIds.map((id) => getCollaborativeRecommendations(id))
      )
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

  // 3. Merge, shuffle, and rearrange recommendations, then save to state.
  useEffect(() => {
    // Only merge when we have both collabRecs and allRecs loaded.
    if (collabRecs.length === 0 && allRecs.length === 0) return;

    const merged: MergedRec[] = [];
    const maxLength = Math.max(collabRecs.length, allRecs.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < collabRecs.length) {
        merged.push({ type: 'collab', rec: collabRecs[i] });
      }
      if (i < allRecs.length) {
        merged.push({ type: 'content', rec: allRecs[i] });
      }
    }

    // Helper: Shuffle an array (Fisher-Yates)
    function shuffleArray<T>(array: T[]): T[] {
      const arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // Helper: Rearrange to avoid adjacent recs with the same basedOffOf value.
    function rearrangeToAvoidAdjacentDuplicates<T extends { rec: { basedOffOf: string } }>(array: T[]): T[] {
      for (let i = 1; i < array.length; i++) {
        if (array[i].rec.basedOffOf === array[i - 1].rec.basedOffOf) {
          for (let j = i + 1; j < array.length; j++) {
            if (array[j].rec.basedOffOf !== array[i - 1].rec.basedOffOf) {
              [array[i], array[j]] = [array[j], array[i]];
              break;
            }
          }
        }
      }
      return array;
    }

    const shuffled = rearrangeToAvoidAdjacentDuplicates(shuffleArray(merged));
    setRandomizedRecs(shuffled);
  }, [collabRecs, allRecs]);

  // 4. Infinite scroll: Increase visibleCount when the sentinel is in view.
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Increase visibleCount only if there are more recs to show.
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

        {/* Azure recommendations at the top */}
        {azureCalled && (
          <MovieList 
            key={userId}
            recommender="Movies For You"
            movies={azureMovieRecommendations}
          />
        )}

        {/* Render randomized recommendations gradually */}
        {randomizedRecs.slice(0, visibleCount).map(({ type, rec }) => (
          <MovieList
            key={`${type}-${rec.basedOffOf}`}
            recommender={
              type === 'collab'
                ? `People who like ${rec.basedOffOf} also like`
                : `Movies and shows like ${rec.basedOffOf}`
            }
            movies={rec.recommendations}
          />
        ))}

        {/* Sentinel element to trigger infinite scroll */}
        <div ref={sentinelRef} style={{ height: '1px' }}></div>
      </div>
      <Footer />
    </div>
  );
};
