import React from 'react';

interface MovieCardProps {
  title: string;
  posterUrl: string;
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterUrl,
  onClick,
}) => (
  <div
    className="card text-white bg-dark m-2"
    style={{ width: '10rem', cursor: 'pointer' }}
    onClick={onClick}
  >
    <img
      src={posterUrl}
      alt={title}
      className="card-img-top"
      style={{ height: '15rem', objectFit: 'cover' }}
    />
    <div className="card-body p-2">
      <p className="card-text text-center text-truncate mb-0">{title}</p>
    </div>
  </div>
);
