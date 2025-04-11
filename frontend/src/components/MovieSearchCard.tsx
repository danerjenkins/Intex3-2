// MovieSearchCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieSearchCardProps {
  id: string;
  title: string;
  director: string;
  info: string;
}

export const MovieSearchCard: React.FC<MovieSearchCardProps> = ({
  id,
  title,
  director,
  info,
}) => {
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const formattedTitle = title.replace(/[:!%.'--()&#’]/g, '');
  const posterUrl = `${imgUrl}${encodeURIComponent(formattedTitle)}.jpg`;
  const navigate = useNavigate();

  const handlePosterClick = () => {
    navigate(`/movieDescription/${encodeURIComponent(id)}`);
  };
  return (
    <>
      <div className="card h-100" onClick={handlePosterClick}>
        <img
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

        <div className="card-body d-flex flex-column cardColor">
          <h5 className="card-title">{title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{director}</h6>
          <p className="card-text mb-3">{info}</p>
        </div>
      </div>
    </>
  );
};
