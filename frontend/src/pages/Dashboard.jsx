import React, { useEffect, useState } from 'react';

import DataTable from '../items/DataTable';
import NavBar from '../items/NavBar';

import '../App.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch( `${process.env.REACT_APP_BACKEND_URL}/dashboard` /* 'http://localhost:3001/dashboard' */, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setTransactions(data.transactions || []);  // Fallback to an empty array if undefined
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message || 'Unauthorized access'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Network or unexpected error: ${error.message}`);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/dashboard` /* 'http://localhost:3001/dashboard' */, {
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
      } else {
        console.error('Form submission failed:', result);
      }
    } catch (error) {
      console.error('Database insertion error details:', error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className='main'>
      <NavBar />
      <h1>{message}</h1>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <div className='name'>
            <label htmlFor='date'>Enter Date:</label>
            <input type='date' name='date' onChange={handleChange}/>
          </div>
          <div className='password'>
            <label htmlFor='item-name'>Enter Category:</label>
            <select name="category" id="category" onChange={handleChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="investment">Investment</option>
              <option value="borrower">Borrower</option>
            </select>
          </div>
          <div className='phonenum'>
            <label htmlFor='description'>Enter Description:</label>
            <textarea type='text' name='description' onChange={handleChange}/>
          </div>
          <div className='email'>
            <label htmlFor='amount'>Enter Amount:</label>
            <input type='number' name='amount' onChange={handleChange}/>
          </div>
          <div className='submit'>
            <input id="submit" type='submit' />
          </div>
        </form>
      </div>
      <DataTable transactions={transactions}/>
    </div> 
  )
}

export default Dashboard;
