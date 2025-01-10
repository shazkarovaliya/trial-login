import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { UserContext } from '../components/UserContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  useEffect(() => {
    const fetchBankOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/getBankOptions', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bank options');
        }
        const data = await response.json();
        setAccounts(data.bankOptions || []);
      } catch (error) {
        console.error('Error fetching bank options:', error);
        setAccounts([]);
      }
    };

    fetchBankOptions();
  }, []);

  const toggleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown);
    setShowBankDropdown(false); // Close bank dropdown if open
  };

  const toggleBankDropdown = () => {
    setShowBankDropdown(!showBankDropdown);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="nav-links">
            {isLoggedIn ? (
              <li><button onClick={() => navigate('/dashboard')}>Dashboard</button></li>
            ) : (
              <li><button onClick={() => navigate('/')}>Home</button></li>
            )}

            {isLoggedIn ? (
              <>
                <li>
                  <button onClick={toggleReportDropdown}>Report</button>
                  {showReportDropdown && (
                    <ul className="dropdown-menu">
                      <li>
                        <button onClick={toggleBankDropdown}>Bank Report</button>
                        {showBankDropdown && (
                          <ul className="dropdown-submenu">
                            {accounts.length > 0 ? (
                              accounts.map((account) => (
                                <li key={account.id}>
                                  <button onClick={() => navigate(`/report/bank/${account.bank}`)}>
                                    {account.bank}
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li>No accounts found</li>
                            )}
                          </ul>
                        )}
                      </li>
                    </ul>
                  )}
                </li>
                <li><button onClick={() => navigate('/transfer')}>Entry</button></li>
                <li><button onClick={() => navigate('/settings')}>Settings</button></li>
                <li><LogoutButton /></li>
              </>
            ) : (
              <>
                <li><button onClick={() => navigate('/')}>About</button></li>
                <li><button onClick={() => navigate('/')}>Contact</button></li>
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