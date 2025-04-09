// MovieDataCard.tsx
import React from 'react';

interface MovieDataCardProps {
  title: string;
  director: string;
  info: string;
  posterUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const MovieDataCard: React.FC<MovieDataCardProps> = ({
  title,
  director,
  info,
  posterUrl,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card h-100">
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

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{director}</h6>
        <p className="card-text mb-3">{info}</p>
        <div className="mt-auto d-flex justify-content-between">
          <button className="btn btn-success btn-sm" onClick={onEdit}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};
