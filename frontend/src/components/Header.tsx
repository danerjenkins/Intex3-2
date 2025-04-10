import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './AuthorizeView';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="bg-dark text-white border-bottom border-secondary py-3 px-4">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
          <img
            src="/logo.png"
            alt="CineNiche Logo"
            style={{ width: '150px', height: 'auto', cursor: 'pointer' }}
            onClick={() => navigate('/movies')}
          />
        </div>

        {/* Center: Search Bar */}
        {user && (
          <div className="flex-grow-1 px-4">
          <input
            type="text"
            placeholder="Search..."
            className="form-control bg-secondary text-white border-0 rounded-pill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>)}

        {/* Right: Profile Icon */}
        {user && (
          <div>
            <img
              src="/user-icon.webp"
              alt="User"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/profile')}
            />
          </div>
        )}
      </div>
    </header>
  );
};
