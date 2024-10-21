import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(/*`${process.env.REACT_APP_BACKEND_URL}/login`*/ 'https://trial-login-production-c2f7.up.railway.app/login' /*'http://localhost:3001/login'*/, {
        method: 'POST',
        //mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials in the request
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Login successful') {
          navigate('/dashboard');
        } else {
          console.error('Invalid credentials');
        }
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRedirectHome = () => {
    navigate('/');
  };

  const handleRedirectAbout = () => {
    navigate('/login');
  };

  const handleRedirectContact = () => {
    navigate('/login');
  };

  const handleRedirectLogin = () => {
    navigate('/login');
  };

  const handleRedirectRegister = () => {
    navigate('/register');
  };

  return (
    <div className='main'>
      <nav class="navbar">
        <div class="navbar-container">
          <ul class="nav-links">
            <li><button onClick={handleRedirectHome}>Home</button></li>
            <li><button onClick={handleRedirectAbout}>About</button></li>
            <li><button onClick={handleRedirectContact}>Contact</button></li>
            <li><button class="active" onClick={handleRedirectLogin}>Login</button></li>
            <li><button onClick={handleRedirectRegister}>Register</button></li>
          </ul>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        <div className='name'>
          <label htmlFor='name'>Enter Username:</label>
          <input type='text' name='name' value={formData.name} onChange={handleChange} />
        </div>
        <div className='password'>
          <label htmlFor='password'>Enter Password:</label>
          <input type='password' name='password' value={formData.password} onChange={handleChange} />
        </div>
        <div className='submit'>
          <input type='submit' />
        </div>
      </form>
      
    </div>
  );
}

export default Login;
