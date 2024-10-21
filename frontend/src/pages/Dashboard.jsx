import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LogoutButton from '../components/LogoutButton';

import '../App.css';

const Dashboard = () => {
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dashboard`, {
          method: 'GET',
          credentials: 'include', // Include credentials in the request
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
        } else {
          setMessage('Unauthorized');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleRedirectHome = () => {
    navigate('/');
  };

  const handleRedirectAbout = () => {
    navigate('/login');
  };

  const handleRedirectContact = () => {
    navigate('/login');
  };

  return (
    <div className='main'>
      <nav class="navbar">
        <div class="navbar-container">
          <ul class="nav-links">
            <li><button onClick={handleRedirectHome}>Home</button></li>
            <li><button onClick={handleRedirectAbout}>About</button></li>
            <li><button onClick={handleRedirectContact}>Contact</button></li>
            <li><LogoutButton /></li>
          </ul>
        </div>
      </nav>
      <h1>{message}</h1>
      <div className="register">
        <form>
          <div className='name'>
            <label htmlFor='scan-code'>Enter Date:</label>
            <input type='date' name='scan-code' />
          </div>
          <div className='password'>
            <label htmlFor='item-name'>Enter Category:</label>
            <input type='text' name='item-name' />
          </div>
          <div className='phonenum'>
            <label htmlFor='quantity'>Enter Description:</label>
            <input type='number' name='quantity'/>
          </div>
          <div className='email'>
            <label htmlFor='sell-price'>Enter Amount:</label>
            <input type='text' name='sell-price'/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Dashboard;
