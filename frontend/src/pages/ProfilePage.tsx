// ProfilePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Simulated user info (replace with context or API call)
  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 28,
    location: 'Provo, UT',
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent
      });
  
      if (response.ok) {
        // Optionally: clear user context or force a reload
        navigate('/login'); // Redirect to login after logout
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100 p-4 d-flex flex-column align-items-center">
  <Header />

  <h1 className="h3 fw-bold mb-4">Your Profile</h1>

  <div className="bg-secondary bg-opacity-25 p-4 rounded shadow w-100" style={{ maxWidth: '500px' }}>
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

    <button
      onClick={handleLogout}
      className="btn btn-danger w-100"
    >
      Log Out
    </button>
  </div>
</div>

  );
};
