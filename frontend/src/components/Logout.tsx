import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import { useContext } from 'react';
// import { UserContext } from './AuthorizeView';

const LogoutButton = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  // const user = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent to the server
      });

      if (response.ok) {
        // If the API logout is successful, clear the cookie
        Cookies.remove('user', {path : "/"}); // Remove the user cookie
        
        // Redirect user to login page
        navigate('/'); // Or navigate('/') for home page
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
