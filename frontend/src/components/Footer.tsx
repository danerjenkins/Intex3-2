// Footer.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './AuthorizeView'; // or wherever you exported it

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const user = React.useContext(UserContext);

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
    {/* Conditionally render the Admin Dashboard link */}
    {user?.email === 'admin@admin.com' && (
            <div className="mt-2">
              <Link
                to="/admin"
                className="text-secondary text-decoration-underline"
                style={{ fontSize: '0.9rem' }}
              >
                Admin Dashboard
              </Link>
            </div>
          )}
    </footer>
  );
};
