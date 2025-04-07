import React from 'react';

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
}

const allGenres = [
  'Action',
  'Comedy',
  'Drama',
  'Documentary',
  'Horror',
  'Romance',
  'Thriller',
  'Animation',
  'Adventure',
  'Sci-Fi',
];

export const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenres,
  onGenreChange,
}) => {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  return (
    <div className="bg-dark text-white p-4 rounded shadow mb-4">
      <h2 className="h5 fw-semibold mb-3">Filter by Genre</h2>
      <div className="row">
        {allGenres.map((genre) => (
          <div className="col-6 mb-2" key={genre}>
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input me-2"
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
                id={`genre-${genre}`}
              />
              <label className="form-check-label" htmlFor={`genre-${genre}`}>
                {genre}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
