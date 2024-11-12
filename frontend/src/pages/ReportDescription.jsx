import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NavBar from '../items/NavBar';

const ReportDescription = () => {
  const { description } = useParams();
  const [transactions, setTransactions] = useState([]); // Default to an empty array
  const [total, setTotal] = useState(0); // Default to 0
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/description/${description}`)
      .then((response) => response.json())
      .then((data) => {
        // Sort transactions by date in descending order
        const sortedTransactions = (data.transactions || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(sortedTransactions); // Set sorted transactions
        setTotal(data.total || 0);  // Set total or 0 if undefined
      })
      .catch((error) => {
        setError('Failed to fetch transactions');
        console.error("Error fetching transactions:", error);
      });
  }, [description]);  

  return (
    <div className="main">
      <NavBar />
      <h2>Report for {description}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Memo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((row, index) => (
              <tr key={index}>
                <td>{new Date(row.date).toLocaleDateString('en-US')}</td> {/* Format date */}
                <td>{row.category}</td>
                <td>${row.adjusted_amount.toFixed(2)}</td>
                <td>{row.memo || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No data found for this description.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total for {description}: ${total.toFixed(2)}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReportDescription;