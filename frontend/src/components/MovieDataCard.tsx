// MovieDataCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieDataCardProps {
  id: string;
  title: string;
  director: string;
  info: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MovieDataCard: React.FC<MovieDataCardProps> = ({
  id,
  title,
  director,
  info,
  onEdit,
  onDelete,
}) => {
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const normalized = title.normalize('NFD');
  const cleaned = normalized.replace(/[:!%.'--()&#’]/g, '');
  const posterUrl = `${imgUrl}${encodeURIComponent(cleaned)}.jpg`;
  const navigate = useNavigate();

  const handlePosterClick = () => {
    navigate(`/movieDescription/${encodeURIComponent(id)}`);
  };
  return (
    <div className="card h-100">
      <img
        onClick={handlePosterClick}
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
        <div className="mt-auto d-flex justify-content-between">
          <button className="editButton" onClick={onEdit}>
            Edit
          </button>
          <button className="deleteButton" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
