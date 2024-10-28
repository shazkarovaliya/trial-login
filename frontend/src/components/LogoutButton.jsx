import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`/*'http://localhost:3001/logout'*/, {
        method: 'POST',
        credentials: 'include', // Ensure credentials are sent (cookies)
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear any local user state if needed
        console.log('Logout successful');
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;