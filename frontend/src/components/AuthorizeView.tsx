import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import Cookies from 'js-cookie'; // Import js-cookie
import { createContext } from 'react';

export interface User {
  appUserId: number | null;
  email: string;
  role: string;
  identityId: string;
}
export const UserContext = createContext<User>({
  appUserId: null,
  email: 'x@x.x',
  role: '',
  identityId: '',
});

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // add a loading state
  //const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User>({
    appUserId: null,
    email: 'x@x.x',
    role: '',
    identityId: '',
  });

  useEffect(() => {
    async function fetchWithRetry(url: string, options: any) {
      try {
        const response = await fetch(url, options);
        //console.log('AuthorizeView: Raw Response:', response);

        const contentType = response.headers.get('content-type');

        // Ensure response is JSON before parsing
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }

        const data = await response.json();

        if (data.email) {
          setUser({
            email: data.email,
            role: data.role || '',
            appUserId: data.appUserId || null,
            identityId: data.identityId,
          });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch (error) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchWithRetry(`${apiUrl}/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Registering ...</span>
        </div>
        <p>Registering ...</p>
      </div>
    );
  }

  if (authorized) {
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }

  return <Navigate to="/login" />;
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null; // Prevents errors if context is null

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
