import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface User {
  email: string;
  role: string;
}


export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
    const [user, setUser] = useState<User | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };


  useEffect(() => {
      async function fetchWithRetry(url: string, options: any) {
          const response = await fetch(url, options);
          const data = await response.json();
          if (data.email) {
            setUser({ email: data.email, role: data.role || '' });
          } else {
            throw new Error('Invalid user session');
          }
        }
      fetchWithRetry(`${apiUrl}/pingauth`, {
        method: 'GET',
        credentials: 'include',
      });
    }, []);


  return (
    <header className="headerBg border-bottom border-secondary py-3 px-4">
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
            className="form-control border-0 rounded-pill"
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
