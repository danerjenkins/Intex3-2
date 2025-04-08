import { Movie } from '../types/Movie';

interface FetchMoviesResponse {
  movies: Movie[]; // An array of movies
  totalNumMovies: number; // The total number of movies available
}

// This is the URL of the API (the website that stores the movie data).
const API_URL = 'https://intexs3g2-backend-f6e9c2gjgbaxguag.eastus-01.azurewebsites.net'; // Replace with your actual movie API URL

// This function fetches movies from the API
export const fetchMovies = async (
  pageNum: number, // The current page number
  selectedgenres: string[] = [], // Selected genres for filtering
  selectedRatings: string[] = [] // Selected ratings for filtering
): Promise<FetchMoviesResponse> => {
  try {
    const genresParams = selectedgenres
      .map((genre) => `genres=${encodeURIComponent(genre)}`)
      .join('&');

    const ratingsParams = selectedRatings
      .map((rating) => `ratings=${encodeURIComponent(rating)}`)
      .join('&');

    const response = await fetch(
      `${API_URL}/Movies/GetAdminMovieData?pageNumber=${pageNum}${
        selectedgenres.length ? `&${genresParams}` : ''
      }${selectedRatings.length ? `&${ratingsParams}` : ''}`
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

// This function is for adding a new movie to the API
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_URL}/UpdateMovie/${show_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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