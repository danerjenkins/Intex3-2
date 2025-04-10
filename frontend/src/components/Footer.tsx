// Footer.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './AuthorizeView'; // or wherever you exported it

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const user = React.useContext(UserContext);

  return (
    <footer className="fixed-footer">
      <p className="mb-1">
        &copy; {new Date().getFullYear()} CineNiche. All the magic of movies, reserved 🎬🍿.
      </p>
      <div>
        <button
          onClick={() => navigate('/privacy')}
          className="btn btn-link p-0 text-decoration-underline text-secondary"
          style={{ fontSize: '0.75rem' }}
        >
          Privacy Policy
        </button>
      </div>
      {/* Conditionally render the Admin Dashboard link */}
      {user?.email === 'admin@admin.com' && (
        <div className="admin-link mt-2">
          <Link
            to="/admin"
            className="text-secondary text-decoration-underline"
            style={{ fontSize: '0.75rem' }}
          >
            Admin Dashboard 🎥
          </Link>
        </div>
      )}
    </footer>
  );
};
