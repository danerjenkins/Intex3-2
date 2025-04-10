import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

interface GenreFilterProps {
  selectedGenres?: string[];
  onGenreChange?: (genres: string[]) => void;
}

// Use your full list or a simplified version, as needed:
const allGenres = [
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

const scrollGenreList = (direction: string, container: HTMLElement) => {
  // Look for the scrollable genre list element
  const list = container.querySelector('.genre-list') as HTMLElement;
  if (!list) {
    console.error('Genre list element not found');
    return;
  }

  // Determine the width of a genre button (including margin/padding)
  const genreButton = list.querySelector('.btn-genre') as HTMLElement;
  if (!genreButton) {
    console.error('Genre button element not found');
    return;
  }

  // Calculate the scroll amount based on button width and a factor (e.g. 6 items)
  const buttonWidth =
    genreButton.offsetWidth +
    parseInt(getComputedStyle(list).gap || '0', 10);
  const scrollAmount = buttonWidth * 6;

  if (direction === 'left') {
    list.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    list.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

export const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onGenreChange }) => {
  const navigate = useNavigate();

  const handleGenreClick = (genre: string) => {
    // If you have an external onGenreChange callback (for inline filtering), call it:
    if (onGenreChange) {
      if (selectedGenres && selectedGenres.includes(genre)) {
        onGenreChange(selectedGenres.filter((g) => g !== genre));
      } else {
        onGenreChange([genre]); // this example uses one genre at a time
      }
    }
    // Navigate to /search with the genre as a query parameter.
    navigate(`/search?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="genre-filter-container p-3 rounded mb-4 position-relative">

      {/* Left chevron */}
      <button
        className="chevron left"
        onClick={(e) => {
          // Find the closest container with the scrolling functionality
          const container = (e.target as HTMLElement).closest(
            '.genre-filter-container'
          ) as HTMLElement | null;
          if (container) scrollGenreList('left', container);
        }}
      >
        ‹
      </button>

      {/* Horizontal scrolling container for genres */}
      <div className="genre-list d-flex flex-row overflow-auto px-3 py-2 gap-2">
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`btn btn-genre ${selectedGenres?.includes(genre) ? 'active' : ''}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Right chevron */}
      <button
        className="chevron right"
        onClick={(e) => {
          const container = (e.target as HTMLElement).closest(
            '.genre-filter-container'
          ) as HTMLElement | null;
          if (container) scrollGenreList('right', container);
        }}
      >
        ›
      </button>
    </div>
  );
};
