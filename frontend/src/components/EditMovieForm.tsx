import { useState } from 'react';
import { Movie } from '../types/Movie';
import { addMovie, updateMovie } from '../api/MoviesApi';

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

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
  isNew?: boolean; // <- optional flag
}

const EditMovieForm = ({
  movie,
  onSuccess,
  onCancel,
  isNew,
}: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleGenreChange = (genre: string) => {
    const currentGenres =
      formData.genre
        ?.split(',')
        .map((g) => g.trim())
        .filter(Boolean) || [];
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    setFormData({ ...formData, genre: updatedGenres.join(', ') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieToSend = {
        ...formData,
        Genre: formData.genre, // for C# backend compatibility
      };
      delete (movieToSend as any).genre;
      if (isNew) {
        await addMovie(movieToSend); // <-- use your addMovie function
      } else {
        await updateMovie(formData.show_id, movieToSend);
      }
      onSuccess();
    } catch (err) {
      console.error('Update failed', err);
      alert('Movie update failed. Check console.');
    }
  };

  return (
    <div className="cardColor mb-4 p-4 rounded">
  <h3 className="mb-4">
    {isNew ? 'Add Movie' : 'Update Movie'}
  </h3>
  <form onSubmit={handleSubmit}>
    <div className="row">
      {[
        { label: 'Title', name: 'title', type: 'text' },
        { label: 'Type', name: 'type', type: 'text' },
        { label: 'Director', name: 'director', type: 'text' },
        { label: 'Cast', name: 'cast', type: 'text' },
        { label: 'Country', name: 'country', type: 'text' },
        { label: 'Release Year', name: 'release_year', type: 'number' },
        { label: 'Rating', name: 'rating', type: 'text' },
        { label: 'Duration (minutes)', name: 'duration', type: 'text' },
        { label: 'Description', name: 'description', type: 'text' },
      ].map((field) => (
        <div className="col-md-6 mb-3" key={field.name}>
          <label htmlFor={field.name} className="form-label" style={{ color: 'var(--text-color)' }}>
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={(formData as any)[field.name] || ''}
            onChange={handleChange}
            style={{
              backgroundColor: 'var(--movie-card-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--btn-genre-border)',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              width: '100%',
            }}
          />
        </div>
      ))}
    </div>

    <div className="mb-4">
      <label className="form-label" style={{ color: 'var(--text-color)' }}>
        Select Genres:
      </label>
      <div className="row">
        {genresList.map((genre) => (
          <div className="col-md-4" key={genre}>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id={genre}
                checked={formData.genre
                  ?.split(',')
                  .map((g) => g.trim())
                  .includes(genre)}
                onChange={() => handleGenreChange(genre)}
                style={{
                  accentColor: 'var(--btn-genre-border)',
                }}
              />
              <label
                className="form-check-label"
                htmlFor={genre}
                style={{ color: 'var(--text-color)', marginLeft: '0.5rem' }}
              >
                {genre}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="d-flex justify-content-end gap-2">
      <button type="submit" className="btn-genre">
        {isNew ? 'Add Movie' : 'Update Movie'}
      </button>
      <button
        type="button"
        className="btn-genre"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </form>
</div>

  );
};

export default EditMovieForm;
