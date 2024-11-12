import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import NavBar from '../items/NavBar';
import TotalTable from '../items/TotalTable';
import BankTotalTable from '../items/BankTotalTable';

import '../App.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    account: '',
    transmeth: '',
    checkNum: '',
    memo: '',
    amount: ''
  });

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [tdOptions, setTdOptions] = useState([]);  // State to hold description options
  const [bankOptions, setBankOptions] = useState([]);  // State to hold bank options

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    const fetchTdOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/settings', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setTdOptions(data.td_options);  // Set options for description in state
        } else {
          console.error('Failed to fetch TDOptions');
        }
      } catch (error) {
        console.error('Error fetching TDOptions:', error);
      }
    };

    const fetchBankOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/getBankOptions', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setBankOptions(data.bankOptions);  // Set options for banks in state
        } else {
          console.error('Failed to fetch Bank Options');
        }
      } catch (error) {
        console.error('Error fetching Bank Options:', error);
      }
    };

    fetchTdOptions();
    fetchBankOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/dashboard', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setTransactions(data.transactions || []);
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message || 'Unauthorized access'}`);
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage(`Network or unexpected error: ${error.message}`);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submission successful:', result);
        window.location.reload();
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
              <option value="">Select a category</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Investment">Investment</option>
              <option value="Borrower">Borrower</option>
            </select>
          </div>
          <div className='phonenum'>
            <label htmlFor='description'>Enter Description:</label>
            <div>
              <select name="description" onChange={handleChange}>
                <option value="">Select a description</option>
                {tdOptions.map(option => (
                  <option key={option.id} value={option.dd_option}>{option.dd_option}</option>
                ))}
              </select>
              <a href="/settings" style={{ marginLeft: '10px', color: 'black' }}>
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </div>
          </div>
          <div className='email'>
            <label htmlFor='account'>Enter Account:</label>
            <div>
              <select name="account" onChange={handleChange}>
                <option value="">Select an account</option>
                {bankOptions.map(option => (
                  <option key={option.id} value={option.bank}>{option.bank}</option>
                ))}
              </select>
              <a href="/settings" style={{ marginLeft: '10px', color: 'black' }}>
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </div>
          </div>
          <div className='email'>
            <label htmlFor='transmeth'>Enter Transaction Method:</label>
            <select name="transmeth" id="transmeth" onChange={handleChange}>
              <option value="">Select a transaction method</option>
              <option value="Cash">Cash</option>
              <option value="EFT">EFT</option>
              <option value="Check">Check</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>
          {formData.transmeth === "Check" && (
            <div className='email'>
              <label htmlFor='checkNum'>Enter Check Number:</label>
              <input
                type='text'
                name='checkNum'
                onChange={handleChange}
                value={formData.checkNum}
              />
            </div>
          )}
          <div className='email'>
            <label htmlFor='amount'>Enter Amount:</label>
            <input type='number' name='amount' onChange={handleChange}/>
          </div>
          <div className='email'>
            <label htmlFor='memo'>Enter Memo:</label>
            <input type='text' name='memo' onChange={handleChange}/>
          </div>
          <div className='submit'>
            <input id="submit" type='submit' />
          </div>
        </form>
      </div>
      {loading ? <p>Loading...</p> : (
        <>
          <TotalTable transactions={transactions} />
          <BankTotalTable /> {/* Add this below the TotalTable */}
        </>
      )}
    </div> 
  )
}

export default Dashboard;