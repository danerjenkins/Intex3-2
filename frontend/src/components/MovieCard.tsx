//MovieCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  id: string;
  title: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ id, title }) => {
  const navigate = useNavigate();
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const normalized = title.normalize('NFD');
  const cleaned = normalized.replace(/[:!%.'--()&#’]/g, '');
  const posterUrl = `${imgUrl}${encodeURIComponent(cleaned)}.jpg`;

  const handlePosterClick = () => {
    navigate(`/movieDescription/${encodeURIComponent(id)}`);
  };
  return (
    <div
      key={id}
      className="movie-card-body m-2 d-flex align-items-center justify-content-center"
      onClick={handlePosterClick}
      style={{ height: '100%' }}
    >
      <img
      className="movie-card-img"
      src={posterUrl}
      alt={title}
      onError={(e) => {
        const target = e.target as HTMLImageElement;

        // Prevent infinite loop if the fallback image also fails
        if (!target.src.includes('/defaultposter.png')) {
        target.onerror = null;
        target.src = '/defaultposter.png';
        }
      }}
      style={{ width: '200px', height: 'auto' }}
      />
    </div>
  );
};

{
  /* <p
        className="card-text text-center mb-0"
        style={{
          flexGrow: 0,
          textAlign: 'center',
          padding: '0.5rem',
          whiteSpace: 'normal',
          wordBreak: 'keep-all',
          display: '-webkit-box', // Needed for line clamping
          WebkitLineClamp: 3, // Limits to 2 lines
          WebkitBoxOrient: 'vertical', // Proper orientation for clamping
        }}
      >
        {title}
      </p> */
}
