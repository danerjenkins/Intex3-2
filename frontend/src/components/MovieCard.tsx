import React from 'react';

const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';

interface MovieCardProps {
  id: string;
  title: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({ id, title }) => (
  <div key={id} className="card-body text-white bg-dark m-2">
    <img
      src={`${imgUrl}${encodeURIComponent(title)}.jpg`}
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
