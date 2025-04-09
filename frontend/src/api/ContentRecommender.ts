import { Movie } from '../types/Movie';

interface FetchRecommendationResponse {
  movies: Movie[]; // An array of movies
  totalNumberItems: number; // The total number of movies available
}

export interface Recommendation {
  showId: string;
  title: string;
}

// This is the URL of the API (the website that stores the movie data).
const API_URL = import.meta.env.VITE_API_URL;
// This function fetches movies from the API
export const fetchAllMovies = async (
  pageNum: number, // The current page number
  pageSize: number = 12,
  selectedgenres: string[] = [], // Selected genres for filtering
  selectedRatings: string[] = [] // Selected ratings for filtering
): Promise<FetchRecommendationResponse> => {
  try {
    const genresParams = selectedgenres
      .map((genre) => `genres=${encodeURIComponent(genre)}`)
      .join('&');

    const ratingsParams = selectedRatings
      .map((rating) => `ratings=${encodeURIComponent(rating)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/Movies/GetAdminMovieData?pageNumber=${pageNum}&pageSize=${pageSize}${
        selectedgenres.length ? `&${genresParams}` : ''
      }${selectedRatings.length ? `&${ratingsParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data: FetchRecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export async function getContentRecommendation(
  movieId: string
): Promise<Recommendation[]> {
  try {
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
    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to fetch movie: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
