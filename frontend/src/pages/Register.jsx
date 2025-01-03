import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';

import NavBar from '../items/NavBar';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    business: '',
    address: ''
  });
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
      const response = await fetch(/* `${process.env.REACT_APP_BACKEND_URL}/register` */ 'http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials in the request
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submission successful:', result);
        navigate('/login');
      } else {
        console.error('Form submission failed:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='main'>
      <div className="register">
      <NavBar />
        <form onSubmit={handleSubmit}>
          <div className='name'>
            <label htmlFor='name'>Enter Name:</label>
            <input type='text' name='name' value={formData.name} onChange={handleChange} />
          </div>
          <div className='name'>
            <label htmlFor='username'>Enter Username:</label>
            <input type='text' name='username' value={formData.username} onChange={handleChange} />
          </div>
          <div className='password'>
            <label htmlFor='password'>Enter Password:</label>
            <input type='password' name='password' value={formData.password} onChange={handleChange} />
          </div>
          <div className='phonenum'>
            <label htmlFor='phone'>Enter Phone Number:</label>
            <input type='number' name='phone' value={formData.phone} onChange={handleChange} />
          </div>
          <div className='email'>
            <label htmlFor='email'>Enter Email:</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} />
          </div>
          <div className='business'>
            <label htmlFor='business'>Enter Business Type:</label>
            <input type='text' name='business' value={formData.business} onChange={handleChange} />
          </div>
          <div className='address'>
            <label htmlFor='address'>Enter Address:</label>
            <input type='text' name='address' value={formData.address} onChange={handleChange} />
          </div>
          <div className='submit'>
            <input id="submit" type='submit' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;