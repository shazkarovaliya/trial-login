import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../components/variables.js'; // Import clearUser to clear user data

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://vamsivemula.art/logout', {
        method: 'POST',
        credentials: 'include', // Ensure credentials are sent (cookies)
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        clearUser(); // Clear user information from variables.js
        console.log('Logout successful');
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