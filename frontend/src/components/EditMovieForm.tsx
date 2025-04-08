import { useState } from 'react';
import { Movie } from '../types/Movie'; // Import Movie interface (you can create this)
import { updateMovie } from '../api/MoviesApi'; // Assuming you have an updateMovie function in your API

const genresList = [
  "Action", "Adventure", "Anime Series International TV Show", "British TV Shows Docuseries International TV Show", 
  "Children", "Comedy", "Comedy Drama International", "Docuseries", "Comedy Romance", "Crime TV Show Docuseries", "Documentary", 
  "Documentary International", "Drama", "Drama International", "Drama Romance", "Family", "Fantasy", "Horror", 
  "International Thriller", "International TV Show Romantic TV Show", "Kids TV Show", "Language TV Show", "Musical", 
  "Nature TV Show", "Reality TV Show", "Spirituality", "TV Show Action", "TV Show Comedy", "Talk Shows TV Comedy", "Thriller"
];

interface EditMovieFormProps {
  movie: Movie; // Use the Movie interface
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({
  movie,
  onSuccess,
  onCancel,
}: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (genre: string) => {
    const currentGenres = formData.genre.split(',').map(g => g.trim()).filter(Boolean);
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
  
    setFormData({ ...formData, genre: updatedGenres.join(', ') });
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.show_id, formData); // Assuming updateMovie API function is available
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Movie Information</h2>
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
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <h3>Select Genres:</h3>
      {genresList.map((genre) => (
        <div key={genre}>
          <input
            type="checkbox"
            id={genre}
            checked={formData.genre.split(',').map(g => g.trim()).includes(genre)}
            onChange={() => handleGenreChange(genre)}
          />
          <label htmlFor={genre}>{genre}</label>
        </div>
      ))}

      <button type="submit">Update Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditMovieForm;
