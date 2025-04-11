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
  const formattedTitle = title.replace(/[:!%.'--()&#’]/g, '');
  const posterUrl = `${imgUrl}${encodeURIComponent(formattedTitle)}.jpg`;
  const handlePosterClick = () => {
    navigate(`/movieDescription/${encodeURIComponent(id)}`);
  };
  return (
    <div
      key={id}
      className="movie-card-body text-white bg-dark m-2"
      onClick={handlePosterClick}
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
      />
      <p
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
      </p>
    </div>
  );
};
