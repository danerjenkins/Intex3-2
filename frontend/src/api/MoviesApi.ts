// MoviesApi.ts
import { Movie } from '../types/Movie';
import { AzureRecs } from '../types/AzureRec';

interface FetchMoviesResponse {
  movies: Movie[]; // An array of movies
  totalNumberItems: number; // The total number of movies available
}

// This is the URL of the API (the website that stores the movie data).
const API_URL = import.meta.env.VITE_API_URL;
// This function fetches movies from the API
export const fetchMovies = async (
  pageNum: number, // The current page number
  pageSize: number = 12,
  selectedgenres: string[] = [], // Selected genres for filtering
  selectedRatings: string[] = [], // Selected ratings for filtering
  
): Promise<FetchMoviesResponse> => {
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
      }${selectedRatings.length ? `&${ratingsParams}` : ''}`, {
        method: 'GET',
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data: FetchMoviesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchAllMovies = async (): Promise<Movie[]> => {
  let allMovies: Movie[] = [];
  let currentPage = 1;
  const pageSize = 8000; // Large enough to minimize requests

  while (true) {
    const data = await fetchMovies(currentPage, pageSize);
    allMovies = [...allMovies, ...data.movies];

    const totalPages = Math.ceil(data.totalNumberItems / pageSize);
    if (currentPage >= totalPages) break;

    currentPage++;
  }

  return allMovies;
};
// This function is for adding a new movie to the API
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/Movies/CreateMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error(`Failed to add movie: ${response.statusText}`);
    }

    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// This function is for updating a movie in the API
export const updateMovie = async (
  show_id: string, // The ID of the movie we want to update
  updatedMovie: Movie // The updated movie data
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/Movies/UpdateMovie/${show_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      throw new Error(`Failed to update movie: ${response.statusText}`);
    }

    const data: Movie = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// This function is for deleting a movie from the API
export const deleteMovie = async (show_id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${show_id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `Delete request sent for movie ${show_id}, status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(`Failed to delete movie: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};


export async function getMovieWithId(movieId: string): Promise<any> {
  try{
    const response = await fetch(`${API_URL}/Movies/GetMovieFromId?showId=${movieId}`,{
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  catch(e) {
    console.error(e);
    throw e;
  }
}


// Define the type that represents a rated movie record.
// Update fields as they are defined in your Ratings table.
export interface Rating {
  user_id: number;
  show_id: string;
  rating: number;
  // Add any other fields that are returned from the endpoint.
}

export const fetchUserRatedMovies = async (userId: number): Promise<Rating[]> => {
  const url = `${API_URL}/GetUserRatedMovies?userId=${userId}`;
  
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // Include credentials (cookies, etc.) if needed.
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user rated movies: ${response.statusText}`);
  }
  
  // Parse and return JSON data.
  return await response.json() as Rating[];
};
export async function getAzureRecs(userId: number): Promise<AzureRecs> {
  try {
    const response = await fetch(`${API_URL}/Movies/GetRecommendationFromAzure`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId}),
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch Azure recommendations: ${response.statusText}`);
    }
    const data = await response.json();
    const returnData = data.Results.WebServiceOutput0[0];
    return returnData;
  } catch (error) {
    console.error('Error fetching Azure recommendations:', error);
    throw error;
  }

}