import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const user = useContext(UserContext);
  const navigate = useNavigate();
  
  // Check if the user has already accepted cookies
  useEffect(() => {
    const userConsent = Cookies.get('cookie-consent');
    if (!userConsent) {
      setIsVisible(true); // Show banner if no consent is found    
    }
  }, [user]);

  // Handle user acceptance of cookies
  const acceptCookies = () => {
    Cookies.set('cookie-consent', 'accepted', { expires: 1, path: '/' }); // Store consent for 1 day

    setIsVisible(false); // Hide the banner after acceptance
  };

  if (!isVisible) return null;

  const goToPrivacyPolicy = () => {
   navigate('/privacy');
 };

  return (
    <div style={styles.banner}>
      <div style={styles.text}>
        <p>
          We use cookies to improve your experience on our site. By using our
          site, you agree to our use of cookies.
          <span onClick={goToPrivacyPolicy} style={styles.link}>
            {' '}Learn more
          </span>
          .
        </p>
      </div>
      <button onClick={acceptCookies} style={styles.button}>
        Accept
      </button>
    </div>
  );
};

// Simple styling for the banner
import { CSSProperties } from 'react';
import { UserContext } from './AuthorizeView';

const styles: { [key: string]: CSSProperties } = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    zIndex: 1000,
  },
  text: {
    display: 'inline-block',
    marginRight: '10px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  link: {
    color: '#ddd',
    textDecoration: 'underline',
  },
};

export default CookieConsentBanner;
