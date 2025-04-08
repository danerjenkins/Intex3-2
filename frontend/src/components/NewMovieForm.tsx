import { useState } from 'react';
import { Movie } from '../types/Movie'; // Import Movie interface
import { addMovie } from '../api/MoviesAPI'; // Assuming you have an addMovie function in your API

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Updated genres list based on your provided data
const genresList = [ 'Action', 'Adventure', 'Anime Series International TV Shows', 'British TV Shows Docuseries International TV Shows', 
  'Children', 'Comedies', 'Comedies Dramas International Movies', 'Comedies International Movies', 'Comedies Romantic Movies', 
  'Crime TV Shows Docuseries', 'Documentaries', 'Documentaries International Movies', 'Docuseries', 'Dramas', 'Dramas International Movies', 
  'Dramas Romantic Movies', 'Family Movies', 'Fantasy', 'Horror Movies', 'International Movies Thrillers', 'International TV Shows Romantic TV Shows TV Dramas',
   'Kids TV', 'Language TV Shows', 'Musicals', 'Nature TV', 'Reality TV', 'Spirituality', 'TV Action', 'TV Comedies', 'TV Dramas', 'Talk Shows TV Comedies', 'Thrillers'
];

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    show_id: 0,
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: 0,
    rating: 0,
    duration: 0,
    description: '',
    genres: [], // Add a genres array to track selected genres
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (genre: string) => {
    setFormData((prevFormData) => {
      const updatedGenres = prevFormData.genres.includes(genre)
        ? prevFormData.genres.filter((g) => g !== genre) // Uncheck the genre
        : [...prevFormData.genres, genre];               // Check the genre
      return { ...prevFormData, genres: updatedGenres };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMovie(formData); // Assuming addMovie API function is available
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>

      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>

      <label>
        Type:
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
        />
      </label>

      <label>
        Director:
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </label>

      <label>
        Cast:
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
        />
      </label>

      <label>
        Country:
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </label>

      <label>
        Release Year:
        <input
          type="number"
          name="release_year"
          value={formData.release_year}
          onChange={handleChange}
        />
      </label>

      <label>
        Rating:
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </label>

      <label>
        Duration (minutes):
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <div>
        <h3>Select Genres:</h3>
        {genresList.map((genre) => (
          <div key={genre}>
            <input
              type="checkbox"
              id={genre}
              checked={formData.genres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
            />
            <label htmlFor={genre}>{genre}</label>
          </div>
        ))}
      </div>

      <button type="submit">Add Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NewMovieForm;
