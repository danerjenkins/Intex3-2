// ProfilePage.tsx
import React, { useEffect } from 'react';
import { Header } from '../components/Header';
import Logout from '../components/Logout';
import ToggleThemeButton from '../components/ToggleThemeButton';
import { getCookie } from '../hooks/useTheme';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';

export const ProfilePage: React.FC = () => {
  // Simulated user info (replace with context or API call)
  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 28,
    location: 'Provo, UT',
  };
  // const [theme, setTheme] = useState<string>('dark');

  // useEffect(() => {
  //   const currentTheme = getCookie('theme') || 'dark';
  //   setTheme(currentTheme);
  //   document.documentElement.setAttribute('data-theme', currentTheme);
  // }, []);
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="min-vh-100 p-4 d-flex flex-column align-items-center">
        <div
          className="profileCard bg-opacity-25 p-4 rounded shadow w-100"
          style={{ maxWidth: '500px' }}
        >

          <h1 className="h3 fw-bold mb-4">Your Profile</h1>
          <div className="mb-3">
            <p className="text-muted small mb-1">Name</p>
            <p className="fs-5 mb-0">{user.name}</p>
          </div>
          <div className="mb-3">
            <p className="text-muted small mb-1">Email</p>
            <p className="fs-5 mb-0">{user.email}</p>
          </div>
          <div className="mb-3">
            <p className="text-muted small mb-1">Age</p>
            <p className="fs-5 mb-0">{user.age}</p>
          </div>
          <div className="mb-4">
            <p className="text-muted small mb-1">Location</p>
            <p className="fs-5 mb-0">{user.location}</p>
          </div>

          {/* Theme Toggle Button */}
          <ToggleThemeButton />
          <br />
          <br />
          <Logout />
          <br /><br />
          <button className='profileButton' onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
      <Footer />
    </>
  );
};
