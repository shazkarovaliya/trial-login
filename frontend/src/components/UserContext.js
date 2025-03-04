import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check session status with backend on mount
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/checkSession' /* 'http://localhost:3001/checkSession' */, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Logged In');
          setIsLoggedIn(data.isLoggedIn); // true if session exists
        } else {
          console.log('Logged Out');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
