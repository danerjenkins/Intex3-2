// ContentRecommender.ts
import { getMovieWithId } from './MoviesApi';

export interface Recommendation {
  show_id: string;
  title: string;
}

export interface Recommendations {
  basedOffOf: string;
  recommendations: Recommendation[];
}
const API_URL = import.meta.env.VITE_API_URL;

export async function getContentRecommendations(
  movieId: string
): Promise<Recommendations> {
  try {
    const title: string = (await getMovieWithId(movieId)).title;
    const response = await fetch(
      `${API_URL}/Movies/ContentRecommendations/${movieId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const recommendations: Recommendations = {
      basedOffOf: title,
      recommendations: data,
    };

    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to fetch dis movie, son: ${response.statusText}`);
    }
    return recommendations;
  } catch (e) {
    console.error(`problem w getContentRecommendations(), homes: ${e}`);
    throw e;
  }
}

export async function loadRecommender(
  movieList: string[]
): Promise<Recommendations[]> {
  try {
    const allRecs = await Promise.all(
      movieList.map((ml) => getContentRecommendations(ml))
    );
    return allRecs;
  } catch (e) {
    console.error(`Error loading recommendations: ${(e as Error).message}`);
    throw e;
  }
}

