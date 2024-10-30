import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { UserContext } from '../components/UserContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  const handleRedirectHome = () => {
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="nav-links">
            <li><button onClick={handleRedirectHome}>Home</button></li>
            <li><button onClick={() => navigate('/about')}>About</button></li>
            <li><button onClick={() => navigate('/contact')}>Contact</button></li>
            {isLoggedIn ? (
              <li><LogoutButton /></li>
            ) : (
              <>
                <li><button onClick={() => navigate('/login')}>Login</button></li>
                <li><button onClick={() => navigate('/register')}>Register</button></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
