// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/Login.css'; // Import the login-specific CSS
// import NavBar from '../items/NavBar';
// import { setUser } from '../components/variables.js'; // Import setUser to store user data

// const Login = () => {
//   const [formData, setFormData] = useState({ name: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(/* 'http://localhost:3001/login' */ 'https://vamsivemula.art/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         //credentials: 'include', // Include credentials in the request
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.message === 'Login successful') {
//           setUser(data.user); // Store user information in variables.js
//           console.log('User data stored:', data.user);
//           navigate('/dashboard');
//         } else {
//           console.error('Invalid credentials');
//         }
//       } else {
//         console.error('Login failed');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="login-page">
//       <NavBar />
//       <form onSubmit={handleSubmit}>
//         <div className="name">
//           <label htmlFor="name">Username:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} />
//         </div>
//         <div className="password">
//           <label htmlFor="password">Password:</label>
//           <input type="password" name="password" value={formData.password} onChange={handleChange} />
//         </div>
//         <div className="submit">
//           <input type="submit" />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import NavBar from '../items/NavBar';
//import { setUser } from '../components/variables.js'; // Optional, still useful if you're storing user info in memory

const Login = () => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vamsivemula.art/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Login successful' && data.token) {
          // Store token in localStorage
          localStorage.setItem('authToken', data.token);

          // Optionally store user info in memory
          setUser(data.user);

          console.log('Login successful. User:', data.user);

          navigate('/dashboard');
        } else {
          console.error('Invalid credentials');
          alert('Login failed: Invalid credentials');
        }
      } else {
        console.error('Login failed with status:', response.status);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <NavBar />
      <form onSubmit={handleSubmit}>
        <div className="name">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="submit">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;