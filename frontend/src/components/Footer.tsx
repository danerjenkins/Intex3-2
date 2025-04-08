// Footer.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-dark text-secondary text-center py-4 border-top border-secondary mt-auto">
      <p className="mb-1">
        &copy; {new Date().getFullYear()} CineNiche. All rights reserved.
      </p>
      <button
        onClick={() => navigate('/privacy')}
        className="btn btn-link p-0 text-decoration-underline text-secondary"
        style={{ fontSize: '0.9rem' }}
      >
        Privacy Policy
      </button>
    </footer>
  );
};
