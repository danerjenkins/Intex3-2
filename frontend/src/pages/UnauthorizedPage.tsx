import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default UnauthorizedPage;
