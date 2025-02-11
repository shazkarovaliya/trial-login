import React, { useEffect, useState } from 'react';
import NavBar from '../items/NavBar';
import TotalTable from '../items/TotalTable';
import BankTotalTable from '../items/BankTotalTable';
import '../App.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://vamsivemula.art/dashboard' /* 'http://localhost:3001/dashboard' */, {
  //         method: 'GET',
  //         credentials: 'include',
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setMessage(data.message);
  //         setTransactions(data.transactions || []);
  //       } else {
  //         const errorData = await response.json();
  //         setMessage(`Error: ${errorData.message || 'Unauthorized access'}`);
  //         setTransactions([]);
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       setMessage(`Network or unexpected error: ${error.message}`);
  //       setTransactions([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    console.log("Fetching dashboard data...");
  
    try {
      const response = await fetch('https://vamsivemula.art/dashboard', {
        method: 'GET',
        credentials: 'include', // Ensures session data is sent
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching data:", errorData);
        setMessage(`Error: ${errorData.message || 'Unauthorized access'}`);
        setTransactions([]);
      } else {
        const data = await response.json();
        console.log("Fetched data:", data);
  
        setMessage(data.message);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage(`Network or unexpected error: ${error.message}`);
      setTransactions([]);
    } finally {
      console.log("Finished fetching data, setting loading to false.");
      setLoading(false);
    }
  };
  
  

  // return (
  //   <div className='main'>
  //     <NavBar />
  //     <h1>{message}</h1>
  //     {loading ? <p>Loading...</p> : (
  //       <>
  //         <TotalTable transactions={transactions} />
  //         <BankTotalTable />
  //       </>
  //     )}
  //   </div>
  // );
  return (
    <div className='main'>
      <NavBar />
      <h1>{message}</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {transactions.length > 0 ? (
            <>
              <TotalTable transactions={transactions} />
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