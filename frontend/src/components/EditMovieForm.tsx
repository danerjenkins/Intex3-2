import { useState } from 'react';
import { Movie } from '../types/Movie';
import { updateMovie } from '../api/MoviesApi';

const genresList = [
  "Action", "Adventure", "Anime Series International TV Show", "British TV Shows Docuseries International TV Show", 
  "Children", "Comedy", "Comedy Drama International", "Docuseries", "Comedy Romance", "Crime TV Show Docuseries", "Documentary", 
  "Documentary International", "Drama", "Drama International", "Drama Romance", "Family", "Fantasy", "Horror", 
  "International Thriller", "International TV Show Romantic TV Show", "Kids TV Show", "Language TV Show", "Musical", 
  "Nature TV Show", "Reality TV Show", "Spirituality", "TV Show Action", "TV Show Comedy", "Talk Shows TV Comedy", "Thriller"
];

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleGenreChange = (genre: string) => {
    const currentGenres = formData.genre?.split(',').map(g => g.trim()).filter(Boolean) || [];
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    setFormData({ ...formData, genre: updatedGenres.join(', ') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bodyToSend = {
        ...formData,
        Genre: formData.genre, // for C# backend compatibility
      };
      delete (bodyToSend as any).genre;

      await updateMovie(formData.show_id, bodyToSend);
      onSuccess();
    } catch (err) {
      console.error("Update failed", err);
      alert("Movie update failed. Check console.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="card-title mb-4">Edit Movie</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {[
              { label: "Title", name: "title", type: "text" },
              { label: "Type", name: "type", type: "text" },
              { label: "Director", name: "director", type: "text" },
              { label: "Cast", name: "cast", type: "text" },
              { label: "Country", name: "country", type: "text" },
              { label: "Release Year", name: "release_year", type: "number" },
              { label: "Rating", name: "rating", type: "text" },
              { label: "Duration (minutes)", name: "duration", type: "text" },
              { label: "Description", name: "description", type: "text" },
            ].map((field) => (
              <div className="col-md-6 mb-3" key={field.name}>
                <label htmlFor={field.name} className="form-label">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={(formData as any)[field.name] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Select Genres:</label>
            <div className="row">
              {genresList.map((genre) => (
                <div className="col-md-4" key={genre}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={genre}
                      checked={formData.genre?.split(',').map(g => g.trim()).includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    <label className="form-check-label" htmlFor={genre}>
                      {genre}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="submit" className="btn btn-primary">
              Update Movie
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieForm;
