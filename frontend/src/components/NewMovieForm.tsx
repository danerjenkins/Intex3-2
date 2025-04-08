import { useState } from 'react';
import { Movie } from '../types/Movie'; // Import Movie interface
import { addMovie } from '../api/MoviesApi'; // Assuming you have an addMovie function in your API

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Updated genres list based on your provided data
const genresList = [
  'Action',
  'Adventure',
  'Anime Series International TV Show',
  'British TV Shows Docuseries International TV Show',
  'Children',
  'Comedy',
  'Comedy Drama International',
  'Docuseries',
  'Comedy Romance',
  'Crime TV Show Docuseries',
  'Documentary',
  'Documentary International',
  'Drama',
  'Drama International',
  'Drama Romance',
  'Family',
  'Fantasy',
  'Horror',
  'International Thriller',
  'International TV Show Romantic TV Show',
  'Kids TV Show',
  'Language TV Show',
  'Musical',
  'Nature TV Show',
  'Reality TV Show',
  'Spirituality',
  'TV Show Action',
  'TV Show Comedy',
  'Talk Shows TV Comedy',
  'Thriller',
];

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    show_id: '',
    title: '',
    type: '',
    director: '',
    cast: '',
    country: '',
    release_year: 0,
    rating: '',
    duration: '',
    description: '',
    genre: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (genre: string) => {
    setFormData((prevFormData) => {
      const currentGenres = prevFormData.genre
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g); // turn string into array
      const updatedGenres = currentGenres.includes(genre)
        ? currentGenres.filter((g) => g !== genre)
        : [...currentGenres, genre];

      return { ...prevFormData, genre: updatedGenres.join(', ') }; // turn back into comma string
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim genre string before submission
    const trimmedGenres = formData.genre
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g)
      .join(', ');

    await addMovie({ ...formData, genre: trimmedGenres });
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
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </label>

      <label>
        Duration (minutes):
        <input
          type="text"
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
              checked={formData.genre
                .split(',')
                .map((g) => g.trim())
                .includes(genre)}
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
