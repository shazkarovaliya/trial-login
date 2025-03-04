import React, { useEffect, useState } from 'react';
import NavBar from '../items/NavBar';
import TotalTable from '../items/TotalTable';
import BankTotalTable from '../items/BankTotalTable';
import '../App.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/dashboard', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent
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

  return (
    <div className='main'>
      <NavBar />
      <h1>{message}</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {transactions.length > 0 ? (
            <>
              <BankTotalTable />
            </>
          ) : (
            <p>No transactions found.</p>
          )}
        </>
      )}
    </div>
  );
  
};

export default Dashboard;