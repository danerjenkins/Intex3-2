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

async function getContentRecommendations(
  movieId: string
): Promise<Recommendations> {
  const recommendationList: Recommendation[] = [];
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
    recommendationList.push(data);
    const recommendations: Recommendations = {
      basedOffOf: title,
      recommendations: recommendationList,
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
  const allRecs: Recommendations[] = [];
  try {
    movieList.map(async (ml) => {
      const data = getContentRecommendations(ml);
      allRecs.push(await data);
    });
    return allRecs;
  } catch (e) {
    console.log(`error, yo: ${(e as Error).message}`);
    throw e;
  }
}
