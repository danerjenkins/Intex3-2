// ContentRecommender.ts
import { getMovieWithId } from './MoviesApi';

export interface Recommendation {
  show_id: string;
  title: string;
  genre?: string;
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
    // Check response before parsing JSON
    if (!response.ok) {
      // Optionally attempt to get any error message from the body.
      const errorText = await response.text();
      console.error('ContentRecommendations error response:', errorText);
      console.error(`Status: ${response.status} - ${response.statusText}`);
      throw new Error(
        `Failed to fetch movie recommendations: ${response.statusText}`
      );
    }
    const data = await response.json();
    // console.log(data);
    const recommendations: Recommendations = {
      basedOffOf: title,
      recommendations: data,
    };

    return recommendations;
  } catch (e) {
    console.error(`problem w getContentRecommendations(), homes: ${e}`);
    throw e;
  }
}

export async function getCollaborativeRecommendations(
  movieId: string
): Promise<Recommendations> {
  try {
    const title: string = (await getMovieWithId(movieId)).title;
    const response = await fetch(
      `${API_URL}/Movies/CollaborativeRecommendations/${movieId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // Check response before parsing JSON
    if (!response.ok) {
      // Optionally attempt to get any error message from the body.
      const errorText = await response.text();
      console.error('Collaborative Recommendations error response:', errorText);
      console.error(`Status: ${response.status} - ${response.statusText}`);
      throw new Error(
        `Failed to fetch movie collab recommendations: ${response.statusText}`
      );
    }
    const data = await response.json();
    // console.log(data);
    const recommendations: Recommendations = {
      basedOffOf: title,
      recommendations: data,
    };
    return recommendations;
  } catch (e) {
    console.error(`problem w getCollaborativeRecommendations(), homes: ${e}`);
    throw e;
  }
}
