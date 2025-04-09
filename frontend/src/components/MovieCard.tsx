import React from 'react';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  onClick: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  onClick,
}) => (
  <div key={id} className="movie-card-body text-white bg-dark m-2" onClick={onClick}>
    <img
      src={posterUrl || 'defaultposter.png'}
      alt={title}
      className="card-img-top"
      style={{ height: '15rem', objectFit: 'cover' }}
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
