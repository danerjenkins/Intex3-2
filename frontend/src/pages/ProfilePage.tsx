// ProfilePage.tsx
import React from 'react';
import { Header } from '../components/Header';
import Logout from '../components/Logout';
import ToggleThemeButton from '../components/ToggleThemeButton';
// import { getCookie } from '../hooks/useTheme';
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { User, UserContext } from '../components/AuthorizeView';

export const ProfilePage: React.FC = () => {
  // Simulated user info (replace with context or API call)
  const user: User = React.useContext(UserContext);
  let role: string = user.role;
  if (user.role == '') {
    role = 'Proud CineNiche Subscriber';
  }

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
            <p className="small mb-1">
              <strong>Account:</strong>
            </p>
            <p className="fs-5 mb-0">{user.email}</p>
          </div>
          <div className="mb-3">
            <p className="small mb-1">
              <strong>Access Level: </strong>
            </p>
            <p className="fs-5 mb-0">{role}</p>
          </div>

          {/* Theme Toggle Button */}
          <ToggleThemeButton />
          <br />
          <br />
          <Logout />
          <br />
          <br />
          <button className="profileButton" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
